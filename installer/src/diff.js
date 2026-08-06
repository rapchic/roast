import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { promisify } from 'node:util';
import { join } from 'node:path';

const execFileAsync = promisify(execFile);

/** Default max files for agent roast scope — over this, ask before expanding. */
export const SCOPE_BUDGET = 30;

/** Max file paths listed per area in markdown (JSON keeps the full list). */
const MD_FILES_PER_AREA = 8;

const AREAS = [
  { prefix: 'src/', label: 'src' },
  { prefix: 'lib/', label: 'lib' },
  { prefix: 'app/', label: 'app' },
  { prefix: 'installer/', label: 'installer' },
  { prefix: 'test/', label: 'test' },
  { prefix: 'tests/', label: 'tests' },
  { prefix: 'docs/', label: 'docs' },
  { prefix: '.github/', label: 'ci' },
  { prefix: 'config/', label: 'config' },
];

async function git(cwd, args) {
  const { stdout } = await execFileAsync('git', args, { cwd, maxBuffer: 10 * 1024 * 1024 });
  return stdout.trim();
}

/**
 * Resolve a git ref usable with `merge-base` (keep `origin/main` when no local `main`).
 * Returns { ref, label } where label is the short branch name for display.
 */
async function resolveBaseBranch(cwd, base) {
  if (base && base !== 'auto') {
    const candidates = [base, base.replace(/^origin\//, ''), `origin/${base.replace(/^origin\//, '')}`];
    for (const ref of candidates) {
      try {
        await git(cwd, ['rev-parse', '--verify', ref]);
        return { ref, label: ref.replace(/^origin\//, '') };
      } catch {
        continue;
      }
    }
    return { ref: base, label: base.replace(/^origin\//, '') };
  }
  const candidates = [
    'origin/HEAD',
    'origin/main',
    'origin/master',
    'main',
    'master',
  ];
  for (const ref of candidates) {
    try {
      if (ref === 'origin/HEAD') {
        const sym = await git(cwd, ['symbolic-ref', 'refs/remotes/origin/HEAD']);
        const remoteRef = sym.replace('refs/remotes/', ''); // origin/main
        await git(cwd, ['rev-parse', '--verify', remoteRef]);
        return { ref: remoteRef, label: remoteRef.replace(/^origin\//, '') };
      }
      await git(cwd, ['rev-parse', '--verify', ref]);
      return { ref, label: ref.replace(/^origin\//, '') };
    } catch {
      continue;
    }
  }
  return { ref: 'main', label: 'main' };
}

function categorizeFiles(files) {
  const byArea = {};
  const uncategorized = [];
  for (const f of files) {
    let placed = false;
    for (const { prefix, label } of AREAS) {
      if (f.startsWith(prefix)) {
        byArea[label] = byArea[label] ?? [];
        byArea[label].push(f);
        placed = true;
        break;
      }
    }
    if (!placed) uncategorized.push(f);
  }
  if (uncategorized.length) byArea.other = uncategorized;
  return byArea;
}

function detectSignals(files, byArea) {
  const testAreas = ['test', 'tests'];
  const testsTouched = testAreas.some((a) => (byArea[a]?.length ?? 0) > 0);
  const docsOnly = files.length > 0 && files.every((f) =>
    f.startsWith('docs/') || (f.endsWith('.md') && !f.startsWith('.github/')),
  );
  const versionBump = files.some((f) =>
    f === 'package.json' || f === 'pyproject.toml' || f === 'Cargo.toml' || f === 'CHANGELOG.md',
  );
  const ciTouched = (byArea.ci?.length ?? 0) > 0;
  return { testsTouched, docsOnly, versionBump, ciTouched };
}

function suggestScope(byArea, signals, commitCount, fileCount) {
  const parts = [];
  if (signals.docsOnly) return 'Documentation-only changes — verify accuracy and broken links';
  if (byArea.ci?.length) parts.push('CI/config');
  if (byArea.src?.length || byArea.lib?.length || byArea.app?.length || byArea.installer?.length) {
    parts.push('application code');
  }
  if (signals.testsTouched) parts.push('test coverage');
  if (parts.length === 0) {
    parts.push(fileCount > 0
      ? `${fileCount} file(s) (commits + working tree)`
      : `${commitCount} commit(s) across mixed files`);
  }
  const base = `Review ${parts.join(' + ')} for evidence gaps, scope creep, and missing tests`;
  if (fileCount > SCOPE_BUDGET) {
    return `${base}. OVER BUDGET (${fileCount}>${SCOPE_BUDGET}) — ask user before reading beyond top areas`;
  }
  return base;
}

function uniqueSorted(lists) {
  return [...new Set(lists.flat().filter(Boolean))].sort();
}

function parseCommits(logRaw) {
  return logRaw.split('\n').filter(Boolean).map((line) => {
    const [hash, ...rest] = line.split(' ');
    return { hash, subject: rest.join(' ') };
  });
}

function formatMarkdown(data) {
  const lines = [
    '## Roast Diff Signals',
    '',
    `- **Base branch:** \`${data.baseBranch}\``,
    `- **Commits since merge-base:** ${data.commitCount}` +
      (data.since ? ` (filtered \`--since ${data.since}\`)` : ''),
    `- **Changed files:** ${data.changedFiles.length}` +
      (data.includesWorkingTree ? ' (committed + working tree + untracked)' : ' (committed only)'),
    `- **Scope budget:** ${data.scopeBudget.limit}` +
      (data.scopeBudget.overBudget ? ` — OVER (${data.changedFiles.length})` : ' — ok'),
    '',
    '### By area',
  ];
  for (const [area, files] of Object.entries(data.byArea)) {
    const shown = files.slice(0, MD_FILES_PER_AREA);
    const extra = files.length > MD_FILES_PER_AREA ? ` … +${files.length - MD_FILES_PER_AREA} more` : '';
    lines.push(`- **${area}** (${files.length}): ${shown.join(', ')}${extra}`);
  }
  if (data.scopeBudget.overBudget) {
    const preview = data.changedFiles.slice(0, SCOPE_BUDGET);
    const rest = data.changedFiles.length - preview.length;
    lines.push('', '### File list (truncated for markdown)');
    lines.push(preview.join(', ') + (rest > 0 ? ` … +${rest} more (full list in \`--format json\`)` : ''));
  }
  if (data.includesWorkingTree) {
    lines.push('', '### Breakdown');
    lines.push(`- Committed vs base: ${data.committedFiles.length}`);
    lines.push(`- Dirty vs HEAD: ${data.workingTreeFiles.length}`);
    lines.push(`- Untracked: ${data.untrackedFiles.length}`);
  }
  lines.push('', '### Signals');
  lines.push(`- Tests touched: ${data.signals.testsTouched ? 'yes' : 'no'}`);
  lines.push(`- Docs-only: ${data.signals.docsOnly ? 'yes' : 'no'}`);
  lines.push(`- Version bump files: ${data.signals.versionBump ? 'yes' : 'no'}`);
  lines.push(`- CI touched: ${data.signals.ciTouched ? 'yes' : 'no'}`);
  lines.push('', '### Suggested roast scope');
  lines.push(data.suggestedScope);
  if (data.recentCommits.length) {
    lines.push('', '### Recent commits');
    for (const c of data.recentCommits.slice(0, 10)) {
      lines.push(`- \`${c.hash}\` ${c.subject}`);
    }
  }
  return lines.join('\n');
}

/**
 * Parse relative duration like `1d`, `12h`, `30m`.
 * @returns {Date|null}
 */
export function parseSince(since) {
  if (typeof since !== 'string') return null;
  const m = since.trim().match(/^(\d+)([dhm])$/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  const unit = m[2].toLowerCase();
  const ms = unit === 'd' ? n * 86400000 : unit === 'h' ? n * 3600000 : n * 60000;
  return new Date(Date.now() - ms);
}

export async function gatherDiff({
  path: root = process.cwd(),
  base = 'auto',
  since,
  format = 'markdown',
  committedOnly = false,
} = {}) {
  const cwd = join(root);

  if (!existsSync(join(cwd, '.git'))) {
    const err = { error: 'Not a git repository', path: cwd };
    if (format === 'json') return JSON.stringify(err, null, 2);
    return `## Roast Diff Signals\n\nNot a git repository: \`${cwd}\``;
  }

  let sinceDate = null;
  if (since) {
    sinceDate = parseSince(since);
    if (!sinceDate) {
      throw new Error(
        `Invalid --since "${since}". Use a relative duration like 1d, 12h, or 30m.`,
      );
    }
  }

  const { ref: baseRef, label: baseBranch } = await resolveBaseBranch(cwd, base);
  const mergeBase = await git(cwd, ['merge-base', 'HEAD', baseRef]);
  const range = `${mergeBase}..HEAD`;
  const sinceArgs = sinceDate ? [`--since=${sinceDate.toISOString()}`] : [];

  const committedRaw = sinceDate
    ? await git(cwd, ['log', '--name-only', '--pretty=format:', ...sinceArgs, range]).catch(() => '')
    : await git(cwd, ['diff', '--name-only', `${mergeBase}...HEAD`]);
  const committedFiles = uniqueSorted([committedRaw.split('\n')]);

  let workingTreeFiles = [];
  let untrackedFiles = [];
  if (!committedOnly) {
    const dirtyRaw = await git(cwd, ['diff', '--name-only', 'HEAD']).catch(() => '');
    const stagedRaw = await git(cwd, ['diff', '--name-only', '--cached']).catch(() => '');
    workingTreeFiles = uniqueSorted([
      dirtyRaw.split('\n'),
      stagedRaw.split('\n'),
    ]);
    const untrackedRaw = await git(cwd, ['ls-files', '--others', '--exclude-standard']).catch(() => '');
    untrackedFiles = untrackedRaw.split('\n').filter(Boolean);
  }

  const changedFiles = committedOnly
    ? committedFiles
    : uniqueSorted([committedFiles, workingTreeFiles, untrackedFiles]);

  const byArea = categorizeFiles(changedFiles);
  const signals = detectSignals(changedFiles, byArea);

  const logRaw = await git(cwd, ['log', '--oneline', ...sinceArgs, range]).catch(() => '');
  const recentCommits = parseCommits(logRaw);
  const commitCount = recentCommits.length;

  const data = {
    baseBranch,
    baseRef,
    mergeBase,
    since: since || null,
    commitCount,
    changedFiles,
    committedFiles,
    workingTreeFiles,
    untrackedFiles,
    includesWorkingTree: !committedOnly,
    byArea,
    signals,
    scopeBudget: {
      limit: SCOPE_BUDGET,
      overBudget: changedFiles.length > SCOPE_BUDGET,
    },
    suggestedScope: suggestScope(byArea, signals, commitCount, changedFiles.length),
    recentCommits,
  };

  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  return formatMarkdown(data);
}

export { gatherDiff as diff };

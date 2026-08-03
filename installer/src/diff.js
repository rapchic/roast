import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { promisify } from 'node:util';
import { join } from 'node:path';

const execFileAsync = promisify(execFile);

const AREAS = [
  { prefix: 'src/', label: 'src' },
  { prefix: 'lib/', label: 'lib' },
  { prefix: 'app/', label: 'app' },
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

async function resolveBaseBranch(cwd, base) {
  if (base && base !== 'auto') {
    return base.replace(/^origin\//, '');
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
        return sym.replace('refs/remotes/origin/', '');
      }
      await git(cwd, ['rev-parse', '--verify', ref]);
      return ref.replace(/^origin\//, '');
    } catch {
      continue;
    }
  }
  return 'main';
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
    f.startsWith('docs/') || f.endsWith('.md') || f.startsWith('.github/'),
  );
  const versionBump = files.some((f) =>
    f === 'package.json' || f === 'pyproject.toml' || f === 'Cargo.toml' || f === 'CHANGELOG.md',
  );
  const ciTouched = (byArea.ci?.length ?? 0) > 0;
  return { testsTouched, docsOnly, versionBump, ciTouched };
}

function suggestScope(byArea, signals, commitCount) {
  const parts = [];
  if (signals.docsOnly) return 'Documentation-only changes — verify accuracy and broken links';
  if (byArea.ci?.length) parts.push('CI/config');
  if (byArea.src?.length || byArea.lib?.length || byArea.app?.length) {
    parts.push('application code');
  }
  if (signals.testsTouched) parts.push('test coverage');
  if (parts.length === 0) parts.push(`${commitCount} commit(s) across mixed files`);
  return `Review ${parts.join(' + ')} for evidence gaps, scope creep, and missing tests`;
}

function formatMarkdown(data) {
  const lines = [
    '## Roast Diff Signals',
    '',
    `- **Base branch:** \`${data.baseBranch}\``,
    `- **Commits since merge-base:** ${data.commitCount}`,
    `- **Changed files:** ${data.changedFiles.length}`,
    '',
    '### By area',
  ];
  for (const [area, files] of Object.entries(data.byArea)) {
    lines.push(`- **${area}** (${files.length}): ${files.slice(0, 8).join(', ')}${files.length > 8 ? '…' : ''}`);
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

export async function gatherDiff({ path: root = process.cwd(), base = 'auto', since, format = 'markdown' }) {
  const cwd = join(root);

  if (!existsSync(join(cwd, '.git'))) {
    const err = { error: 'Not a git repository', path: cwd };
    if (format === 'json') return JSON.stringify(err, null, 2);
    return `## Roast Diff Signals\n\nNot a git repository: \`${cwd}\``;
  }

  const baseBranch = await resolveBaseBranch(cwd, base);
  const mergeBase = await git(cwd, ['merge-base', 'HEAD', baseBranch]);

  let commitRange = mergeBase;
  if (since) {
    const sinceDate = parseSince(since);
    if (sinceDate) {
      const sinceCommits = await git(cwd, ['rev-list', `--since=${sinceDate.toISOString()}`, 'HEAD']).catch(() => '');
      if (sinceCommits) commitRange = sinceCommits.split('\n').pop() ?? mergeBase;
    }
  }

  const diffFilesRaw = await git(cwd, ['diff', '--name-only', `${mergeBase}...HEAD`]);
  const changedFiles = diffFilesRaw.split('\n').filter(Boolean);
  const byArea = categorizeFiles(changedFiles);
  const signals = detectSignals(changedFiles, byArea);

  const logRaw = await git(cwd, ['log', '--oneline', `${mergeBase}..HEAD`]).catch(() => '');
  const recentCommits = logRaw.split('\n').filter(Boolean).map((line) => {
    const [hash, ...rest] = line.split(' ');
    return { hash, subject: rest.join(' ') };
  });
  const commitCount = recentCommits.length;

  const data = {
    baseBranch,
    mergeBase,
    commitCount,
    changedFiles,
    byArea,
    signals,
    suggestedScope: suggestScope(byArea, signals, commitCount),
    recentCommits,
  };

  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  return formatMarkdown(data);
}

function parseSince(since) {
  const m = since.match(/^(\d+)([dhm])$/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  const unit = m[2];
  const ms = unit === 'd' ? n * 86400000 : unit === 'h' ? n * 3600000 : n * 60000;
  return new Date(Date.now() - ms);
}

export { gatherDiff as diff };

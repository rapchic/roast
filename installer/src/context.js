import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const CONVENTION_FILES = [
  'AGENTS.md',
  'CLAUDE.md',
  'CONTRIBUTING.md',
  '.cursorrules',
];

const STACK_DETECTORS = [
  { file: 'package.json', type: 'node', parser: parsePackageJson },
  { file: 'pyproject.toml', type: 'python', parser: parsePyproject },
  { file: 'go.mod', type: 'go', parser: () => ({ packageManager: 'go modules' }) },
  { file: 'Cargo.toml', type: 'rust', parser: () => ({ packageManager: 'cargo' }) },
  { file: 'Gemfile', type: 'ruby', parser: () => ({ packageManager: 'bundler' }) },
  { file: 'pom.xml', type: 'java', parser: () => ({ packageManager: 'maven' }) },
  { file: 'build.gradle', type: 'java', parser: () => ({ packageManager: 'gradle' }) },
];

async function parsePackageJson(root) {
  const raw = await readFile(join(root, 'package.json'), 'utf8');
  const pkg = JSON.parse(raw);
  const scripts = pkg.scripts ?? {};
  const pm = detectPackageManager(root);
  return {
    name: pkg.name,
    packageManager: pm,
    scripts: pickScripts(scripts),
    engines: pkg.engines,
  };
}

function detectPackageManager(root) {
  if (existsSync(join(root, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(root, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(root, 'bun.lockb')) || existsSync(join(root, 'bun.lock'))) return 'bun';
  if (existsSync(join(root, 'package-lock.json'))) return 'npm';
  return 'npm';
}

function pickScripts(scripts) {
  const keys = ['test', 'lint', 'build', 'typecheck', 'check', 'dev', 'start'];
  const out = {};
  for (const k of keys) {
    if (scripts[k]) out[k] = scripts[k];
  }
  return out;
}

async function parsePyproject(root) {
  const raw = await readFile(join(root, 'pyproject.toml'), 'utf8');
  const scripts = {};
  const testMatch = raw.match(/\[tool\.pytest\.ini_options\]/);
  if (testMatch) scripts.test = 'pytest';
  if (raw.includes('[tool.ruff]')) scripts.lint = 'ruff';
  if (raw.includes('[tool.mypy]')) scripts.typecheck = 'mypy';
  return { packageManager: existsSync(join(root, 'poetry.lock')) ? 'poetry' : 'pip', scripts };
}

async function findConventionFiles(root) {
  const found = [];
  for (const f of CONVENTION_FILES) {
    if (existsSync(join(root, f))) found.push(f);
  }
  const cursorRules = join(root, '.cursor', 'rules');
  if (existsSync(cursorRules)) {
    try {
      const entries = await readdir(cursorRules);
      for (const e of entries) {
        if (e.endsWith('.mdc') || e.endsWith('.md')) {
          found.push(relative(root, join(cursorRules, e)));
        }
      }
    } catch { /* ignore */ }
  }
  return found;
}

async function findCiWorkflows(root) {
  const wfDir = join(root, '.github', 'workflows');
  if (!existsSync(wfDir)) return [];
  try {
    const entries = await readdir(wfDir);
    return entries.filter((e) => e.endsWith('.yml') || e.endsWith('.yaml'));
  } catch {
    return [];
  }
}

async function blastRadius(root, targetGlob) {
  if (!targetGlob) return null;
  try {
    const { stdout } = await execFileAsync(
      'git',
      ['ls-files', targetGlob],
      { cwd: root, maxBuffer: 10 * 1024 * 1024 },
    );
    const files = stdout.trim().split('\n').filter(Boolean);
    return { glob: targetGlob, fileCount: files.length, files: files.slice(0, 50) };
  } catch {
    return { glob: targetGlob, fileCount: 0, files: [], error: 'git ls-files failed' };
  }
}

function formatMarkdown(ctx) {
  const lines = [
    '## Roast Context (Phase 0 INIT)',
    '',
    `- **Stack:** ${ctx.stack.type}${ctx.stack.name ? ` (${ctx.stack.name})` : ''} — ${ctx.stack.packageManager ?? 'unknown'}`,
    `- **Root:** ${ctx.root}`,
  ];
  if (Object.keys(ctx.scripts).length) {
    lines.push('- **Commands:**');
    for (const [k, v] of Object.entries(ctx.scripts)) {
      lines.push(`  - \`${k}\`: \`${v}\``);
    }
  }
  if (ctx.conventionSources.length) {
    lines.push(`- **Convention sources:** ${ctx.conventionSources.join(', ')}`);
  }
  if (ctx.ciWorkflows.length) {
    lines.push(`- **CI workflows:** ${ctx.ciWorkflows.join(', ')}`);
  }
  if (ctx.blastRadius) {
    lines.push(`- **Blast radius:** \`${ctx.blastRadius.glob}\` — ${ctx.blastRadius.fileCount} file(s)`);
  }
  if (ctx.git) {
    lines.push(`- **Git branch:** ${ctx.git.branch} (base: ${ctx.git.defaultBranch})`);
  }
  return lines.join('\n');
}

export async function gatherContext({ path: root = process.cwd(), target, format = 'markdown' }) {
  const absRoot = join(root);

  let stack = { type: 'unknown', packageManager: null, scripts: {} };
  for (const det of STACK_DETECTORS) {
    if (existsSync(join(absRoot, det.file))) {
      const parsed = await det.parser(absRoot);
      stack = { type: det.type, ...parsed };
      break;
    }
  }

  const conventionSources = await findConventionFiles(absRoot);
  const ciWorkflows = await findCiWorkflows(absRoot);
  const radius = target ? await blastRadius(absRoot, target) : null;
  const git = await detectGit(absRoot);

  const ctx = {
    root: absRoot,
    stack: {
      type: stack.type,
      name: stack.name,
      packageManager: stack.packageManager,
      engines: stack.engines,
    },
    scripts: stack.scripts ?? {},
    conventionSources,
    ciWorkflows,
    blastRadius: radius,
    git,
  };

  if (format === 'json') {
    return JSON.stringify(ctx, null, 2);
  }
  return formatMarkdown(ctx);
}

async function detectGit(root) {
  if (!existsSync(join(root, '.git'))) return null;
  try {
    const [{ stdout: branch }, { stdout: defaultBranch }] = await Promise.all([
      execFileAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: root }),
      execFileAsync('git', ['symbolic-ref', 'refs/remotes/origin/HEAD'], { cwd: root }).catch(() =>
        execFileAsync('git', ['rev-parse', '--verify', 'origin/main'], { cwd: root })
          .then(() => ({ stdout: 'refs/remotes/origin/main\n' }))
          .catch(() => execFileAsync('git', ['rev-parse', '--verify', 'origin/master'], { cwd: root })
            .then(() => ({ stdout: 'refs/remotes/origin/master\n' }))),
      ),
    ]);
    const base = defaultBranch.trim().replace('refs/remotes/', '');
    return { branch: branch.trim(), defaultBranch: base };
  } catch {
    return null;
  }
}

export { gatherContext as context };

#!/usr/bin/env node
/**
 * Contributor setup for this git repo only (not shipped).
 * Installs Cursor skill/commands from this checkout, enables local CI hooks, /roast-no.
 */
import { cp, chmod, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cli = join(root, 'installer/bin/cli.js');

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('🔥 roastit contributor setup\n');

run(process.execPath, [cli, 'install', '--tools', 'cursor', '--path', root]);

const roastNoSrc = join(root, 'dev', 'commands', 'roast-no.md');
const destDir = join(root, '.cursor', 'commands');
await mkdir(destDir, { recursive: true });

if (existsSync(roastNoSrc)) {
  await cp(roastNoSrc, join(destDir, 'roast-no.md'));
  console.log('✓ Workspace /roast-no → .cursor/commands/roast-no.md');
} else {
  console.warn('⚠ Missing dev/commands/roast-no.md');
}

const hook = join(root, '.githooks', 'pre-push');
if (existsSync(hook)) {
  await chmod(hook, 0o755);
  run('git', ['config', 'core.hooksPath', '.githooks']);
  console.log('✓ Local CI: git core.hooksPath=.githooks (pre-push → npm run ci)');
}

console.log(`
── Next ──
1. Restart Cursor (or Developer: Reload Window)
2. /roast-only     → roast this repo and learn the format
3. /roast-no       → audit contributor don’t-list
4. npm run ci      → same gates as GitHub (also runs on git push)

After editing skills/commands/rules:
  npm run sync:project-cursor && roastit install --tools cursor
`);

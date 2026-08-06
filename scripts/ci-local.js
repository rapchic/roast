#!/usr/bin/env node
/**
 * Local CI — same gates as GitHub Actions (test job), run before push.
 * Not a GitHub workflow; catches failures on your machine first.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const steps = [
  ['test', ['test']],
  ['lint', ['run', 'lint']],
  ['smoke', ['run', 'smoke']],
  ['pack:check', ['run', 'pack:check']],
];

console.log('🔥 roastit local CI (mirrors GitHub Actions test job)\n');

for (const [name, args] of steps) {
  console.log(`── ${name} ──`);
  const r = spawnSync('npm', args, { stdio: 'inherit', cwd: root, shell: process.platform === 'win32' });
  if (r.status !== 0) {
    console.error(`\n✗ local CI failed at: npm ${args.join(' ')}`);
    console.error('Fix before push. Bypass only if you must: git push --no-verify');
    process.exit(r.status ?? 1);
  }
  console.log('');
}

console.log('✓ local CI passed — safe to push\n');

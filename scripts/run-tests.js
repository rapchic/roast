#!/usr/bin/env node
/** Cross-platform test runner — avoids shell ** glob issues on Linux CI. */
import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const testDir = join(root, 'test');
const files = (await readdir(testDir))
  .filter((f) => f.endsWith('.test.js'))
  .map((f) => join('test', f))
  .sort();

if (files.length === 0) {
  console.error('No test/*.test.js files found');
  process.exit(1);
}

const r = spawnSync(
  process.execPath,
  ['--test', '--test-concurrency=1', ...files],
  { stdio: 'inherit', cwd: root },
);
process.exit(r.status ?? 1);

#!/usr/bin/env node
/** Syntax-check ESM JavaScript under installer/, scripts/, and test/ */
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules') continue;
      walk(p, acc);
    } else if (name.endsWith('.js')) {
      acc.push(p);
    }
  }
  return acc;
}

const dirs = ['installer', 'scripts', 'test'].map((d) => join(ROOT, d));
const files = dirs.flatMap((d) => walk(d));

for (const file of files) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

console.log(`Lint OK (${files.length} files)`);

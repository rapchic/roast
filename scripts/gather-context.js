#!/usr/bin/env node
/**
 * Agent helper — delegates to `roastit` / `roast` context.
 * Tries PATH binaries, then the repo CLI.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const forward = process.argv.slice(2);

function runNodeCli(cliPath) {
  execFileSync(process.execPath, [cliPath, 'context', ...forward], { stdio: 'inherit' });
}

function tryBin(bin) {
  execFileSync(bin, ['context', ...forward], { stdio: 'inherit' });
}

const bins = ['roastit', 'roast'];
for (const bin of bins) {
  try {
    tryBin(bin);
    process.exit(0);
  } catch (err) {
    // ENOENT / not on PATH — try next; other failures from a found binary should surface
    if (err && err.code !== 'ENOENT' && err.status !== 127) {
      // Binary ran but exited non-zero — already printed via inherit
      process.exit(err.status ?? 1);
    }
  }
}

const devCli = join(__dirname, '..', 'installer', 'bin', 'cli.js');
if (existsSync(devCli)) {
  try {
    runNodeCli(devCli);
    process.exit(0);
  } catch (err) {
    process.exit(err.status ?? 1);
  }
}

console.error('roastit CLI not found. Install with: npm install -g @rapchic/roast  (or npm link from this repo)');
process.exit(1);

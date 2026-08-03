#!/usr/bin/env node
/**
 * Agent helper — delegates to `roast context`.
 * Requires roast on PATH (global install or npm link).
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

try {
  execFileSync('roast', ['context', ...forward], { stdio: 'inherit' });
} catch {
  const devCli = join(__dirname, '..', 'installer', 'bin', 'cli.js');
  if (existsSync(devCli)) {
    runNodeCli(devCli);
  } else {
    console.error('roast CLI not found. Install with: npm install -g roast');
    process.exit(1);
  }
}

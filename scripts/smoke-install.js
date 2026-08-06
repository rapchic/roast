#!/usr/bin/env node
/**
 * Smoke test: install to a temp HOME and verify Cursor paths + roastit content.
 */
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { install as cursorInstall } from '../installer/src/clients/cursor.js';
import { CURSOR_COMMAND_FILES } from '../installer/src/utils.js';

const tempHome = await mkdtemp(join(tmpdir(), 'roast-smoke-'));
mkdirSync(join(tempHome, '.cursor'), { recursive: true });

try {
  process.env.ROAST_HOME = tempHome;
  await cursorInstall({ yes: true });

  const checks = [
    join(tempHome, '.cursor', 'skills', 'roast', 'SKILL.md'),
    join(tempHome, '.cursor', 'rules', 'roast.mdc'),
    ...CURSOR_COMMAND_FILES.map((f) => join(tempHome, '.cursor', 'commands', f)),
  ];

  const missing = checks.filter((p) => !existsSync(p));
  if (missing.length) {
    console.error('Smoke install FAILED — missing:');
    for (const p of missing) console.error(' ', p);
    process.exit(1);
  }

  const installCmd = await readFile(
    join(tempHome, '.cursor', 'commands', 'roast-install.md'),
    'utf8',
  );
  if (!installCmd.includes('roastit')) {
    console.error('Smoke install FAILED — roast-install.md missing roastit package name');
    process.exit(1);
  }
  if (installCmd.includes('node_modules/roast/')) {
    console.error('Smoke install FAILED — roast-install.md still references node_modules/roast');
    process.exit(1);
  }

  console.log('Smoke install OK');
  console.log(`  Temp HOME: ${tempHome}`);
  console.log(`  Files verified: ${checks.length}`);
} finally {
  delete process.env.ROAST_HOME;
  await rm(tempHome, { recursive: true, force: true });
}

#!/usr/bin/env node
/**
 * postinstall — auto-deploy on global npm install only.
 * Skip: ROAST_SKIP_POSTINSTALL=1 or npm install in a dependency tree.
 */
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const isGlobal = process.env.npm_config_global === 'true';
const skip = process.env.ROAST_SKIP_POSTINSTALL === '1';

if (!isGlobal || skip) {
  process.exit(0);
}

if (!existsSync(join(homedir(), '.cursor'))) {
  console.log('roast: ~/.cursor not found — skip postinstall (run: npx @rapchic/roast install)');
  process.exit(0);
}

try {
  const { install } = await import('../installer/src/install.js');
  console.log('roast: running postinstall for global npm install…');
  await install({ tools: 'cursor', yes: true });
} catch (err) {
  console.warn('roast postinstall skipped:', err.message);
}

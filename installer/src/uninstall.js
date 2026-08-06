import { rm, readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  detectClients,
  getHomedir,
  installJsonPath,
  roastDir,
  SKILL_NAME,
} from './utils.js';
import { uninstall as cursorUninstall } from './clients/cursor.js';
import { uninstall as claudeUninstall } from './clients/claude.js';
import { uninstall as codexUninstall } from './clients/codex.js';

const HANDLERS = { cursor: cursorUninstall, claude: claudeUninstall, codex: codexUninstall };

const ALL_CLIENTS = ['cursor', 'claude', 'codex'];

/** True if the roast skill is still present for a client under ROAST_HOME/homedir. */
export function isClientSkillInstalled(client, home = getHomedir()) {
  const paths = {
    cursor: join(home, '.cursor', 'skills', SKILL_NAME, 'SKILL.md'),
    claude: join(home, '.claude', 'skills', SKILL_NAME, 'SKILL.md'),
    codex: join(home, '.codex', 'skills', SKILL_NAME, 'SKILL.md'),
  };
  const p = paths[client];
  return p ? existsSync(p) : false;
}

export function listRemainingClients(home = getHomedir()) {
  return ALL_CLIENTS.filter((c) => isClientSkillInstalled(c, home));
}

async function updateInstallStateClients(remaining) {
  const installJson = installJsonPath();
  if (!existsSync(installJson)) return;
  try {
    const existing = JSON.parse(await readFile(installJson, 'utf8'));
    const state = {
      ...existing,
      clients: remaining,
      client: remaining[0] ?? existing.client,
    };
    await mkdir(dirname(installJson), { recursive: true });
    const tmp = installJson + '.tmp';
    await writeFile(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8');
    await rename(tmp, installJson);
  } catch {
    /* ignore corrupt meta */
  }
}

async function removeSharedState() {
  const scriptsDir = join(roastDir(), 'scripts');
  if (existsSync(scriptsDir)) {
    await rm(scriptsDir, { recursive: true });
    console.log(`  ✓ Removed ${scriptsDir}`);
  }

  const installJson = installJsonPath();
  if (existsSync(installJson)) {
    await rm(installJson);
    console.log(`  ✓ Removed ${installJson}`);
  }
}

export async function uninstall({ tools, yes = false } = {}) {
  let clients;
  if (tools) {
    clients = tools.split(',').map((s) => s.trim().toLowerCase());
  } else {
    clients = await detectClients();
    if (clients.length === 0) {
      console.log('No supported IDE clients detected. Pass --tools cursor|claude|codex to specify.');
      process.exit(1);
    }
    console.log(`Detected clients: ${clients.join(', ')}\n`);
  }

  for (const client of clients) {
    const handler = HANDLERS[client];
    if (!handler) {
      console.error(`Unknown client "${client}". Valid: cursor, claude, codex`);
      continue;
    }
    await handler({ yes });
  }

  const remaining = listRemainingClients();
  if (remaining.length === 0) {
    console.log('\nNo roast clients remain — removing shared ~/.roast state.');
    await removeSharedState();
  } else {
    await updateInstallStateClients(remaining);
    console.log(`\nShared ~/.roast kept — still installed for: ${remaining.join(', ')}`);
  }
}

import { prompt, readInstallState } from './utils.js';
import { checkForUpdate } from './version-check.js';
import { install as cursorInstall } from './clients/cursor.js';
import { install as claudeInstall } from './clients/claude.js';
import { install as codexInstall } from './clients/codex.js';

const HANDLERS = { cursor: cursorInstall, claude: claudeInstall, codex: codexInstall };

export async function update({ yes = false } = {}) {
  const state = await readInstallState();
  if (!state) {
    console.log('No roast install found. Run: npx roast install');
    process.exit(1);
  }

  const { current, latest, updateAvailable, releaseUrl } = await checkForUpdate();

  if (!updateAvailable) {
    console.log(`roast v${current} is up to date.`);
    return;
  }

  console.log(`Update available: v${current} → v${latest}`);
  if (releaseUrl) console.log(`Release notes: ${releaseUrl}`);
  console.log();

  const clients = Array.isArray(state.clients)
    ? state.clients
    : state.client
      ? [state.client]
      : [];

  if (clients.length === 0) {
    console.error('No client found in install state. Re-install with: npx roast install --tools <client>');
    process.exit(1);
  }

  if (!yes) {
    const answer = await prompt(`Apply update to v${latest}? [Y/n] `);
    if (answer.toLowerCase() === 'n') {
      console.log('Update skipped.');
      return;
    }
  }

  for (const client of clients) {
    const handler = HANDLERS[client];
    if (!handler) {
      console.error(`Unknown client "${client}" in install state — skipping.`);
      continue;
    }
    await handler({ yes: true });
  }
}

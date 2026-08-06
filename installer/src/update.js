import { spawn } from 'node:child_process';
import { prompt, readInstallState, VERSION } from './utils.js';
import { checkForUpdate, compareSemver } from './version-check.js';
import { install as cursorInstall } from './clients/cursor.js';
import { install as claudeInstall } from './clients/claude.js';
import { install as codexInstall } from './clients/codex.js';

const HANDLERS = { cursor: cursorInstall, claude: claudeInstall, codex: codexInstall };

function clientsFromState(state) {
  const clients = Array.isArray(state.clients)
    ? state.clients
    : state.client
      ? [state.client]
      : [];
  return clients.filter((c) => HANDLERS[c]);
}

async function reinstallFromThisPackage(clients) {
  for (const client of clients) {
    await HANDLERS[client]({ yes: true });
  }
  console.log(`\n✓ Installed skill files from roastit@${VERSION}`);
}

function fetchLatestViaNpx(latest, clients) {
  const tools = clients.join(',');
  const args = ['-y', `roastit@${latest}`, 'install', '--tools', tools, '--yes'];
  console.log(`→ Fetching roastit@${latest} via npx…`);
  console.log(`  npx ${args.join(' ')}\n`);

  return new Promise((resolve, reject) => {
    const child = spawn('npx', args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ROAST_UPDATE_FROM_NPX: '1',
      },
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`npx roastit@${latest} install exited with code ${code}`));
    });
  });
}

/**
 * Package-user update: fetch latest from npm, then install.
 * (Dev/workspace refresh is NOT this command — use `roastit install` from a linked checkout.)
 */
export async function update({ yes = false } = {}) {
  const state = await readInstallState();
  if (!state) {
    console.log('No roast install found. Run: npx roastit install');
    process.exit(1);
  }

  const clients = clientsFromState(state);
  if (clients.length === 0) {
    console.error('No client found in install state. Re-install with: npx roastit install --tools <client>');
    process.exit(1);
  }

  // Child process after npx fetched the tarball — install from *this* (new) package only
  if (process.env.ROAST_UPDATE_FROM_NPX === '1') {
    await reinstallFromThisPackage(clients);
    return;
  }

  const { current, latest, updateAvailable, releaseUrl } = await checkForUpdate();

  if (!latest) {
    console.error('Cannot update: npm registry unreachable or roastit is not published yet.');
    console.error('From a git clone: run `roastit install --tools cursor --yes` (see CONTRIBUTING.md).');
    process.exit(1);
  }

  const behind = updateAvailable && compareSemver(current, latest) < 0;

  if (!behind) {
    console.log(`roastit v${current} is up to date on npm. Reinstalling skill files…\n`);
    await reinstallFromThisPackage(clients);
    return;
  }

  console.log(`Update available: v${current} → v${latest}`);
  if (releaseUrl) console.log(`Release notes: ${releaseUrl}`);
  console.log();

  if (!yes) {
    if (!process.stdin.isTTY) {
      console.error('Non-interactive shell detected. Re-run with --yes to apply the update.');
      process.exit(1);
    }
    const answer = await prompt(`Download roastit@${latest} and reinstall? [Y/n] `);
    if (answer.toLowerCase() === 'n') {
      console.log('Update skipped.');
      return;
    }
  }

  try {
    await fetchLatestViaNpx(latest, clients);
    console.log(`\n✓ Updated to roastit@${latest}`);
  } catch (err) {
    console.error(`\n✗ Update failed: ${err.message}`);
    process.exit(1);
  }
}

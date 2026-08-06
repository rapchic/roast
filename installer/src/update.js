import { spawn } from 'node:child_process';
import { PACKAGE_NAME, prompt, readInstallState, VERSION } from './utils.js';
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
  console.log(`\n✓ Installed skill files from ${PACKAGE_NAME}@${VERSION}`);
}

function fetchLatestViaNpx(latest, clients) {
  const tools = clients.join(',');
  const spec = `${PACKAGE_NAME}@${latest}`;
  const args = ['-y', spec, 'install', '--tools', tools];
  console.log(`→ Fetching ${spec} via npx…`);
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
      else reject(new Error(`npx ${spec} install exited with code ${code}`));
    });
  });
}

/**
 * Package-user update: fetch latest from npm, then install.
 * (Dev/workspace refresh is NOT this command — use `roast install` from a linked checkout.)
 */
export async function update({ yes = false } = {}) {
  const state = await readInstallState();
  if (!state) {
    console.log(`No roast install found. Run: npx ${PACKAGE_NAME} install`);
    process.exit(1);
  }

  const clients = clientsFromState(state);
  if (clients.length === 0) {
    console.error(`No client found in install state. Re-install with: npx ${PACKAGE_NAME} install --tools <client>`);
    process.exit(1);
  }

  // Child process after npx fetched the tarball — install from *this* (new) package only
  if (process.env.ROAST_UPDATE_FROM_NPX === '1') {
    await reinstallFromThisPackage(clients);
    return;
  }

  const { current, latest, updateAvailable, releaseUrl } = await checkForUpdate();

  if (!latest) {
    console.error(`Cannot update: npm registry unreachable or ${PACKAGE_NAME} is not published yet.`);
    console.error('From a git clone: run `roast install` (see CONTRIBUTING.md).');
    process.exit(1);
  }

  const behind = updateAvailable && compareSemver(current, latest) < 0;

  if (!behind) {
    console.log(`${PACKAGE_NAME} v${current} is up to date on npm. Reinstalling skill files…\n`);
    await reinstallFromThisPackage(clients);
    return;
  }

  console.log(`Update available: v${current} → v${latest}`);
  if (releaseUrl) console.log(`Release notes: ${releaseUrl}`);
  console.log();

  if (!yes) {
    if (!process.stdin.isTTY) {
      // Non-interactive (CI/agents): apply without prompting
    } else {
      const answer = await prompt(`Download ${PACKAGE_NAME}@${latest} and reinstall? [Y/n] `);
      if (answer.toLowerCase() === 'n') {
        console.log('Update skipped.');
        return;
      }
    }
  }

  try {
    await fetchLatestViaNpx(latest, clients);
    console.log(`\n✓ Updated to ${PACKAGE_NAME}@${latest}`);
  } catch (err) {
    console.error(`\n✗ Update failed: ${err.message}`);
    process.exit(1);
  }
}

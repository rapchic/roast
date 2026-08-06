import { readInstallState, VERSION } from './utils.js';
import { checkForUpdate } from './version-check.js';

export async function status() {
  const state = await readInstallState();

  if (!state) {
    console.log('roast is not installed.');
    console.log('Run: npx roastit install');
    return;
  }

  console.log('roast status');
  console.log('─────────────');
  console.log(`  Installed: ${state.version}`);
  console.log(`  CLI pkg:   ${VERSION}`);
  console.log(`  Clients:   ${(state.clients ?? [state.client]).filter(Boolean).join(', ')}`);
  console.log(`  Method:    ${state.method ?? 'npx'}`);
  console.log(`  Date:      ${new Date(state.installedAt).toLocaleString()}`);

  console.log();
  console.log('Checking for updates...');
  const { latest, updateAvailable, releaseUrl } = await checkForUpdate();

  if (latest === null) {
    console.log('  (offline or roastit not on npm yet)');
  } else if (updateAvailable) {
    console.log(`  npm latest: v${latest} (this CLI is v${VERSION})`);
    if (releaseUrl) console.log(`  Release notes:    ${releaseUrl}`);
    console.log('  Run: npx roastit update');
  } else if (state.version !== VERSION) {
    console.log(`  npm latest v${VERSION}; skill meta v${state.version} — run: npx roastit update`);
  } else {
    console.log(`  v${VERSION} is up to date.`);
  }
}

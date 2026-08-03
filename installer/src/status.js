import { readInstallState } from './utils.js';
import { checkForUpdate } from './version-check.js';

export async function status() {
  const state = await readInstallState();

  if (!state) {
    console.log('roast is not installed.');
    console.log('Run: npx roast install');
    return;
  }

  console.log('roast status');
  console.log('─────────────');
  console.log(`  Version:   ${state.version}`);
  console.log(`  Clients:   ${(state.clients ?? [state.client]).filter(Boolean).join(', ')}`);
  console.log(`  Method:    ${state.method ?? 'npx'}`);
  console.log(`  Installed: ${new Date(state.installedAt).toLocaleString()}`);

  console.log();
  console.log('Checking for updates...');
  const { current, latest, updateAvailable, releaseUrl } = await checkForUpdate();

  if (latest === null) {
    console.log('  (offline — could not reach npm registry)');
  } else if (updateAvailable) {
    console.log(`  Update available: v${current} → v${latest}`);
    if (releaseUrl) console.log(`  Release notes:    ${releaseUrl}`);
    console.log('  Run: npx roast update');
  } else {
    console.log(`  v${current} is up to date.`);
  }
}

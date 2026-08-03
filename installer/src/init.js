import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { detectClients } from './utils.js';
import { gatherContext } from './context.js';

export async function init({ path: root = process.cwd(), yes = false } = {}) {
  const configDir = join(root, '.roast');
  const configPath = join(configDir, 'config.json');

  if (existsSync(configPath) && !yes) {
    console.log(`Roast config already exists at ${configPath}`);
    console.log('Pass --yes to overwrite.');
    return;
  }

  const clients = await detectClients();
  const ctx = JSON.parse(await gatherContext({ path: root, format: 'json' }));

  const config = {
    version: 1,
    initializedAt: new Date().toISOString(),
    detectedClients: clients,
    stack: ctx.stack,
    conventionSources: ctx.conventionSources,
    ciWorkflows: ctx.ciWorkflows,
    notes: 'Local roast config — does not affect agent behavior. Use npx roast install to deploy the skill.',
  };

  await mkdir(configDir, { recursive: true });
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');

  console.log('✓ Roast initialized');
  console.log(`  Config: ${configPath}`);
  console.log(`  Detected IDEs: ${clients.length ? clients.join(', ') : 'none — pass --tools on install'}`);
  console.log(`  Stack: ${ctx.stack.type} (${ctx.stack.packageManager ?? 'unknown'})`);
  console.log();
  console.log('Next steps:');
  console.log('  npx roast install          # deploy skill to your IDE');
  console.log('  npx roast context          # print INIT context for agents');
  console.log('  npx roast diff --base auto # diff signals for current branch');
}

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { detectClients, REPO_ROOT } from './utils.js';
import { gatherContext } from './context.js';

const AGENTS_TEMPLATE = join(REPO_ROOT, 'skills', 'roast', 'assets', 'templates', 'agents.md');

export async function writeAgentsMd(root, { yes = false } = {}) {
  const dest = join(root, 'AGENTS.md');
  if (existsSync(dest) && !yes) {
    console.log(`AGENTS.md already exists at ${dest}`);
    console.log('Pass --yes to overwrite.');
    return { written: false, path: dest };
  }
  let body = await readFile(AGENTS_TEMPLATE, 'utf8');
  try {
    const ctx = JSON.parse(await gatherContext({ path: root, format: 'json' }));
    const scripts = ctx.scripts ?? {};
    const fill = (cmd) => (cmd ? `\`${cmd}\`` : '`(none detected)`');
    body = body
      .replace('(npm | pnpm | yarn | …)', ctx.stack?.packageManager ?? 'npm')
      .replace('`(fill from package scripts)`', fill(scripts.test))
      .replace('`(fill)`', fill(scripts.lint))
      .replace('`(fill)`', fill(scripts.build));
  } catch {
    /* keep template placeholders */
  }
  await writeFile(dest, body, 'utf8');
  console.log(`✓ Wrote short AGENTS.md → ${dest}`);
  console.log('  Opt-in only — roast never auto-creates this during a critique.');
  return { written: true, path: dest };
}

export async function init({
  path: root = process.cwd(),
  yes = false,
  agents = false,
} = {}) {
  if (agents) {
    return writeAgentsMd(root, { yes });
  }

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
    notes: 'Local roast config — does not affect agent behavior. Use npx roastit install to deploy the skill.',
  };

  await mkdir(configDir, { recursive: true });
  await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');

  console.log('✓ Roast initialized');
  console.log(`  Config: ${configPath}`);
  console.log(`  Detected IDEs: ${clients.length ? clients.join(', ') : 'none — pass --tools on install'}`);
  console.log(`  Stack: ${ctx.stack.type} (${ctx.stack.packageManager ?? 'unknown'})`);
  if (!ctx.conventionSources?.includes('AGENTS.md')) {
    console.log();
    console.log('Tip: optional short AGENTS.md → npx roastit init --agents');
  }
  console.log();
  console.log('Next steps:');
  console.log('  npx roastit install          # deploy skill to your IDE');
  console.log('  npx roastit context          # print INIT context for agents');
  console.log('  npx roastit diff --base auto # diff signals for current branch');
}

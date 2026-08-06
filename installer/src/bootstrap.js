import { install } from './install.js';
import { installProject, isGlobalInstalled, isProjectInstalled } from './project.js';
import { detectClients } from './utils.js';

/**
 * First-time setup: global IDE install + project .cursor/ (slash commands work in this repo immediately).
 */
export async function bootstrap({
  tools,
  yes = false,
  project = true,
  path: root = process.cwd(),
} = {}) {
  let clients = tools?.split(',').map((s) => s.trim().toLowerCase());

  if (!clients?.length) {
    clients = await detectClients();
    if (clients.length === 0) {
      clients = ['cursor'];
      console.log('No IDE config dirs detected — defaulting to cursor.\n');
    }
  }

  console.log('🔥 roast bootstrap — first-time setup\n');

  await install({ tools: clients.join(','), yes });

  if (project) {
    console.log('');
    await installProject({ path: root, yes });
  }

  const globalOk = await isGlobalInstalled();
  const projectOk = project ? await isProjectInstalled(root) : false;

  console.log('');
  console.log('── Next steps ──');
  console.log('1. Restart Cursor (required for global skills)');
  console.log('2. In any repo: type /roast');
  if (projectOk) {
    console.log(`3. This repo already has project commands — /roast may work here before global skill sync`);
  }
  console.log('');
  console.log('Reinstall anytime: /roast-install (after first bootstrap) or:');
  console.log('  npx roastit bootstrap --yes');
  console.log('');

  return { globalOk, projectOk, clients };
}

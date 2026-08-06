import { detectClients } from './utils.js';
import { install as cursorInstall } from './clients/cursor.js';
import { install as claudeInstall } from './clients/claude.js';
import { install as codexInstall } from './clients/codex.js';
import { installProject, isGlobalInstalled, isProjectInstalled } from './project.js';

const HANDLERS = { cursor: cursorInstall, claude: claudeInstall, codex: codexInstall };

/**
 * Deploy skill + commands. Default: global IDE install + project `.cursor/` in cwd.
 * Use --no-project for global-only.
 */
export async function install({
  tools,
  yes = false,
  project = true,
  path: projectRoot = process.cwd(),
  quietNext = false,
} = {}) {
  let clients;

  if (tools) {
    clients = tools.split(',').map((s) => s.trim().toLowerCase());
    const unknown = clients.filter((c) => !HANDLERS[c]);
    if (unknown.length) {
      console.error(`Unknown client(s): ${unknown.join(', ')}. Valid options: cursor, claude, codex`);
      process.exit(1);
    }
  } else {
    clients = await detectClients();
    if (clients.length === 0) {
      clients = ['cursor'];
      console.log('No IDE config dirs detected — defaulting to cursor.\n');
    } else {
      console.log(`Detected clients: ${clients.join(', ')}\n`);
    }
  }

  for (const client of clients) {
    await HANDLERS[client]({ yes });
  }

  if (project) {
    console.log('');
    await installProject({ path: projectRoot });
  }

  if (!quietNext) {
    const globalOk = await isGlobalInstalled();
    const projectOk = project ? await isProjectInstalled(projectRoot) : false;
    console.log('');
    console.log('── Next steps ──');
    console.log('1. Restart Cursor');
    console.log('2. Type /roast');
    if (projectOk) {
      console.log('3. This repo has project commands — /roast may work here before global skill sync');
    }
    if (!globalOk && !projectOk) {
      console.log('   (If nothing installed, re-run: npx @rapchic/roast install)');
    }
    console.log('');
  }

  return { clients, project };
}

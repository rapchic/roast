#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { install } from '../src/install.js';
import { update } from '../src/update.js';
import { status } from '../src/status.js';
import { uninstall } from '../src/uninstall.js';
import { init } from '../src/init.js';
import { bootstrap } from '../src/bootstrap.js';
import { gatherContext } from '../src/context.js';
import { gatherDiff } from '../src/diff.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(await readFile(join(__dirname, '../../package.json'), 'utf8'));

const program = new Command();

program
  .name('roast')
  .description('Evidence-based code roast — install skill and gather repo context for AI agents')
  .version(version);

program
  .command('bootstrap')
  .description('First-time setup: global install + project .cursor/ (recommended)')
  .option('--tools <clients>', 'Comma-separated: cursor, claude, codex (default: auto-detect)')
  .option('--path <dir>', 'Project root for .cursor/ files', process.cwd())
  .option('--no-project', 'Skip installing .cursor/ in current repo')
  .option('--yes', 'Non-interactive')
  .action((opts) =>
    bootstrap({
      tools: opts.tools,
      yes: Boolean(opts.yes),
      project: opts.project,
      path: opts.path,
    }),
  );

program
  .command('init')
  .description('Detect repo + IDE, write optional .roast/config.json (or --agents for AGENTS.md)')
  .option('--path <dir>', 'Repository root', process.cwd())
  .option('--yes', 'Overwrite existing config / AGENTS.md')
  .option('--agents', 'Write a short AGENTS.md template (opt-in; never during roast)')
  .option('--install', 'Also run bootstrap (global + project install)')
  .action(async (opts) => {
    await init(opts);
    if (opts.install) {
      if (opts.agents) {
        console.log('Also running bootstrap (--install with --agents)…\n');
      }
      await bootstrap({ path: opts.path, yes: opts.yes, project: true });
    }
  });

program
  .command('install')
  .description('Deploy roast skill and slash commands to Cursor / Claude / Codex')
  .option('--tools <clients>', 'Comma-separated: cursor, claude, codex (default: auto-detect)')
  .option('--project', 'Also install .cursor/ in current repo (team-friendly, no global needed for /roast)')
  .option('--path <dir>', 'Project root when using --project', process.cwd())
  .option('--yes', 'Non-interactive')
  .action((opts) => install(opts));

program
  .command('update')
  .description('Fetch latest roastit from npm and reinstall')
  .option('--yes', 'Non-interactive — auto-apply updates')
  .action((opts) => update(opts));

program
  .command('status')
  .description('Show installed version and check for updates')
  .action(() => status());

program
  .command('uninstall')
  .description('Remove roast skill from installed IDEs')
  .option('--tools <clients>', 'Comma-separated clients to uninstall from')
  .option('--yes', 'Non-interactive')
  .action((opts) => uninstall(opts));

program
  .command('context')
  .description('Phase 0 INIT — stack, scripts, rules, CI, blast radius (no LLM)')
  .option('--path <dir>', 'Repository root', process.cwd())
  .option('--target <glob>', 'Blast radius glob (e.g. src/auth/**)')
  .option('--format <fmt>', 'Output format: markdown or json', 'markdown')
  .action(async (opts) => {
    const out = await gatherContext(opts);
    console.log(out);
  });

program
  .command('diff')
  .description('Git diff signals for roast input (no LLM) — includes working tree by default')
  .option('--path <dir>', 'Repository root', process.cwd())
  .option('--base <branch>', 'Base branch or auto', 'auto')
  .option('--since <duration>', 'Limit commits (e.g. 1d, 12h, 30m)')
  .option('--committed-only', 'Ignore working tree and untracked files')
  .option('--format <fmt>', 'Output format: markdown or json', 'markdown')
  .action(async (opts) => {
    try {
      const out = await gatherDiff({
        path: opts.path,
        base: opts.base,
        since: opts.since,
        format: opts.format,
        committedOnly: opts.committedOnly,
      });
      console.log(out);
    } catch (err) {
      console.error(err.message || err);
      process.exit(1);
    }
  });

program.parse();

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
  .command('init')
  .description('Detect repo + IDE, write optional .roast/config.json')
  .option('--path <dir>', 'Repository root', process.cwd())
  .option('--yes', 'Overwrite existing config')
  .action((opts) => init(opts));

program
  .command('install')
  .description('Deploy roast skill and slash commands to Cursor / Claude / Codex')
  .option('--tools <clients>', 'Comma-separated: cursor, claude, codex (default: auto-detect)')
  .option('--yes', 'Non-interactive')
  .action((opts) => install(opts));

program
  .command('update')
  .description('Update installed roast skill to latest version')
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
  .description('Git diff signals for roast input (no LLM)')
  .option('--path <dir>', 'Repository root', process.cwd())
  .option('--base <branch>', 'Base branch or auto', 'auto')
  .option('--since <duration>', 'Limit commits (e.g. 1d, 12h, 30m)')
  .option('--format <fmt>', 'Output format: markdown or json', 'markdown')
  .action(async (opts) => {
    const out = await gatherDiff(opts);
    console.log(out);
  });

program.parse();

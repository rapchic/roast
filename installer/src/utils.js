import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { homedir as nodeHomedir } from 'node:os';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

/** Home directory — override with ROAST_HOME for tests. */
export function getHomedir() {
  return process.env.ROAST_HOME || nodeHomedir();
}

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SKILL_SRC = join(REPO_ROOT, 'skills', 'roast');
export const RULES_SRC = join(REPO_ROOT, 'rules', 'roast.mdc');
export const COMMANDS_SRC = join(REPO_ROOT, 'commands', 'cursor');
export const CURSOR_COMMAND_FILES = [
  'roast.md',
  'roast-only.md',
  'roast-idea.md',
  'roast-what.md',
  'roast-learn.md',
  'roast-install.md',
];
export const SCRIPTS_SRC = join(REPO_ROOT, 'scripts');
/** Scripts copied to ~/.roast/scripts on install (not lint/smoke/dev tooling). */
export const RUNTIME_SCRIPTS = ['gather-context.js'];

export function roastDir() {
  return join(getHomedir(), '.roast');
}

export function installJsonPath() {
  return join(roastDir(), '.meta.json');
}

export const ROAST_DIR = roastDir();
export const INSTALL_JSON = installJsonPath();
export const SKILL_NAME = 'roast';

const _pkg = JSON.parse(await readFile(join(REPO_ROOT, 'package.json'), 'utf8'));
export const VERSION = _pkg.version;
/** npm package name (scoped), e.g. @rapchic/roast */
export const PACKAGE_NAME = _pkg.name;

export async function copySkill(targetDir) {
  await mkdir(targetDir, { recursive: true });
  const dest = join(targetDir, SKILL_NAME);
  if (existsSync(dest)) {
    await rm(dest, { recursive: true, force: true });
  }
  await cp(SKILL_SRC, dest, { recursive: true });
}

export async function copyRules(targetPath) {
  await mkdir(dirname(targetPath), { recursive: true });
  await cp(RULES_SRC, targetPath);
}

export async function copyCursorCommands(targetDir) {
  await mkdir(targetDir, { recursive: true });
  for (const file of CURSOR_COMMAND_FILES) {
    await cp(join(COMMANDS_SRC, file), join(targetDir, file));
  }
}

export async function copyScripts() {
  const dest = join(roastDir(), 'scripts');
  await mkdir(dest, { recursive: true });
  for (const file of RUNTIME_SCRIPTS) {
    await cp(join(SCRIPTS_SRC, file), join(dest, file));
  }
}

export async function writeInstallState({ client, method = 'npx' }) {
  const installJson = installJsonPath();
  await mkdir(dirname(installJson), { recursive: true });
  let existing = {};
  if (existsSync(installJson)) {
    try {
      existing = JSON.parse(await readFile(installJson, 'utf8'));
    } catch {
      existing = {};
    }
  }
  const existingClients = Array.isArray(existing.clients)
    ? existing.clients
    : existing.client
      ? [existing.client]
      : [];
  const clients = existingClients.includes(client)
    ? existingClients
    : [...existingClients, client];
  const state = {
    ...existing,
    version: VERSION,
    method,
    client,
    clients,
    installedAt: existing.installedAt ?? new Date().toISOString(),
  };
  const tmp = installJson + '.tmp';
  await writeFile(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8');
  await rename(tmp, installJson);
  return state;
}

export async function readInstallState() {
  const installJson = installJsonPath();
  if (!existsSync(installJson)) return null;
  try {
    return JSON.parse(await readFile(installJson, 'utf8'));
  } catch {
    return null;
  }
}

export async function prompt(question, { yes = false } = {}) {
  if (yes) return '';
  if (process.env.ROAST_TEST_PROMPT_ANSWER !== undefined) {
    return process.env.ROAST_TEST_PROMPT_ANSWER;
  }
  if (!process.stdin.isTTY) return '';
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/** Confirm a destructive action. Non-TTY requires --yes (returns false otherwise). */
export async function confirmYes(question, { yes = false } = {}) {
  if (yes) return true;
  if (process.env.ROAST_TEST_PROMPT_ANSWER !== undefined) {
    return process.env.ROAST_TEST_PROMPT_ANSWER.toLowerCase() === 'y';
  }
  if (!process.stdin.isTTY) {
    console.error('Non-interactive shell detected. Re-run with --yes to confirm.');
    return false;
  }
  const answer = await prompt(question, { yes: false });
  return answer.toLowerCase() === 'y';
}

export async function detectClients() {
  const home = getHomedir();
  const clients = [];
  if (existsSync(join(home, '.cursor'))) clients.push('cursor');
  if (existsSync(join(home, '.claude'))) clients.push('claude');
  if (existsSync(join(home, '.codex'))) clients.push('codex');
  return clients;
}

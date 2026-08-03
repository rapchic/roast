import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SKILL_SRC = join(REPO_ROOT, 'skills', 'roast');
export const RULES_SRC = join(REPO_ROOT, 'rules', 'roast-commands.mdc');
export const SCRIPTS_SRC = join(REPO_ROOT, 'scripts');
export const ROAST_DIR = join(homedir(), '.roast');
export const INSTALL_JSON = join(ROAST_DIR, '.meta.json');
export const SKILL_NAME = 'roast';

const _pkg = JSON.parse(await readFile(join(REPO_ROOT, 'package.json'), 'utf8'));
export const VERSION = _pkg.version;

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

export async function copyScripts() {
  const dest = join(ROAST_DIR, 'scripts');
  await mkdir(dest, { recursive: true });
  await cp(SCRIPTS_SRC, dest, { recursive: true });
}

export async function writeInstallState({ client, method = 'npx' }) {
  await mkdir(dirname(INSTALL_JSON), { recursive: true });
  const existing = existsSync(INSTALL_JSON)
    ? JSON.parse(await readFile(INSTALL_JSON, 'utf8'))
    : {};
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
  const tmp = INSTALL_JSON + '.tmp';
  await writeFile(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8');
  await rename(tmp, INSTALL_JSON);
  return state;
}

export async function readInstallState() {
  if (!existsSync(INSTALL_JSON)) return null;
  try {
    return JSON.parse(await readFile(INSTALL_JSON, 'utf8'));
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

export async function detectClients() {
  const clients = [];
  if (existsSync(join(homedir(), '.cursor'))) clients.push('cursor');
  if (existsSync(join(homedir(), '.claude'))) clients.push('claude');
  if (existsSync(join(homedir(), '.codex'))) clients.push('codex');
  return clients;
}

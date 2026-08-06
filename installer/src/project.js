import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  copyCursorCommands,
  copyRules,
  copySkill,
  CURSOR_COMMAND_FILES,
  getHomedir,
  SKILL_NAME,
} from './utils.js';

/** Project-relative Cursor paths (committed to repo — no global install needed for slash commands). */
export function projectCursorPaths(root) {
  return {
    commandsDir: join(root, '.cursor', 'commands'),
    skillsDir: join(root, '.cursor', 'skills'),
    skillFile: join(root, '.cursor', 'skills', SKILL_NAME, 'SKILL.md'),
    rulesFile: join(root, '.cursor', 'rules', 'roast.mdc'),
  };
}

export async function installProject({ path: root = process.cwd() } = {}) {
  const { commandsDir, skillsDir, skillFile, rulesFile } = projectCursorPaths(root);

  await copySkill(skillsDir);
  await copyCursorCommands(commandsDir);
  await mkdir(join(root, '.cursor', 'rules'), { recursive: true });
  await copyRules(rulesFile);

  console.log('✓ Project roast installed (works in this repo after Cursor reload)');
  console.log(`  Skill:     ${skillFile}`);
  console.log(`  Commands:  ${CURSOR_COMMAND_FILES.map((f) => join(commandsDir, f)).join(', ')}`);
  console.log(`  Rule:      ${rulesFile}`);
  console.log('  Tip: commit `.cursor/commands/` and `.cursor/skills/roast/` so teammates get /roast without global install');

  return { installed: true, paths: { skillFile, commandsDir, rulesFile } };
}

export async function isProjectInstalled(root = process.cwd()) {
  const { skillFile } = projectCursorPaths(root);
  return existsSync(skillFile);
}

/** True if roast skill exists for Cursor, Claude, or Codex under ROAST_HOME/homedir. */
export async function isGlobalInstalled() {
  const home = getHomedir();
  return (
    existsSync(join(home, '.cursor', 'skills', SKILL_NAME, 'SKILL.md')) ||
    existsSync(join(home, '.claude', 'skills', SKILL_NAME, 'SKILL.md')) ||
    existsSync(join(home, '.codex', 'skills', SKILL_NAME, 'SKILL.md'))
  );
}

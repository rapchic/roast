import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import {
  copyCursorCommands,
  copyRules,
  copyScripts,
  copySkill,
  CURSOR_COMMAND_FILES,
  getHomedir,
  confirmYes,
  writeInstallState,
} from '../utils.js';
import { join } from 'node:path';

function cursorPaths() {
  const home = getHomedir();
  return {
    skillsDir: join(home, '.cursor', 'skills'),
    commandsDir: join(home, '.cursor', 'commands'),
    rulesFile: join(home, '.cursor', 'rules', 'roast.mdc'),
    legacyRulesFile: join(home, '.cursor', 'rules', 'roast-commands.mdc'),
    skillFile: join(home, '.cursor', 'skills', 'roast', 'SKILL.md'),
  };
}

export async function install({ yes = false } = {}) {
  const { skillsDir, commandsDir, rulesFile, legacyRulesFile, skillFile } = cursorPaths();

  console.log('→ Installing roast for Cursor...');

  await copyScripts();

  await copySkill(skillsDir);
  await copyCursorCommands(commandsDir);
  await copyRules(rulesFile);

  if (existsSync(legacyRulesFile)) {
    await rm(legacyRulesFile);
  }

  await writeInstallState({ client: 'cursor' });

  console.log('');
  console.log(`✓ Installed skill:     ${skillFile}`);
  console.log(`✓ Installed commands:  ${CURSOR_COMMAND_FILES.map((f) => f.replace('.md', '')).join(', ')}`);
  console.log(`✓ Installed rule:      ${rulesFile}`);
  console.log('→ Restart Cursor');
  console.log('→ First time: type /roast-install anytime to reinstall');
  console.log('→ Daily use: type /roast in any project');
  console.log('');
}

export async function uninstall({ yes = false } = {}) {
  const { skillsDir, commandsDir, rulesFile, legacyRulesFile } = cursorPaths();

  const ok = await confirmYes('Remove roast skill, commands, and rules from Cursor? [y/N] ', { yes });
  if (!ok) {
    console.log('Uninstall cancelled.');
    return;
  }

  const skillPath = join(skillsDir, 'roast');
  if (existsSync(skillPath)) {
    await rm(skillPath, { recursive: true, force: true });
    console.log(`  ✓ Removed ${skillPath}`);
  }

  for (const file of CURSOR_COMMAND_FILES) {
    const cmdPath = join(commandsDir, file);
    if (existsSync(cmdPath)) {
      await rm(cmdPath);
      console.log(`  ✓ Removed ${cmdPath}`);
    }
  }

  for (const rulePath of [rulesFile, legacyRulesFile]) {
    if (existsSync(rulePath)) {
      await rm(rulePath);
      console.log(`  ✓ Removed ${rulePath}`);
    }
  }

  console.log('\n✓ Cursor uninstall complete. Restart Cursor to apply.');
}

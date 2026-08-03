import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { copyRules, copyScripts, copySkill, prompt, writeInstallState } from '../utils.js';

const SKILLS_DIR = join(homedir(), '.cursor', 'skills');
const RULES_FILE = join(homedir(), '.cursor', 'rules', 'roast-commands.mdc');

export async function install({ yes = false } = {}) {
  console.log('→ Installing roast for Cursor...');

  await copyScripts();
  console.log('  ✓ Scripts installed to ~/.roast/scripts/');

  await copySkill(SKILLS_DIR);
  console.log(`  ✓ Skill copied to ${join(SKILLS_DIR, 'roast')}`);

  await copyRules(RULES_FILE);
  console.log(`  ✓ Slash commands written to ${RULES_FILE}`);

  await writeInstallState({ client: 'cursor' });
  console.log('\n✓ roast installed for Cursor');
  console.log('  Restart Cursor to load the skill.');
  console.log('  Try /roast-only or ask: "roast this diff independently"\n');
}

export async function uninstall({ yes = false } = {}) {
  const confirmed = yes
    ? 'y'
    : await prompt('Remove roast skill and rules from Cursor? [y/N] ', { yes });
  if (confirmed.toLowerCase() !== 'y') {
    console.log('Uninstall cancelled.');
    return;
  }

  const skillPath = join(SKILLS_DIR, 'roast');
  if (existsSync(skillPath)) {
    await rm(skillPath, { recursive: true, force: true });
    console.log(`  ✓ Removed ${skillPath}`);
  }
  if (existsSync(RULES_FILE)) {
    await rm(RULES_FILE);
    console.log(`  ✓ Removed ${RULES_FILE}`);
  }
  console.log('\n✓ Cursor uninstall complete. Restart Cursor to apply.');
}

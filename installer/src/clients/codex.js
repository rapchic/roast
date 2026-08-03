import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { copyScripts, copySkill, prompt, writeInstallState } from '../utils.js';

const SKILLS_DIR = join(homedir(), '.codex', 'skills');
const AGENTS_MD = join(homedir(), '.codex', 'AGENTS.md');
const ROAST_BLOCK_START = '<!-- roast start -->';
const ROAST_BLOCK_END = '<!-- roast end -->';

const ROAST_HINT = `
${ROAST_BLOCK_START}
## Roast (evidence-based code review)

Use the \`roast\` skill for evidence-based critiques. Every finding must cite \`path:line\`, git diff, or test output.

Triggers: \`/roast\`, \`/roast-only\`, \`/roast-idea\`. Run \`npx roast context\` and \`npx roast diff\` for INIT data.
${ROAST_BLOCK_END}
`;

function upsertBlock(existing, block) {
  const startIdx = existing.indexOf(ROAST_BLOCK_START);
  const endIdx = existing.indexOf(ROAST_BLOCK_END);
  if (startIdx !== -1 && endIdx !== -1) {
    return existing.slice(0, startIdx) + block.trim() + existing.slice(endIdx + ROAST_BLOCK_END.length);
  }
  return existing.trimEnd() + '\n' + block;
}

export async function install({ yes = false } = {}) {
  console.log('→ Installing roast for Codex...');

  await copyScripts();
  console.log('  ✓ Scripts installed to ~/.roast/scripts/');

  await copySkill(SKILLS_DIR);
  console.log(`  ✓ Skill copied to ${join(SKILLS_DIR, 'roast')}`);

  await mkdir(join(homedir(), '.codex'), { recursive: true });
  const existing = existsSync(AGENTS_MD) ? await readFile(AGENTS_MD, 'utf8') : '';
  await writeFile(AGENTS_MD, upsertBlock(existing, ROAST_HINT), 'utf8');
  console.log(`  ✓ Roast hint appended to ${AGENTS_MD}`);

  await writeInstallState({ client: 'codex' });
  console.log('\n✓ roast installed for Codex\n');
}

export async function uninstall({ yes = false } = {}) {
  const confirmed = yes
    ? 'y'
    : await prompt('Remove roast skill from Codex? [y/N] ', { yes });
  if (confirmed.toLowerCase() !== 'y') {
    console.log('Uninstall cancelled.');
    return;
  }

  const skillPath = join(SKILLS_DIR, 'roast');
  if (existsSync(skillPath)) {
    await rm(skillPath, { recursive: true, force: true });
    console.log(`  ✓ Removed ${skillPath}`);
  }

  if (existsSync(AGENTS_MD)) {
    let content = await readFile(AGENTS_MD, 'utf8');
    const startIdx = content.indexOf(ROAST_BLOCK_START);
    const endIdx = content.indexOf(ROAST_BLOCK_END);
    if (startIdx !== -1 && endIdx !== -1) {
      content = content.slice(0, startIdx) + content.slice(endIdx + ROAST_BLOCK_END.length);
      await writeFile(AGENTS_MD, content.trimEnd() + '\n', 'utf8');
      console.log(`  ✓ Removed roast block from ${AGENTS_MD}`);
    }
  }

  console.log('\n✓ Codex uninstall complete.');
}

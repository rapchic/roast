import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { copyScripts, copySkill, prompt, writeInstallState } from '../utils.js';

const SKILLS_DIR = join(homedir(), '.claude', 'skills');
const CLAUDE_MD = join(homedir(), '.claude', 'CLAUDE.md');
const ROAST_BLOCK_START = '<!-- roast start -->';
const ROAST_BLOCK_END = '<!-- roast end -->';

const ROAST_HINT = `
${ROAST_BLOCK_START}
## Roast (evidence-based code review)

Use the \`roast\` skill for evidence-based critiques. Every finding must cite \`path:line\`, git diff, or test output.

Slash-style triggers (say in chat):
- \`/roast\` — roast and fix current context
- \`/roast-only\` — verdict only, no file edits
- \`/roast-idea\` — critique before implementing

Run \`npx roast context\` and \`npx roast diff\` in the repo for Phase 0 INIT data.
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
  console.log('→ Installing roast for Claude Code...');

  await copyScripts();
  console.log('  ✓ Scripts installed to ~/.roast/scripts/');

  await copySkill(SKILLS_DIR);
  console.log(`  ✓ Skill copied to ${join(SKILLS_DIR, 'roast')}`);

  await mkdir(join(homedir(), '.claude'), { recursive: true });
  const existing = existsSync(CLAUDE_MD) ? await readFile(CLAUDE_MD, 'utf8') : '';
  await writeFile(CLAUDE_MD, upsertBlock(existing, ROAST_HINT), 'utf8');
  console.log(`  ✓ Roast hint appended to ${CLAUDE_MD}`);

  await writeInstallState({ client: 'claude' });
  console.log('\n✓ roast installed for Claude Code');
  console.log('  Restart Claude Code to load the skill.\n');
}

export async function uninstall({ yes = false } = {}) {
  const confirmed = yes
    ? 'y'
    : await prompt('Remove roast skill from Claude Code? [y/N] ', { yes });
  if (confirmed.toLowerCase() !== 'y') {
    console.log('Uninstall cancelled.');
    return;
  }

  const skillPath = join(SKILLS_DIR, 'roast');
  if (existsSync(skillPath)) {
    await rm(skillPath, { recursive: true, force: true });
    console.log(`  ✓ Removed ${skillPath}`);
  }

  if (existsSync(CLAUDE_MD)) {
    let content = await readFile(CLAUDE_MD, 'utf8');
    const startIdx = content.indexOf(ROAST_BLOCK_START);
    const endIdx = content.indexOf(ROAST_BLOCK_END);
    if (startIdx !== -1 && endIdx !== -1) {
      content = content.slice(0, startIdx) + content.slice(endIdx + ROAST_BLOCK_END.length);
      await writeFile(CLAUDE_MD, content.trimEnd() + '\n', 'utf8');
      console.log(`  ✓ Removed roast block from ${CLAUDE_MD}`);
    }
  }

  console.log('\n✓ Claude Code uninstall complete.');
}

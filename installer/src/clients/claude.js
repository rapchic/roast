import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { copyScripts, copySkill, getHomedir, confirmYes, writeInstallState } from '../utils.js';

const ROAST_BLOCK_START = '<!-- roast start -->';
const ROAST_BLOCK_END = '<!-- roast end -->';

function claudePaths() {
  const home = getHomedir();
  return {
    skillsDir: join(home, '.claude', 'skills'),
    claudeMd: join(home, '.claude', 'CLAUDE.md'),
  };
}

const ROAST_HINT = `
${ROAST_BLOCK_START}
## Roast (evidence-based code review)

Use the \`roast\` skill for evidence-based critiques. Every finding must cite \`path:line\`, git diff, or test output.

Slash-style triggers (say in chat):
- \`/roast\` — roast and fix current context
- \`/roast-only\` — verdict only, no file edits
- \`/roast-idea\` — critique before implementing
- \`/roast-what\` — explain the diff or a roast in plain English
- \`/roast-learn\` — learn this project's patterns & antipatterns

Run \`npx @rapchic/roast context\` and \`npx @rapchic/roast diff\` in the repo for Phase 0 INIT data.
${ROAST_BLOCK_END}
`;

/** Upsert roast block; if a start marker exists without a matching end, replace from start. */
export function upsertBlock(existing, block) {
  const startIdx = existing.indexOf(ROAST_BLOCK_START);
  const endIdx = existing.indexOf(ROAST_BLOCK_END);
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return existing.slice(0, startIdx) + block.trim() + existing.slice(endIdx + ROAST_BLOCK_END.length);
  }
  if (startIdx !== -1) {
    // Incomplete block — remove start marker only; keep following user content; append fresh block
    const withoutStart =
      existing.slice(0, startIdx) + existing.slice(startIdx + ROAST_BLOCK_START.length);
    return withoutStart.trimEnd() + '\n' + block;
  }
  return existing.trimEnd() + '\n' + block;
}

export async function install({ yes = false } = {}) {
  const { skillsDir, claudeMd } = claudePaths();
  console.log('→ Installing roast for Claude Code...');

  await copyScripts();
  console.log('  ✓ Scripts installed to ~/.roast/scripts/');

  await copySkill(skillsDir);
  console.log(`  ✓ Skill copied to ${join(skillsDir, 'roast')}`);

  await mkdir(join(getHomedir(), '.claude'), { recursive: true });
  const existing = existsSync(claudeMd) ? await readFile(claudeMd, 'utf8') : '';
  await writeFile(claudeMd, upsertBlock(existing, ROAST_HINT), 'utf8');
  console.log(`  ✓ Roast hint appended to ${claudeMd}`);

  await writeInstallState({ client: 'claude' });
  console.log('\n✓ roast installed for Claude Code');
  console.log('  Restart Claude Code to load the skill.\n');
}

export async function uninstall({ yes = false } = {}) {
  const { skillsDir, claudeMd } = claudePaths();
  const ok = await confirmYes('Remove roast skill from Claude Code? [y/N] ', { yes });
  if (!ok) {
    console.log('Uninstall cancelled.');
    return;
  }

  const skillPath = join(skillsDir, 'roast');
  if (existsSync(skillPath)) {
    await rm(skillPath, { recursive: true, force: true });
    console.log(`  ✓ Removed ${skillPath}`);
  }

  if (existsSync(claudeMd)) {
    let content = await readFile(claudeMd, 'utf8');
    const startIdx = content.indexOf(ROAST_BLOCK_START);
    const endIdx = content.indexOf(ROAST_BLOCK_END);
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      content = content.slice(0, startIdx) + content.slice(endIdx + ROAST_BLOCK_END.length);
      await writeFile(claudeMd, content.trimEnd() + '\n', 'utf8');
      console.log(`  ✓ Removed roast block from ${claudeMd}`);
    } else if (startIdx !== -1) {
      content = content.slice(0, startIdx).trimEnd() + '\n';
      await writeFile(claudeMd, content, 'utf8');
      console.log(`  ✓ Removed incomplete roast block from ${claudeMd}`);
    }
  }

  console.log('\n✓ Claude Code uninstall complete.');
}

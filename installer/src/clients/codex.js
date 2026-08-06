import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { copyScripts, copySkill, getHomedir, confirmYes, writeInstallState } from '../utils.js';

const ROAST_BLOCK_START = '<!-- roast start -->';
const ROAST_BLOCK_END = '<!-- roast end -->';

function codexPaths() {
  const home = getHomedir();
  return {
    skillsDir: join(home, '.codex', 'skills'),
    agentsMd: join(home, '.codex', 'AGENTS.md'),
  };
}

const ROAST_HINT = `
${ROAST_BLOCK_START}
## Roast (evidence-based code review)

Use the \`roast\` skill for evidence-based critiques. Every finding must cite \`path:line\`, git diff, or test output.

Triggers: \`/roast\`, \`/roast-only\`, \`/roast-idea\`, \`/roast-what\`, \`/roast-learn\`. Run \`npx @rapchic/roast context\` and \`npx @rapchic/roast diff\` for INIT data.
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
    const withoutStart =
      existing.slice(0, startIdx) + existing.slice(startIdx + ROAST_BLOCK_START.length);
    return withoutStart.trimEnd() + '\n' + block;
  }
  return existing.trimEnd() + '\n' + block;
}

export async function install({ yes = false } = {}) {
  const { skillsDir, agentsMd } = codexPaths();
  console.log('→ Installing roast for Codex...');

  await copyScripts();
  console.log('  ✓ Scripts installed to ~/.roast/scripts/');

  await copySkill(skillsDir);
  console.log(`  ✓ Skill copied to ${join(skillsDir, 'roast')}`);

  await mkdir(join(getHomedir(), '.codex'), { recursive: true });
  const existing = existsSync(agentsMd) ? await readFile(agentsMd, 'utf8') : '';
  await writeFile(agentsMd, upsertBlock(existing, ROAST_HINT), 'utf8');
  console.log(`  ✓ Roast hint appended to ${agentsMd}`);

  await writeInstallState({ client: 'codex' });
  console.log('\n✓ roast installed for Codex\n');
}

export async function uninstall({ yes = false } = {}) {
  const { skillsDir, agentsMd } = codexPaths();
  const ok = await confirmYes('Remove roast skill from Codex? [y/N] ', { yes });
  if (!ok) {
    console.log('Uninstall cancelled.');
    return;
  }

  const skillPath = join(skillsDir, 'roast');
  if (existsSync(skillPath)) {
    await rm(skillPath, { recursive: true, force: true });
    console.log(`  ✓ Removed ${skillPath}`);
  }

  if (existsSync(agentsMd)) {
    let content = await readFile(agentsMd, 'utf8');
    const startIdx = content.indexOf(ROAST_BLOCK_START);
    const endIdx = content.indexOf(ROAST_BLOCK_END);
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      content = content.slice(0, startIdx) + content.slice(endIdx + ROAST_BLOCK_END.length);
      await writeFile(agentsMd, content.trimEnd() + '\n', 'utf8');
      console.log(`  ✓ Removed roast block from ${agentsMd}`);
    } else if (startIdx !== -1) {
      content = content.slice(0, startIdx).trimEnd() + '\n';
      await writeFile(agentsMd, content, 'utf8');
      console.log(`  ✓ Removed incomplete roast block from ${agentsMd}`);
    }
  }

  console.log('\n✓ Codex uninstall complete.');
}

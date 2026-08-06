import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { install as cursorInstall } from '../installer/src/clients/cursor.js';
import {
  CURSOR_COMMAND_FILES,
  SKILL_NAME,
} from '../installer/src/utils.js';

test('cursor install copies skill, commands, and rule to temp HOME', async () => {
  const tempHome = await mkdtemp(join(tmpdir(), 'roast-install-'));
  mkdirSync(join(tempHome, '.cursor'), { recursive: true });

  try {
    process.env.ROAST_HOME = tempHome;

    await cursorInstall({ yes: true });

    const skillFile = join(tempHome, '.cursor', 'skills', SKILL_NAME, 'SKILL.md');
    assert.ok(existsSync(skillFile), 'SKILL.md should exist');

    const skillContent = await readFile(skillFile, 'utf8');
    assert.match(skillContent, /Evidence-Based Critique|Evidence-Based Code Review/);

    for (const file of CURSOR_COMMAND_FILES) {
      const cmdPath = join(tempHome, '.cursor', 'commands', file);
      assert.ok(existsSync(cmdPath), `${file} should exist`);
    }

    const roastCmd = await readFile(join(tempHome, '.cursor', 'commands', 'roast.md'), 'utf8');
    assert.match(roastCmd, /roast-and-fix/);
    assert.match(roastCmd, /@rapchic\/roast install/);
    assert.doesNotMatch(roastCmd, /bootstrap/);

    const installCmd = await readFile(
      join(tempHome, '.cursor', 'commands', 'roast-install.md'),
      'utf8',
    );
    assert.match(installCmd, /@rapchic\/roast install/);
    assert.doesNotMatch(installCmd, /bootstrap/);
    assert.match(installCmd, /@rapchic\/roast/);
    assert.doesNotMatch(installCmd, /node_modules\/roast\//);
    assert.doesNotMatch(installCmd, /Phase 0 INIT → infer scope → roast output/);

    const rulePath = join(tempHome, '.cursor', 'rules', 'roast.mdc');
    assert.ok(existsSync(rulePath), 'roast.mdc should exist');

    const metaPath = join(tempHome, '.roast', '.meta.json');
    assert.ok(existsSync(metaPath), 'install state should exist');
  } finally {
    delete process.env.ROAST_HOME;
    await rm(tempHome, { recursive: true, force: true });
  }
});

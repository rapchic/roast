import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { installProject, projectCursorPaths } from '../installer/src/project.js';
import { CURSOR_COMMAND_FILES } from '../installer/src/utils.js';

test('installProject copies skill and commands into repo .cursor/', async () => {
  const root = await mkdtemp(join(tmpdir(), 'roast-proj-'));

  try {
    await installProject({ path: root, yes: true });

    const paths = projectCursorPaths(root);
    assert.ok(existsSync(paths.skillFile));
    for (const f of CURSOR_COMMAND_FILES) {
      assert.ok(existsSync(join(paths.commandsDir, f)), `${f} missing`);
    }
    assert.ok(existsSync(paths.rulesFile));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

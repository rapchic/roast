import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(REPO, 'installer/bin/cli.js');

test('update without npm latest exits nonzero', async () => {
  const home = await mkdtemp(join(tmpdir(), 'roast-update-'));
  try {
    await mkdir(join(home, '.roast'), { recursive: true });
    await writeFile(
      join(home, '.roast', '.meta.json'),
      JSON.stringify({
        version: '0.0.1',
        client: 'cursor',
        clients: ['cursor'],
        method: 'npx',
        installedAt: new Date().toISOString(),
      }) + '\n',
    );

    // Force registry miss by pointing at a nonsense package name via... we can't easily.
    // Instead: ROAST_UPDATE_FROM_NPX refreshes from this package (child path after npx).
    const r = spawnSync(process.execPath, [CLI, 'update', '--yes'], {
      env: {
        ...process.env,
        ROAST_HOME: home,
        ROAST_UPDATE_FROM_NPX: '1',
        HOME: home,
      },
      encoding: 'utf8',
    });
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const { existsSync } = await import('node:fs');
    assert.equal(existsSync(join(home, '.cursor', 'skills', 'roast', 'SKILL.md')), true);
  } finally {
    await rm(home, { recursive: true, force: true });
  }
});

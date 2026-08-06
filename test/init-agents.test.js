import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { init, writeAgentsMd } from '../installer/src/init.js';

test('writeAgentsMd creates short AGENTS.md', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'roast-agents-'));
  try {
    await writeFile(join(dir, 'package.json'), JSON.stringify({
      name: 'demo',
      scripts: { test: 'node --test', lint: 'eslint .' },
    }));
    const result = await writeAgentsMd(dir, { yes: true });
    assert.equal(result.written, true);
    const body = await readFile(join(dir, 'AGENTS.md'), 'utf8');
    assert.match(body, /AGENTS\.md/);
    assert.match(body, /node --test/);
    assert.ok(body.split('\n').length < 50);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('init --agents does not overwrite without --yes', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'roast-agents-exist-'));
  try {
    await writeFile(join(dir, 'AGENTS.md'), '# existing\n');
    const result = await init({ path: dir, agents: true, yes: false });
    assert.equal(result.written, false);
    const body = await readFile(join(dir, 'AGENTS.md'), 'utf8');
    assert.equal(body, '# existing\n');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

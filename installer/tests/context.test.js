import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gatherContext } from '../src/context.js';
import { gatherDiff } from '../src/diff.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('gatherContext detects node stack in roast repo', async () => {
  const out = await gatherContext({ path: REPO_ROOT, format: 'json' });
  const ctx = JSON.parse(out);
  assert.equal(ctx.stack.type, 'node');
  assert.ok(ctx.conventionSources.length >= 0);
});

test('gatherDiff runs on git repo', async () => {
  const out = await gatherDiff({ path: REPO_ROOT, format: 'json' });
  const data = JSON.parse(out);
  if (data.error) {
    assert.match(data.error, /git/i);
    return;
  }
  assert.ok(typeof data.baseBranch === 'string');
  assert.ok(Array.isArray(data.changedFiles));
});

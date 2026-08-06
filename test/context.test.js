import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gatherContext } from '../installer/src/context.js';
import { gatherDiff, parseSince } from '../installer/src/diff.js';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('gatherContext detects node stack in roast repo', async () => {
  const out = await gatherContext({ path: REPO_ROOT, format: 'json' });
  const ctx = JSON.parse(out);
  assert.equal(ctx.stack.type, 'node');
  assert.equal(ctx.stack.name, '@rapchic/roast');
  assert.ok(ctx.scripts.test);
});

test('gatherDiff runs on git repo', async () => {
  let out;
  try {
    out = await gatherDiff({ path: REPO_ROOT, format: 'json' });
  } catch (err) {
    assert.fail(`gatherDiff threw unexpectedly: ${err.message}`);
  }
  const data = JSON.parse(out);
  if (data.error) {
    assert.fail(`Unexpected git/repo error in this repository: ${data.error}`);
  }
  assert.ok(typeof data.baseBranch === 'string');
  assert.ok(Array.isArray(data.changedFiles));
  assert.equal(data.includesWorkingTree, true);
  assert.ok(data.scopeBudget?.limit >= 1);
  assert.ok(Array.isArray(data.workingTreeFiles));
  assert.ok(Array.isArray(data.untrackedFiles));
  assert.ok(typeof data.commitCount === 'number');
  assert.ok(data.byArea && typeof data.byArea === 'object');
});

test('gatherDiff --committed-only skips working tree', async () => {
  let out;
  try {
    out = await gatherDiff({ path: REPO_ROOT, format: 'json', committedOnly: true });
  } catch (err) {
    assert.fail(`gatherDiff threw unexpectedly: ${err.message}`);
  }
  const data = JSON.parse(out);
  if (data.error) {
    assert.fail(`Unexpected git/repo error in this repository: ${data.error}`);
  }
  assert.equal(data.includesWorkingTree, false);
  assert.equal(data.workingTreeFiles.length, 0);
  assert.equal(data.untrackedFiles.length, 0);
});

test('parseSince accepts d/h/m and rejects garbage', () => {
  assert.ok(parseSince('1d') instanceof Date);
  assert.ok(parseSince('12h') instanceof Date);
  assert.ok(parseSince('30m') instanceof Date);
  assert.equal(parseSince('foo'), null);
  assert.equal(parseSince(''), null);
  assert.equal(parseSince('1w'), null);
});

test('gatherDiff rejects invalid --since', async () => {
  await assert.rejects(
    () => gatherDiff({ path: REPO_ROOT, format: 'json', since: 'foo' }),
    /Invalid --since/,
  );
});

test('gatherDiff --since filters commit list field', async () => {
  const full = JSON.parse(await gatherDiff({ path: REPO_ROOT, format: 'json', committedOnly: true }));
  const day = JSON.parse(
    await gatherDiff({ path: REPO_ROOT, format: 'json', committedOnly: true, since: '1d' }),
  );
  assert.equal(day.since, '1d');
  assert.ok(day.commitCount <= full.commitCount);
});

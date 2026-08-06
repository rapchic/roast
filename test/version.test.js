import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareSemver } from '../installer/src/version-check.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

test('compareSemver orders versions', () => {
  assert.ok(compareSemver('0.1.0', '0.2.0') < 0);
  assert.ok(compareSemver('1.0.0', '0.9.9') > 0);
  assert.equal(compareSemver('1.0.0', '1.0.0'), 0);
});

test('compareSemver strips prerelease and leading v', () => {
  assert.equal(compareSemver('1.0.0-beta.1', '1.0.0'), 0);
  assert.ok(compareSemver('1.0.0-rc.1', '1.0.1') < 0);
  assert.ok(compareSemver('v1.2.3', '1.2.2') > 0);
  assert.ok(!Number.isNaN(compareSemver('1.0.0-alpha', '1.0.0')));
});

test('package.json version matches skills/roast/SKILL.md frontmatter', async () => {
  const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf8'));
  const skill = await readFile(join(ROOT, 'skills', 'roast', 'SKILL.md'), 'utf8');
  const m = skill.match(/^---[\s\S]*?^version:\s*([^\s]+)/m);
  assert.ok(m, 'SKILL.md must have version: in frontmatter');
  assert.equal(pkg.version, m[1]);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareSemver } from '../src/version-check.js';

test('compareSemver orders versions', () => {
  assert.ok(compareSemver('0.1.0', '0.2.0') < 0);
  assert.ok(compareSemver('1.0.0', '0.9.9') > 0);
  assert.equal(compareSemver('1.0.0', '1.0.0'), 0);
});

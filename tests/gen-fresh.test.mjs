import test from "node:test";
import assert from "node:assert/strict";
import { isFresh, DEFAULT_MAX_AGE_MIN } from "../scripts/gen-fresh-lib.mjs";

const now = 1_000_000_000_000;
const min = 60_000;

test("gen-fresh: a file younger than the limit is reused", () => {
  assert.equal(isFresh({ mtimeMs: now - 10 * min, now }), true);
});
test("gen-fresh: a file older than the limit is refetched", () => {
  assert.equal(isFresh({ mtimeMs: now - (DEFAULT_MAX_AGE_MIN + 1) * min, now }), false);
});
test("gen-fresh: a missing file is generated", () => {
  assert.equal(isFresh({ mtimeMs: null, now }), false);
});
test("gen-fresh: CI and force always fetch, 0 disables the cache", () => {
  assert.equal(isFresh({ mtimeMs: now - min, now, ci: true }), false);
  assert.equal(isFresh({ mtimeMs: now - min, now, force: true }), false);
  assert.equal(isFresh({ mtimeMs: now - min, now, maxAgeMin: 0 }), false);
});
test("gen-fresh: a file dated in the future is not trusted", () => {
  assert.equal(isFresh({ mtimeMs: now + 5 * min, now }), false);
});

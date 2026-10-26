import assert from "node:assert/strict";
import { test } from "node:test";
import { oneLine } from "../scripts/gen-org-stats.mjs";

test("oneLine keeps a network value on one log line", () => {
  assert.equal(oneLine("a\nFORGED: ok\r\n\tb"), "a FORGED: ok b");
  assert.equal(oneLine(42), "42");
  assert.equal(oneLine("x".repeat(500)).length, 200);
});

import assert from "node:assert/strict";
import { test } from "node:test";

import { lastBaseWins } from "../scripts/seo-check.mjs";

test("the last --base wins, so a served port overrides the script's default", () => {
  assert.deepEqual(
    lastBaseWins(["--base", "http://localhost:3000", "--host", "h", "--base", "http://localhost:6000"]),
    ["--host", "h", "--base", "http://localhost:6000"],
  );
});

test("one --base, or none, is left as it is", () => {
  assert.deepEqual(lastBaseWins(["--base", "a", "--host", "h"]), ["--base", "a", "--host", "h"]);
  assert.deepEqual(lastBaseWins(["--host", "h"]), ["--host", "h"]);
});

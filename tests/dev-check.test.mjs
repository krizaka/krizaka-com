import test from "node:test";
import assert from "node:assert/strict";
import { lintableFiles } from "../scripts/dev-check.mjs";

test("dev-check: lints changed scripts and sources, not data, declarations or node_modules", () => {
  assert.deepEqual(
    lintableFiles(["app/page.tsx", "lib/a.ts", "scripts/x.mjs", "messages/en.json", "next-env.d.ts", "node_modules/x/y.js", "README.md"]),
    ["app/page.tsx", "lib/a.ts", "scripts/x.mjs"],
  );
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const proposal = readFileSync(new URL("../docs/design/bunny-org-library.md", import.meta.url), "utf8");

test("the org library has exclusive generated ownership and explicit upload boundaries", () => {
  assert.match(proposal, /`krizaka\/v1\/` is \*\*generated-only\*\*/);
  assert.match(proposal, /`tools\/export-brand\.mjs` is its sole writer and owns every file there, including `manifest\.json`/);
  assert.match(proposal, /Reviewed upload.*under `site\/org\/<kind>\/`/);
  assert.match(proposal, /`site\/org\/` is managed only by `scripts\/cdn-assets\.mjs` and its entries in `lib\/cdn-manifest\.json`/);
  assert.doesNotMatch(proposal, /upload --to `?krizaka\/v1\//);
});

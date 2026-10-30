import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const proposal = readFileSync(new URL("../docs/design/bunny-org-library.md", import.meta.url), "utf8");

test("the org library has exclusive generated ownership and explicit upload boundaries", () => {
  assert.match(proposal, /`krizaka\/v1\/` is \*\*generated-only\*\*/);
  assert.match(
    proposal,
    /`tools\/export-brand\.mjs` is its sole writer and owns every file there, including `manifest\.json`/,
  );
  assert.match(proposal, /Reviewed upload.*under `site\/org\/<kind>\/`/);
  assert.match(
    proposal,
    /`site\/org\/` is managed only by `scripts\/cdn-assets\.mjs` and its entries in `lib\/cdn-manifest\.json`/,
  );
  assert.doesNotMatch(proposal, /upload --to `?krizaka\/v1\//);
});

test("the supplied default set is the first org-level candidate and its published manifest is sanitised", () => {
  assert.match(proposal, /12 default avatars/);
  assert.match(proposal, /12 default banners/);
  assert.match(proposal, /first org-level candidates/);
  assert.match(proposal, /`krizaka\/v1\/avatars\/default-<01-12>`/);
  assert.match(proposal, /`krizaka\/v1\/covers\/default-<01-12>`/);
  assert.match(proposal, /\*\*Supplied\*\*/);
  assert.match(proposal, /\*\*Generated\*\*/);
  assert.match(proposal, /none is added by this PR/);
  assert.match(proposal, /\*\*The published manifest is sanitised\.\*\*/);
  assert.match(proposal, /no company identifier/);
  assert.match(proposal, /no personal data/);
  assert.doesNotMatch(proposal, /Documents\/krizaka/);
});

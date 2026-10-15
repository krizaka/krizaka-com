// The HTML of a page must revalidate at the edge; only the hashed bundles are immutable (a deploy must show at once).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");

test("pages revalidate: no long s-maxage on the HTML rule", () => {
  const rule = config.match(/source: "\/\(\(\?!([^"]+)\)\.\*\)"/);
  assert.ok(rule, "a catch-all rule for pages exists");
  assert.match(rule[1], /_next\/static\//, "the hashed bundles are excluded from the revalidating rule");
  assert.match(config, /value: "public, max-age=0, must-revalidate"/);
});

test("no rule gives pages a year at the edge", () => {
  assert.doesNotMatch(config, /s-maxage=31536000/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { figureColumns } from "../lib/figure-grid.ts";

// The coordinator (2026-10-20): /open-source's five tiles wrapped 4 + 1 at desktop width, a big empty grey block, and
// « Apache-2.0 » broke on two lines. The figures fill their rows; the licence is a caption, not a tile.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

test("a row of figures never leaves an empty cell, wide or on a phone", () => {
  for (let n = 1; n <= 9; n++) {
    const { wide, narrow } = figureColumns(n);
    assert.equal(n % wide, 0, `${n} figures in ${wide} columns`);
    assert.equal(n % narrow, 0, `${n} figures in ${narrow} columns on a phone`);
    assert.ok(narrow <= 3, `${n}: at most 3 columns on a phone`);
  }
  assert.deepEqual(figureColumns(4), { wide: 4, narrow: 2 }, "four figures: one row, 2 × 2 on a phone");
});

test("/open-source: the figures are one line of facts above the packages (Cahier: no counter band under the hero), values never broken", () => {
  const page = read("app/[locale]/open-source/page.tsx");
  assert.doesNotMatch(page, /id: "license", value: "Apache-2\.0"/, "the licence is not a stat tile");
  assert.doesNotMatch(page, /<StatGrid/, "no band of counters under the hero (krizaka-cahier-design, Refuse)");
  assert.match(page, /<Facts items=\{figures\} \/>/);
  const css = read("app/components/figure-tiles.css");
  assert.match(css, /white-space: nowrap/);
  assert.match(css, /--kz-fig-cols-narrow/);
  for (const l of ["en", "fr"])
    assert.match(JSON.parse(read(`messages/${l}.json`)).site.openSource.figures.license, /\{license\}/);
});

// A row of figures reads as one line of numbers (scripts/figures-lib.mjs; the browser check is scripts/check-figures.mjs,
// run by CI on the container at 360/768/1440, dark and light, EN and FR).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cases, figureProblems } from "../scripts/figures-lib.mjs";

const c = { path: "/fr", width: 1440, theme: "dark" };
const fig = (text, row, baseline, numeric = "lining-nums tabular-nums") => ({ text, row, baseline, numeric });

test("covers the home, EN and FR, at 360/768/1440 in both themes", () => {
  assert.equal(cases().length, 2 * 3 * 2);
});

test("a row on one baseline, lining and tabular, passes", () => {
  assert.deepEqual(figureProblems(c, [fig("39", 100, 140), fig("4 514", 100, 140.5)]), []);
});

test("a figure lower than its row (a label that wrapped above it) fails", () => {
  assert.match(figureProblems(c, [fig("39", 100, 140), fig("4 514", 100, 172)])[0], /sit 32px apart/);
});

test("old-style or proportional digits fail", () => {
  assert.match(figureProblems(c, [fig("39", 100, 140, "normal")])[0], /not lining-nums tabular-nums/);
  assert.match(figureProblems(c, [fig("39", 100, 140, "tabular-nums")])[0], /not lining-nums/);
});

test("the home's proofs: the number on top, every number lining and tabular (the --kz-figures token)", () => {
  const css = readFileSync(new URL("../app/components/home/home.css", import.meta.url), "utf8");
  const cell = css.match(/\.kz-home-proofs > div \{([^}]*)\}/)[1];
  // column-reverse puts the number (dd, last) on top; flex-end packs the cell from the top, so a wrapped label flows below.
  assert.match(cell, /flex-direction: column-reverse/);
  assert.match(cell, /justify-content: flex-end/);
  assert.match(css.match(/\.kz-home-proofs dd \{([^}]*)\}/)[1], /font-variant-numeric: var\(--kz-figures/);
});

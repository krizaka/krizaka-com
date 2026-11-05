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

// krizaka-internal#2445: Krizaka's figures left the home's hero for /docs, one quiet line there.
test("the home's hero shows no figures any more: they are /docs' quiet line", () => {
  const css = readFileSync(new URL("../app/components/home/home.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /\.kz-home-proofs|\.kz-home-proof-group|\.kz-home-license/);
  const hero = readFileSync(new URL("../app/components/home/HomeHero.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(hero, /NumberTicker|floorFigure|kz-home-proofs/);
  const docs = readFileSync(new URL("../app/[locale]/docs/page.tsx", import.meta.url), "utf8");
  assert.match(docs, /<p className="os-stats">/);
});

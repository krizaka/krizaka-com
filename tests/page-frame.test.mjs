import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Quality gate of the design skills (2026-10-30, review of #509 and #512): the paper of a page is one class of
// app/globals.css, never an inline style on its <main>; and /services does not repeat the home's band of counters.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

test("the home and /services wear the site's paper class, no inline style on <main>", () => {
  assert.match(read("app/globals.css"), /\.kz-site-main \{[^}]*background: var\(--kz-surface-0\)/);
  for (const page of ["app/[locale]/page.tsx", "app/[locale]/services/page.tsx"]) {
    const src = read(page);
    assert.match(src, /<main className="kz-site-main">/, page);
    assert.doesNotMatch(src, /<main[^>]*style=\{\{/, page);
  }
});

test("/services: the figures are one line of facts, its hero has one primary action", () => {
  const src = read("app/[locale]/services/page.tsx");
  assert.doesNotMatch(src, /FigureTiles/, "the home's hero already carries the climbing figures");
  assert.match(src, /<Facts items=\{figures\.map/);
  const hero = src.slice(src.indexOf("<PricingPage"), src.indexOf("plansLabel="));
  assert.equal((hero.match(/variant="primary"/g) ?? []).length, 1);
  assert.doesNotMatch(hero, /variant="secondary"/, "the second way in is a quiet ghost link");
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { weeklyTotal, weeklyTotalOfSnapshot } from "../lib/package-catalogue.ts";
import { figureColumns } from "../lib/figure-grid.ts";

// Oussama (2026-10-20): the hero's figures add « npm downloads last week », read at build from the same data as
// /open-source (api.npmjs.org, the sum over the @krizaka packages), hidden when unknown, climbing like the others; the
// row stays balanced (full rows on a phone and wide), the licence a caption as on /open-source.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

test("the hero's downloads are /open-source's: the sum of every package's last week, undefined when none reports", () => {
  const snap = {
    npm: { "@krizaka/ui": "3.29.0", "@krizaka/icons": "0.6.0", "@krizaka/x": "1.0.0" },
    npmMeta: { "@krizaka/ui": { weeklyDownloads: 4968 }, "@krizaka/icons": { weeklyDownloads: 120 }, "@krizaka/x": {} },
  };
  assert.equal(weeklyTotalOfSnapshot(snap), 5088);
  assert.equal(weeklyTotalOfSnapshot({ npm: { a: "1" }, npmMeta: {} }), undefined, "unknown: hidden, never 0");
  assert.equal(weeklyTotalOfSnapshot({}), undefined);
  assert.equal(weeklyTotalOfSnapshot(snap), weeklyTotal([{ weeklyDownloads: 4968 }, { weeklyDownloads: 120 }, {}]));
});

test("the hero reads it at build, climbs with NumberTicker, drops it when missing, and keeps full rows", () => {
  const page = read("app/[locale]/page.tsx");
  assert.match(page, /downloads: npmWeeklyDownloads\(\)/);
  const hero = read("app/components/home/HomeHero.tsx");
  assert.match(hero, /id: "downloads", value: floorFigure\(figures\.downloads \?\? 0\), label: t\.proofs\.downloads/);
  assert.match(hero, /g\.items\.filter\(\(p\) => p\.value > 0\)/, "a figure the registries did not give is not shown");
  assert.match(hero, /<NumberTicker value=\{p\.value\}/);
  assert.match(hero, /groups\.published/);
  assert.match(hero, /groups\.used/);
  assert.match(hero, /figureColumns\(g\.items\.length\)/);
  assert.match(hero, /className="kz-home-license"/, "the licence is a caption, not a fifth cell");
  assert.match(read("app/components/home/home.css"), /\.kz-home-proofs \{[^}]*repeat\(var\(--kz-fig-cols-narrow/);
  for (const n of [3, 4]) assert.equal(n % figureColumns(n).narrow, 0);
  for (const l of ["en", "fr"]) {
    const p = JSON.parse(read(`messages/${l}.json`)).site.home.hero.proofs;
    assert.ok(p.downloads, `${l}: hero.proofs.downloads`);
    assert.match(p.license, /\{license\}/);
  }
});

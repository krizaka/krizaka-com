import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { weeklyTotal, weeklyTotalOfSnapshot } from "../lib/package-catalogue.ts";

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

// krizaka-internal#2445: the downloads moved with the other figures from the home's hero to /docs' line.
test("/docs reads the downloads at build and says them only when the registries gave them", () => {
  const docs = read("app/[locale]/docs/page.tsx");
  assert.match(docs, /const downloads = npmWeeklyDownloads\(\);/);
  assert.match(
    docs,
    /format\(downloads \? h\.statsDownloads : h\.stats,/,
    "a figure the registries did not give is not shown",
  );
  assert.doesNotMatch(read("app/[locale]/page.tsx"), /npmWeeklyDownloads/, "the home reads no downloads");
  for (const l of ["en", "fr"]) {
    const h = JSON.parse(read(`messages/${l}.json`)).site.openSource.hub;
    assert.match(h.statsDownloads, /\{downloads\}/, l);
    assert.doesNotMatch(h.stats, /\{downloads\}/, l);
  }
});

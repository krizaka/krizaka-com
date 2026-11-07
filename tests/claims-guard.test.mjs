import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { LICENCE, OPEN_SOURCE_EVERYTHING, PRODUCT, PRODUCT_COUNT } from "../lib/public-claims.ts";

const root = new URL("../", import.meta.url).pathname;
const read = (f) => readFileSync(join(root, f), "utf8");

function walk(dir, out = []) {
  for (const n of readdirSync(join(root, dir))) {
    const rel = join(dir, n);
    if (statSync(join(root, rel)).isDirectory()) walk(rel, out);
    else if (/\.(tsx?|json|md|mdx|txt)$/.test(n) && !/\.signed\.json$/.test(n)) out.push(rel);
  }
  return out;
}
const GENERATED =
  /^lib\/.*(registry-versions|dev-preview-checklists|github-org|org-stats|cdn-manifest|changelog)[^/]*\.json$/;
/** The rules themselves (lib/public-claims.ts), not a claim. */
const RULES = "lib/public-claims.ts";
const sources = ["app", "lib", "content"]
  .flatMap((d) => {
    try {
      return walk(d);
    } catch {
      return [];
    }
  })
  // The generated files are not ours to word; lib/changelog.json is the family's live release notes, each line judged by
  // these rules (lib/public-claims.ts) when it is generated (krizaka-internal#2880): a test never reads live data.
  .filter((f) => !GENERATED.test(f) && f !== RULES);

test("no message or page claims a licence (FSL, BSL...) for a product (founder, 2026-11-01)", () => {
  for (const f of [...sources, "messages/en.json", "messages/fr.json"]) {
    for (const [i, line] of read(f).split("\n").entries()) {
      if (LICENCE.test(line)) assert.doesNotMatch(line, PRODUCT, `${f}:${i + 1} names a licence next to a product`);
    }
  }
  for (const l of ["en", "fr"]) {
    assert.doesNotMatch(read(`messages/${l}.json`), LICENCE, `${l}: no source-available licence is named at all`);
  }
});

test("no typed repository count in the source or the messages: counts are read at build or absent", () => {
  const re = /\b\d+\s+(?:public\s+|open[- ]source\s+|publics?\s+)?(?:repositories|repos|dépôts)\b/i;
  for (const f of [...sources, "messages/en.json", "messages/fr.json"]) {
    for (const [i, line] of read(f).split("\n").entries())
      assert.doesNotMatch(line, re, `${f}:${i + 1} types a repository count`);
  }
});

test("the docs hub counts the open-source list and says so; 'public' labels read the organisation count", () => {
  for (const l of ["en", "fr"]) {
    const m = JSON.parse(read(`messages/${l}.json`));
    assert.doesNotMatch(m.site.openSource.hub.stats, /public/i, `${l}: hub stats counts open-source repositories`);
  }
  assert.match(read("app/[locale]/docs/page.tsx"), /repositories\.length/);
});

test("no Maven Central count, no « every repository » licence claim (founder, 2026-11-01)", () => {
  const bad = [
    [
      /mavenArtifactCount|"[^"]*\{maven\}[^"]*"|(?:artifacts|artefacts) (?:on|sur) Maven Central/i,
      "a Maven Central count",
    ],
    [
      /(?:Apache|licen[cs]e|\{license\})[^\n]*(?:every repositor|chaque dépôt(?! porte))|(?:on|sur) every repositor|sur chaque dépôt(?! porte)/i,
      "a licence claim on every repository",
    ],
  ];
  for (const f of [...sources, "messages/en.json", "messages/fr.json"])
    for (const [i, line] of read(f).split("\n").entries())
      for (const [re, what] of bad) assert.doesNotMatch(line, re, `${f}:${i + 1} shows ${what}`);
});

test("public figures and the downloads total are « more than N », read at build, rounded down, never typed, in two groups", async () => {
  const { floorFigure } = await import("../lib/figure-floor.ts");
  for (const real of [36, 47, 40, 7, 100, 999, 170578])
    assert.ok(floorFigure(real) < real, `${real}: never rounded up`);
  for (const l of ["en", "fr"]) {
    const m = JSON.parse(read(`messages/${l}.json`));
    assert.match(m.site.openSource.hub.stats, /^(?:more than|plus de)/, `${l}: hub stats say « more than »`);
    for (const p of [m.site.home.hero.proofs, m.site.services.proof]) {
      assert.ok(p.more && p.groups.published && p.groups.used, `${l}: « more than » and the two group labels`);
    }
    assert.doesNotMatch(
      JSON.stringify(m),
      /\b1[0-9]{2}[  ,]?[0-9]{3}\b.{0,40}(?:downloads|téléchargements)/i,
      `${l}: no typed downloads figure`,
    );
  }
  const hero = read("app/components/home/HomeHero.tsx");
  for (const k of ["repositories", "npm", "downloads"])
    assert.match(hero, new RegExp(`floorFigure\\(figures\\.${k}`), k);
  assert.match(read("app/[locale]/services/page.tsx"), /floorFigure\(npmWeeklyDownloads\(\) \?\? 0\)/);
});

/* krizaka-internal#2807: every page's social preview said « seven products built on them — all open source » and llms.txt
   « ships seven products », « Every repository is public under Apache-2.0 », « Everything is open source ». The products are
   data (lib/products.ts) and carry no licence (AGENTS.md): a count of products is never typed, and no line claims that
   everything, or every repository, is open source. (The messages join this guard once the Krizaka UI block page has left,
   krizaka-internal#2804 slice F: its history line counts the products of 2025.) */
const CODE_AND_CONTENT = sources.filter((f) => !/^content\/films\//.test(f));

test("no product count in words, and no « everything is open source » line (krizaka-internal#2807)", () => {
  const bad = [
    [PRODUCT_COUNT, "a product count in words"],
    [OPEN_SOURCE_EVERYTHING, "a licence claim on everything"],
  ];
  for (const f of CODE_AND_CONTENT)
    for (const [i, line] of read(f).split("\n").entries())
      for (const [re, what] of bad) assert.doesNotMatch(line, re, `${f}:${i + 1} says ${what}`);
});

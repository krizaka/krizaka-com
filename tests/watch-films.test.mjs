import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { isoDuration, WATCH_FILMS, watchPath } from "../lib/watch-films.ts";
import { createRequire } from "node:module";
import { lastResortRedirects, productRedirects } from "../lib/product-redirects.ts";
import { uiRedirects } from "../lib/ui-redirects.ts";
import { javaRedirects } from "../lib/java-redirects.ts";

const { match } = createRequire(import.meta.url)("path-to-regexp");

const root = new URL("../", import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p), "utf8");
const walk = (dir) =>
  readdirSync(join(root, dir)).flatMap((n) => {
    const rel = join(dir, n);
    return statSync(join(root, rel)).isDirectory() ? walk(rel) : [rel];
  });

test("VideoObject is built only for a watch page: an illustrative clip carries no structured data (Search Console video report, 2026-11-01)", () => {
  const users = [...walk("app"), ...walk("lib")].filter(
    (f) => /\.(tsx?|mjs)$/.test(f) && /VideoObject|buildVideoJsonLd/.test(read(f)),
  );
  assert.deepEqual(users.sort(), ["app/[locale]/films/[id]/page.tsx", "lib/structured-data.ts"].sort());
});

test("a watch page carries everything Google asks for a video that is the main content", () => {
  const page = read("app/[locale]/films/[id]/page.tsx");
  for (const field of ["name", "description", "thumbnailUrl", "uploadDate", "duration", "contentUrl", "transcript"]) {
    assert.match(page, new RegExp(`\\b${field}\\b`), field);
  }
  assert.match(page, /<video controls/);
  assert.match(page, /poster=/);
  assert.match(page, /srcLang="en"/);
  assert.match(page, /srcLang="fr"/);
  assert.match(page, /dynamicParams = false/);
});

test("every watch film has an upload date, a length, a duration and a page template", () => {
  assert.ok(WATCH_FILMS.length > 0);
  for (const f of WATCH_FILMS) {
    assert.match(f.uploadDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(f.seconds > 0);
    assert.ok(f.cues.length > 0);
    assert.match(read("lib/page-templates.ts"), /"\/films\/\[id\]": "gallery"/);
    assert.equal(watchPath(f.id), `/films/${f.id}`);
  }
  assert.equal(isoDuration(44), "PT44S");
  assert.equal(isoDuration(60), "PT1M");
  assert.equal(isoDuration(125), "PT2M5S");
});

test("the sitemap lists each watch page with its video tags, and the story links to it", () => {
  const sitemap = read("app/sitemap.ts");
  assert.match(sitemap, /WATCH_FILMS/);
  for (const key of ["thumbnail_loc", "content_loc", "duration", "publication_date"]) {
    assert.match(sitemap, new RegExp(key));
  }
  assert.match(read("app/[locale]/story/page.tsx"), /watchPath\("family"\)/);
});

test("the sitemap never lists an address that redirects (any redirect map)", () => {
  const paths = [...read("app/sitemap.ts").matchAll(/^\s+"(\/[a-z-]*)",$/gm)].map((m) => m[1]);
  assert.ok(paths.includes("/services") && paths.includes("/story"));
  const rules = [...productRedirects(), ...lastResortRedirects(), ...uiRedirects(), ...javaRedirects()].map((r) => ({
    source: r.source,
    matches: match(r.source, { decode: decodeURIComponent }),
  }));
  for (const loc of ["fr", "en"])
    for (const p of paths.concat(watchPath("family"), "/open-source/krizaka-ui")) {
      const url = `/${loc}${p}`;
      assert.equal(rules.find((r) => r.matches(url))?.source, undefined, url);
    }
});

test("no source names the legacy Bunny folder site/brand-films (layout v2 is org/v1/films, through lib/cdn.ts)", () => {
  const offenders = [...walk("app"), ...walk("lib")].filter(
    (f) => /\.(tsx?|json|mjs)$/.test(f) && /["'`/]site\/brand-films\//.test(read(f)),
  );
  assert.deepEqual(offenders, []);
});

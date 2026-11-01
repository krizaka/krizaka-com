import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { filmRedirects, isoDuration, RETIRED_FILMS, WATCH_FILMS, watchPath } from "../lib/watch-films.ts";
import { BRAND_FILM } from "../lib/brand-film.ts";
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
  for (const field of ["name", "description", "thumbnailUrl", "uploadDate", "duration", "contentUrl"]) {
    assert.match(page, new RegExp(`\\b${field}\\b`), field);
  }
  assert.match(page, /<video\s+controls/);
  assert.match(page, /poster=/);
  assert.doesNotMatch(page, /autoPlay|autoplay/, "nothing plays by itself (reduced motion: the poster waits)");
  // The brand film has no speech: no captions track, its text version is the list of its shots, in both languages.
  assert.doesNotMatch(page, /<track/);
  assert.match(page, /f\.shots\.map/);
  for (const l of ["en", "fr"]) {
    const film = JSON.parse(read(`messages/${l}.json`)).site.story.watch.film;
    assert.deepEqual(Object.keys(film.shots), [...BRAND_FILM.shots], l);
    for (const k of ["title", "description", "credit"]) assert.ok(film[k].trim(), `${l} ${k}`);
  }
  assert.match(page, /dynamicParams = false/);
});

test("every watch film has an upload date, a length, a duration and a page template", () => {
  assert.ok(WATCH_FILMS.length > 0);
  for (const f of WATCH_FILMS) {
    assert.match(f.uploadDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(f.seconds > 0);
    assert.ok(f.shots.length > 0);
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
  assert.match(read("app/[locale]/story/page.tsx"), /watchPath\(film\.id\)/);
  assert.deepEqual(
    WATCH_FILMS.map((f) => f.id),
    [BRAND_FILM.id],
    "« Montrer son travail » is THE watch page",
  );
});

test("the sitemap never lists an address that redirects (any redirect map)", () => {
  const paths = [...read("app/sitemap.ts").matchAll(/^\s+"(\/[a-z-]*)",$/gm)].map((m) => m[1]);
  assert.ok(paths.includes("/services") && paths.includes("/story"));
  const rules = [...productRedirects(), ...lastResortRedirects(), ...uiRedirects(), ...javaRedirects()].map((r) => ({
    source: r.source,
    matches: match(r.source, { decode: decodeURIComponent }),
  }));
  for (const loc of ["fr", "en"])
    for (const p of paths.concat(watchPath(BRAND_FILM.id), "/open-source/krizaka-ui")) {
      const url = `/${loc}${p}`;
      assert.equal(rules.find((r) => r.matches(url))?.source, undefined, url);
    }
});

test("a retired film's watch page answers 308 with the brand film's, with or without the locale", () => {
  assert.equal(RETIRED_FILMS.family, BRAND_FILM.id);
  assert.ok(!WATCH_FILMS.some((f) => f.id in RETIRED_FILMS), "a retired film has no page any more");
  const rules = filmRedirects();
  const to = (url) => {
    for (const r of rules) {
      const m = match(r.source, { decode: decodeURIComponent })(url);
      if (m) return { dest: r.destination.replace(":locale", m.params.locale ?? ""), permanent: r.permanent };
    }
  };
  assert.deepEqual(to("/fr/films/family"), { dest: "/fr/films/montrer-son-travail", permanent: true });
  assert.deepEqual(to("/en/films/family"), { dest: "/en/films/montrer-son-travail", permanent: true });
  assert.deepEqual(to("/films/family"), { dest: "/films/montrer-son-travail", permanent: true });
  assert.match(read("next.config.ts"), /\.\.\.filmRedirects\(\)/);
});

test("no source names the legacy Bunny folder site/brand-films (layout v2 is org/v1/films, through lib/cdn.ts)", () => {
  const offenders = [...walk("app"), ...walk("lib")].filter(
    (f) => /\.(tsx?|json|mjs)$/.test(f) && /["'`/]site\/brand-films\//.test(read(f)),
  );
  assert.deepEqual(offenders, []);
});

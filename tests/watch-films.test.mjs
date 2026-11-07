import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { filmRedirects, isoDuration, RETIRED_FILMS, WATCH_FILMS, watchFilm, watchPath } from "../lib/watch-films.ts";
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
  assert.match(
    page,
    /<WatchPlayer src=\{media\.mp4\} poster=\{media\.poster\}/,
    "@krizaka/ui's MediaPlayer, not a hand-made video",
  );
  assert.doesNotMatch(page, /<video\b/);
  assert.match(read("app/components/WatchPlayer.tsx"), /<MediaPlayer\b[^>]*poster=/);
  assert.doesNotMatch(page, /autoPlay|autoplay/, "nothing plays by itself (reduced motion: the poster waits)");
  // The brand film has no speech: no captions track, its text version is the list of its shots, in both languages.
  assert.doesNotMatch(page, /<track/);
  assert.match(page, /f\.shots\.map/);
  assert.match(page, /words\.version\.lines\.map/, "the text version of every film is on its page");
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
    assert.ok(f.kind === "brand" ? f.shots.length > 0 : f.mp4.endsWith("-full.mp4"));
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
    [BRAND_FILM.id, "dossier-nadia", "dossier-sam", "dossier-theo"],
    "the brand film and the three Dossiers each have their watch page; the trailer's is withheld",
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

// The trailer's file still ends on a wrong licence card (« Open source · Apache-2.0 »; Sovkora is FSL-1.1 with an
// Apache-2.0 future licence). The founder is re-editing it. Until the corrected file replaces it, its watch page is not
// published: no page, no sitemap entry, no slide action to it. Its 10 s loop (2-12 s) ends before the card and stays.
test("a withheld film has no watch page, and says why; the trailer is withheld until its licence card is corrected", () => {
  const board = JSON.parse(read("content/films/home-showcase.json"));
  const withheld = Object.entries(board.films).filter(([, f]) => typeof f !== "string" && f.watch?.withheld);
  assert.deepEqual(
    withheld.map(([id]) => id),
    ["trailer"],
  );
  assert.match(board.films.trailer.watch.withheld, /licen[cs]e card/i);
  assert.match(board.films.trailer.watch.withheld, /krizaka-internal#2876/, "where the right wording is");
  for (const [id] of withheld) {
    assert.equal(watchFilm(id), undefined, `${id}: no watch page`);
  }
  assert.match(board.films.trailer.cut, /the loop is 2-12 s of the film/, "the loop ends before the card");
});

// The watch page of a storyboard film says its alt as the meta description; check-seo (the container smoke) refuses one
// outside 30-400 characters, and the French alts of Sam and Théo were 404 and 413 (found by the crack, 2026-11-07).
test("each watch page's description fits the SEO check's bounds, in both languages", () => {
  const [, min, max] =
    /length < (\d+) \|\| decode\(desc\[0\]\)\.length > (\d+)/.exec(read("scripts/check-seo.mjs")) ?? [];
  assert.ok(min && max, "the bounds are check-seo's own");
  for (const l of ["en", "fr"]) {
    const films = JSON.parse(read(`messages/${l}.json`)).site.home.films;
    for (const f of WATCH_FILMS.filter((x) => x.kind === "storyboard")) {
      const n = films[f.id].alt.length;
      assert.ok(n >= Number(min) && n <= Number(max), `${l} ${f.id}: description of ${n} characters (${min}-${max})`);
    }
  }
});

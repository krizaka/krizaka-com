// « Le monde de Krizaka » on /story: its captions come from the messages, at the film's own times, and the film is on the CDN.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FILM_BASE, FILM_CAST, FILM_CUES, FILM_SECONDS, filmVtt, vttResponse } from "../lib/film-captions.ts";
import { hasCode, hasJsx, identifiers, strings } from "./helpers/source.mjs";

const messages = (lang) => JSON.parse(readFileSync(new URL(`../messages/${lang}.json`, import.meta.url), "utf8"));

test("every line of the film has its words in both languages, in order, inside the film", () => {
  for (const lang of ["en", "fr"]) {
    const cues = messages(lang).site.story.world.cues;
    assert.deepEqual(Object.keys(cues).sort(), FILM_CUES.map((c) => c.id).sort(), lang);
    for (const c of FILM_CUES) assert.ok(cues[c.id].trim(), `${lang} ${c.id}`);
  }
  FILM_CUES.forEach((c, i) => {
    assert.ok(c.start < c.end && c.end <= FILM_SECONDS, c.id);
    if (i) assert.ok(FILM_CUES[i - 1].end <= c.start, `${c.id} overlaps the line before`);
  });
  for (const bird of FILM_CAST)
    assert.ok(
      FILM_CUES.some((c) => c.id === bird),
      `${bird} says its promise`,
    );
});

test("the captions are WebVTT: a header, one cue per line, the page's words", () => {
  const vtt = filmVtt(messages("fr").site.story.world.cues);
  assert.match(vtt, /^WEBVTT\n\ntitle\n00:00:00\.600 --> 00:00:03\.600\nLe monde de Krizaka\.\n/);
  assert.equal(vtt.match(/ --> /g).length, FILM_CUES.length);
  assert.match(vtt, /falcon\n00:00:06\.200 --> 00:00:10\.800\n/);
});

test("the film's site cut and its poster are on the CDN manifest", () => {
  const { files } = JSON.parse(readFileSync(new URL("../lib/cdn-manifest.json", import.meta.url), "utf8"));
  for (const ext of ["mp4", "webm", "jpg"]) assert.match(files[`${FILM_BASE}.${ext}`] ?? "", /^[0-9a-f]{10}$/, ext);
});

test("the home's ambient loop (the valley without its birds): both cuts and themes on the CDN, still under reduced motion and Save-Data, only on screen", () => {
  const { files } = JSON.parse(readFileSync(new URL("../lib/cdn-manifest.json", import.meta.url), "utf8"));
  for (const cut of ["16x9", "4x5"])
    for (const theme of ["dark", "light"])
      for (const ext of ["webm", "mp4", "jpg"])
        assert.match(
          files[`brand-films/ambient/home-valley-${cut}-${theme}.${ext}`] ?? "",
          /^[0-9a-f]{10}$/,
          `${cut} ${theme} ${ext}`,
        );
  const loop = "app/components/home/AmbientLoop.tsx";
  const words = strings(loop).join("\n");
  for (const guard of ["prefers-reduced-motion: reduce", "saveData", "IntersectionObserver", "muted", "load"])
    assert.ok(words.includes(guard) || identifiers(loop).has(guard), guard);
  assert.ok(hasCode(loop, "v.pause()"), "paused off screen");
  assert.ok(hasCode(loop, "<picture>"));
  assert.ok(hasCode(loop, 'loading="lazy"'));
  assert.ok(hasCode(loop, 'addEventListener("load"'));
  assert.ok(!identifiers(loop).has("controls") && !hasCode(loop, "controls"), "no controls on the backdrop");
  assert.ok(hasJsx("app/components/home/HomeHero.tsx", "FilmLightbox"));
  assert.ok(hasCode("app/components/home/ProductsFlock.tsx", "<AmbientLoop set={set} />"));
});

test("« The Krizaka family » (/story): one bird per product of today, its own lines in order, no departed product, on the CDN", async () => {
  const { FAMILY_BASE, FAMILY_CUES, FAMILY_SECONDS } = await import("../lib/film-captions.ts");
  assert.deepEqual(
    FAMILY_CUES.map((c) => c.id),
    ["title", "falcon", "flamingo", "owl", "beaver", "together"],
  );
  FAMILY_CUES.forEach((c, i) => {
    assert.ok(c.start < c.end && c.end <= FAMILY_SECONDS, c.id);
    if (i) assert.ok(FAMILY_CUES[i - 1].end <= c.start, `${c.id} overlaps the line before`);
  });
  for (const lang of ["en", "fr"]) {
    const family = messages(lang).site.story.world.family;
    for (const k of ["title", "player", "credit"]) assert.ok(family[k].trim(), `${lang} ${k}`);
    assert.deepEqual(Object.keys(family.cues).sort(), FAMILY_CUES.map((c) => c.id).sort(), lang);
    for (const c of FAMILY_CUES) assert.ok(family.cues[c.id].trim(), `${lang} ${c.id}`);
    // each product is named by the bird that stands for it, and no word of payment or of a product that left the family
    assert.match(family.cues.falcon, /Krizaka/);
    assert.match(family.cues.flamingo, /Orazaka/);
    assert.match(family.cues.owl, /Yomizaka/);
    assert.match(family.cues.beaver, /Akinaza/);
    assert.doesNotMatch(JSON.stringify(family), /pay|paie|orochia|yasakia|yororis|kachizaka|yazakia/i, lang);
  }
  const vtt = filmVtt(messages("en").site.story.world.family.cues, FAMILY_CUES);
  assert.match(vtt, /^WEBVTT\n\ntitle\n00:00:00\.600 --> 00:00:03\.600\nThe Krizaka family\.\n/);
  assert.equal(vtt.match(/ --> /g).length, FAMILY_CUES.length);
  const { files } = JSON.parse(readFileSync(new URL("../lib/cdn-manifest.json", import.meta.url), "utf8"));
  assert.match(FAMILY_BASE, /^brand-films\/family\//);
  for (const ext of ["mp4", "webm", "jpg"]) assert.match(files[`${FAMILY_BASE}.${ext}`] ?? "", /^[0-9a-f]{10}$/, ext);
});

test("the home's « Watch the film » plays the family film, and the light code film under reduced motion or Save-Data", async () => {
  const { prefersLightFilm } = await import("../lib/film-captions.ts");
  const media = (reduce) => (q) => ({ matches: reduce && q.includes("reduce") });
  assert.equal(prefersLightFilm({ matchMedia: media(false), navigator: {} }), false);
  assert.equal(prefersLightFilm({ matchMedia: media(true), navigator: {} }), true);
  assert.equal(prefersLightFilm({ matchMedia: media(false), navigator: { connection: { saveData: true } } }), true);
  assert.equal(prefersLightFilm({}), false);
  const hero = readFileSync(new URL("../app/components/home/HomeHero.tsx", import.meta.url), "utf8");
  assert.match(hero, /video\(FAMILY_BASE\)/);
  assert.match(hero, /vtt: "family\.vtt"/);
  assert.match(hero, /fallback=\{\{ mp4: codeFilm\.mp4, poster: codeFilm\.poster, vtt: "film\.vtt" \}\}/);
  const box = readFileSync(new URL("../app/components/home/FilmLightbox.tsx", import.meta.url), "utf8");
  assert.match(box, /prefersLightFilm\(window\)/);
  assert.match(box, /poster=\{play\.poster\}/);
});

test("« l'aube » is withdrawn from the site (Oussama, 2026-10-20): no page draws it, the manifest names none of its files", async () => {
  const { readFileSync, readdirSync, statSync } = await import("node:fs");
  const { join } = await import("node:path");
  const walk = (dir) =>
    readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
  for (const file of [...walk("app"), ...walk("lib")].filter((f) => /\.(tsx?|json)$/.test(f))) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /brand-films\/dawn|l-aube/, `${file} still draws « l'aube »`);
  }
});

test("« la tournée » gives way to « le relais »: no page draws the tour any more, its captions route is gone", async () => {
  const { readdirSync, statSync, existsSync } = await import("node:fs");
  const { join } = await import("node:path");
  const walk = (dir) =>
    readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
  for (const file of [...walk("app"), ...walk("lib")].filter((f) => /\.tsx?$/.test(f))) {
    assert.doesNotMatch(
      readFileSync(file, "utf8"),
      /TOUR_BASE|brand-films\/epic|tour\.vtt/,
      `${file} still draws the tour`,
    );
  }
  assert.ok(!existsSync("app/[locale]/story/tour.vtt"), "the tour's captions route");
  assert.ok(
    !existsSync("app/[locale]/story/relay.vtt/route.ts"),
    "« le relais » is retired: its captions route is gone",
  );
  assert.ok(existsSync("app/[locale]/story/family.vtt/route.ts"), "the family film's captions route");
});

test("both caption routes answer through one response: same-origin WebVTT, cacheable for an hour", async () => {
  const res = vttResponse(filmVtt(messages("en").site.story.world.cues));
  assert.equal(res.headers.get("content-type"), "text/vtt; charset=utf-8");
  assert.equal(res.headers.get("cache-control"), "public, max-age=3600");
  assert.match(await res.text(), /^WEBVTT/);
});

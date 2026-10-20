// « Le monde de Krizaka » on /story: its captions come from the messages, at the film's own times, and the film is on the CDN.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FILM_BASE, FILM_CAST, FILM_CUES, FILM_SECONDS, filmVtt } from "../lib/film-captions.ts";

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
  for (const bird of FILM_CAST) assert.ok(FILM_CUES.some((c) => c.id === bird), `${bird} says its promise`);
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

test("the home's ambient loop: both cuts and themes on the CDN, still under reduced motion and Save-Data, only on screen", () => {
  const { files } = JSON.parse(readFileSync(new URL("../lib/cdn-manifest.json", import.meta.url), "utf8"));
  for (const cut of ["16x9", "4x5"]) for (const theme of ["dark", "light"]) for (const ext of ["webm", "mp4", "jpg"]) assert.match(files[`brand-films/ambient/home-ambient-${cut}-${theme}.${ext}`] ?? "", /^[0-9a-f]{10}$/, `${cut} ${theme} ${ext}`);
  const loop = readFileSync(new URL("../app/components/home/AmbientLoop.tsx", import.meta.url), "utf8");
  for (const guard of ["prefers-reduced-motion: reduce", "saveData", "IntersectionObserver", "v.pause()", "muted", "<picture>", 'loading="lazy"', 'addEventListener("load"']) assert.ok(loop.includes(guard), guard);
  assert.ok(!/controls/.test(loop.replace(/\/\*[\s\S]*?\*\//g, "")), "no controls on the backdrop");
  const hero = readFileSync(new URL("../app/components/home/HomeHero.tsx", import.meta.url), "utf8");
  assert.match(hero, /<AmbientLoop set=\{AMBIENT\} \/>/);
  assert.match(hero, /<FilmLightbox /);
});

test("the reference film (« l'aube ») says the film's own lines, in order, inside its length, and is on the CDN", async () => {
  const { DAWN_BASE, DAWN_CUES, DAWN_SECONDS } = await import("../lib/film-captions.ts");
  const ids = FILM_CUES.map((c) => c.id);
  DAWN_CUES.forEach((c, i) => {
    assert.ok(ids.includes(c.id), `${c.id} is a line of the film`);
    assert.ok(c.start < c.end && c.end <= DAWN_SECONDS, c.id);
    if (i) assert.ok(DAWN_CUES[i - 1].end <= c.start, `${c.id} overlaps the line before`);
  });
  for (const bird of FILM_CAST) assert.ok(DAWN_CUES.some((c) => c.id === bird), `${bird} says its promise at dawn`);
  const vtt = filmVtt(messages("en").site.story.world.cues, DAWN_CUES);
  assert.match(vtt, /^WEBVTT\n\nfalcon\n00:00:05\.690 --> 00:00:08\.420\nThe falcon keeps watch: security comes first\.\n/);
  const { files } = JSON.parse(readFileSync(new URL("../lib/cdn-manifest.json", import.meta.url), "utf8"));
  for (const ext of ["mp4", "webm", "jpg"]) assert.match(files[`${DAWN_BASE}.${ext}`] ?? "", /^[0-9a-f]{10}$/, ext);
  for (const lang of ["en", "fr"]) {
    const dawn = messages(lang).site.story.world.dawn;
    for (const k of ["title", "lead", "player", "credit"]) assert.ok(dawn[k].trim(), `${lang} ${k}`);
    assert.match(dawn.credit, lang === "en" ? /AI-generated/ : /Généré par IA/, "the page says the film is AI-generated");
  }
});

test("the home's « Watch the film » plays the reference film (« l'aube »), and the light code film under reduced motion or Save-Data", async () => {
  const { prefersLightFilm } = await import("../lib/film-captions.ts");
  const media = (reduce) => (q) => ({ matches: reduce && q.includes("reduce") });
  assert.equal(prefersLightFilm({ matchMedia: media(false), navigator: {} }), false);
  assert.equal(prefersLightFilm({ matchMedia: media(true), navigator: {} }), true);
  assert.equal(prefersLightFilm({ matchMedia: media(false), navigator: { connection: { saveData: true } } }), true);
  assert.equal(prefersLightFilm({}), false);
  const hero = readFileSync(new URL("../app/components/home/HomeHero.tsx", import.meta.url), "utf8");
  assert.match(hero, /video\(DAWN_BASE\)/);
  assert.match(hero, /vtt: "dawn\.vtt"/);
  assert.match(hero, /fallback=\{\{ mp4: codeFilm\.mp4, poster: codeFilm\.poster, vtt: "film\.vtt" \}\}/);
  const box = readFileSync(new URL("../app/components/home/FilmLightbox.tsx", import.meta.url), "utf8");
  assert.match(box, /prefersLightFilm\(window\)/);
  assert.match(box, /poster=\{play\.poster\}/);
});

test("the previous reference film (« la tournée ») is replaced, never accumulated, on the CDN", () => {
  const { files } = JSON.parse(readFileSync(new URL("../lib/cdn-manifest.json", import.meta.url), "utf8"));
  assert.deepEqual(Object.keys(files).filter((k) => k.startsWith("brand-films/epic/")), []);
  for (const lang of ["en", "fr"]) for (const kind of ["2160p", "1080p", "9x16"]) {
    assert.match(files[`brand-films/dawn/le-monde-de-krizaka-l-aube-${kind}-${lang}.mp4`] ?? "", /^[0-9a-f]{10}$/, `${kind} ${lang}`);
  }
});

test("the home's button says the reference film's own length", async () => {
  const { DAWN_SECONDS } = await import("../lib/film-captions.ts");
  const minutes = Math.floor(DAWN_SECONDS / 60);
  const seconds = Math.round(DAWN_SECONDS % 60);
  // Every place that says the film's length (the home's button, /story's poster card) says this one.
  const lengths = (node) => Object.entries(node).flatMap(([k, v]) => (v && typeof v === "object" ? lengths(v) : k === "filmLength" ? [v] : []));
  for (const value of lengths(messages("en"))) assert.equal(value, `${minutes} min ${seconds} s`);
  for (const value of lengths(messages("fr"))) assert.equal(value, `${minutes} min ${String(seconds).padStart(2, "0")}`);
  assert.ok(lengths(messages("en")).length >= 2);
});

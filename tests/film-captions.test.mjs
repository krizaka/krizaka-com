// « Le monde de Krizaka » on /story: its captions come from the messages, at the film's own times, and the film is on the CDN.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FILM_BASE, FILM_CAST, FILM_CUES, FILM_SECONDS, filmVtt, vttResponse } from "../lib/film-captions.ts";

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

test("the home's ambient loop (the valley without its birds): both cuts and themes on the CDN, still under reduced motion and Save-Data, only on screen", () => {
  const { files } = JSON.parse(readFileSync(new URL("../lib/cdn-manifest.json", import.meta.url), "utf8"));
  for (const cut of ["16x9", "4x5"]) for (const theme of ["dark", "light"]) for (const ext of ["webm", "mp4", "jpg"]) assert.match(files[`brand-films/ambient/home-valley-${cut}-${theme}.${ext}`] ?? "", /^[0-9a-f]{10}$/, `${cut} ${theme} ${ext}`);
  const loop = readFileSync(new URL("../app/components/home/AmbientLoop.tsx", import.meta.url), "utf8");
  for (const guard of ["prefers-reduced-motion: reduce", "saveData", "IntersectionObserver", "v.pause()", "muted", "<picture>", 'loading="lazy"', 'addEventListener("load"']) assert.ok(loop.includes(guard), guard);
  assert.ok(!/controls/.test(loop.replace(/\/\*[\s\S]*?\*\//g, "")), "no controls on the backdrop");
  const hero = readFileSync(new URL("../app/components/home/HomeHero.tsx", import.meta.url), "utf8");
  assert.match(hero, /<FilmLightbox /);
  assert.match(readFileSync(new URL("../app/components/home/ProductsFlock.tsx", import.meta.url), "utf8"), /<AmbientLoop set=\{set\} \/>/);
});

test("the relay (« le relais », the reference film) says its own lines, in order, inside its length, and is on the CDN", async () => {
  const { RELAY_BASE, RELAY_CUES, RELAY_SECONDS } = await import("../lib/film-captions.ts");
  assert.deepEqual(RELAY_CUES.map((c) => c.id), ["falcon", "owl", "duck", "cold", "quebec", "flamingo", "pigeon", "together"]);
  RELAY_CUES.forEach((c, i) => {
    assert.ok(c.start < c.end && c.end <= RELAY_SECONDS, c.id);
    if (i) assert.ok(RELAY_CUES[i - 1].end <= c.start, `${c.id} overlaps the line before`);
  });
  for (const bird of FILM_CAST) assert.ok(RELAY_CUES.some((c) => c.id === bird), `${bird} says its promise on the relay`);
  for (const lang of ["en", "fr"]) {
    const relay = messages(lang).site.story.world.relay;
    for (const k of ["title", "lead", "player", "credit"]) assert.ok(relay[k].trim(), `${lang} ${k}`);
    assert.match(relay.credit, lang === "en" ? /AI-generated/ : /Généré par IA/, "the page says the film is AI-generated");
    for (const c of RELAY_CUES) assert.ok(relay.cues[c.id]?.trim(), `${lang} ${c.id}`);
    // the promises are the film's own words, the same as the code film's
    for (const bird of FILM_CAST) assert.equal(relay.cues[bird], messages(lang).site.story.world.cues[bird], `${lang} ${bird}`);
  }
  const vtt = filmVtt(messages("fr").site.story.world.relay.cues, RELAY_CUES);
  assert.match(vtt, /^WEBVTT\n\nfalcon\n00:00:03\.\d{3} --> /);
  assert.match(vtt, /Au Québec, on t’aide… pis on s’obstine sur comment\./);
  assert.equal(vtt.match(/ --> /g).length, RELAY_CUES.length);
  const { files } = JSON.parse(readFileSync(new URL("../lib/cdn-manifest.json", import.meta.url), "utf8"));
  assert.match(RELAY_BASE, /^brand-films\/relay\//);
  for (const ext of ["mp4", "webm", "jpg"]) assert.match(files[`${RELAY_BASE}.${ext}`] ?? "", /^[0-9a-f]{10}$/, ext);
});

test("the home's « Watch the film » plays the relay, and the light code film under reduced motion or Save-Data", async () => {
  const { prefersLightFilm } = await import("../lib/film-captions.ts");
  const media = (reduce) => (q) => ({ matches: reduce && q.includes("reduce") });
  assert.equal(prefersLightFilm({ matchMedia: media(false), navigator: {} }), false);
  assert.equal(prefersLightFilm({ matchMedia: media(true), navigator: {} }), true);
  assert.equal(prefersLightFilm({ matchMedia: media(false), navigator: { connection: { saveData: true } } }), true);
  assert.equal(prefersLightFilm({}), false);
  const hero = readFileSync(new URL("../app/components/home/HomeHero.tsx", import.meta.url), "utf8");
  assert.match(hero, /video\(RELAY_BASE\)/);
  assert.match(hero, /vtt: "relay\.vtt"/);
  assert.match(hero, /fallback=\{\{ mp4: codeFilm\.mp4, poster: codeFilm\.poster, vtt: "film\.vtt" \}\}/);
  const box = readFileSync(new URL("../app/components/home/FilmLightbox.tsx", import.meta.url), "utf8");
  assert.match(box, /prefersLightFilm\(window\)/);
  assert.match(box, /poster=\{play\.poster\}/);
});

test("« l'aube » is withdrawn from the site (Oussama, 2026-10-20): no page draws it, the manifest names none of its files", async () => {
  const { readFileSync, readdirSync, statSync } = await import("node:fs");
  const { join } = await import("node:path");
  const walk = (dir) => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
  for (const file of [...walk("app"), ...walk("lib")].filter((f) => /\.(tsx?|json)$/.test(f))) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /brand-films\/dawn|l-aube/, `${file} still draws « l'aube »`);
  }
});

test("« la tournée » gives way to « le relais »: no page draws the tour any more, its captions route is gone", async () => {
  const { readdirSync, statSync, existsSync } = await import("node:fs");
  const { join } = await import("node:path");
  const walk = (dir) => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
  for (const file of [...walk("app"), ...walk("lib")].filter((f) => /\.tsx?$/.test(f))) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /TOUR_BASE|brand-films\/epic|tour\.vtt/, `${file} still draws the tour`);
  }
  assert.ok(!existsSync("app/[locale]/story/tour.vtt"), "the tour's captions route");
  assert.ok(existsSync("app/[locale]/story/relay.vtt/route.ts"), "the relay's captions route");
});

test("both caption routes answer through one response: same-origin WebVTT, cacheable for an hour", async () => {
  const res = vttResponse(filmVtt(messages("en").site.story.world.cues));
  assert.equal(res.headers.get("content-type"), "text/vtt; charset=utf-8");
  assert.equal(res.headers.get("cache-control"), "public, max-age=3600");
  assert.match(await res.text(), /^WEBVTT/);
});

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
  for (const guard of ["prefers-reduced-motion: reduce", "saveData", "IntersectionObserver", "v.pause()", "muted", "<picture>"]) assert.ok(loop.includes(guard), guard);
  assert.ok(!/controls/.test(loop.replace(/\/\*[\s\S]*?\*\//g, "")), "no controls on the backdrop");
  const hero = readFileSync(new URL("../app/components/home/HomeHero.tsx", import.meta.url), "utf8");
  assert.match(hero, /<AmbientLoop set=\{AMBIENT\} \/>/);
  assert.match(hero, /<FilmLightbox /);
});

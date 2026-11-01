// The flock's promises (site.story.world.cues), the home's ambient loop, and the films retired from the site. The brand
// film « Montrer son travail » (lib/brand-film.ts) is tested in story.test.mjs and watch-films.test.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { FILM_CAST } from "../lib/film-captions.ts";
import { hasCode, hasJsx, identifiers, strings } from "./helpers/source.mjs";

const messages = (lang) => JSON.parse(readFileSync(new URL(`../messages/${lang}.json`, import.meta.url), "utf8"));

test("every bird of the flock has its promise in both languages", () => {
  for (const lang of ["en", "fr"]) {
    const cues = messages(lang).site.story.world.cues;
    for (const bird of FILM_CAST) assert.ok(cues[bird]?.trim(), `${lang} ${bird}`);
    const family = messages(lang).site.story.world.family.cues;
    for (const bird of ["falcon", "duck", "owl", "beaver"]) assert.ok(family[bird]?.trim(), `${lang} family ${bird}`);
  }
});

test("« Le monde de Krizaka » and « La famille Krizaka » are retired (2026-11-01): no slot plays them, their captions routes are gone", () => {
  for (const route of [
    "app/[locale]/story/film.vtt/route.ts",
    "app/[locale]/story/family.vtt/route.ts",
    "lib/caption-route.ts",
  ])
    assert.ok(!existsSync(route), route);
  for (const file of [
    "app/components/home/HomeHero.tsx",
    "app/[locale]/story/page.tsx",
    "lib/story-film.ts",
    "lib/watch-films.ts",
  ]) {
    const src = readFileSync(file, "utf8");
    assert.doesNotMatch(
      src,
      /brand-films\/(film|family)\/|FILM_BASE|FAMILY_BASE|\.vtt"/,
      `${file} still plays a retired film`,
    );
  }
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
});

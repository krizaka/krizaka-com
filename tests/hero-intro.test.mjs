import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cssDecls } from "./helpers/source.mjs";

// The home hero's cinematic intro (WWW-HERO, 2026-10-17) and its ambient film: once per session, skippable, still under
// reduced motion and Save-Data, no library, no canvas, no animation frame; the text is never part of it (LCP).
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const intro = read("app/components/home/HeroIntro.tsx");
const css = read("app/components/home/home.css");

test("the intro plays once per session, and never under reduced motion or Save-Data", () => {
  assert.match(intro, /sessionStorage\.getItem\(SESSION_KEY\)/);
  assert.match(intro, /prefers-reduced-motion: reduce/);
  assert.match(intro, /saveData/);
  assert.match(intro, /html\.dataset\.intro = "skip"/);
  assert.match(intro, /html\.dataset\.intro = "play"/);
});

test("any input skips it, and it ends by itself", () => {
  assert.match(intro, /SKIP_EVENTS = \["keydown", "pointerdown", "wheel", "touchstart"\]/);
  assert.match(intro, /html\.dataset\.intro = "done"/);
  assert.match(intro, /setTimeout\(finish, INTRO_MS\)/);
});

test("no animation frame, no canvas, no animation library — CSS animations only", () => {
  for (const src of [intro, read("app/components/home/AmbientLoop.tsx"), read("app/components/home/HomeHero.tsx")]) {
    assert.doesNotMatch(src, /requestAnimationFrame|<canvas|getContext\(|framer-motion|gsap|motion\/react/);
  }
  const pkg = JSON.parse(read("package.json"));
  for (const lib of ["framer-motion", "motion", "gsap", "lottie-web"])
    assert.equal(pkg.dependencies[lib], undefined, lib);
});

test("the choreography over the poster: the mark draws, the scene rises in with its birds, a light sweeps, then the loop fades in; everything at rest under reduced motion; nothing stays hidden without JavaScript", () => {
  const home = "app/components/home/home.css";
  assert.match(
    cssDecls(home, 'html[data-intro="play"] .kz-intro-mark path[stroke-linecap]').animation ?? "",
    /kz-intro-draw/,
  );
  assert.match(cssDecls(home, 'html[data-intro="play"] .kz-intro-sweep').animation ?? "", /kz-intro-sweep/);
  const fallback = cssDecls(home, ".kz-intro-deco").animation ?? "";
  assert.ok(/kz-intro-fallback/.test(fallback) && /\bboth\b/.test(fallback), "without script, the decorations fade in by themselves");
  const rest = cssDecls(home, "html[data-intro] .kz-intro-deco", { within: "(prefers-reduced-motion: reduce)" });
  assert.equal(rest.animation, "none");
  assert.equal(rest.opacity, "1");
});

test("the ambient flock appears in the hero and the products section, each in its own taped photo", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.match(hero, /<AmbientLoop set=\{VALLEY\} \/>/);
  assert.match(hero, /<TapedPhoto/);
  assert.match(read("app/components/home/ProductShowcase.tsx"), /<ProductsFlock set=\{VALLEY\} \/>/);
  assert.match(read("app/components/home/ProductsFlock.tsx"), /<TapedPhoto/);
});

test("« Le monde de Krizaka » opens in a lightbox from the hero; the player's code loads only when it opens", () => {
  const box = read("app/components/home/FilmLightbox.tsx");
  assert.match(box, /dynamic\(\(\) => import\("@krizaka\/ui\/video-player"\)/);
  assert.match(box, /<Dialog\.Root>/);
  assert.match(box, /preload="none"/);
  assert.match(read("app/components/home/HomeHero.tsx"), /video\(FILM_BASE\)/);
  for (const l of ["en", "fr"]) assert.ok(JSON.parse(read(`messages/${l}.json`)).site.home.hero.film, l);
});

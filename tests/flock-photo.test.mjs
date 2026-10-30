import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { HERO_FLOCK } from "../lib/products-flock.ts";
import {
  cssAtRules,
  cssDecls,
  cssSelectors,
  hasCode,
  hasJsx,
  importsFrom,
  jsxAll,
  strings,
} from "./helpers/source.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const css = read("app/components/home/home.css");

test("the products flock uses @krizaka/ui's TapedPhoto, with no local photo lookalike", () => {
  const flock = "app/components/home/ProductsFlock.tsx";
  assert.ok(importsFrom(flock, "@krizaka/ui/taped-photo"));
  assert.ok(hasJsx(flock, "TapedPhoto", { className: "kz-band-photo" }));
  assert.ok(!strings(flock).some((s) => s.includes("kz-photo")), "no local photo class");
  assert.ok(!cssSelectors("app/components/home/home.css").some((s) => s.startsWith(".kz-photo")));
  assert.ok(hasCode(flock, '<div className="kz-band-photo-wrap"> <TapedPhoto'));
  assert.equal(cssDecls("app/components/home/home.css", ".kz-band-photo-wrap")["overflow-x"], "clip");
  assert.equal(cssDecls("app/components/home/home.css", ".kz-band").margin, "0");
  assert.ok(jsxAll(flock, "Flock").some((e) => "scenes" in e.attrs));
  assert.ok(hasCode(flock, "href={`#product-${b.product}`}"));
});

test("the band and its stage reserve their responsive space and remain clipped at phone width", () => {
  const home = "app/components/home/home.css";
  const band = cssDecls(home, ".kz-band");
  assert.equal(band.width, "100%");
  assert.equal(band["aspect-ratio"], "16 / 6.1");
  assert.ok(!("border" in band) && !("box-shadow" in band), "no frame around the band");
  assert.equal(cssDecls(home, ".kz-band-stage").bottom, "calc(-0.13 * 56.25cqw)");
  assert.equal(cssDecls(home, ".kz-band", { within: "(max-width: 640px)" })["aspect-ratio"], "100 / 78");
  assert.ok(cssAtRules(home, "media").includes("(prefers-reduced-motion: reduce)"));
});

test("the story's film poster is a taped photo, while the existing lightbox trigger stays interactive", () => {
  const story = read("app/[locale]/story/page.tsx");
  assert.match(story, /from "@krizaka\/ui\/taped-photo"/);
  assert.match(story, /<TapedPhoto className="st-film-photo" tilt=\{lean\("who"\)\}>\s*<FilmLightbox/);
  assert.match(story, /trigger=\{\s*<button type="button" className="st-film"/);
  assert.match(read("app/[locale]/story/story.css"), /\.st-film:focus-visible\s*\{[^}]*outline-offset:\s*-3px/);
});

test("the hero flock captions stay within the scene at every bird position", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  const birds = HERO_FLOCK.birds;
  assert.deepEqual(
    birds.filter(({ bird }) => ["falcon", "pigeon"].includes(bird)).map(({ bird, x }) => [bird, x]),
    [
      ["falcon", 15],
      ["pigeon", 85],
    ],
  );
  assert.match(hero, /--flock-x/);
  assert.match(
    css,
    /\.kz-home-flock-caption\s*\{[^}]*transform:\s*translate\(clamp\(calc\(8px - var\(--flock-x\)\),\s*-50%,\s*calc\(100cqw - 8px - var\(--flock-x\) - 100%\)\),\s*-2px\)/,
  );
  assert.match(css, /\.kz-home-flock-caption\s*\{[^}]*max-width:\s*min\(260px,\s*calc\(100cqw - 16px\)\)/);

  const sceneWidth = 300;
  for (const locale of ["en", "fr"]) {
    const cues = JSON.parse(read(`messages/${locale}.json`)).site.story.world.cues;
    for (const { bird, x: percent } of birds) {
      const promise = cues[bird];
      assert.ok(promise, `${locale}: ${bird} promise`);

      const anchorX = (percent / 100) * sceneWidth;
      const captionWidth = Math.min(260, sceneWidth - 16);
      const offset = Math.max(8 - anchorX, Math.min(-captionWidth / 2, sceneWidth - 8 - anchorX - captionWidth));
      const captionLeft = anchorX + offset;
      assert.ok(captionLeft >= 8, `${locale}: ${bird} left edge at 360px viewport`);
      assert.ok(captionLeft + captionWidth <= sceneWidth - 8, `${locale}: ${bird} right edge at 360px viewport`);
    }
  }
});

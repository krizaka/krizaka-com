import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { HERO_SLIDES, heroSlideProblems } from "../lib/hero-slides.ts";

// Fig. 1's slides are data (lib/hero-slides.ts, krizaka-internal#2229): a slide naming a clip the CDN manifest does not
// know fails the build; its words are messages and name only the commercial names.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const manifest = JSON.parse(read("lib/cdn-manifest.json"));
const has = (path) => Boolean(manifest.files[path]);

test("every slide of the hero names a clip the CDN manifest knows (webm, mp4 and poster)", () => {
  assert.ok(HERO_SLIDES.length > 0);
  assert.deepEqual(heroSlideProblems(HERO_SLIDES, has), []);
});

test("a slide whose clip the manifest does not know is refused", () => {
  const ghost = [...HERO_SLIDES, { id: "ghost", fig: "1b", kind: "film", base: "products/yomizaka/tour/nothing" }];
  const problems = heroSlideProblems(ghost, has);
  assert.equal(problems.length, 3);
  assert.match(problems[0], /ghost: products\/yomizaka\/tour\/nothing\.webm is not in the CDN manifest/);
});

test("the film's slide previews it with its silent loop, and a loop the manifest does not know is refused", () => {
  const film = HERO_SLIDES.find((s) => s.kind === "film");
  assert.ok(film?.loop, "the film slide names its loop (the hero's silent preview, @krizaka/ui/pausable-loop)");
  const ghost = [{ ...film, loop: "brand-films/montrer-son-travail/nothing" }];
  const problems = heroSlideProblems(ghost, has);
  assert.equal(problems.length, 3);
  assert.match(problems[0], /film: brand-films\/montrer-son-travail\/nothing\.webm is not in the CDN manifest/);
});

test("the hero hands the loop to MediaPlayer's preview and MediaCarousel's renderLoop, in the site's words", () => {
  const src = read("app/components/home/HeroFigure.tsx");
  assert.match(src, /from "@krizaka\/ui\/pausable-loop"/);
  assert.match(src, /preview=\{/);
  assert.match(src, /renderLoop=\{/);
  assert.match(src, /playerLabels=\{/);
  assert.doesNotMatch(src, /defaultOpen/);
});

test("a recording names its journey, and an id is used once", () => {
  const base = HERO_SLIDES[0].base;
  assert.match(
    heroSlideProblems([{ id: "r", fig: "1b", kind: "recording", base }], has)[0],
    /a recording names its journey/,
  );
  assert.deepEqual(
    heroSlideProblems([{ id: "r", fig: "1b", kind: "recording", base, journey: "applicant-file-open" }], has),
    [],
  );
  assert.match(heroSlideProblems([...HERO_SLIDES, ...HERO_SLIDES], has)[0], /the id is used twice/);
});

test("the slides' figure numbers follow their order, 1a, 1b, 1c", () => {
  assert.deepEqual(
    HERO_SLIDES.map((s) => s.fig),
    ["1a", "1b", "1c", "1d"].slice(0, HERO_SLIDES.length),
  );
});

test("each slide's words exist in both languages, with the commercial names only (no code name, no dev host)", () => {
  const code = /yomizaka|akinaza|orazaka|kachizaka/i;
  for (const l of ["en", "fr"]) {
    const slides = JSON.parse(read(`messages/${l}.json`)).site.home.hero.slides;
    for (const s of HERO_SLIDES) {
      for (const k of ["title", "alt", "caption"]) {
        const text = slides[s.id]?.[k];
        assert.ok(text?.trim(), `${l}: slides.${s.id}.${k}`);
        assert.doesNotMatch(text, code, `${l}: slides.${s.id}.${k} names a code name`);
        assert.doesNotMatch(text, /dev\./, `${l}: slides.${s.id}.${k} names a dev host`);
      }
    }
    for (const s of HERO_SLIDES) {
      // One slide model (« media show what it does »): one clip or poster, one short caption that says what it does and its result.
      assert.ok(slides[s.id].caption.length <= 90, `${l}: slides.${s.id}.caption is one short line`);
    }
    assert.deepEqual(Object.keys(slides).sort(), HERO_SLIDES.map((s) => s.id).sort(), `${l}: no word without a slide`);
  }
});

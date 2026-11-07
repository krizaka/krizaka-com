import { test } from "node:test";
import assert from "node:assert/strict";
import { findCodeNames } from "@krizaka/org";
import { readFileSync } from "node:fs";
import {
  PRODUCT_SHOWCASES,
  SHOWCASES,
  STILLS,
  showcaseOf,
  showcaseProblems,
  showcaseSlides,
  showcaseStill,
} from "../lib/home-showcase.ts";
import { IN_DESIGN } from "../lib/products-in-design.ts";
import { barHref } from "../lib/bar-href.ts";
import { boardProblems, clipsOf, maxCredits, shotsOf, tallFilter } from "../scripts/home-showcase.mjs";

// The home's carousels (founder, 2026-11-05, krizaka-internal#2450): the hero's and one per product, Sovkora in the centre;
// real media made for each, 16:9 on wide screens and 4:5 on phones, served from Bunny; they advance on their own with
// WCAG 2.2.2's controls and stay still under reduced motion.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const manifest = JSON.parse(read("lib/cdn-manifest.json"));
const has = (path) => Boolean(manifest.files[path]);
const board = JSON.parse(read("content/films/home-showcase.json"));
const carousel = read("app/components/home/ShowcaseCarousel.tsx");

test("every slide of every carousel has its 16:9 rendition on the CDN (mp4, webm, poster), and at least three slides", () => {
  assert.deepEqual([...SHOWCASES], ["hero", "verikora", "sovkora", "folioviv"]);
  assert.deepEqual(showcaseProblems(has), []);
});

test("a slide missing a file, or a carousel with too few slides, is refused", () => {
  const problems = showcaseProblems((path) => has(path) && !path.startsWith("home/showcase/sovkora/tea-wide"));
  assert.deepEqual(problems, [
    "sovkora/tea: home/showcase/sovkora/tea-wide.mp4 is not in the CDN manifest",
    "sovkora/tea: home/showcase/sovkora/tea-wide.webm is not in the CDN manifest",
    "sovkora/tea: home/showcase/sovkora/tea-wide.jpg is not in the CDN manifest",
  ]);
});

// A product in conception has no carousel: one still (founder, 2026-11-06, krizaka-internal#2802), a mood photo made locally
// in the carousels' look, drawn in their frame. Nothing moves, so its poster is also the reduced-motion still.
test("every product in conception has its still, a 16:9 poster read from the CDN manifest", () => {
  assert.deepEqual(
    [...STILLS],
    IN_DESIGN.map((p) => p.id),
  );
  for (const product of STILLS) {
    const still = showcaseStill(product);
    assert.match(still.poster, new RegExp(`^home/showcase/${product}/${still.id}-wide\\.jpg$`));
    assert.ok(has(still.poster), `${still.poster} is in the manifest`);
  }
});

test("a still whose photo the manifest does not know is refused (the build fails)", () => {
  const { poster, id } = showcaseStill("kridoc");
  assert.deepEqual(
    showcaseProblems((path) => has(path) && path !== poster),
    [`kridoc/${id}: ${poster} is not in the CDN manifest`],
  );
});

test("the still was made locally, its take written down: model, seed, prompt, no paid run", () => {
  for (const product of STILLS) {
    const s = board.stills[product];
    assert.ok(s.idea?.trim() && s.prompt?.trim(), `${product}: an idea and a prompt`);
    assert.ok(Number.isInteger(s.seed), `${product}: a seed`);
    assert.match(s.model, /FLUX\.2 \[klein\] 4B/);
    assert.match(s.made, /locally/);
    assert.equal(s.credits, 0, `${product}: no paid run`);
    assert.ok(
      s.candidates.length >= 2 && s.candidates.some((c) => c.id === s.id),
      `${product}: the kept take is a candidate`,
    );
  }
});

test("the still is the carousels' frame, still: one picture from the manifest, no clip, no timer, its caption numbered", () => {
  const still = read("app/components/home/ShowcaseStill.tsx");
  assert.doesNotMatch(still, /"use client"|<video|useEffect|setTimeout|autoPlay/, "nothing moves, on the server");
  assert.match(still, /src=\{cdn\(still\.poster\)\}/, "the photo's URL comes from the manifest");
  assert.match(still, /alt=\{words\.alt\}/);
  assert.match(still, /width=\{POSTER\.width\}\s+height=\{POSTER\.height\}/, "the 16:9 box is reserved");
  assert.match(still, /className="kz-show-stage"/, "the carousels' 16:9 plate");
  assert.match(still, /format\(t\.labels\.figure, \{ fig: String\(fig\), caption: words\.caption \}\)/);
  for (const l of ["en", "fr"])
    assert.deepEqual(Object.keys(messages(l).site.home.showcase.stills).sort(), [...STILLS].sort(), `${l}: stills`);
});

test("the storyboard is coherent: one take per shot, an idea and a prompt each, every slide of an order exists", () => {
  assert.deepEqual(boardProblems(board), []);
  assert.deepEqual(boardProblems({ ...board, carousels: { x: { shots: [{ id: "a", from: 2, to: 1 }] } } }), [
    "x/a: « to » must come after « from »",
    "x/a: a shot carries one idea",
    "x/a: a shot has its prompt",
  ]);
  for (const c of SHOWCASES) {
    const slides = showcaseSlides(c);
    assert.ok(slides.length >= 3, c);
    for (const s of slides) assert.match(s.wide, new RegExp(`^home/showcase/${c}/${s.id}-wide$`));
  }
  assert.ok(shotsOf(board).length > 0 && clipsOf(board).length > 0);
  assert.deepEqual(findCodeNames(read("content/films/home-showcase.json")), [], "commercial names only");
});

test("the products' carousels follow the row: Verikora, Sovkora in the centre, Folioviv", () => {
  assert.deepEqual([...PRODUCT_SHOWCASES], ["verikora", "sovkora", "folioviv"]);
  assert.equal(showcaseOf("Sovkora"), "sovkora");
  assert.equal(showcaseOf("Kridoc"), undefined);
});

test("every slide has its caption and its text alternative in both languages, and no word without a slide", () => {
  for (const l of ["en", "fr"]) {
    const s = messages(l).site.home.showcase;
    for (const c of SHOWCASES) {
      assert.ok(s.carousels[c]?.trim(), `${l}: carousels.${c}`);
      const ids = showcaseSlides(c).map((x) => x.id);
      assert.deepEqual(Object.keys(s.slides[c]).sort(), [...ids].sort(), `${l}: ${c}`);
      for (const id of ids) {
        assert.ok(s.slides[c][id].caption.trim(), `${l}: ${c}/${id} caption`);
        assert.ok(s.slides[c][id].alt.length > 30, `${l}: ${c}/${id} says what it shows`);
      }
    }
    for (const k of ["pause", "play", "previous", "next", "textVersion", "slideOf", "figure"])
      assert.ok(s.labels[k]?.trim(), `${l}: labels.${k}`);
    for (const k of ["reel", "clip", "library"]) assert.ok(s.sources[k]?.trim(), `${l}: sources.${k}`);
    assert.doesNotMatch(JSON.stringify(s), /\d+[,.]?\d*\s?\$|\$\s?\d/, `${l}: no amount`);
  }
});

test("it advances on its own, with WCAG 2.2.2's controls: pause / play, paused on hover, focus and off screen", () => {
  assert.match(carousel, /const advancing = !still && !stopped && !hovered && !focused && onScreen && total > 1;/);
  assert.match(carousel, /globalThis\.setTimeout\(\(\) => \{\s*const next = \(active \+ 1\) % total;/);
  assert.match(carousel, /\}, DWELL_MS\);/);
  assert.match(carousel, /onPointerEnter=\{\(\) => setHovered\(true\)\}/);
  assert.match(carousel, /onFocus=\{\(\) => setFocused\(true\)\}/);
  assert.match(carousel, /IntersectionObserver/);
  assert.match(carousel, /label=\{stopped \? w\.play : w\.pause\}/, "a visible pause / play, named");
  assert.match(carousel, /aria-roledescription=\{w\.carousel\}/);
  assert.match(carousel, /aria-live=\{advancing \? "off" : "polite"\}/, "the counter is announced only while still");
  assert.match(carousel, /e\.key === "ArrowRight"/, "the arrow keys turn it");
  assert.doesNotMatch(carousel, /setInterval|requestAnimationFrame/);
});

test("still under reduced motion or Save-Data: no timer, no clip, no pause button, no fade", () => {
  assert.match(carousel, /prefersStill\(globalThis\)/);
  assert.match(carousel, /\{!still && \(/, "no pause / play when nothing moves");
  assert.match(carousel, /here && loaded && !still && <Clip/);
  const css = read("app/components/home/showcase.css").replace(/\/\*[\s\S]*?\*\//g, "");
  const calm = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(calm, /\.kz-show-slide \{\s*transition: none;/);
  assert.match(calm, /animation: none;/);
  assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|blur\(|translate/, "tokens only, nothing travels");
});

test("one 16:9 rendition on every screen, never the tall one: poster first, the h1 stays the LCP", () => {
  assert.doesNotMatch(carousel, /\btall\b|WIDE_QUERY|useRendition|min-width: 640/, "no vertical source switching");
  assert.match(carousel, /src=\{s\.wide\.poster\}/);
  assert.match(carousel, /<Clip r=\{s\.wide\}/);
  assert.match(carousel, /here && loaded && !still/, "no clip in the server's HTML");
  assert.match(
    carousel,
    /const draw = seen\.has\(i\) \|\| i === \(active \+ 1\) % total;/,
    "posters drawn as they come",
  );
  assert.match(carousel, /muted\s+playsInline/);
  assert.doesNotMatch(carousel, /autoPlay/);
  assert.match(read("app/components/home/Showcase.tsx"), /<details className="kz-fig-text kz-show-text">/);
  assert.doesNotMatch(read("lib/home-showcase.ts"), /\btall:/, "the data holds no tall rendition");
  const css = read("app/components/home/showcase.css");
  assert.match(css, /object-fit: cover;/, "a 16:9 frame filled on every screen");
  assert.doesNotMatch(css, /aspect-ratio: 4 \/ 5/, "the phone's frame is 16:9 too");
});

test("a clip that cannot play leaves its poster: the video unmounts when its last source fails", () => {
  assert.match(carousel, /<source src=\{r\.mp4\} type="video\/mp4" onError=\{\(\) => setBroken\(true\)\} \/>/);
  assert.match(carousel, /if \(broken\) \{\s*return null;/);
});

test("sound is an option: muted by default, a toggle only for clips with audio, after a click, on hover or focus, per session", () => {
  assert.match(carousel, /const sound = soundChosen && current\.audio && \(hovered \|\| focused\) && !still;/);
  assert.match(carousel, /\{hasAudio && !still && \(/, "no button unless a clip has sound, never under reduced motion");
  assert.match(carousel, /aria-pressed=\{soundChosen\}/);
  assert.match(carousel, /sessionStorage/);
  assert.doesNotMatch(carousel, /localStorage/, "the choice lasts for the session only");
  assert.match(carousel, /ref\.current\.muted = !sound/);
  assert.equal(messages("en").site.home.showcase.labels.soundOn, "Sound on");
  assert.equal(messages("fr").site.home.showcase.labels.soundOn, "Activer le son");
  // Runway's outputs are silent: no slide claims an audio track, so the button ships disabled (never an unlicensed track).
  assert.ok(SHOWCASES.every((c) => showcaseSlides(c).every((x) => x.audio === false)));
});

test("the encoder still cuts 4:5 frames on the subject (kept for other uses), never stretched", () => {
  assert.equal(tallFilter(1080, 1920), "crop=1080:1350:0:285,scale=544:680:flags=lanczos,setsar=1");
  assert.equal(tallFilter(1280, 720, 0.3), "crop=576:720:96:0,scale=544:680:flags=lanczos,setsar=1");
  assert.equal(tallFilter(1280, 720, 0), "crop=576:720:0:0,scale=544:680:flags=lanczos,setsar=1");
});

test("every Runway run is logged with its model and credits, and the issue stays under its checkpoint", () => {
  const log = JSON.parse(read("content/films/home-showcase.log.json"));
  assert.ok(log.runs.length > 0);
  for (const r of log.runs) {
    assert.match(r.model, /^aleph2$/, r.shot);
    assert.ok(Number.isFinite(r.credits) && r.credits >= 0, r.shot);
  }
  const spent = log.checkpoint.balance.before - log.checkpoint.balance.after;
  assert.ok(
    spent >= log.runs.reduce((n, r) => n + r.credits, 0),
    "the real charge is read from the balance, never below the estimates",
  );
  assert.ok(spent <= log.checkpoint.capCredits, `${spent} credits: over the checkpoint without the founder's go`);
  for (const s of shotsOf(board)) {
    assert.ok(maxCredits(s) >= 56, s.id);
    assert.ok(log.chosen[`${s.carousel}/${s.id}`], `${s.carousel}/${s.id}: a take is chosen`);
  }
});

test("the bar's « Products » scrolls on the home and leads to the home's section from elsewhere", () => {
  const products = { href: "/#products" };
  assert.equal(barHref(products, "fr", "/fr"), "#products");
  assert.equal(barHref(products, "en", "/en/"), "#products");
  assert.equal(barHref(products, "fr", "/fr/services"), "/fr#products");
  assert.equal(barHref({ href: "/services" }, "fr", "/fr"), "/services");
  for (const f of ["app/components/SiteBar.tsx", "app/components/MobilePanel.tsx"])
    assert.match(read(f), /<Link href=\{barHref\(l, locale, path\)\}>/, f);
});

test("AGENTS.md says the new rules: the home's order (§ 2) and the carousels' exception (§ 4)", () => {
  const agents = read("AGENTS.md");
  assert.match(agents, /Sovkora · Verikora · Folioviv/);
  assert.match(agents, /Two blocks of the home move on their own\. The carousels/);
});

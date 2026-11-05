import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PRODUCT_SHOWCASES, SHOWCASES, showcaseOf, showcaseProblems, showcaseSlides } from "../lib/home-showcase.ts";
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

test("every slide of every carousel has both renditions on the CDN (mp4, webm, poster), and at least three slides", () => {
  assert.deepEqual([...SHOWCASES], ["hero", "verikora", "sovkora", "folioviv"]);
  assert.deepEqual(showcaseProblems(has), []);
});

test("a slide missing a file, or a carousel with too few slides, is refused", () => {
  const problems = showcaseProblems((path) => has(path) && !path.startsWith("home/showcase/sovkora/neon-tall"));
  assert.deepEqual(problems, [
    "sovkora/neon: home/showcase/sovkora/neon-tall.mp4 is not in the CDN manifest",
    "sovkora/neon: home/showcase/sovkora/neon-tall.webm is not in the CDN manifest",
    "sovkora/neon: home/showcase/sovkora/neon-tall.jpg is not in the CDN manifest",
  ]);
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
  assert.doesNotMatch(
    read("content/films/home-showcase.json"),
    /yomizaka|akinaza|orazaka|kachizaka/i,
    "commercial names only",
  );
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
  assert.match(carousel, /window\.setTimeout\(\(\) => \{\s*const next = \(active \+ 1\) % total;/);
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
  assert.match(carousel, /prefersStill\(window\)/);
  assert.match(carousel, /\{!still && \(/, "no pause / play when nothing moves");
  assert.match(carousel, /here && loaded && !still && rendition && \(\s*<Clip/);
  const css = read("app/components/home/showcase.css").replace(/\/\*[\s\S]*?\*\//g, "");
  const calm = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(calm, /\.kz-show-slide \{\s*transition: none;/);
  assert.match(calm, /animation: none;/);
  assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|blur\(|translate/, "tokens only, nothing travels");
});

test("one rendition per viewport and poster first: the phone never fetches the desktop file, the h1 stays the LCP", () => {
  assert.match(carousel, /<source media=\{WIDE_QUERY\} srcSet=\{s\.wide\.poster\} \/>/);
  assert.match(carousel, /src=\{s\.tall\.poster\}/);
  assert.match(carousel, /r=\{s\[rendition\]\}/, "the clip in the viewport's rendition only");
  assert.match(carousel, /\(\) => null,\s*\);/, "no rendition on the server: no clip in the HTML");
  assert.match(
    carousel,
    /const draw = seen\.has\(i\) \|\| i === \(active \+ 1\) % total;/,
    "posters drawn as they come",
  );
  assert.match(carousel, /muted\s+playsInline/);
  assert.doesNotMatch(carousel, /autoPlay/);
  assert.match(read("app/components/home/Showcase.tsx"), /<details className="kz-fig-text kz-show-text">/);
});

test("phone renditions are 4:5 frames cut on the subject, never stretched", () => {
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
  assert.match(agents, /Verikora · Sovkora in the centre · Folioviv/);
  assert.match(agents, /Two blocks of the home move on their own\. The carousels/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { findCodeNames } from "@krizaka/org";
import { existsSync, readFileSync } from "node:fs";
import {
  FILM_IDS,
  PHONE_CUT,
  SHOWCASES,
  SlideSource,
  showcaseProblems,
  showcaseSlides,
  slideSeconds,
} from "../lib/home-showcase.ts";
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

test("every slide of every carousel has its files on the CDN (videos and poster), and at least three slides", () => {
  assert.deepEqual([...SHOWCASES], ["hero", "verikora", "sovkora", "folioviv"]);
  assert.deepEqual(showcaseProblems(has), []);
});

test("a slide missing a file, or a carousel with too few slides, is refused", () => {
  const problems = showcaseProblems((path) => has(path) && !path.startsWith("home/showcase/sovkora/snow-wide"));
  assert.deepEqual(problems, [
    "sovkora/snow: home/showcase/sovkora/snow-wide.webm is not in the CDN manifest",
    "sovkora/snow: home/showcase/sovkora/snow-wide.mp4 is not in the CDN manifest",
    "sovkora/snow: home/showcase/sovkora/snow-wide.jpg is not in the CDN manifest",
  ]);
  const film = showcaseProblems((path) => has(path) && path !== "products/sovkora/films/trailer-720.mp4");
  assert.deepEqual(film, ["sovkora/trailer: products/sovkora/films/trailer-720.mp4 is not in the CDN manifest"]);
});

// The founder's Sovkora trailer (krizaka-internal#2837): first slide of Sovkora's carousel, whole, with its sound. The home's
// promise stays compliance (founder, 2026-11-07): the hero does NOT open on it, and the h1 did not move.
test("the Sovkora trailer opens Sovkora's carousel (not the hero's), with its sound, a phone cut and its poster", () => {
  assert.deepEqual(FILM_IDS, ["trailer", "dossier-nadia", "dossier-sam", "dossier-theo"]);
  const [first] = showcaseSlides("sovkora");
  assert.equal(first.id, "trailer", "sovkora opens on the trailer");
  assert.equal(first.source, SlideSource.Film);
  assert.equal(first.audio, true, "the film keeps its music");
  assert.equal(first.poster, "products/sovkora/films/trailer-poster.webp", "the poster first");
  assert.deepEqual(first.videos, [
    { path: "products/sovkora/films/trailer-720.mp4", type: "video/mp4", media: PHONE_CUT },
    { path: "products/sovkora/films/trailer.mp4", type: "video/mp4" },
  ]);
  assert.equal(PHONE_CUT, "(max-width: 767px)");
  for (const c of ["hero", "verikora", "folioviv"])
    assert.ok(
      showcaseSlides(c).every((s) => s.source !== SlideSource.Film || s.id === "film"),
      c,
    );
  assert.deepEqual(
    showcaseSlides("hero").map((s) => s.id),
    ["film", "entreprise", "signature"],
    "the hero: the brand film, Krizaka Entreprise, a hand that signs",
  );
  assert.deepEqual(
    showcaseSlides("verikora").map((s) => s.id),
    ["sign", "owl", "loupe"],
  );
});

// The Dossiers (krizaka-internal#2876): « les Dossiers Sovkora », made-up stories. A carousel plays a loop of at most 10 s of
// each; the whole film (with its sound) plays on its watch page, with one action to it from the slide.
test("no whole film plays inside a carousel: a loop of 10 s at most, the whole on its watch page", () => {
  const films = Object.entries(board.films).filter(([, f]) => typeof f !== "string");
  assert.deepEqual(
    showcaseSlides("sovkora").map((s) => s.id),
    ["trailer", "dossier-nadia", "pigeon", "snow", "dossier-sam"],
  );
  const live = new Set(SHOWCASES.flatMap((c) => showcaseSlides(c).map((x) => x.id)));
  assert.ok(!live.has("dossier-theo"), "Théo is only on his watch page");
  for (const [id, f] of films) {
    assert.ok(f.watch, `${id}: a film has its whole on a watch page, never in a carousel`);
    const [, a, b] = /the loop is (\d+(?:\.\d+)?)-(\d+(?:\.\d+)?) s of the film/.exec(f.cut) ?? [];
    assert.ok(a !== undefined && Number(b) - Number(a) <= 10, `${id}: its loop is at most 10 s (${f.cut})`);
    assert.match(f.watch.mp4, new RegExp(`^products/sovkora/films/${id}-full\\.mp4$`));
    assert.ok(f.watch.seconds >= 60, `${id}: the whole film`);
    assert.equal(has(f.watch.mp4), true, `${id}: its whole cut is on the CDN`);
  }
  for (const s of showcaseSlides("sovkora").filter((x) => x.source === SlideSource.Film)) {
    const withheld = board.films[s.id].watch.withheld;
    assert.equal(
      s.watch,
      withheld ? undefined : s.id,
      `${s.id}: the slide's one action leads to its published watch page`,
    );
  }
  assert.equal(
    showcaseSlides("sovkora").find((s) => s.id === "dossier-nadia").audio,
    false,
    "a Dossier's loop is silent",
  );
});

test("the Dossiers say they are fiction, in both languages, and never claim customers", () => {
  const rule = {
    en: { caption: /^Sovkora Files no\. 0[1-3], /, alt: /^A fictional story, faces generated: / },
    fr: { caption: /^Les Dossiers Sovkora n° 0[1-3], /, alt: /^Histoire inventée, visages générés : / },
  };
  for (const l of ["en", "fr"]) {
    for (const id of ["dossier-nadia", "dossier-sam", "dossier-theo"]) {
      const w = messages(l).site.home.films[id];
      assert.match(w.caption, rule[l].caption, `${l} ${id}`);
      assert.match(w.alt, rule[l].alt, `${l} ${id}`);
      assert.match(w.watchLabel, /\d min \d+/, `${l} ${id}: the label says how long`);
      assert.doesNotMatch(`${w.caption} ${w.watchLabel}`, /customer|client|run Sovkora|font tourner/i, `${l} ${id}`);
      assert.doesNotMatch(w.alt, /run Sovkora|font tourner|our customers|nos clients/i, `${l} ${id}: a story`);
      assert.deepEqual(findCodeNames(JSON.stringify(w)), [], `${l} ${id}`);
      assert.ok(w.transcript.lines.length >= 8, `${l} ${id}: the text version of its titles`);
      assert.equal(
        w.transcript.lines.length,
        messages(l === "en" ? "fr" : "en").site.home.films[id].transcript.lines.length,
      );
    }
  }
});

test("the trailer's words: caption, alt and a transcript of its titles, from the film, in both languages", () => {
  const en = messages("en").site.home.films.trailer;
  const fr = messages("fr").site.home.films.trailer;
  for (const [l, w] of [
    ["en", en],
    ["fr", fr],
  ]) {
    assert.ok(w.caption.includes("Sovkora"), `${l}: caption`);
    assert.ok(w.alt.length > 80 && /1 min 51/.test(w.alt), `${l}: the alt says what it shows and how long`);
    assert.ok(w.transcript.lead.trim(), `${l}: transcript lead`);
    assert.deepEqual(findCodeNames(JSON.stringify(w)), [], `${l}: commercial names only`);
  }
  assert.equal(en.transcript.lines.length, fr.transcript.lines.length, "one line per title, in each language");
  assert.equal(en.transcript.lines[0], "Every day, your data leaves.");
  assert.equal(fr.transcript.lines[0], "Chaque jour, vos données partent.");
  assert.match(fr.transcript.lines.at(-1), /^Sovkora, l'IA qui reste chez vous\./);
  for (const l of ["en", "fr"]) assert.ok(messages(l).site.home.showcase.sources.film.trim(), `${l}: sources.film`);
  const watch = read("app/[locale]/films/[id]/page.tsx");
  assert.match(watch, /w\.transcript\?\.lines/, "the transcript is the text version of the film's watch page");
});

// Kridoc, the last product that showed a mood photo, is a row like the others (krizaka-internal#3559): no still is left.
test("no product shows a still any more: no stills in the storyboard, in the library or in the messages", () => {
  assert.equal(board.stills, undefined);
  assert.ok(!existsSync(new URL("../app/components/home/ShowcaseStill.tsx", import.meta.url)));
  for (const l of ["en", "fr"]) assert.equal(messages(l).site.home.showcase.stills, undefined, `${l}: stills`);
  assert.ok(
    !Object.keys(manifest.files).some((f) => f.startsWith("home/showcase/kridoc/")),
    "no photo left on the CDN manifest",
  );
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
    for (const s of slides.filter((x) => x.source !== SlideSource.Film)) {
      assert.equal(s.poster, `home/showcase/${c}/${s.id}-wide.jpg`);
      assert.deepEqual(
        s.videos.map((v) => v.path),
        [`home/showcase/${c}/${s.id}-wide.webm`, `home/showcase/${c}/${s.id}-wide.mp4`],
      );
    }
  }
  assert.ok(shotsOf(board).length > 0 && clipsOf(board).length > 0);
  assert.deepEqual(findCodeNames(read("content/films/home-showcase.json")), [], "commercial names only");
});

test("every slide has its caption and its text alternative in both languages, and no word without a slide", () => {
  for (const l of ["en", "fr"]) {
    const s = messages(l).site.home.showcase;
    for (const c of SHOWCASES) {
      assert.ok(s.carousels[c]?.trim(), `${l}: carousels.${c}`);
      const ids = showcaseSlides(c)
        .filter((x) => x.source !== SlideSource.Film)
        .map((x) => x.id);
      assert.deepEqual(Object.keys(s.slides[c]).sort(), [...ids].sort(), `${l}: ${c}`);
      for (const id of ids) {
        assert.ok(s.slides[c][id].caption.trim(), `${l}: ${c}/${id} caption`);
        assert.ok(s.slides[c][id].alt.length > 30, `${l}: ${c}/${id} says what it shows`);
      }
    }
    for (const k of ["pause", "play", "previous", "next", "textVersion", "slideOf", "figure", "sound", "close"])
      assert.ok(s.labels[k]?.trim(), `${l}: labels.${k}`);
    for (const k of Object.values(SlideSource)) assert.ok(s.sources[k]?.trim(), `${l}: sources.${k}`);
    assert.doesNotMatch(JSON.stringify(s), /\d+[,.]?\d*\s?\$|\$\s?\d/, `${l}: no amount`);
  }
});

// krizaka-internal#3273: the home has no player of its own. Every clip plays through @krizaka/ui's MediaCarousel, whose
// rules (autoplay held by the visible pause and by being off screen, never by the pointer or a click; sound only after
// the visitor's press, one slide at a time; reduced motion and Save-Data) are tested in krizaka-ui.
test("the home has no carousel and no player of its own: the storyboard feeds /story's clips and the watch pages", () => {
  for (const gone of [
    "app/components/home/Showcase.tsx",
    "app/components/home/showcase.css",
    "app/components/home/ShowcaseCarousel.tsx",
    "app/components/home/DirectionLoop.tsx",
    "lib/showcase-player.ts",
  ])
    assert.equal(existsSync(new URL(`../${gone}`, import.meta.url)), false, `${gone} is deleted`);
  for (const f of [
    "app/[locale]/page.tsx",
    "app/components/home/HomeHero.tsx",
    "app/components/home/ProductShowcase.tsx",
  ])
    assert.doesNotMatch(
      read(f),
      /MediaCarousel|<video\b|autoPlay|PausableLoop|<Showcase\b/,
      `${f}: nothing moves at load`,
    );
});

test("every slide declares its measured length (the autoplay's time on screen) and its poster", () => {
  for (const c of SHOWCASES)
    for (const x of showcaseSlides(c)) {
      const seconds = slideSeconds(x.id);
      assert.ok(typeof seconds === "number" && seconds > 0 && seconds <= 15, `${c}/${x.id}: a loop of 15 s at most`);
    }
});

test("sound is the visitor's choice: only a finished film claims an audio track", () => {
  assert.equal(messages("en").site.home.showcase.labels.sound, "Sound");
  assert.equal(messages("fr").site.home.showcase.labels.sound, "Son");
  // Runway's outputs are silent: only a finished film claims an audio track (the trailer's loop keeps its music; the
  // Dossiers' loops are silent, their sound is on their watch page).
  const withSound = [];
  for (const c of SHOWCASES)
    for (const x of showcaseSlides(c)) {
      assert.ok(!x.audio || x.source === SlideSource.Film, `${c}/${x.id}`);
      if (x.audio) withSound.push(`${c}/${x.id}`);
    }
  assert.deepEqual(withSound, ["sovkora/trailer"]);
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

test("AGENTS.md says the new rules: the home's order (§ 2) and that no block of the home moves (§ 4)", () => {
  const agents = read("AGENTS.md");
  assert.match(agents, /Sovkora · Verikora · Folioviv/);
  assert.match(agents, /No block of the home moves on its own/);
});

test("a withheld film's slide has no action to its watch page (the trailer, until its licence card is corrected)", () => {
  const trailer = showcaseSlides("sovkora").find((s) => s.id === "trailer");
  assert.ok(trailer, "the trailer's loop stays in the storyboard (/story's clips)");
  assert.equal(trailer.watch, undefined, "no « Watch the film » to a page that is not published");
  for (const id of ["dossier-nadia", "dossier-sam"]) {
    assert.equal(showcaseSlides("sovkora").find((s) => s.id === id)?.watch, id, `${id}: its action leads to its page`);
  }
  // The whole film stays on the CDN and in the manifest: the check of its files does not depend on the hold.
  assert.ok(manifest.files[board.films.trailer.watch.mp4], "the trailer's web cut is still in the manifest");
});

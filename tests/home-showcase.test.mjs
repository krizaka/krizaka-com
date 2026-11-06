import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { PRODUCT_SHOWCASES, SHOWCASES, showcaseOf, showcaseProblems, showcaseSlides } from "../lib/home-showcase.ts";
import { barHref } from "../lib/bar-href.ts";
import {
  boardProblems,
  clipsOf,
  generatedCredits,
  generatedOf,
  generatedProblems,
  maxCredits,
  shotsOf,
  tallFilter,
} from "../scripts/home-showcase.mjs";

// The home's carousels (founder, 2026-11-05, krizaka-internal#2450): the hero's and one per product, Sovkora in the centre;
// real media made for each, 16:9 on wide screens and 4:5 on phones, served from Bunny; they advance on their own with
// WCAG 2.2.2's controls and stay still under reduced motion.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const manifest = JSON.parse(read("lib/cdn-manifest.json"));
const has = (path) => Boolean(manifest.files[path]);
const board = JSON.parse(read("content/films/home-showcase.json"));

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

// Since 2026-11-06 (krizaka-internal#2658) the carousel is @krizaka/ui's MediaCarousel v2 (krizaka-ui ADR-010): its own
// tests prove the clock, the holds, reduced motion, the clip's mounting and its failure, and the sound gesture. Here: the
// home uses it with those options, and no hand-made carousel is left.
const showcase = read("app/components/home/Showcase.tsx");

test("the home's carousels are MediaCarousel v2: autoplay, sound as an option, the Cahier frame, the caption in the bar", () => {
  assert.match(showcase, /import \{ type CarouselSlide, MediaCarousel \} from "@krizaka\/ui\/media-carousel";/);
  for (const prop of [/\n\s+autoplay\n/, /\n\s+sound\n/, /frame="cahier"/, /caption="bar"/])
    assert.match(showcase, prop);
  assert.ok(
    !existsSync(new URL("../app/components/home/ShowcaseCarousel.tsx", import.meta.url)),
    "no hand-made carousel",
  );
  assert.ok(!existsSync(new URL("../app/components/home/showcase.css", import.meta.url)), "its styles left with it");
  assert.doesNotMatch(showcase, /setTimeout|setInterval|requestAnimationFrame|<video/);
});

test("every word of the carousel is the site's, in both languages, the roles included", () => {
  for (const k of ["previous", "next", "pause", "play", "soundOn", "textVersion"])
    assert.match(showcase, new RegExp(`${k}: w\\.${k},`), k);
  assert.match(showcase, /slide: w\.slideOf,/);
  assert.match(showcase, /carousel: w\.carousel,/);
  assert.match(showcase, /slideRole: w\.slide,/);
});

test("one 16:9 rendition on every screen, never the tall one; the text version on the server", () => {
  assert.match(showcase, /src: cdn\(`\$\{s\.wide\}\.jpg`\)/);
  assert.match(showcase, /video: \{ webm: cdn\(`\$\{s\.wide\}\.webm`\), mp4: cdn\(`\$\{s\.wide\}\.mp4`\) \}/);
  assert.doesNotMatch(showcase, /\btall\b/);
  assert.match(showcase, /<details className="kz-fig-text">/);
  assert.doesNotMatch(read("lib/home-showcase.ts"), /\btall:/, "the data holds no tall rendition");
});

test("sound is an option: a slide claims audio only when its file has a track", () => {
  assert.match(showcase, /audio: s\.audio,/);
  assert.equal(messages("en").site.home.showcase.labels.soundOn, "Sound on");
  assert.equal(messages("fr").site.home.showcase.labels.soundOn, "Activer le son");
  // Runway's outputs are silent: no slide claims an audio track, so the button stays hidden (never an unlicensed track).
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
    assert.match(r.model, /^(aleph2|gen4\.5)$/, r.shot);
    assert.ok(Number.isFinite(r.credits) && r.credits >= 0, r.shot);
  }
  const aleph = log.runs.filter((r) => r.model === "aleph2");
  const spent = log.checkpoint.balance.before - log.checkpoint.balance.after;
  assert.ok(
    spent >= aleph.reduce((n, r) => n + r.credits, 0),
    "the real charge is read from the balance, never below the estimates",
  );
  assert.ok(spent <= log.checkpoint.capCredits, `${spent} credits: over the checkpoint without the founder's go`);
  // krizaka-internal#2658: Verikora's rule clips (Gen-4.5) have their own checkpoint, read from the balance.
  for (const c of log.checkpoints ?? []) {
    const charged = c.balance.before - c.balance.after;
    const runs = log.runs.filter((r) => r.model === c.model);
    assert.ok(charged >= runs.reduce((n, r) => n + r.credits, 0), `${c.issue}: never below the logged runs`);
    assert.ok(charged <= c.capCredits, `${c.issue}: ${charged} credits, over the checkpoint without the founder's go`);
  }
  for (const g of generatedOf(board))
    assert.ok(log.chosen[`${g.carousel}/${g.id}`], `${g.carousel}/${g.id}: a take is chosen`);
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

// Founder, 2026-11-06 (krizaka-internal#2658): Verikora's carousel shows its own clips, each a DIFFERENT real rule of
// Verikora's catalogue (never the deposit every time, never an invented rule), its article as the product cites it, the
// words in the caption and never in the picture.
test("Verikora's generated clips: one real rule each, its citation and its line in the catalogue, the words in the caption", () => {
  const made = generatedOf(board).filter((g) => g.carousel === "verikora");
  assert.ok(made.length >= 4, "at least four rules");
  assert.deepEqual(generatedProblems(board), []);
  assert.equal(new Set(made.map((g) => g.rule)).size, made.length, "one rule per clip");
  assert.ok(!made.some((g) => g.rule === "QC-LEASE-004"), "not the deposit every time");
  for (const g of made) {
    assert.match(g.rule, /^(QC-LEASE|TS-[A-Z])-\d{3}$/, g.id);
    assert.match(g.citation, /^C\.c\.Q\., art\. \d{4}/, g.id);
    assert.match(g.catalogue, /^verikora:apps\/web\/lib\/closing-note\/data\/qc-residential-lease\.json:\d+$/, g.id);
    assert.match(board.generatedLook, /No readable text/, "no words in the picture");
    assert.equal(generatedCredits(g), g.seconds * 12, "Gen-4.5's published rate");
    const article = g.citation.match(/art\. (\d{4})/)[1];
    for (const l of ["en", "fr"]) {
      assert.match(messages(l).site.home.showcase.slides.verikora[g.id].caption, new RegExp(article), `${l}: ${g.id}`);
    }
  }
  assert.deepEqual(
    generatedProblems({
      ...board,
      carousels: {
        x: {
          generated: [
            {
              id: "a",
              rule: "R-1",
              citation: "C.c.Q., art. 1",
              catalogue: "verikora:f.json:1",
              seconds: 6,
              idea: "i",
              prompt: "p",
            },
            { id: "b", rule: "R-1", citation: "", catalogue: "elsewhere", seconds: 30, idea: "i", prompt: "p" },
          ],
        },
      },
    }),
    [
      "x/b: 2 to 10 s",
      "x/b: a rule carries its citation and its place in the catalogue (verikora:<file>:<line>)",
      "x/b: R-1 is already shown by x/a: one rule per clip",
    ],
  );
  for (const g of made)
    assert.ok(
      showcaseSlides("verikora").some((s) => s.id === g.id && s.source === "generated"),
      g.id,
    );
});

// Founder, 2026-11-06: the site says « vous »; a caption never says « tu / tes / ton / ta / toi » (an alt may quote a reel's
// burned-in title, between « »).
test("the French captions say « vous », never « tu »", () => {
  const slides = messages("fr").site.home.showcase.slides;
  for (const [c, words] of Object.entries(slides))
    for (const [id, w] of Object.entries(words))
      assert.doesNotMatch(w.caption, /\b(tu|tes|ton|ta|toi|te)\b/i, `${c}/${id}`);
});

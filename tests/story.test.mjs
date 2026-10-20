import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// /story (2026-10-20, Oussama: « on a du mal à suivre la story »): a chaptered longform — a short intro, then ten-second
// chapters beside a sticky contents, a reading hairline, the reference film once (a poster card, a lightbox), no
// full-bleed player in the text, every chapter a heading + a line or two + one proof + its depth in a fold.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = (l) => JSON.parse(read(`messages/${l}.json`)).site;
const page = read("app/[locale]/story/page.tsx");
const chapter = read("app/components/story/StoryChapter.tsx");
const css = read("app/[locale]/story/story.css");

test("the page is the longform template with a sticky contents (Toc + TocLayout) and a reading hairline", async () => {
  assert.match(read("lib/page-templates.ts"), /"\/story": "longform"/);
  assert.match(page, /import \{ Toc, TocLayout \} from "@krizaka\/ui\/toc"/);
  assert.match(page, /<TocLayout toc=\{<Toc label=\{st\.toc\} items=\{items\} \/>\}>/);
  assert.match(page, /<ReadingProgress \/>/);
  const bar = read("app/components/story/ReadingProgress.tsx");
  assert.match(bar, /"use client"/);
  assert.match(bar, /\{ passive: true \}/);
  assert.doesNotMatch(bar, /requestAnimationFrame/, "no permanent animation frame (AGENTS §4)");
  assert.match(bar, /aria-hidden/);
  assert.match(css, /\.st-progress[^}]*position: fixed[^}]*transform: scaleX\(var\(--st-read\)\)/);
});

const story = read("lib/story.ts");
const productIds = [...read("lib/products.ts").matchAll(/\{ id: "(\w+)", name:/g)].map((m) => m[1]);

test("the chapters are, in order: who we are, the engine, each product, the open stack, what is next — products from PRODUCTS", () => {
  assert.match(story, /STORY_ANCHORS = \["who", "engine", \.\.\.PRODUCT_CHAPTERS, "open", "next"\] as const/);
  assert.match(story, /PRODUCT_CHAPTERS[^=]*= \[\.\.\.PROVES_FIRST, \.\.\.ROSTER\]/, "the first proofs, then the rest of the roster: every product but the engine");
  assert.match(story, /ROSTER[^=]*= PRODUCTS\.map\(\(p\) => p\.id\)\.filter\(\(id\) => id !== ENGINE && !PROVES_FIRST\.includes\(id\)\)/);
  for (const id of ["who", "engine", "open", "next"]) assert.match(page, new RegExp(`id="${id}"`));
  assert.match(page, /id=\{`p-\$\{id\}`\}/);
  assert.match(page, /id === "who" \|\| id === "engine" \|\| id === "open" \|\| id === "next" \? id : `p-\$\{id\}`/);
});

test("each chapter is readable in ten seconds: heading, a line or two, one proof, depth in a native fold", () => {
  assert.match(chapter, /<h2 id=\{`\$\{id\}-title`\}/);
  assert.match(chapter, /<details className="st-ch-fold">/);
  assert.match(chapter, /aria-labelledby=\{`\$\{id\}-title`\}/);
  assert.match(chapter, /st-ch-proof/);
  for (const l of ["en", "fr"]) {
    const st = messages(l).story;
    for (const [k, v] of Object.entries({ who: st.who.lead, engine: st.engine.lead, open: st.open.lead, next: st.next.lead })) assert.ok(v.length <= 240, `${l}: ${k} lead is ${v.length} characters`);
    for (const id of ["orochia", "yomizaka", "kachizaka", "akinaza", "yasakia", "yororis"]) assert.ok(messages(l).products.cards[id].line.length <= 90, `${l}: ${id}`);
  }
});

test("each chapter wears the right bird, with its promise from the film or the brand reference; no bird twice", () => {
  const map = Object.fromEntries([...story.match(/PRODUCT_BIRD[^=]*= \{([^}]*)\}/)[1].matchAll(/(\w+): "(\w+)"/g)].map((m) => [m[1], m[2]]));
  assert.deepEqual(map, { orazaka: "flamingo", yomizaka: "owl", orochia: "pigeon", kachizaka: "magpie", akinaza: "beaver", yasakia: "lovebird", yororis: "crane" });
  assert.deepEqual(Object.keys(map).sort(), [...productIds].sort(), "a bird for every product");
  const who = story.match(/WHO_BIRD[^=]*= "(\w+)"/)[1];
  const open = story.match(/OPEN_BIRD[^=]*= "(\w+)"/)[1];
  const used = [who, open, ...Object.values(map)];
  assert.equal(new Set(used).size, used.length, "one bird per subject on the page");
  for (const l of ["en", "fr"]) {
    const st = messages(l).story;
    for (const bird of used) assert.ok(st.world.cues[bird] || st.birds[bird], `${l}: the ${bird}'s promise`);
  }
});

test("the film is shown once: one poster card opening the lightbox; no inline player, no autoplay in the text", () => {
  assert.equal([...page.matchAll(/<FilmLightbox/g)].length, 1, "the reference film once");
  assert.match(page, /video\(TOUR_BASE\)/, "« Le monde de Krizaka : la tournée »");
  assert.match(page, /vtt: "tour\.vtt"/);
  assert.match(page, /fallback=\{\{ mp4: codeFilm\.mp4, poster: codeFilm\.poster, vtt: "film\.vtt" \}\}/, "the light film under reduced motion / Save-Data");
  assert.doesNotMatch(page, /VideoPlayer|<video|autoPlay|autoplay/, "no player in the reading column");
  assert.match(page, /<Image className="st-film-poster" src=\{film\.poster\}/, "the poster is a content frame");
  assert.match(css, /\.st-film \{[^}]*max-width: 420px[^}]*aspect-ratio: 16 \/ 9/, "sized for the column, 16:9");
  const box = read("app/components/home/FilmLightbox.tsx");
  assert.match(box, /preload="none"/);
  assert.match(box, /trigger\?: ReactNode/);
  for (const l of ["en", "fr"]) {
    const w = messages(l).story.who;
    assert.ok(w.film && w.filmLength && w.filmNote, l);
    assert.match(messages(l).story.world.tour.credit, l === "en" ? /AI-generated/ : /Généré par IA/, "said on the page: AI-generated");
  }
  assert.match(page, /st\.world\.tour\.credit/, "the credit is on the page, not only in the film");
});

test("the text version of the film is listed once, in the fold, from the messages", () => {
  assert.equal([...page.matchAll(/st\.world\.cues\[c\]/g)].length, 1);
});

test("a product chapter shows its field's mini-visual (demo data, said so), claims only what runs, and links its site and its source", () => {
  assert.match(page, /<ProductVisual id=\{id\} \/>/);
  assert.match(page, /data-pv-host/);
  assert.match(read("app/components/home/visuals/ProductVisual.tsx"), /closest\("\.kz-pc, \[data-pv-host\]"\)/);
  for (const l of ["en", "fr"]) assert.ok(messages(l).story.products.demo, l);
  assert.match(page, /p\.noSite \? h\.seeCode : h\.visit/);
});

test("Yororis: its chapter quotes the reviewed statement verbatim and adds no word of its own about it", () => {
  assert.match(page, /t\.site\.yororis\.reviewed\.construction/);
  assert.match(page, /t\.site\.yororis\.reviewed\.isNot/);
  // new messages never carry « yororis » in their key (the lexicon reads those): the chapter's words are the shared ones.
  for (const l of ["en", "fr"]) assert.doesNotMatch(JSON.stringify(Object.keys(messages(l).story)), /yororis/i);
  assert.doesNotMatch(JSON.stringify(messages("en").story.birds) + JSON.stringify(messages("fr").story.birds), /therap|heal|guérir|soin/i);
});

test("the next chapter is read from the data: planned uses and products in development, never typed", () => {
  assert.match(page, /ENGINE_USES\.filter\(\(u\) => u\.planned\)/);
  assert.match(page, /PRODUCTS\.filter\(\(p\) => p\.status === "development"\)/);
  for (const l of ["en", "fr"]) {
    const n = messages(l).story.next;
    assert.match(n.wire, /\{products\}/);
    assert.match(n.reach, /\{products\}/);
    assert.doesNotMatch(JSON.stringify(n), /\b20\d\d\b|bientôt|coming soon|waiting list|beta/i, `${l}: no date, no promise`);
  }
});

test("the page keeps the rules: no hard-coded text choice by locale, no colour literal in its stylesheet but the poster's white on black, reduced motion safe", () => {
  assert.doesNotMatch(page, /locale === |isFr/);
  const literal = css.replace(/color-mix\(in oklab, #000 \d+%, transparent\)|color-mix\(in oklab, #fff \d+%, transparent\)|color: #fff;/g, "");
  assert.doesNotMatch(literal, /#[0-9a-fA-F]{3,8}\b|rgb\(|zinc-/, "tokens only");
  assert.doesNotMatch(css, /@keyframes|animation:/, "nothing animates here");
});

test("the arcade stages are gone from /story", () => {
  assert.doesNotMatch(page, /StageBanner|PromiseCard|ScrollStage|ContinuePrompt/);
  for (const l of ["en", "fr"]) assert.equal(messages(l).story.arcade, undefined);
});

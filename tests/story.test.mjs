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
  assert.match(page, /storyFilm\(\)/, "the film slot: « le relais » (lib/story-film.ts)");
  assert.match(page, /vtt: film\.vtt/);
  assert.match(page, /fallback=\{\{ mp4: codeFilm\.mp4, poster: codeFilm\.poster, vtt: "film\.vtt" \}\}/, "the light film under reduced motion / Save-Data");
  assert.doesNotMatch(page, /VideoPlayer|<video|autoPlay|autoplay/, "no player in the reading column");
  assert.match(page, /<Image className="st-film-poster" src=\{film\.poster\}/, "the poster is a content frame");
  assert.match(css, /\.st-film \{[^}]*max-width: 420px[^}]*aspect-ratio: 16 \/ 9/, "sized for the column, 16:9");
  const box = read("app/components/home/FilmLightbox.tsx");
  assert.match(box, /preload="none"/);
  assert.match(box, /trigger\?: ReactNode/);
  for (const l of ["en", "fr"]) {
    const w = messages(l).story.who;
    assert.ok(w.film && w.filmLength && w.filmCredit && w.filmCredits, l);
  }
});

test("the film block shows no captions list and no credits wall: one quiet line, the captions live in the <track>", () => {
  assert.doesNotMatch(page, /RELAY_CUES|relay\.cues/, "captions are never printed as a list");
  assert.doesNotMatch(page, /st\.world\.relay\.credit\b/, "no credits paragraph");
  assert.doesNotMatch(page, /summary: st\.who/, "no fold on the founder chapter");
  assert.match(page, /st\.who\.filmCredit/);
  for (const l of ["en", "fr"]) assert.ok(messages(l).story.who.filmCredit.length < 50, l);
});

test("a product chapter shows its field's mini-visual (demo data, said so), claims only what runs, and links its site and its source", () => {
  assert.match(page, /<ProductVisual id=\{id\} \/>/);
  // The visual plays as soon as it is on screen (2026-10-20): no hover host to wire any more.
  assert.match(read("app/components/home/visuals/ProductVisual.tsx"), /const playing = !still && onScreen;/);
  assert.doesNotMatch(page, /data-pv-host/);
  for (const l of ["en", "fr"]) assert.ok(messages(l).story.products.demo, l);
  assert.match(page, /href=\{p\.siteUrl\}/);
});

test("Yororis: its chapter keeps the reviewed « is not » list verbatim and says where it stands", () => {
  assert.match(page, /st\.products\.constructionNote/, "where it stands, said plainly: QA-only on dev, nothing public");
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

test("each product shows its real take: a poster that plays on click in a lightbox, the mini-visual only as the fallback", () => {
  const takes = read("lib/story-takes.ts");
  const ids = ["orazaka", "yomizaka", "orochia", "kachizaka", "akinaza", "yasakia"];
  for (const id of ids) assert.match(takes, new RegExp(`\\n  ${id}: \\{\\s*ratio:`), `${id} has a take`);
  // Yororis' recording shows the dev build's QA banner: no take (its mini-visual) until it is re-recorded — no QA name on the page.
  assert.doesNotMatch(takes, /\n  yororis: \{/);
  // every file a take names is on the CDN (recorded in the manifest), in the language it needs
  const { files } = JSON.parse(read("lib/cdn-manifest.json"));
  for (const m of takes.matchAll(/(mp4|webm|poster): "(products\/[^"]+)"/g)) {
    for (const l of m[2].includes("{l}") ? ["en", "fr"] : ["en"]) {
      const path = m[2].replace("{l}", l);
      assert.match(files[path] ?? "", /^[0-9a-f]{10}$/, `${path} is on the CDN`);
    }
  }
  const card = read("app/components/story/TakeCard.tsx");
  assert.match(card, /preload="none"/);
  assert.match(card, /next\/dynamic/, "the player's code loads on click");
  assert.match(card, /<Dialog\.Root>/);
  assert.match(page, /takeOf\(id, locale\)/);
  assert.match(page, /takeProof\(id, p\.name\) \?\? \(/, "mini-visual = fallback");
  assert.match(css, /\.st-take-card \{[^}]*width: 168px[^}]*aspect-ratio: 9 \/ 16/, "a fixed small phone frame");
  for (const l of ["en", "fr"]) for (const k of ["watch", "close", "player", "inLang", "watchRender", "renderPlayer"]) assert.ok(messages(l).story.products.take[k], `${l}: take.${k}`);
});

// The birds of /story (bug 2026-10-20: « Le faucon veille » wore a blue bird that read as the pigeon). A chapter's bird
// is drawn in ITS OWN colours (tone="own", as in the film and on /contact) — in the page's brand tone every bird took the
// same blue — and each bird carries the promise it is cast for (brand reference: the falcon watches, the owl reads, the
// duck builds, the flamingo answers and the payment follows, the pigeon delivers).
const BIRD_WORD = { en: { falcon: "falcon", owl: "owl", duck: "duck", flamingo: "flamingo", pigeon: "pigeon" }, fr: { falcon: "faucon", owl: "hibou", duck: "canard", flamingo: "flamant", pigeon: "pigeon" } };
const PROMISE = { falcon: /watch|veille/i, owl: /read|lit /i, duck: /build|construit/i, flamingo: /answer|répond/i, pigeon: /deliver|livre/i };

test("a chapter's bird is drawn in its own colours, never in the page's brand tone", () => {
  assert.match(chapter, /<Mascot bird=\{bird\}[^>]*tone="own"/);
});

test("each of the five birds of the film says its own promise, in both languages", () => {
  for (const lang of ["en", "fr"]) {
    const cues = messages(lang).story.world.cues;
    for (const [bird, word] of Object.entries(BIRD_WORD[lang])) {
      assert.match(cues[bird].toLowerCase(), new RegExp(word), `${lang}: the ${bird}'s line names the ${bird}`);
      assert.match(cues[bird], PROMISE[bird], `${lang}: the ${bird}'s line says its promise`);
    }
  }
});

test("the chapters cast the right birds: falcon for who we are, duck for open source, one bird per subject", () => {
  assert.match(story, /WHO_BIRD: StoryBird = "falcon"/);
  assert.match(story, /OPEN_BIRD: StoryBird = "duck"/);
  const cast = Object.fromEntries([...story.matchAll(/^\s+(\w+): "(\w+)",$/gm)].map((m) => [m[1], m[2]]));
  assert.equal(cast.orazaka, "flamingo", "the engine answers, and the payment follows");
  assert.equal(cast.yomizaka, "owl", "Yomizaka reads documents");
  assert.equal(cast.orochia, "pigeon", "Orochia delivers");
  const birds = [...Object.values(cast), "falcon", "duck"];
  assert.equal(new Set(birds).size, birds.length, "never the same bird twice on the page");
  assert.match(page, /bird=\{WHO_BIRD\}\s+promise=\{promiseOf\(t, WHO_BIRD\)\}/, "the who chapter's promise is its own bird's");
  assert.match(page, /bird=\{PRODUCT_BIRD\.orazaka\}\s+promise=\{promiseOf\(t, PRODUCT_BIRD\.orazaka\)\}/);
  assert.match(page, /promise=\{promiseOf\(t, bird\)\}/);
});

test("the own palettes of the birds are distinct (the falcon is orange, not the pigeon's blue)", async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const React = (await import("react")).default;
  const { Mascot } = await import("@krizaka/ui/mascots");
  const fills = (bird) => new Set([...renderToStaticMarkup(React.createElement(Mascot, { bird, mood: "success", size: 44, animated: false, tone: "own" })).matchAll(/#[0-9a-f]{6}/gi)].map((m) => m[0].toLowerCase()));
  const f = fills("falcon");
  const p = fills("pigeon");
  assert.ok(f.has("#ff9f00") && !p.has("#ff9f00"), "the falcon wears its orange");
  assert.ok(p.has("#22d3ee") && !f.has("#22d3ee"), "the pigeon wears its cyan-indigo");
});

// Story peer review (2026-10-21): one strong medium per chapter, captions in both languages, a film slot ready for « le relais ».
import { takeVtt } from "../lib/take-captions.ts";
// lib/story-takes.ts reads the CDN manifest (a JSON import): the test reads its source.
const TAKE_PRODUCTS = [...read("lib/story-takes.ts").matchAll(/\n  (\w+): \{\s*ratio:/g)].map((m) => m[1]);
import { pickFilm } from "../lib/film-captions.ts";

test("every take has its captions in both languages, one line per cue, cues in order inside the take", () => {
  const specs = read("lib/story-takes.ts");
  for (const id of TAKE_PRODUCTS) {
    const m = specs.match(new RegExp(`\\n  ${id}: \\{[\\s\\S]*?cues: (\\[\\[[^\\n]*\\]\\])`));
    assert.ok(m, `${id}: cues`);
    const cues = JSON.parse(m[1]);
    cues.forEach(([a, b], i) => {
      assert.ok(a < b, `${id} cue ${i}`);
      if (i) assert.ok(cues[i - 1][1] <= a, `${id} cue ${i} overlaps`);
    });
    for (const l of ["en", "fr"]) {
      const words = messages(l).story.products.take.captions[id];
      assert.equal(words.length, cues.length, `${l} ${id}: one line per cue`);
      assert.ok(words.every((w) => w.trim()), `${l} ${id}: no empty line`);
    }
  }
  const vtt = takeVtt([[0, 6], [6.5, 11]], ["One", "Two"]);
  assert.equal(vtt, "WEBVTT\n\n00:00:00.000 --> 00:00:06.000\nOne\n\n00:00:06.500 --> 00:00:11.000\nTwo\n");
});

test("the captions route serves each take's lines same-origin and the player lists both languages", () => {
  const route = read("app/[locale]/story/captions/[take]/route.ts");
  assert.match(route, /text\/vtt/);
  assert.match(route, /force-static/);
  assert.match(read("app/components/story/TakeCard.tsx"), /\/story\/captions\/\$\{id\}/);
});

test("the engine shows a scene it rendered (the Old Port), Yasakia its batch in both languages, Yororis none until re-recorded", () => {
  const takes = read("lib/story-takes.ts");
  assert.match(takes, /orazaka: \{ ratio: "film", mp4: "products\/orazaka\/video\/old-port\.mp4"/);
  assert.match(takes, /products\/yasakia\/tour\/take-en-batch\.mp4/);
  assert.match(takes, /fr: \{ mp4: "products\/yasakia\/tour\/take-batch\.mp4"/);
  assert.doesNotMatch(takes, /take-full|moment-fr-phone/);
  assert.equal(read("lib/cdn-manifest.json").includes("take-full"), false, "the 3-minute walkthrough is out of the manifest");
  assert.ok(TAKE_PRODUCTS.includes("orazaka") && !TAKE_PRODUCTS.includes("yororis"));
});

test("no take names Orazaka as the one doing a product's job, and Orochia's take is its feed and its tip", () => {
  const caps = messages("en").story.products.take.captions;
  for (const id of Object.keys(caps).filter((k) => k !== "orazaka")) assert.doesNotMatch(caps[id].join(" "), /Orazaka/, id);
  assert.doesNotMatch(JSON.stringify(caps), /\bQA\b/);
});

test("the film slot takes the newest film whose files are on the CDN, else the one under it", () => {
  const films = [
    { id: "relais", base: "brand-films/relay/x", vtt: "relais.vtt" },
    { id: "tournee", base: "brand-films/epic/y", vtt: "tour.vtt" },
  ];
  const has = (...bases) => (p) => bases.some((b) => ["webm", "mp4", "jpg"].map((e) => `${b}.${e}`).includes(p));
  assert.equal(pickFilm(films, has("brand-films/epic/y")).id, "tournee");
  assert.equal(pickFilm(films, has("brand-films/relay/x", "brand-films/epic/y")).id, "relais");
  assert.equal(pickFilm(films, () => false).id, "tournee", "never a dead poster: the oldest is always the fallback");
  assert.match(read("lib/story-film.ts"), /id: "relais", base: RELAY_BASE, vtt: "relay\.vtt"/);
});

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
const PAGE = "app/[locale]/story/page.tsx";
const CSS = "app/[locale]/story/story.css";
const CHAPTER = "app/components/story/StoryChapter.tsx";
const has = (path) => Boolean(JSON.parse(read("lib/cdn-manifest.json")).files[path]);

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
const productIds = PRODUCT_RECORDS().map((p) => p.id);

test("the chapters are, in order: who we are, the name, how we work, the engine, each product, the open stack, what is next — products from PRODUCTS", () => {
  const lib = "lib/story.ts";
  assert.ok(hasCode(lib, 'COMPANY_CHAPTERS = ["who", "name", "work"] as const'));
  assert.ok(
    hasCode(lib, 'STORY_ANCHORS = [...COMPANY_CHAPTERS, "engine", ...PRODUCT_CHAPTERS, "open", "next"] as const'),
  );
  assert.ok(
    hasCode(lib, "= [...PROVES_FIRST, ...ROSTER]"),
    "the first proofs, then the rest of the roster: every product but the engine",
  );
  assert.ok(
    hasCode(
      lib,
      "ROSTER: readonly ProductId[] = PRODUCTS.map((p) => p.id).filter((id) => id !== ENGINE && !PROVES_FIRST.includes(id))",
    ),
  );
  const pageFile = "app/[locale]/story/page.tsx";
  const ids = jsx(pageFile).map((e) => e.attrs.id);
  for (const id of ["who", "name", "work", "engine", "open", "next"]) assert.ok(ids.includes(id), id);
  assert.ok(ids.includes("{`p-${id}`}"));
  assert.ok(hasCode(pageFile, 'const plain = new Set<string>([...COMPANY_CHAPTERS, "engine", "open", "next"]);'));
  assert.ok(hasCode(pageFile, "plain.has(id) ? id : `p-${id}`"));
});

test("each chapter is readable in ten seconds: the site's section head, a line or two, one figure, depth in a native fold", () => {
  // the head is @krizaka/ui's SectionHeading: « § n » in the margin, the note in lower case, the title (never a hand-made head)
  assert.ok(importsFrom(CHAPTER, "@krizaka/ui/page"));
  const head = jsxAll(CHAPTER, "SectionHeading");
  assert.equal(head.length, 1);
  assert.equal(head[0].attrs.id, "{`${id}-title`}");
  assert.equal(head[0].attrs.number, "{`§ ${number}`}");
  assert.equal(head[0].attrs.size, "sm", "the head of a reading page");
  assert.ok(!jsx(CHAPTER).some((e) => e.tag === "h2"), "no hand-made heading");
  assert.match(chapter, /aria-labelledby=\{`\$\{id\}-title`\}/);
  assert.match(chapter, /st-ch-proof/);
  // the fold is the /services questions' shell
  assert.ok(jsx(CHAPTER).some((e) => e.attrs.className === "kz-tpl-faq st-ch-fold"));
  assert.ok(jsx(CHAPTER).some((e) => e.tag === "details"));
  // the lead is the reading pages' prose
  assert.ok(jsx(CHAPTER).some((e) => e.attrs.className === "rd-prose st-ch-lead"));
  for (const l of ["en", "fr"]) {
    const st = messages(l).story;
    for (const [k, v] of Object.entries({
      who: st.who.lead,
      work: st.work.lead,
      engine: st.engine.lead,
      open: st.open.lead,
      next: st.next.lead,
    }))
      assert.ok(v.length <= 240, `${l}: ${k} lead is ${v.length} characters`);
    for (const id of ["verikora", "folioviv"])
      assert.ok(messages(l).products.cards[id].line.length <= 110, `${l}: ${id}`);
  }
});

// Founder, 2026-11-06 (krizaka-internal#2800): « et qu'il aligne les UI sur le style global dans Our story ». The page
// draws nothing the site already has: the head is SectionHeading, the fold .kz-tpl-faq, the figures the site's plate, the
// brand is scoped to what wears it, and the Cahier refusals hold (no gradient, no blur, no rounded card, no uppercase note,
// no bold display face, no !important).
test("the page's UI is the site's: one hero action, the brand scoped to its chip and its actions, Cahier refusals in its stylesheet", () => {
  const hero = jsxAll(PAGE, "PageHero")[0];
  assert.ok(hero, "a PageHero");
  const heroButtons = jsxAncestors(PAGE, "ButtonLink").filter((up) => up.includes("PageHero"));
  assert.equal(heroButtons.length, 1, "one action in the hero, like the home and /services");
  assert.equal(messages("en").story.intro.products, undefined, "the second hero action's words are gone");
  // a chapter never wears the brand on its whole section (it would swap the Cahier faces and the margin ink)
  const section = jsxAll(CHAPTER, "section")[0];
  assert.equal(section.attrs.className, "st-ch");
  assert.ok(hasCode(CHAPTER, 'cn("st-ch-actions", branded)'), "the actions wear the product's brand");
  assert.ok(hasCode(CHAPTER, "<span className={branded}>{meta}</span>"), "so does the status chip");
  const text = cssText(CSS);
  assert.doesNotMatch(text, /gradient\((?![^)]*paper-rule)/, "no gradient wash (only the name card's ruling)");
  assert.doesNotMatch(text, /blur\(|backdrop-filter/, "no frosted glass");
  assert.doesNotMatch(
    text,
    /border-radius: (?!var\(--kz-card-radius, 0\)|50%)/,
    "square cards; only a round play button",
  );
  assert.doesNotMatch(text, /text-transform: uppercase|letter-spacing: 0\.0\d/, "notes are lower case, untracked");
  assert.doesNotMatch(text, /font-weight: (7|8|9)00/, "no bold display face");
  assert.doesNotMatch(text, /!important/);
  assert.doesNotMatch(
    text,
    /box-shadow: [^;]*\d+px \d+px \d+px \d+px|box-shadow: 0 \d+px \d+px/,
    "solid paper shadows only",
  );
  for (const gone of [
    ".st-ch-meta",
    ".st-ch-n",
    ".st-ch-title",
    ".st-ch-kicker",
    ".st-place",
    ".st-proof-note",
    ".st-film-play",
    ".st-film-caption",
    ".st-take-photo",
  ])
    assert.ok(!cssSelectors(CSS).some((sel) => sel.includes(gone)), `${gone} is dead and gone`);
  // the plate and its caption are the site's, shared with the home's carousels
  for (const file of ["app/components/story/ClipFigure.tsx", "app/components/story/TakeCard.tsx"]) {
    assert.ok(
      jsx(file).some((e) => /rd-plate\b/.test(e.attrs.className ?? "")),
      `${file}: the site's plate`,
    );
    assert.ok(
      jsx(file).some((e) => e.attrs.className === "rd-plate-caption"),
      `${file}: the plate's caption`,
    );
  }
  for (const file of ["app/components/home/ShowcaseStill.tsx"])
    assert.ok(
      jsx(file).some((e) => e.attrs.className === "rd-plate kz-show-stage"),
      `${file}: the home's frames are the same plate`,
    );
  assert.equal(cssDecls("app/globals.css", ".rd-plate")["box-shadow"], "4px 4px 0 var(--kz-border-strong)");
});

test("each chapter wears the right bird, with its promise from the film or the brand reference; no bird twice", () => {
  const map = objectMap("lib/story.ts", "PRODUCT_BIRD");
  assert.deepEqual(map, { sovkora: "duck", verikora: "owl", folioviv: "beaver" });
  assert.deepEqual(Object.keys(map).sort(), [...productIds].sort(), "a bird for every product");
  const who = constString("lib/story.ts", "WHO_BIRD");
  const open = constString("lib/story.ts", "OPEN_BIRD");
  const used = [who, open, ...Object.values(map)];
  assert.equal(new Set(used).size, used.length, "one bird per subject on the page");
  for (const l of ["en", "fr"]) {
    const st = messages(l).story;
    for (const bird of used) assert.ok(st.world.cues[bird] || st.birds[bird], `${l}: the ${bird}'s promise`);
  }
});

test("the film is shown once: its loop is chapter 1's clip, the whole film opens in a lightbox; no player, no autoplay in the text", () => {
  const p = "app/[locale]/story/page.tsx";
  assert.equal(jsxAll(p, "FilmLightbox").length, 1, "the reference film once");
  assert.ok(hasCode(p, "brandFilm()"), "the film slot: « Montrer son travail » (lib/story-film.ts)");
  assert.ok(hasCode(p, "tall: film.tall"), "the vertical cut, when it is on the CDN");
  const tags = jsx(p).map((e) => e.tag);
  assert.ok(!tags.includes("VideoPlayer") && !tags.includes("video"), "no player in the reading column");
  assert.ok(!identifiers(p).has("autoPlay") && !identifiers(p).has("autoplay"), "no autoplay");
  assert.equal(STORY_CLIPS.who.carousel, "hero");
  assert.equal(STORY_CLIPS.who.id, "film", "chapter 1's clip is the film's loop, the home's first slide");
  assert.ok(
    jsxAncestors(p, "FilmLightbox").every((up) => up.includes("StoryChapter")),
    "the lightbox opens from chapter 1",
  );
  const box = "app/components/home/FilmLightbox.tsx";
  assert.ok(jsx(box).some((e) => e.attrs.preload === "none"));
  assert.ok(hasCode(box, "trigger?: ReactNode"));
  for (const l of ["en", "fr"]) {
    const w = messages(l).story.who;
    assert.ok(w.film && w.filmLength && w.filmCredit && w.filmCredits, l);
  }
});

test("the film block shows no captions list and no credits wall: one quiet line, the credits in a dialog", () => {
  assert.doesNotMatch(page, /RELAY_CUES|FAMILY_CUES|relay\.cues/, "captions are never printed as a list");
  assert.doesNotMatch(page, /st\.world\.family\.credit\b/, "no credits paragraph");
  assert.doesNotMatch(page, /summary: st\.who/, "no fold on the founder chapter");
  assert.match(page, /<FilmCredits \/>/);
  assert.doesNotMatch(page, /family\.vtt/, "« crédits » never opens a raw .vtt");
  const fc = read("app/components/story/FilmCredits.tsx");
  assert.match(fc, /@krizaka\/ui\/dialog/, "the credits list opens in the Krizaka UI Dialog");
  for (const l of ["en", "fr"]) assert.ok(messages(l).story.who.creditsList.length >= 5, l);
  for (const l of ["en", "fr"]) assert.ok(messages(l).story.who.filmCredit.length < 50, l);
});

test("a product chapter shows its field's mini-visual (demo data, said so), claims only what runs, and links its site and its source", () => {
  assert.match(page, /<ProductVisual id=\{id\} name=\{p\.name\} \/>/);
  // The visual plays as soon as it is on screen (2026-10-20): no hover host to wire any more.
  assert.match(read("app/components/home/visuals/ProductVisual.tsx"), /const playing = !still && onScreen;/);
  assert.doesNotMatch(page, /data-pv-host/);
  for (const l of ["en", "fr"]) assert.ok(messages(l).story.products.demo, l);
  assert.match(page, /href=\{p\.siteUrl\}/);
});

test("the next chapter is read from the data: planned uses and products in development, never typed", () => {
  assert.match(page, /ENGINE_USES\.filter\(\(u\) => u\.planned\)/);
  assert.match(page, /PRODUCTS\.filter\(\(p\) => p\.status === "development"\)/);
  for (const l of ["en", "fr"]) {
    const n = messages(l).story.next;
    assert.match(n.wire, /\{products\}/);
    assert.match(n.reach, /\{products\}/);
    assert.doesNotMatch(
      JSON.stringify(n),
      /\b20\d\d\b|bientôt|coming soon|waiting list|beta/i,
      `${l}: no date, no promise`,
    );
  }
});

test("the page keeps the rules: no hard-coded text choice by locale, no colour literal in its stylesheet, reduced motion safe", () => {
  assert.doesNotMatch(page, /locale === |isFr/);
  assert.doesNotMatch(css, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|zinc-/, "tokens only");
  assert.doesNotMatch(css, /@keyframes|animation:/, "nothing animates here");
});

test("the arcade stages are gone from /story", () => {
  assert.doesNotMatch(page, /StageBanner|PromiseCard|ScrollStage|ContinuePrompt/);
  for (const l of ["en", "fr"]) assert.equal(messages(l).story.arcade, undefined);
});

// Founder, 2026-11-06 (krizaka-internal#2800): « on vend une émotion, on laisse voir une émotion ». A chapter's face shows
// a clip of the home's carousels, the feeling of the chapter; the name and how we work have none, on purpose.
test("each chapter with a clip names a live slide of a home carousel, its files in the CDN manifest", () => {
  assert.deepEqual(storyClipProblems(has), []);
  assert.deepEqual(Object.keys(STORY_CLIPS), ["who", "engine", "verikora", "folioviv", "open", "next"]);
  const anchors = ["who", "name", "work", "engine", ...productIds, "open", "next"];
  for (const chapter of Object.keys(STORY_CLIPS)) assert.ok(anchors.includes(chapter), `${chapter} is a chapter`);
  assert.equal(STORY_CLIPS.name, undefined, "the name's shots are retired from the carousel: no clip forced");
  assert.equal(STORY_CLIPS.work, undefined, "no live clip shows the work itself: no clip forced");
  // two chapters never share a clip
  const ids = Object.values(STORY_CLIPS).map((c) => `${c.carousel}/${c.id}`);
  assert.equal(new Set(ids).size, ids.length);
  // the words are the carousel's own, in both languages
  for (const l of ["en", "fr"])
    for (const c of Object.values(STORY_CLIPS)) {
      const w = messages(l).home.showcase.slides[c.carousel][c.id];
      assert.ok(w?.caption && w?.alt, `${l}: ${c.carousel}/${c.id} has its caption and its alt`);
    }
});

test("a retired slide or a missing file is refused, and the build throws on it", () => {
  const board = JSON.parse(read("content/films/home-showcase.json"));
  const retired = board.carousels.hero.retired.map((r) => r.id);
  assert.ok(retired.includes("notebook") && retired.includes("ink"), "the name's shots are retired today");
  const missing = storyClipProblems((path) => has(path) && path !== "home/showcase/folioviv/home-wide.webm");
  assert.deepEqual(missing, ["folioviv: home/showcase/folioviv/home-wide.webm is not in the CDN manifest"]);
  assert.deepEqual(clipOf("folioviv"), { carousel: "folioviv", id: "home" });
  assert.equal(clipOf("name"), undefined);
  const figure = "app/components/story/ClipFigure.tsx";
  assert.ok(hasCode(figure, "const problems = storyClipProblems(onCdn);"));
  assert.ok(hasCode(figure, 'throw new Error(`story clips: ${problems.join("; ")}`);'));
  assert.ok(
    hasCode(figure, "video(clipBase(clip))"),
    "the files are read through lib/cdn.ts: an unknown one fails the build",
  );
});

test("a clip is muted, looped, playsinline and lazy, over a poster that reserves 16:9 and carries the alt; still under reduced motion", () => {
  const figure = "app/components/story/ClipFigure.tsx";
  assert.ok(importsFrom(figure, "@krizaka/ui/pausable-loop"), "the loop is @krizaka/ui's PausableLoop");
  const loop = jsxAll(figure, "PausableLoop")[0];
  assert.equal(loop.attrs.poster, "{files.poster}");
  assert.ok(
    hasCode(figure, "labels={{ pause: t.story.clips.pause, play: t.story.clips.play }}"),
    "a visible pause, in words",
  );
  const poster = jsxAll(figure, "Image")[0];
  assert.equal(poster.attrs.src, "{files.poster}");
  assert.equal(poster.attrs.alt, "{words.alt}", "the poster carries the text alternative");
  assert.equal(poster.attrs.width, "{1280}");
  assert.equal(poster.attrs.height, "{720}");
  assert.equal(cssDecls(CSS, ".st-clip-plate")["aspect-ratio"], "16 / 9", "no layout shift");
  assert.equal(cssDecls(CSS, ".st-clip-media")["object-fit"], "cover");
  // muted, looped, playsinline, paused off screen and still under reduced motion are PausableLoop's own contract, tested in
  // krizaka-ui (a product never tests the library); the PR's browser run shows no <video> under reduced motion.
  for (const l of ["en", "fr"]) assert.ok(messages(l).story.clips.pause && messages(l).story.clips.play, l);
  // the caption is the home's figure line
  assert.ok(hasCode(figure, "format(t.home.showcase.labels.figure, { fig: String(fig), caption: words.caption })"));
});

test("each product keeps its real take one step deeper: a poster in the fold that plays on click in a lightbox", () => {
  const takes = read("lib/story-takes.ts");
  const ids = ["sovkora", "verikora", "folioviv"];
  for (const id of ids) assert.match(takes, new RegExp(`\\n  ${id}: \\{\\s*ratio:`), `${id} has a take`);
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
  // the face is the clip; the take goes in the fold, and the mini-visual only when there is neither
  assert.ok(hasCode(PAGE, "clip(id) ?? take ?? ("), "clip, then take, then mini-visual");
  assert.ok(hasCode(PAGE, "{clipOf(id) && take}"), "with a clip on the face, the take is in the fold");
  assert.ok(hasCode(PAGE, "{takeProof(ENGINE, engine.name)}"), "the engine's take, in its fold");
  assert.match(css, /\.st-take-card \{[^}]*width: 168px[^}]*aspect-ratio: 9 \/ 16/, "a fixed small phone frame");
  for (const l of ["en", "fr"])
    for (const k of ["watch", "close", "player", "inLang", "watchRender", "renderPlayer"])
      assert.ok(messages(l).story.products.take[k], `${l}: take.${k}`);
});

// The birds of /story (bug 2026-10-20: « Le faucon veille » wore a blue bird that read as the pigeon). A chapter's bird
// is drawn in ITS OWN colours (tone="own", as in the film and on /contact) — in the page's brand tone every bird took the
// same blue — and each bird carries the promise it is cast for (brand reference: the falcon watches, the owl reads, the
// duck builds, the flamingo answers and the payment follows, the pigeon delivers).
const BIRD_WORD = {
  en: { falcon: "falcon", owl: "owl", duck: "duck", flamingo: "flamingo", pigeon: "pigeon" },
  fr: { falcon: "faucon", owl: "hibou", duck: "canard", flamingo: "flamant", pigeon: "pigeon" },
};
const PROMISE = {
  falcon: /watch|veille/i,
  owl: /read|lit /i,
  duck: /build|construit/i,
  flamingo: /answer|répond/i,
  pigeon: /deliver|livre/i,
};

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

test("the chapters cast the right birds: falcon for who we are, pigeon for open source (it delivers: releases to npm and Maven Central), one bird per subject", () => {
  assert.match(story, /WHO_BIRD: StoryBird = "falcon"/);
  assert.match(story, /OPEN_BIRD: StoryBird = "pigeon"/);
  const cast = Object.fromEntries([...story.matchAll(/^\s+(\w+): "(\w+)",$/gm)].map((m) => [m[1], m[2]]));
  assert.equal(cast.sovkora, "duck", "the engine builds (2026-10-30: the duck is Sovkora's everywhere)");
  assert.equal(cast.verikora, "owl", "Verikora reads documents");
  assert.equal(cast.folioviv, "beaver", "Folioviv builds the shop's books");
  const birds = [...Object.values(cast), "falcon", "pigeon"];
  assert.equal(new Set(birds).size, birds.length, "never the same bird twice on the page");
  assert.match(
    page,
    /bird=\{WHO_BIRD\}\s+promise=\{promiseOf\(t, WHO_BIRD\)\}/,
    "the who chapter's promise is its own bird's",
  );
  assert.match(page, /bird=\{PRODUCT_BIRD\.sovkora\}\s+promise=\{promiseOf\(t, PRODUCT_BIRD\.sovkora\)\}/);
  assert.match(page, /promise=\{promiseOf\(t, bird\)\}/);
});

test("the own palettes of the birds are distinct (the falcon is orange, not the pigeon's blue)", async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const React = (await import("react")).default;
  const { Mascot } = await import("@krizaka/ui/mascots");
  const fills = (bird) =>
    new Set(
      [
        ...renderToStaticMarkup(
          React.createElement(Mascot, { bird, mood: "success", size: 44, animated: false, tone: "own" }),
        ).matchAll(/#[0-9a-f]{6}/gi),
      ].map((m) => m[0].toLowerCase()),
    );
  const f = fills("falcon");
  const p = fills("pigeon");
  assert.ok(f.has("#ff9f00") && !p.has("#ff9f00"), "the falcon wears its orange");
  assert.ok(p.has("#22d3ee") && !f.has("#22d3ee"), "the pigeon wears its cyan-indigo");
});

// Story peer review (2026-10-21): one strong medium per chapter, captions in both languages, a film slot for the reference film.
import { takeVtt } from "../lib/take-captions.ts";
// lib/story-takes.ts reads the CDN manifest (a JSON import): the test reads its source.
const TAKE_PRODUCTS = Object.keys(objectMap("lib/story-takes.ts", "SPECS"));
import { BRAND_FILM, hasTallCut, prefersStill } from "../lib/brand-film.ts";
import { STORY_CLIPS, clipOf, storyClipProblems } from "../lib/story-clips.ts";
import {
  PRODUCT_RECORDS,
  constString,
  cssDecls,
  cssHas,
  cssSelectors,
  cssText,
  hasCode,
  identifiers,
  importsFrom,
  jsx,
  jsxAll,
  jsxAncestors,
  objectMap,
  strings,
} from "./helpers/source.mjs";

test("every take has its captions in both languages, one line per cue, cues in order inside the take", () => {
  const specs = objectMap("lib/story-takes.ts", "SPECS");
  for (const id of TAKE_PRODUCTS) {
    assert.ok(specs[id]?.cues, `${id}: cues`);
    const cues = JSON.parse(specs[id].cues);
    cues.forEach(([a, b], i) => {
      assert.ok(a < b, `${id} cue ${i}`);
      if (i) assert.ok(cues[i - 1][1] <= a, `${id} cue ${i} overlaps`);
    });
    for (const l of ["en", "fr"]) {
      const words = messages(l).story.products.take.captions[id];
      assert.equal(words.length, cues.length, `${l} ${id}: one line per cue`);
      assert.ok(
        words.every((w) => w.trim()),
        `${l} ${id}: no empty line`,
      );
    }
  }
  const vtt = takeVtt(
    [
      [0, 6],
      [6.5, 11],
    ],
    ["One", "Two"],
  );
  assert.equal(vtt, "WEBVTT\n\n00:00:00.000 --> 00:00:06.000\nOne\n\n00:00:06.500 --> 00:00:11.000\nTwo\n");
});

test("the captions route serves each take's lines same-origin and the player lists both languages", () => {
  const route = read("app/[locale]/story/captions/[take]/route.ts");
  assert.match(route, /text\/vtt/);
  assert.match(route, /force-static/);
  assert.match(read("app/components/story/TakeCard.tsx"), /\/story\/captions\/\$\{id\}/);
});

test("the engine shows its web client answering (a persona, not the Old Port scene)", () => {
  const sovkora = objectMap("lib/story-takes.ts", "SPECS").sovkora;
  assert.equal(sovkora.ratio, "wide");
  assert.equal(sovkora.mp4, "products/sovkora/home/take-{l}-dark.mp4");
  const words = strings("lib/story-takes.ts").join("\n");
  assert.doesNotMatch(words, /old-port/, "the generated Old Port scene is no longer the engine's take");
  assert.doesNotMatch(words, /take-full|moment-fr-phone/);
  assert.equal(
    read("lib/cdn-manifest.json").includes("take-full"),
    false,
    "the 3-minute walkthrough is out of the manifest",
  );
  assert.ok(TAKE_PRODUCTS.includes("sovkora"));
});

test("no take names Sovkora as the one doing a product's job", () => {
  const caps = messages("en").story.products.take.captions;
  for (const id of Object.keys(caps).filter((k) => k !== "sovkora"))
    assert.doesNotMatch(caps[id].join(" "), /Sovkora/, id);
  assert.doesNotMatch(JSON.stringify(caps), /\bQA\b/);
});

// The founder approved « Montrer son travail » on 2026-11-01 (krizaka-internal#138): it replaces every other film.
test("the brand film slot reads « Montrer son travail » from the CDN manifest; the vertical cut joins once its files are there", () => {
  const { files } = JSON.parse(read("lib/cdn-manifest.json"));
  assert.match(BRAND_FILM.base, /^brand-films\/montrer-son-travail\//);
  for (const ext of ["webm", "mp4", "jpg"])
    assert.match(
      files[`${BRAND_FILM.base}.${ext}`] ?? "",
      /^[0-9a-f]{10}$/,
      `${BRAND_FILM.base}.${ext} is in the manifest`,
    );
  const slot = read("lib/story-film.ts");
  assert.match(slot, /video\(BRAND_FILM\.base\)/, "the slot resolves the manifest entry through lib/cdn.ts");
  assert.match(
    slot,
    /hasTallCut\(onCdn\)\s*\? \{ mp4: cdn\(`\$\{BRAND_FILM\.tallWeb\}\.mp4`\), poster: cdn\(`\$\{BRAND_FILM\.tall\}\.jpg`\) \}\s*: undefined/,
  );
  assert.doesNotMatch(slot, /FAMILY_BASE|FILM_BASE|RELAY_BASE|family\.vtt|relay\.vtt/, "no retired film in the slot");
  // the vertical cut: absent until both its files are recorded
  assert.equal(
    hasTallCut(() => false),
    false,
  );
  assert.equal(
    hasTallCut((p) => p === `${BRAND_FILM.tallWeb}.mp4`),
    false,
    "a cut without its poster waits",
  );
  assert.equal(
    hasTallCut((p) => [`${BRAND_FILM.tallWeb}.mp4`, `${BRAND_FILM.tall}.jpg`].includes(p)),
    true,
  );
  assert.equal(
    hasTallCut((p) => Boolean(files[p])),
    Boolean(files[`${BRAND_FILM.tallWeb}.mp4`] && files[`${BRAND_FILM.tall}.jpg`]),
  );
  // every slot plays it: the home's hero carousel (its loop, content/films/home-showcase.json, krizaka-internal#2450, with a
  // link to the watch page), /story, the watch page
  assert.match(read("content/films/home-showcase.json"), /montrer-son-travail-loop\./);
  assert.match(read("app/components/home/Showcase.tsx"), /\/films\/\$\{BRAND_FILM\.id\}/);
  assert.match(page, /const film = brandFilm\(\);/);
  assert.match(read("lib/watch-films.ts"), /base: BRAND_FILM\.base/);
  for (const file of [
    "app/components/home/HomeHero.tsx",
    "app/[locale]/story/page.tsx",
    "app/components/home/FilmLightbox.tsx",
  ])
    assert.doesNotMatch(read(file), /FAMILY_BASE|FILM_BASE|codeFilm|fallback=/, `${file}: no other film`);
});

test("reduced motion or Save-Data: the film waits on its poster (no autoplay)", () => {
  const media = (reduce) => (q) => ({ matches: reduce && q.includes("reduce") });
  assert.equal(prefersStill({ matchMedia: media(false), navigator: {} }), false);
  assert.equal(prefersStill({ matchMedia: media(true), navigator: {} }), true);
  assert.equal(prefersStill({ matchMedia: media(false), navigator: { connection: { saveData: true } } }), true);
  assert.equal(prefersStill({}), false);
  const box = read("app/components/home/FilmLightbox.tsx");
  assert.match(box, /setStill\(prefersStill\(window\)\)/);
  assert.match(box, /autoPlay=\{!still\}/);
  assert.match(box, /poster=\{play\.poster\}/);
  assert.doesNotMatch(box, /pauseWhenHidden=\{false\}/, "the player pauses off screen (its default)");
});

// Taped prints (2026-10-23): every picture or video of /story sits in @krizaka/ui's TapedPhoto — the film poster, each
// product's take — with a slight tilt that alternates; the diagrams (the engine flow, the mini-visuals) stay as they are.
// Founder, 2026-11-06 (krizaka-internal#2800): the taped, tilted prints give way to the site's plates (the home's figures):
// every picture or video of /story is a figure on a plate, with its caption under it; the diagrams stay as they are.
test("every picture of /story is a figure on the site's plate: the clips, the takes; no taped print, no tilt", () => {
  const take = "app/components/story/TakeCard.tsx";
  const clipFile = "app/components/story/ClipFigure.tsx";
  for (const file of [PAGE, take, clipFile]) {
    assert.ok(!importsFrom(file, "@krizaka/ui/taped-photo"), `${file}: no taped print`);
    assert.ok(!identifiers(file).has("tilt") && !identifiers(file).has("lean"), `${file}: no tilt`);
  }
  assert.equal(jsxAll(PAGE, "Image").length, 0, "the page draws no picture of its own: ClipFigure and TakeCard do");
  assert.ok(jsx(take).some((e) => e.tag === "figure") && jsx(take).some((e) => e.tag === "figcaption"));
  assert.ok(jsx(clipFile).some((e) => e.tag === "figure") && jsx(clipFile).some((e) => e.tag === "figcaption"));
  // the diagrams are never on a plate
  for (const tag of ["EngineFlowView", "ProductVisual", "ProductLogo"])
    for (const up of jsxAncestors(PAGE, tag)) assert.ok(!up.includes("ClipFigure"), `${tag} is not framed`);
  // the take's focus ring is outside the plate, never clipped by its picture
  assert.equal(cssDecls(CSS, ".st-take-card:focus-visible")["outline-offset"], "2px");
  assert.doesNotMatch(cssText(CSS), /clip-path/i);
});

// 2026-10-26 (Oussama: « aligne les photos ou vidéos une fois à droite et une fois à gauche pour que ça fasse histoire »):
// the chapters' picture alternates sides, in CSS and from the chapter's number; one column on a phone.
test("the chapters' figures alternate sides: right, left, right…, with CSS only, one column below 1100px", () => {
  const chapterFile = "app/components/story/StoryChapter.tsx";
  assert.ok(hasCode(chapterFile, 'sideOf = (number: number): "right" | "left" => (number % 2 ? "right" : "left")'));
  assert.ok(jsx(chapterFile).some((e) => e.attrs["data-side"] === "{sideOf(number)}"));
  const desktop = { within: "(min-width: 1100px)" };
  const proof = '.st-ch[data-side="left"] .st-ch-proof';
  assert.equal(
    cssDecls(CSS, ".st-ch-grid", desktop)["grid-template-columns"],
    "minmax(0, 1fr) minmax(0, 1fr)",
    "the figure takes half the width, like the home's plates",
  );
  assert.equal(cssDecls(CSS, proof, desktop).order, "-1");
  assert.ok(!cssHas(CSS, proof), "a phone keeps the one column and the same order");
  assert.ok(!jsx(PAGE).some((e) => /(order|direction|gridTemplate)/.test(e.attrs.style ?? "")), "no inline layout");
});

// Founder, 2026-11-01 (krizaka-internal#138): /story is Krizaka's story, the company's. The blog is the founder's personal
// blog about how he builds: /story never links to it, in any language.
test("/story never links to the founder's blog (blog.krizaka.com)", () => {
  assert.doesNotMatch(page, /BLOG_URL|blogChapterUrl|BLOG_CHAPTER|readOn\(/, "no blog link on the page");
  assert.doesNotMatch(story, /BLOG_URL|blogChapterUrl|BLOG_CHAPTER/, "lib/story.ts maps no blog chapter");
  for (const l of ["en", "fr"]) {
    const st = messages(l).story;
    assert.equal(st.blog, undefined, `${l}: no blog chapter titles`);
    assert.doesNotMatch(
      JSON.stringify(st),
      /blog\.krizaka\.com|blogue|\bblog\b/i,
      `${l}: the story's words name no blog`,
    );
  }
  for (const file of [
    "app/[locale]/story/page.tsx",
    "app/components/story/StoryChapter.tsx",
    "app/components/story/FilmCredits.tsx",
  ])
    assert.doesNotMatch(read(file), /blog\.krizaka\.com|BLOG_URL/, file);
});

// Only Sovkora, Verikora and Folioviv are in focus; the rule `no-departed-product` (krizaka/.github#413) proves no other name is left.
test("/story lists only the products in focus", () => {
  assert.deepEqual(
    [...productIds].sort(),
    ["folioviv", "sovkora", "verikora"],
    "lib/products.ts lists only the products in focus",
  );
});

// Founder, 2026-11-06 (krizaka-internal#2648): the story tells where the name comes from, in the founders' plural, with no
// first or last name (tests/no-founder-name.test.mjs): The King of Fighters and the arcade halls as a memory, never a
// brand claim (no logo, no character, no image from the game), and « korassa » (كراسة), the notebook behind the Cahier.
test("the name chapter tells The King of Fighters and « korassa » (كراسة), in the founders' plural, in both languages", () => {
  const plural = { fr: /\bdes fondateurs\b/, en: /\bthe founders\b/ };
  const notebook = { fr: /cahier/, en: /notebook/ };
  for (const l of ["en", "fr"]) {
    const n = messages(l).story.name;
    const text = n.passage.join(" ");
    assert.match(text, /The King of Fighters/, `${l}: the arcade memory`);
    assert.match(text, /arcade/, `${l}: the arcade halls`);
    assert.match(text, /korassa/, `${l}: the word heard in the name`);
    assert.match(text, /<b>كراسة<\/b>/, `${l}: the Arabic word, marked for its language`);
    assert.match(text, notebook[l], `${l}: the notebook`);
    assert.match(text, plural[l], `${l}: the founders, in the plural`);
    assert.doesNotMatch(text, /\b(je|j'|mon|ma|I|my)\b/, `${l}: never a first person singular`);
    assert.equal(n.card.arabic, "كراسة");
    assert.ok(n.passage.length <= 3, `${l}: a short passage`);
  }
  const arabic = jsx(PAGE).filter((e) => e.attrs.lang === "ar");
  assert.deepEqual(
    arabic.map((e) => [e.tag, e.attrs.dir, e.attrs.className]),
    [
      ["span", "rtl", "st-ar"],
      ["p", "rtl", "st-name-ar"],
    ],
    "the Arabic, in the passage and on the card, is read as Arabic, right to left",
  );
  assert.ok(
    !jsx(PAGE).some((e) => e.tag === "Image" && /king|kof|arcade/i.test(JSON.stringify(e.attrs))),
    "no image of the game",
  );
});

test("the work chapter says how we work from the facts: lanes, the board, the trains, the matrix, the crack, the speed measured", () => {
  assert.ok(hasCode("lib/story.ts", 'WORK_STEPS = ["board", "lane", "pr", "train", "matrix"] as const'));
  assert.match(page, /<ol className="st-work-steps">/, "the path is an ordered list: its own text version");
  const words = {
    fr: [
      /une voie par produit/i,
      /tableau/,
      /train/,
      /matrice/i,
      /déterministe/,
      /crack/,
      /pompier/,
      /vitesse/,
      /8 novembre 2026/,
    ],
    en: [
      /one lane per product/i,
      /board/,
      /train/,
      /matrix/i,
      /deterministic/,
      /crack/,
      /firefighter/,
      /speed/,
      /November 8, 2026/,
    ],
  };
  for (const l of ["en", "fr"]) {
    const w = messages(l).story.work;
    assert.deepEqual(Object.keys(w.steps), ["board", "lane", "pr", "train", "matrix"], l);
    const text = JSON.stringify(w);
    for (const rx of words[l]) assert.match(text, rx, `${l}: ${rx}`);
    assert.doesNotMatch(text, /\d+ ?%/, `${l}: no percentage on the page (the first measure is on 2026-11-08)`);
  }
});

test("each product says the home's line and status: the same messages and data, Kridoc from the products in conception", () => {
  assert.match(page, /<p>\{h\.cards\[id\]\.line\}<\/p>/, "a product chapter's line is the home card's");
  assert.match(page, /\{t\.site\.home\.engine\.line\}/, "the engine says the home's line");
  assert.match(page, /<ProductStatus status=\{p\.status\} t=\{t\} \/>/, "the status is the product's data");
  assert.match(page, /const board: Status\[\] = \["devPreview", "development", "construction", "paused"\];/);
  assert.match(page, /IN_DESIGN\.map\(\(p\) =>/, "Kridoc is read from lib/products-in-design.ts");
  assert.match(page, /t\.site\.home\.products\.inDesign\.lines\[p\.id\]/);
  assert.match(
    page,
    /\.filter\(\(u\) => product\(u\.id\)\.status !== "paused"\)/,
    "no planned use promised to a paused product",
  );
  for (const l of ["en", "fr"])
    assert.equal(messages(l).story.products.lines, undefined, `${l}: no second product line`);
});

test("the new words of /story carry no em dash or en dash", () => {
  for (const l of ["en", "fr"]) {
    const st = messages(l).story;
    for (const [k, v] of Object.entries({ intro: st.intro, who: st.who, name: st.name, work: st.work, next: st.next }))
      assert.doesNotMatch(JSON.stringify(v), /[\u2014\u2013]/, `${l}: ${k}`);
  }
});

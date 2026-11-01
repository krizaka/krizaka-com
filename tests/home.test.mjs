import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { HOME_SECTIONS, folioOf } from "../lib/home-sections.ts";
import {
  calls,
  constString,
  cssDecls,
  exportedNames,
  hasCode,
  identifiers,
  importsOf,
  jsx,
  jsxAll,
  records,
  strings,
} from "./helpers/source.mjs";

// The home is one of the site's two views (Oussama, 2026-10-17; the other is Open source): the centred hero, the products
// (Orazaka the foundation, the products it powers — the only place they are presented), the open-source stack in brief,
// the principles in brief (Montréal and the closing contact left on 2026-10-22: /story is in the footer, Contact us in the bar). No product is pitched, nothing links to the old /docs.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const HOME = "app/[locale]/page.tsx";
const SECTIONS = ["HomeHero", "ProductShowcase", "Principles"]; // the files
const ORDER = ["HomeHero", "EngineSection", "ProductShowcase", "Principles"]; // the tags, in the story's order

test("the home is made of its four sections, in Oussama's order: no Company, no closing contact panel, no FAQ", () => {
  const home = read(HOME);
  assert.doesNotMatch(home, /<Company\b|<ContactCta\b|<ProductFaq\b|section-backdrop/, "§ 5, § 6 and the FAQ are gone");
  assert.ok(!existsSync(new URL("../app/components/ProductFaq.tsx", import.meta.url)), "ProductFaq came back");
  for (const f of ["Company", "ContactCta"])
    assert.ok(!existsSync(new URL(`../app/components/home/${f}.tsx`, import.meta.url)), `${f} came back`);
  const order = ORDER.map((s) => {
    const at = home.search(new RegExp(`<${s}\\b`));
    assert.ok(at > 0, s);
    return at;
  });
  assert.deepEqual(
    order,
    [...order].sort((a, b) => a - b),
    "hero → engine → products → principles (the libraries live on /open-source)",
  );
});

test("one primary action per section: the hero's goes to #engine", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.equal(hero.match(/variant="primary"/g)?.length, 1);
  assert.match(hero, /href="#engine" variant="primary"/);
  assert.doesNotMatch(hero, /href="\/contact"/, "the bar has Contact us: no duplicate in the hero");
});

test("the hero: text painted at once, the figures read at build and climbing", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.doesNotMatch(hero, /"use client"/, "the hero's text is server-rendered (LCP)");
  assert.doesNotMatch(hero, /data-reveal|reveal\(/, "nothing on the first screen is revealed");
  assert.match(hero, /<NumberTicker value=\{p\.value\}/);
  assert.doesNotMatch(
    hero.slice(hero.indexOf("kz-home-proofs"), hero.indexOf("</dl>")),
    /kz-intro-deco/,
    "the figures are never hidden by the intro",
  );
});

test("the products come from lib/products.ts: one card each, in the product's brand", () => {
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.match(showcase, /PRODUCTS\.filter|heroMarkOrder\(PRODUCTS\)/);
  assert.match(
    showcase,
    /<li\s+id=\{"product-" \+ p\.id\}\s+className=\{cn\("kz-entry", "brand-" \+ p\.id\)\}/,
    "each product is an anchor the hero's marks reach, in its brand",
  );
  assert.match(
    showcase,
    /tone: STAMP\[p\.status\]/,
    "the status is the data's (gated by the dev-preview checklists), stamped",
  );
  assert.equal(
    showcase.match(/<SpecimenTag\b/g)?.length,
    2,
    "the products wear the specimen tag, and so does the engine (KZ-01): one language",
  );
  assert.doesNotMatch(showcase, /knowhow|kz-pc-meta/, "one label per product: no mono eyebrow beside the status");
  assert.match(
    showcase,
    /mark: <ProductLogo id=\{p\.id\} size=\{\d+\} animated=\{false\} \/>/,
    "the mark sits beside the name on the tag, never over the visual",
  );
  assert.match(showcase, /href: p\.siteUrl/, "a card links the product's www site (dev is exposed there; 2026-10-26)");
  for (const s of SECTIONS) {
    const src = read(`app/components/home/${s}.tsx`);
    assert.doesNotMatch(src, /["'](orazaka|yomizaka|akinaza)["']/, `${s} names a product by hand`);
    assert.doesNotMatch(src, /brand-(orazaka|yomizaka|akinaza)/, `${s} paints one product's brand`);
  }
});

test("the home never links to the documentation that moved to ui.krizaka.com and java.krizaka.com", () => {
  for (const s of SECTIONS) assert.doesNotMatch(read(`app/components/home/${s}.tsx`), /["'`]\/docs/, s);
});

test("the old home — the product showcase, the kit gallery, the rotating title — is gone", () => {
  for (const file of [
    "app/components/home/OrgHero.tsx",
    "app/components/home/KitShowcase.tsx",
    "app/components/home/BuildWithKrizaka.tsx",
    "app/components/home/WhatWeBuild.tsx",
    "lib/kit-live.ts",
    "lib/build-with.ts",
    "lib/cli-model.ts",
  ]) {
    assert.ok(!existsSync(new URL(`../${file}`, import.meta.url)), `${file} came back`);
  }
  for (const lang of ["en", "fr"]) {
    const m = messages(lang).site;
    assert.deepEqual(
      Object.keys(m.home),
      ["hero", "engine", "products", "stack", "services", "direction", "principles", "visuals"],
      `${lang}: site.home`,
    );
    assert.equal(m.expertise, undefined, `${lang}: site.expertise`);
  }
});

// krizaka/.github#413: the conformance rule `no-departed-product` proves the names are gone; the home keeps no FAQ.
test("no FAQ comes back", () => {
  for (const lang of ["en", "fr"]) assert.equal(messages(lang).site.faq, undefined, `${lang}: site.faq`);
});

// 2026-10-20 (the coordinator's decisions): the hero puts the products forward — a quiet row of the seven marks, each a
// link to its card, the ones not offered yet dimmed — and its lead names what they are for; no new media (LCP).
test("the hero's row of product marks: from lib/products.ts, each to its card, dimmed when nothing is offered yet", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.match(hero, /<ul className="kz-home-marks" aria-label=\{t\.marksLabel\}>/);
  assert.match(hero, /heroMarkOrder\(PRODUCTS\)\.map\(\(p\) =>/);
  assert.match(hero, /href=\{`#product-\$\{p\.id\}`\}/);
  assert.match(hero, /<ProductLogo id=\{p\.id\} size=\{30\} animated=\{false\} \/>/);
  assert.match(hero, /DIM: readonly ProductStatus\[\] = \["construction", "upcoming"\]/);
  assert.doesNotMatch(hero, /<video|<img/, "the ambient scene remains lazy and does not add eagerly loaded media");
  assert.match(hero, /<AmbientLoop set=\{VALLEY\} \/>/);
  assert.ok(
    hero.indexOf("kz-home-actions") < hero.indexOf("kz-home-marks") &&
      hero.indexOf("kz-home-marks") < hero.indexOf("kz-home-proofs"),
    "under the actions, above the figures",
  );
  for (const lang of ["en", "fr"]) {
    const h = messages(lang).site.home.hero;
    assert.ok(h.marksLabel, `${lang}: hero.marksLabel`);
    assert.ok(h.lead.length < 240, `${lang}: the lead stays one sentence`);
  }
});

test("the hero uses the shared taped flock photo and keeps all five film promises accessible", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.match(hero, /from "@krizaka\/ui\/taped-photo"/);
  assert.match(hero, /<TapedPhoto[^>]*caption=\{t\.plate\.title\}/);
  assert.doesNotMatch(hero, /BirdPlate/);
  assert.match(hero, /<Flock[^>]*scenes/);
  assert.match(hero, /FILM_CAST\.map/);
  assert.match(hero, /promise: cues\[bird\]/);
  assert.match(hero, /className="sr-only"/);
  assert.match(hero, /cueBirds\.map/);
  assert.match(hero, /HERO_FLOCK/);
  assert.ok(
    hero.indexOf("kz-home-actions") < hero.indexOf("<TapedPhoto"),
    "the photo follows the first-paint text and actions",
  );
  for (const lang of ["en", "fr"]) {
    const cues = messages(lang).site.story.world.cues;
    for (const bird of ["falcon", "owl", "duck", "flamingo", "pigeon"])
      assert.ok(cues[bird], `${lang}: ${bird} promise`);
  }
});

// « Build with our open source » (2026-10-20): the stack put forward and playable — Krizaka UI's real components,
// Krizaka Lab's flow with two of the lab's settings, Krizaka Java's BOM — every version and figure read at build.
test("the open-source section: three playable tiles, versions and downloads read at build, one primary action", () => {
  const stack = read("app/components/home/OpenStack.tsx");
  assert.match(stack, /<UiShowcase/);
  assert.match(stack, /<MotionPlayground/);
  assert.match(stack, /<CodeTabs/);
  assert.match(stack, /npmDownloads\(ui\.coordinate\)/);
  assert.match(stack, /mavenVersion\("krizaka-bom"\)/);
  assert.match(stack, /publishedVersion\(ui\.coordinate\)/);
  assert.doesNotMatch(stack, /\d+\.\d+\.\d+/, "no version typed by hand");
  // Krizaka UI's picture (Oussama, 2026-10-23): one real composition of the kit — a card with an avatar, a meter, a row
  // of chips, a switch and a button — never a row of button variants, never a chart of its own.
  const ui = read("app/components/home/playground/UiShowcase.tsx");
  for (const piece of [
    "@krizaka/ui/avatar",
    "@krizaka/ui/button",
    "@krizaka/ui/card",
    "@krizaka/ui/chip",
    "@krizaka/ui/meter",
    "@krizaka/ui/switch",
  ])
    assert.match(ui, new RegExp(piece), piece);
  assert.doesNotMatch(ui, /@krizaka\/charts|Sparkline|variant="(secondary|ghost)"/, "no chart, no row of variants");
  assert.match(
    ui,
    /<CardRoot[^>]*role="img" aria-label=\{w\.label\} inert/,
    "the composed piece is an inert picture, named for assistive technology",
  );
  assert.doesNotMatch(
    ui,
    /Card\.Root|Card\.Body|Chip\.Group/,
    "a Server Component imports the named components: a compound's property is undefined through a client reference",
  );
  assert.match(
    ui,
    /<figcaption className="kz-showcase-caption">\{w\.downloads\}/,
    "the real figure line stays outside the picture, so it is read",
  );
  assert.doesNotMatch(ui, /onValueChange|onCheckedChange|onClick/, "a still picture: nothing to operate");
  assert.doesNotMatch(
    ui,
    /"use client"|var\(--kz|#[0-9a-f]{3,6}\b/i,
    "published components only, no colour of its own",
  );
  for (const lang of ["en", "fr"]) {
    const w = messages(lang).site.home.stack.ui.showcase;
    assert.deepEqual(
      Object.keys(w),
      ["label", "person", "meter", "teams", "digest", "invite"],
      `${lang}: showcase words`,
    );
    assert.equal(w.teams.items.length, 3, `${lang}: three chips`);
    assert.equal(messages(lang).site.home.stack.ui.trend, undefined, `${lang}: no sparkline words left`);
  }
  const motion = read("app/components/home/playground/MotionPlayground.tsx");
  assert.match(motion, /from "@krizaka\/ui\/engine-flow"/);
  assert.match(motion, /FLOW_LAYOUTS/);
  assert.match(motion, /FLOW_MODES/);
  assert.match(motion, /calm=\{calm\}/, "the home's preview is EngineFlow's calm level, not a still frame");
  assert.doesNotMatch(
    motion,
    /particles=\{still|breathe=\{still/,
    "no still override: the photons and the breath run at the calm rate",
  );
  for (const lang of ["en", "fr"]) {
    const s = messages(lang).site.home.stack;
    for (const k of ["ui", "motion", "java"]) assert.ok(s[k], `${lang}: stack.${k}`);
    assert.deepEqual(Object.keys(s.motion.layouts), ["radial", "top-to-bottom", "left-to-right"]);
    assert.deepEqual(Object.keys(s.motion.modes), ["in", "out", "both"]);
  }
});

test("Akinaza is for studios, salons and the self-employed, one short human line, never « compliant » (until a lawyer validates)", () => {
  for (const lang of ["en", "fr"]) {
    const text = JSON.stringify(messages(lang), (k, v) => v)
      .split("\n")
      .join(" ");
    const akinaza = [...text.matchAll(/"akinaza":\{[^{}]*\}|"akinaza":"[^"]*"/g)].map((m) => m[0]).join(" ");
    assert.doesNotMatch(akinaza, /conforme|conformité|compliant|compliance|complies/i, lang);
    assert.doesNotMatch(akinaza, /bakeries|boulangeries/i, `${lang}: no on-site consumption businesses`);
  }
  const en = JSON.stringify(messages("en")),
    fr = JSON.stringify(messages("fr"));
  // The card speaks to the customer's day, in one short line: no law as a headline, never an « OS » (Oussama, 2026-10-22).
  for (const [lang, m] of [
    ["en", messages("en")],
    ["fr", messages("fr")],
  ]) {
    const line = m.site.products.cards.akinaza.line;
    assert.ok(line.length <= 60, `${lang}: one short line`);
    assert.doesNotMatch(line, /Loi 25|Loi 96|\bOS\b/, lang);
  }
  assert.match(en, /Your appointments, invoices and taxes, sorted/);
  assert.match(fr, /Vos rendez-vous, vos factures et vos taxes, réglés/);
});

// The numbers in the margin and the folios come from the section list, never typed (2026-10-22: § 5 and § 6 removed).
test("the section list is the home's six sections, in the honest order; the numbers and the folio are derived from it", () => {
  assert.deepEqual([...HOME_SECTIONS], ["hero", "engine", "products", "services", "direction", "principles"]);
  assert.deepEqual(folioOf("principles"), { page: 6, total: 6 });
  assert.deepEqual(folioOf("hero"), { page: 1, total: 6 });
  for (const lang of ["en", "fr"]) {
    const h = messages(lang).site.home;
    assert.match(h.principles.folio, /\{page\}.*\{total\}/, `${lang}: the folio is a template, not typed digits`);
    HOME_SECTIONS.forEach((id, i) => assert.equal(h[id].number, `§ ${i + 1}`, `${lang}: ${id}`));
  }
  assert.match(read("app/components/home/Principles.tsx"), /format\(p\.folio, folioOf\("principles"\)\)/);
});

// 2026-10-22 (Oussama): Akinaza and Yomizaka are presented as one need — « gestion et conformité » — in the hero's lead and
// the products section, without the word « intelligent » (Akinaza's own rule: no AI wording for its product).
test("the duo is named by its need: management and compliance tools", () => {
  const want = { en: /management and compliance tools/, fr: /outils de gestion et de conformité/ };
  for (const lang of ["en", "fr"]) {
    const h = messages(lang).site.home;
    assert.match(h.hero.lead, want[lang], `${lang}: hero.lead`);
    assert.match(h.hero.lead, /Folioviv/);
    assert.match(h.hero.lead, /Verikora/);
    assert.match(h.products.title, want[lang], `${lang}: products.title`);
    assert.doesNotMatch(`${h.products.title} ${h.products.lead}`, /intelligen/i);
  }
});

// 2026-10-22 (Oussama): /open-source and /story show the stack as four full cards (UI, Motion, Java, TS), each with
// something to try or to copy; Java's dependency and TS's install command have a copy button. The home no longer shows the
// libraries (2026-10-26): /open-source is their one place.
test("the full stack cards: one component on /open-source and /story, with Java and TS to copy", () => {
  const stack = "app/components/home/OpenStack.tsx";
  assert.ok(exportedNames(stack).includes("StackTiles"));
  assert.ok(hasCode(stack, "npmPackagesFrom(ts.repoUrl)"), "TS's packages read at build, never typed");
  assert.ok(
    jsx(stack).some((e) => e.attrs.code === "{install}" && "copyLabel" in e.attrs),
    "the TS install command can be copied",
  );
  assert.ok(
    jsx(stack).some((e) => e.attrs.file === "pom.xml" && "copyLabel" in e.attrs),
    "the Java dependency can be copied",
  );
  assert.ok(
    importsOf(stack).some((i) => i.sideEffect && i.from === "./stack-tiles.css"),
    "the tiles carry their own styles to every page",
  );
  const ids = identifiers(stack);
  assert.ok(!ids.has("LinkCard") && !ids.has("StackCards"));
  for (const page of ["app/[locale]/story/page.tsx"]) assert.ok(hasCode(page, "<StackTiles locale={locale} />"), page);
  assert.ok(
    jsx(stack).some(
      (e) => e.tag === "CardGrid" && e.attrs.as === "ul" && e.attrs.min === "{420}" && e.attrs.columns === "{2}",
    ),
    "the grid is @krizaka/ui's CardGrid: the tiles of a row share one height",
  );
  assert.equal(
    cssDecls("app/components/home/stack-tiles.css", ".kz-build-try").flex,
    "1 1 auto",
    "the example grows to fill its card",
  );
  for (const lang of ["en", "fr"]) assert.ok(messages(lang).site.home.stack.ts.line, `${lang}: stack.ts.line`);
});

// The Motion card's host is the stack data's (lab.krizaka.com), never typed in a component.
test("the stack cards: the Motion host from the data, no playground control on a calm flow", () => {
  const stack = "app/components/home/OpenStack.tsx";
  const motion = "app/components/home/playground/MotionPlayground.tsx";
  assert.ok(
    jsx(stack).some((e) => e.tag === "MotionPlayground" && "w" in e.attrs),
    "the full card keeps the playground's settings",
  );
  assert.ok(hasCode(stack, "meta={hostOf(motion.url)}"), "the full card's host is hostOf of the data's url");
  assert.ok(hasCode(stack, "href={stackActionUrl(motion)}"), "the action opens the lab's scene");
  const typed = strings(stack).join("\n");
  assert.doesNotMatch(typed, /github\.io|lab\.krizaka\.com/, "no host typed in the component");
  assert.ok(!calls(stack).some((c) => c.endsWith(".replace")), "no host rewritten in the component");
  assert.match(constString("lib/stack.ts", "LAB_SITE") ?? "", /^https:\/\/[a-z0-9.-]+$/, "one value in the data");
  const lab = records("lib/stack.ts", "STACK").find((p) => p.actionPath === "/orazaka");
  assert.equal(lab?.url, "LAB_SITE", "the lab's scene derives from the site");
  assert.ok(hasCode(motion, "hint={calm ? undefined : w.hint}"), "a calm flow has no instruction to pick anything");
});

test("§ 5 puts the right to be forgotten first, says the books are kept, and reads its figures at build (Oussama, 2026-10-23)", () => {
  const src = readFileSync(new URL("../app/components/home/Principles.tsx", import.meta.url), "utf8");
  assert.match(src, /\{ id: "forgotten", icon: TrashIcon \}/);
  assert.ok(src.indexOf('"forgotten"') < src.indexOf('"books"'), "the right to be forgotten comes first");
  for (const lang of ["en", "fr"]) {
    const items = messages(lang).site.home.principles.items;
    assert.deepEqual(Object.keys(items), ["forgotten", "books", "facts", "sovereign", "quality", "open"]);
    assert.match(
      items.open.body,
      /\{count\}.*\{npm\}.*\{maven\}/,
      `${lang}: the figures are placeholders, never typed`,
    );
    assert.match(
      items.books.body,
      /(never file|jamais à votre place)/,
      `${lang}: Akinaza prepares the return, never files it`,
    );
  }
});

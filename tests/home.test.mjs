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
const ORDER = ["HomeHero", "ProductShowcase", "ServicesLine", "Direction", "Principles"]; // the tags, in the founder's order (2026-11-05)

test("the home is made of its five sections, in the founder's order: no Company, no closing contact panel, no FAQ", () => {
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
    "hero → products (the engine in the centre) → Entreprise → direction → principles",
  );
});

// The hero speaks to one reader, the property manager (krizaka-internal#2445), with one action (founder, 2026-11-05,
// krizaka-internal#2450): write to us about your files (the contact form, Verikora's topic). No secondary button.
test("one action in the hero: it writes to us on Verikora's topic, and nothing else is a button there", async () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.equal(hero.match(/variant="primary"/g)?.length, 1);
  assert.equal(hero.match(/<ButtonLink\b/g)?.length, 1, "one button");
  assert.match(hero, /href=\{`\/\$\{locale\}\$\{contactHref\("home", HOME_PRODUCT\)\}`\} variant="primary"/);
  assert.match(hero, /id="fig-1"/, "the carousel is Fig. 1");
  assert.doesNotMatch(hero, /FilmLightbox/, "the film is a slide of the carousel, with a link to its page");
  const { HOME_PRODUCT } = await import("../lib/home-sections.ts");
  assert.equal(HOME_PRODUCT, "yomizaka", "the home serves Verikora (its code name is the contact topic's id)");
  for (const l of ["en", "fr"]) {
    const h = messages(l).site.home.hero;
    assert.ok(h.primary?.trim(), `${l}: hero.primary`);
    assert.equal(h.secondary, undefined, `${l}: no secondary action`);
    assert.match(messages(l).site.contactForm.topics.yomizaka, /^Verikora$/, `${l}: the topic is Verikora's`);
  }
  assert.equal(messages("fr").site.home.hero.primary, "Parlez-nous de vos dossiers");
  assert.equal(messages("en").site.home.hero.primary, "Talk to us about your files");
});

// The founder's h1 (2026-11-05, krizaka-internal#2445, supersedes #2424), and a lead that names Verikora first.
test("the hero's h1 is the founder's, and the lead opens on Verikora", () => {
  assert.equal(messages("fr").site.home.hero.title, "Des logiciels de conformité, construits au grand jour.");
  assert.equal(messages("en").site.home.hero.title, "Compliance software, built in the open.");
  for (const l of ["en", "fr"]) {
    const h = messages(l).site.home.hero;
    assert.match(h.lead, /^Verikora /, `${l}: the lead starts with Verikora`);
    assert.doesNotMatch(
      h.lead,
      /Krizaka UI|Krizaka Java|Krizaka TypeScript|Folioviv/,
      `${l}: the libraries leave the lead`,
    );
    assert.match(h.eyebrow, /Montréal/, `${l}: where we are`);
  }
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
  assert.match(showcase, /productOrder\(PRODUCTS\)/);
  assert.match(
    showcase,
    /<li\s+id=\{"product-" \+ p\.id\}\s+className=\{cn\("kz-entry", engine && "kz-entry-engine", "brand-" \+ p\.id\)\}/,
    "each product is an anchor the row reaches, in its brand",
  );
  assert.match(
    showcase,
    /tone: STAMP\[p\.status\]/,
    "the status is the data's (gated by the dev-preview checklists), stamped",
  );
  assert.equal(
    showcase.match(/<SpecimenTag\b/g)?.length,
    2,
    "the products and the engine wear the same specimen tag, and so do the products in design: one language",
  );
  assert.doesNotMatch(showcase, /knowhow|kz-pc-meta/, "one label per product: no mono eyebrow beside the status");
  assert.match(
    showcase,
    /mark: <ProductLogo id=\{p\.id\} size=\{\d+\} animated=\{false\} \/>/,
    "the mark sits beside the name on the tag, never over the visual",
  );
  assert.match(
    showcase,
    /<ButtonLink\s+href=\{p\.siteUrl\}/,
    "a card's one action goes to the product's commercial www site (2026-11-04)",
  );
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
      ["hero", "engine", "products", "stack", "services", "direction", "principles", "visuals", "showcase"],
      `${lang}: site.home`,
    );
    assert.equal(m.expertise, undefined, `${lang}: site.expertise`);
  }
});

// krizaka/.github#413: the conformance rule `no-departed-product` proves the names are gone; the home keeps no FAQ.
test("no FAQ comes back", () => {
  for (const lang of ["en", "fr"]) assert.equal(messages(lang).site.faq, undefined, `${lang}: site.faq`);
});

// The products are reached one way (founder, 2026-11-05, krizaka-internal#2450): the bar's « Products »; the hero's row of
// marks is gone, and the hero's server markup holds no media of its own (the carousel is a client island, poster first).
test("the hero has no row of product marks any more, and no media in its own markup", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.doesNotMatch(hero, /kz-home-marks|ProductLogo|heroMarkOrder/);
  assert.doesNotMatch(hero, /<video|<img/, "the hero's media are the carousel's (Showcase)");
  assert.doesNotMatch(read("app/components/home/home.css"), /\.kz-home-marks/, "no rule of the row left");
  for (const lang of ["en", "fr"]) {
    const h = messages(lang).site.home.hero;
    assert.equal(h.marksLabel, undefined, `${lang}: hero.marksLabel`);
    assert.ok(h.lead.length < 240, `${lang}: the lead stays short`);
  }
});

// « Fig. 1 » is the hero's carousel (krizaka-internal#2450): no polaroid, no tape, no bird legend; after the first-paint text.
test("the hero is « Fig. 1 »: the hero's carousel, after the first-paint text, no bird legend", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.doesNotMatch(
    hero,
    /TapedPhoto|taped-photo|<Flock|AmbientLoop|HERO_FLOCK|<Mascot|kz-fig-bird|HeroFigure/,
    "no polaroid, tape, live flock, valley loop, bird legend or tabs",
  );
  assert.match(
    hero,
    /<div id="fig-1" className="kz-fig">\s*<Showcase carousel="hero" fig=\{HERO_FIGURE\} locale=\{locale\} \/>/,
  );
  assert.ok(hero.indexOf("kz-home-actions") < hero.indexOf('id="fig-1"'), "the figure follows the first-paint text");
  assert.ok(!existsSync(new URL("../app/components/home/HeroFigure.tsx", import.meta.url)), "the tabs are gone");
  assert.ok(!existsSync(new URL("../lib/hero-slides.ts", import.meta.url)), "the slides are the storyboard's");
  for (const lang of ["en", "fr"]) {
    const h = messages(lang).site.home.hero;
    for (const k of ["fig", "figText", "slides", "figure"]) assert.equal(h[k], undefined, `${lang}: hero.${k} is gone`);
  }
});

test("no two figures of the home share a number: the hero is Fig. 1, the products' carousels follow it", async () => {
  const { HERO_FIGURE, productOrder, sectionFigure } = await import("../lib/home-sections.ts");
  const { PRODUCTS } = await import("../lib/products.ts");
  const { IN_DESIGN } = await import("../lib/products-in-design.ts");
  const shown = productOrder(PRODUCTS);
  const numbers = [
    HERO_FIGURE,
    ...shown.map((_, i) => sectionFigure(i + 1)),
    ...IN_DESIGN.map(() => sectionFigure(shown.length + 1)),
  ];
  assert.equal(HERO_FIGURE, 1);
  assert.equal(new Set(numbers).size, numbers.length, `figures ${numbers.join(", ")}`);
  assert.ok(
    numbers.slice(1).every((n) => n >= 2),
    "the sections' figures start at 2",
  );
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.match(showcase, /fig=\{sectionFigure\(nOf\(p\)\)\}/);
  assert.match(showcase, /<DesignPlate product=\{p\} n=\{sectionFigure\(SHOWN\.length \+ 1\)\}/);
  assert.match(showcase, /<FootnoteRef n=\{nOf\(p\)\}/, "the notes keep their own numbers");
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
test("the section list is the home's five sections, in the founder's order; the numbers and the folio are derived from it", () => {
  assert.deepEqual([...HOME_SECTIONS], ["hero", "products", "services", "direction", "principles"]);
  assert.deepEqual(folioOf("principles"), { page: 5, total: 5 });
  assert.deepEqual(folioOf("hero"), { page: 1, total: 5 });
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
    // The hero's lead names Verikora alone since krizaka-internal#2445: the duo is named by its need in #products.
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

test("§ 5 reads its figures at build: placeholders in the open rule, never typed numbers", () => {
  for (const lang of ["en", "fr"]) {
    const items = messages(lang).site.home.principles.items;
    assert.match(items.open.body, /\{count\}.*\{npm\}/, `${lang}: the figures are placeholders, never typed`);
  }
});

// Four rules, true for a Montréal studio (krizaka-internal#2553, meeting 4 of 2026-11-05): the check, the document that
// leaves, Montréal and Canada, built in the open. Folioviv is paused and Sovkora on your own servers is no offer today.
test("the home's principles are the four rules, in order, with their icons and both languages; « Six » is nowhere", () => {
  const src = read("app/components/home/Principles.tsx");
  const ids = [...src.matchAll(/\{ id: "(\w+)", icon: (\w+) \}/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(ids, [
    ["facts", "SearchIcon"],
    ["kept", "TrashIcon"],
    ["canada", "LockIcon"],
    ["open", "KnowledgeIcon"],
  ]);
  const titles = {
    en: [
      "Four rules, checked rather than promised.",
      "A check reports what it saw",
      "A document stays only if you choose",
      "Made in Montréal, French first, hosted in Canada",
      "Built in the open",
    ],
    fr: [
      "Quatre règles, vérifiées plutôt que promises.",
      "Une vérification dit ce qu'elle a vu",
      "Un document ne reste que si vous le choisissez",
      "Fait à Montréal, en français d'abord, hébergé au Canada",
      "Construit au grand jour",
    ],
  };
  for (const l of ["en", "fr"]) {
    const p = messages(l).site.home.principles;
    assert.deepEqual(Object.keys(p.items), ["facts", "kept", "canada", "open"], `${l}: no other rule`);
    assert.deepEqual([p.title, ...ids.map(([id]) => p.items[id].title)], titles[l], l);
    assert.doesNotMatch(JSON.stringify(p), /\bSix\b|\bsix\b/, `${l}: « six » is nowhere`);
    assert.doesNotMatch(
      JSON.stringify(p),
      /Folioviv|Sovkora|propres serveurs|your own servers/,
      `${l}: paused or not offered`,
    );
  }
  assert.match(messages("en").site.home.principles.items.kept.body, /erased after 30 days/);
  assert.match(messages("fr").site.home.principles.items.kept.body, /au bout de 30 jours/);
});

test("the home's meta description does not call the products open source (AGENTS.md § 2: no licence for a product)", () => {
  const page = read(HOME);
  const descriptions = [...page.matchAll(/description:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.ok(descriptions.length >= 2, "FR and EN descriptions");
  for (const d of descriptions)
    assert.doesNotMatch(d, /open[- ]source (products|software products)|produits open source/i, d);
});

// Rule 3 says « hosted in Canada »: the DigitalOcean region of this site and of Verikora's app stays Toronto (`tor`).
test("rule 3 stays true: krizaka-com and yomizaka are deployed in the DigitalOcean region tor (Canada)", async () => {
  const region = (yaml) => yaml.match(/^region:\s*(\S+)/m)?.[1];
  assert.equal(region(read("deploy/digitalocean/app.yaml")), "tor", "krizaka-com leaves Canada");
  const url = "https://raw.githubusercontent.com/krizaka/yomizaka/main/deploy/digitalocean/dev.app.yaml";
  const res = await fetch(url);
  assert.ok(res.ok, `${url}: ${res.status}`);
  assert.equal(region(await res.text()), "tor", "yomizaka leaves Canada");
});

test("the accessibility claim is WCAG 2.1 AA, what the guard checks, never 2.2 (home and /docs)", () => {
  for (const l of ["en", "fr"]) {
    const all = JSON.stringify(messages(l));
    assert.doesNotMatch(all, /WCAG 2\.2(?![.\d])/, `${l}: WCAG 2.2 is claimed`);
    assert.match(messages(l).site.openSource.hub.quality, /WCAG 2\.1 AA/, `${l}: /docs carries the line`);
  }
  assert.match(read("app/[locale]/docs/page.tsx"), /h\.quality/, "/docs renders the line");
});

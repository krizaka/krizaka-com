import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { HOME_SECTIONS, folioOf } from "../lib/home-sections.ts";

// The home is one of the site's two views (Oussama, 2026-10-17; the other is Open source): the centred hero, the products
// (Orazaka the foundation, the products it powers — the only place they are presented), the open-source stack in brief,
// the principles in brief (Montréal and the closing contact left on 2026-10-22: /story is in the footer, Contact us in the bar). No product is pitched, nothing links to the old /docs.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const HOME = "app/[locale]/page.tsx";
const SECTIONS = ["HomeHero", "ProductShowcase", "OpenStack", "Principles"];

test("the home is made of its four sections, in Oussama's order: no Company, no closing contact panel, no FAQ", () => {
  const home = read(HOME);
  assert.doesNotMatch(home, /<Company\b|<ContactCta\b|<ProductFaq\b|section-backdrop/, "§ 5, § 6 and the FAQ are gone");
  assert.ok(!existsSync(new URL("../app/components/ProductFaq.tsx", import.meta.url)), "ProductFaq came back");
  for (const f of ["Company", "ContactCta"]) assert.ok(!existsSync(new URL(`../app/components/home/${f}.tsx`, import.meta.url)), `${f} came back`);
  const order = SECTIONS.map((s) => {
    const at = home.search(new RegExp(`<${s}\\b`));
    assert.ok(at > 0, s);
    return at;
  });
  assert.deepEqual(order, [...order].sort((a, b) => a - b), "hero → products → stack → principles");
});

test("one primary action per section: the hero's goes to #products, the stack's to /open-source", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.equal(hero.match(/variant="primary"/g)?.length, 1);
  assert.match(hero, /href="#products" variant="primary"/);
  assert.doesNotMatch(hero, /href="\/contact"/, "the bar has Contact us: no duplicate in the hero");
  const stack = read("app/components/home/OpenStack.tsx");
  assert.match(stack, /href="\/open-source" variant="primary"/);
  assert.equal(stack.match(/variant="primary"/g)?.length, 1);
});

test("the hero: text painted at once, the figures read at build and climbing", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.doesNotMatch(hero, /"use client"/, "the hero's text is server-rendered (LCP)");
  assert.doesNotMatch(hero, /data-reveal|reveal\(/, "nothing on the first screen is revealed");
  assert.match(hero, /<NumberTicker value=\{p\.value\}/);
  assert.doesNotMatch(hero.slice(hero.indexOf("kz-home-proofs"), hero.indexOf("</dl>")), /kz-intro-deco/, "the figures are never hidden by the intro");
});

test("the products come from lib/products.ts: one card each, in the product's brand", () => {
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.match(showcase, /PRODUCTS\.filter/);
  assert.match(showcase, /<li id=\{"product-" \+ p\.id\} className=\{cn\("kz-entry", "brand-" \+ p\.id\)\}/, "each product is an anchor the hero's marks reach, in its brand");
  assert.match(showcase, /tone: STAMP\[p\.status\]/, "the status is the data's (gated by the dev-preview checklists), stamped");
  assert.equal(showcase.match(/<SpecimenTag\b/g)?.length, 2, "the status is said once per product (the engine's tag, each entry's)");
  assert.doesNotMatch(showcase, /knowhow|kz-pc-meta/, "one label per product: no mono eyebrow beside the status");
  assert.match(showcase, /mark=\{<ProductLogo id=\{p\.id\} size=\{\d+\} animated=\{false\} \/>\}/, "the mark sits beside the name on the tag, never over the visual");
  assert.match(showcase, /href: p\.siteUrl/, "a card links the product's public www page, never its dev host");
  for (const s of SECTIONS) {
    const src = read(`app/components/home/${s}.tsx`);
    assert.doesNotMatch(src, /["'](orazaka|orochia|yasakia|yororis)["']/, `${s} names a product by hand`);
    assert.doesNotMatch(src, /brand-(orazaka|orochia|yasakia|yororis)/, `${s} paints one product's brand`);
  }
});

test("the home never links to the documentation that moved to ui.krizaka.com and java.krizaka.com", () => {
  for (const s of SECTIONS) assert.doesNotMatch(read(`app/components/home/${s}.tsx`), /["'`]\/docs/, s);
});

test("the old home — the product showcase, the kit gallery, the rotating title — is gone", () => {
  for (const file of ["app/components/home/OrgHero.tsx", "app/components/home/KitShowcase.tsx", "app/components/home/BuildWithKrizaka.tsx", "app/components/home/WhatWeBuild.tsx", "lib/kit-live.ts", "lib/build-with.ts", "lib/cli-model.ts"]) {
    assert.ok(!existsSync(new URL(`../${file}`, import.meta.url)), `${file} came back`);
  }
  for (const lang of ["en", "fr"]) {
    const m = messages(lang).site;
    assert.deepEqual(Object.keys(m.home), ["hero", "products", "stack", "principles", "visuals"], `${lang}: site.home`);
    assert.equal(m.expertise, undefined, `${lang}: site.expertise`);
  }
});

test("Orochia is described neutrally: no creator, payout or payment pitch on krizaka.com's shared words", () => {
  const pitch = /creator|créat|payout|paid|payé|payment|paiement|tip|pourboire|90 ?%/i;
  for (const lang of ["en", "fr"]) {
    const m = messages(lang).site;
    assert.doesNotMatch(m.products.cards.orochia.line, pitch, `${lang}: products.cards.orochia`);
    assert.doesNotMatch(JSON.stringify(m.home), pitch, `${lang}: site.home`);
    assert.doesNotMatch(m.structuredData.organization, pitch, `${lang}: structuredData.organization`);
    assert.equal(m.faq, undefined, `${lang}: site.faq`);
  }
});

// 2026-10-20 (the coordinator's decisions): the hero puts the products forward — a quiet row of the seven marks, each a
// link to its card, the ones not offered yet dimmed — and its lead names what they are for; no new media (LCP).
test("the hero's row of product marks: from lib/products.ts, each to its card, dimmed when nothing is offered yet", () => {
  const hero = read("app/components/home/HomeHero.tsx");
  assert.match(hero, /<ul className="kz-home-marks" aria-label=\{t\.marksLabel\}>/);
  assert.match(hero, /PRODUCTS\.map\(\(p\) =>/);
  assert.match(hero, /href=\{`#product-\$\{p\.id\}`\}/);
  assert.match(hero, /<ProductLogo id=\{p\.id\} size=\{30\} animated=\{false\} \/>/);
  assert.match(hero, /DIM: readonly ProductStatus\[\] = \["construction", "upcoming"\]/);
  assert.doesNotMatch(hero, /<video|<img|AmbientLoop set=\{[^A]/, "no new media in the hero");
  assert.ok(hero.indexOf("kz-home-actions") < hero.indexOf("kz-home-marks") && hero.indexOf("kz-home-marks") < hero.indexOf("kz-home-proofs"), "under the actions, above the figures");
  for (const lang of ["en", "fr"]) {
    const h = messages(lang).site.home.hero;
    assert.ok(h.marksLabel, `${lang}: hero.marksLabel`);
    assert.ok(h.lead.length < 240, `${lang}: the lead stays one sentence`);
  }
});

// « Build with our open source » (2026-10-20): the stack put forward and playable — Krizaka UI's real components,
// Krizaka Motion's flow with two of the lab's settings, Krizaka Java's BOM — every version and figure read at build.
test("the open-source section: three playable tiles, versions and downloads read at build, one primary action", () => {
  const stack = read("app/components/home/OpenStack.tsx");
  assert.match(stack, /<UiPlayground/);
  assert.match(stack, /<MotionPlayground/);
  assert.match(stack, /<CodeTabs/);
  assert.match(stack, /npmDownloads\(ui\.coordinate\)/);
  assert.match(stack, /mavenVersion\("krizaka-bom"\)/);
  assert.match(stack, /publishedVersion\(ui\.coordinate\)/);
  assert.doesNotMatch(stack, /\d+\.\d+\.\d+/, "no version typed by hand");
  const ui = read("app/components/home/playground/UiPlayground.tsx");
  for (const piece of ["@krizaka/ui/button", "@krizaka/ui/switch", "@krizaka/ui/chip", "@krizaka/charts/sparkline"]) assert.match(ui, new RegExp(piece));
  assert.match(ui, /theme-\$\{theme\}/, "the theme preview is scoped to the tile");
  const motion = read("app/components/home/playground/MotionPlayground.tsx");
  assert.match(motion, /from "@krizaka\/ui\/engine-flow"/);
  assert.match(motion, /FLOW_LAYOUTS/);
  assert.match(motion, /FLOW_MODES/);
  for (const lang of ["en", "fr"]) {
    const s = messages(lang).site.home.stack;
    for (const k of ["ui", "motion", "java"]) assert.ok(s[k], `${lang}: stack.${k}`);
    assert.deepEqual(Object.keys(s.motion.layouts), ["radial", "top-to-bottom", "left-to-right"]);
    assert.deepEqual(Object.keys(s.motion.modes), ["in", "out", "both"]);
  }
  assert.equal(messages("fr").site.home.stack.title, "Construisez avec nos briques.");
});

test("Akinaza is for studios, salons and the self-employed, one short human line, never « compliant » (until a lawyer validates)", () => {
  for (const lang of ["en", "fr"]) {
    const text = JSON.stringify(messages(lang), (k, v) => v).split("\n").join(" ");
    const akinaza = [...text.matchAll(/"akinaza":\{[^{}]*\}|"akinaza":"[^"]*"/g)].map((m) => m[0]).join(" ");
    assert.doesNotMatch(akinaza, /conforme|conformité|compliant|compliance|complies/i, lang);
    assert.doesNotMatch(akinaza, /bakeries|boulangeries/i, `${lang}: no on-site consumption businesses`);
  }
  const en = JSON.stringify(messages("en")), fr = JSON.stringify(messages("fr"));
  // The card speaks to the customer's day, in one short line: no law as a headline, never an « OS » (Oussama, 2026-10-22).
  for (const [lang, m] of [["en", messages("en")], ["fr", messages("fr")]]) {
    const line = m.site.products.cards.akinaza.line;
    assert.ok(line.length <= 60, `${lang}: one short line`);
    assert.doesNotMatch(line, /Loi 25|Loi 96|\bOS\b/, lang);
  }
  assert.match(en, /Your appointments, invoices and taxes, sorted/);
  assert.match(fr, /Vos rendez-vous, vos factures et vos taxes, réglés/);
});

// The numbers in the margin and the folios come from the section list, never typed (2026-10-22: § 5 and § 6 removed).
test("the section list is the home's four sections; the numbers and the folio are derived from it", () => {
  assert.deepEqual([...HOME_SECTIONS], ["hero", "products", "stack", "principles"]);
  assert.deepEqual(folioOf("principles"), { page: 4, total: 4 });
  assert.deepEqual(folioOf("hero"), { page: 1, total: 4 });
  for (const lang of ["en", "fr"]) {
    const h = messages(lang).site.home;
    assert.match(h.principles.folio, /\{page\}.*\{total\}/, `${lang}: the folio is a template, not typed digits`);
    HOME_SECTIONS.forEach((id, i) => assert.equal(h[id === "stack" ? "stack" : id].number, `§ ${i + 1}`, `${lang}: ${id}`));
  }
  assert.match(read("app/components/home/Principles.tsx"), /format\(p\.folio, folioOf\("principles"\)\)/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

// The home is the company's (2026-10-14): who Krizaka is, the four products as equals, the open-source stack on its own
// sites, how it works, Montréal. No product is featured, no product is pitched, nothing links to the old /docs.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const HOME = "app/[locale]/page.tsx";
const SECTIONS = ["HomeHero", "WhatWeBuild", "OpenStack", "Principles", "Company"];

test("the home is made of its five sections, then the contact and the questions", () => {
  const home = read(HOME);
  for (const s of [...SECTIONS, "ContactCta", "ProductFaq"]) assert.match(home, new RegExp(`<${s}\\b`), s);
});

test("the products are equals: one card each from lib/products.ts, no product singled out", () => {
  const cards = read("app/components/home/WhatWeBuild.tsx");
  assert.match(cards, /PRODUCTS\.map/);
  for (const s of SECTIONS) {
    const src = read(`app/components/home/${s}.tsx`);
    assert.doesNotMatch(src, /["'](orazaka|orochia|yasakia|yororis)["']/, `${s} names a product by hand`);
    assert.doesNotMatch(src, /brand-orochia|brand-\$\{|"brand-" \+/, `${s} paints a product's brand`);
  }
});

test("the home never links to the documentation that moved to ui.krizaka.com and java.krizaka.com", () => {
  for (const s of SECTIONS) assert.doesNotMatch(read(`app/components/home/${s}.tsx`), /["'`]\/docs/, s);
});

test("the old home — the product showcase, the kit gallery, the rotating title — is gone", () => {
  for (const file of ["app/components/home/OrgHero.tsx", "app/components/home/KitShowcase.tsx", "app/components/home/BuildWithKrizaka.tsx", "lib/kit-live.ts", "lib/build-with.ts", "lib/cli-model.ts"]) {
    assert.ok(!existsSync(new URL(`../${file}`, import.meta.url)), `${file} came back`);
  }
  for (const lang of ["en", "fr"]) {
    const m = messages(lang).site;
    assert.deepEqual(Object.keys(m.home), ["hero", "products", "stack", "principles", "company", "contact"], `${lang}: site.home`);
    assert.equal(m.expertise, undefined, `${lang}: site.expertise`);
  }
});

test("Orochia is described neutrally: no creator, payout or payment pitch on krizaka.com's shared words", () => {
  const pitch = /creator|créat|payout|paid|payé|payment|paiement|tip|pourboire|90 ?%/i;
  for (const lang of ["en", "fr"]) {
    const m = messages(lang).site;
    assert.doesNotMatch(m.products.cards.orochia.line, pitch, `${lang}: products.cards.orochia`);
    assert.doesNotMatch(m.nav.family.products.orochia, pitch, `${lang}: nav.family.products.orochia`);
    assert.doesNotMatch(JSON.stringify(m.home), pitch, `${lang}: site.home`);
    assert.doesNotMatch(m.structuredData.organization, pitch, `${lang}: structuredData.organization`);
    assert.doesNotMatch(JSON.stringify(m.faq.krizaka), pitch, `${lang}: faq.krizaka`);
  }
});

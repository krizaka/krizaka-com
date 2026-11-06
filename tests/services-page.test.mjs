import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SERVICES_PAGE_ORDER, SERVICES_PROOF } from "../lib/services-page.ts";
import { CONTACT_KINDS, contactHref, presetForSource, validateContact } from "../lib/contact.ts";

// 2026-10-30 (founder, krizaka-com#487): « Nos services » — Krizaka Entreprise, the one offer for companies.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const msg = (l) => JSON.parse(read(`messages/${l}.json`)).site;

test("every step of the page has its words in both languages, with no price and no invented figure", () => {
  for (const l of ["en", "fr"]) {
    const s = msg(l).services;
    for (const id of SERVICES_PAGE_ORDER.offers) {
      const o = s.offers[id];
      assert.ok(o.name && o.unit && o.hook, `${l}: offers.${id}`);
      assert.ok(o.hook.length <= 90, `${l}: offers.${id}.hook is one line`);
      assert.ok(o.features.length === 3, `${l}: offers.${id} says what you get, in a few lines`);
    }
    for (const id of SERVICES_PAGE_ORDER.faq) assert.ok(s.faq.items[id].q && s.faq.items[id].a, `${l}: faq.${id}`);
    for (const { id } of SERVICES_PROOF)
      assert.ok(s.proofCards[id].title && s.proofCards[id].line, `${l}: proof.${id}`);
    assert.doesNotMatch(JSON.stringify(s), /\d|\$|€|CAD/, `${l}: no figure and no price`);
  }
});

test("the proof links are public artefacts: the stack's sites (UI, Lab, Java, TypeScript), Orazaka's repository, the blog", () => {
  assert.deepEqual(
    SERVICES_PROOF.map((p) => p.id),
    ["ui", "motion", "java", "ts", "orazaka", "blog"],
  );
  for (const { href } of SERVICES_PROOF) assert.match(href, /^https:\/\//);
});

test("the one action is the contact form with the « business » kind preselected", () => {
  assert.ok(CONTACT_KINDS.includes("business"));
  assert.equal(contactHref("services", "business"), "/contact?topic=business&source=services");
  assert.equal(presetForSource("services").kind, "business");
  const page = read("app/[locale]/services/page.tsx");
  assert.equal((page.match(/contactHref\(/g) ?? []).length, 1, "one destination for every action");
  assert.match(page, /const enterprise = contactHref\("services", "business"\)/);
  assert.equal((page.match(/href=\{enterprise\} variant="primary"/g) ?? []).length, 2, "hero and closing call");
  assert.doesNotMatch(
    page,
    /variant="ghost"/,
    "the offers are a list: no button repeated under each (krizaka-internal#2450)",
  );
  for (const l of ["en", "fr"]) {
    const c = JSON.parse(read(`messages/${l}.json`));
    assert.ok(c.site.contactForm.topics.business, `${l}: the business kind is worded`);
  }
});

test("a message with the Entreprise topic is accepted", () => {
  const r = validateContact({
    name: "Eric",
    email: "eric@example.com",
    topic: "enterprise",
    message: "We need a module for our intake forms.",
    locale: "en",
  });
  assert.equal(r.ok, true);
});

test("the page is registered, in the bar, the footer, the sitemap and llms.txt, with a Service node under the Organization", () => {
  assert.match(read("lib/page-templates.ts"), /"\/services": "longform"/);
  assert.match(read("lib/nav.ts"), /\{ href: "\/services", icon: "services" \}/);
  assert.match(read("lib/footer.ts"), /href: "\/services"/);
  assert.match(read("app/sitemap.ts"), /"\/services"/);
  assert.match(read("content/llms.txt"), /\{\{SITE_URL\}\}\/en\/services/);
  const ld = read("lib/structured-data.ts");
  assert.match(ld, /"@type": "Service"/);
  assert.match(ld, /provider: \{ "@id": ORG_ID \}/);
  assert.doesNotMatch(ld.slice(ld.indexOf("buildServiceJsonLd")), /offers|price/, "no price node");
  assert.match(read("app/[locale]/services/page.tsx"), /<JsonLd\s+data=\{buildServiceJsonLd/);
});

test("the page is a longform of blocks: the offers as a numbered list, the proof as a ledger read at build, the folded questions", () => {
  const page = read("app/[locale]/services/page.tsx");
  assert.match(page, /<PageHero/);
  assert.match(page, /<OfferList\b/, "a list, not three squares (founder, 2026-11-05)");
  assert.match(page, /<WorkLedger\b/, "the public work as a ledger of links, not plain boxes");
  assert.doesNotMatch(page, /<ArgumentCard|<LinkCard|<CardGrid/);
  assert.doesNotMatch(page, /PricingPage|price=|plans=/, "no price block: the pricing template is gone");
  assert.match(page, /className="kz-tpl-faq"/);
  assert.match(page, /npmPackages\(\)/, "figures from the registries, never typed");
  assert.doesNotMatch(page, /credits=|svc-how|STEP_ICON/, "no how-it-works section (founder, 2026-11-01)");
  assert.doesNotMatch(page, /mavenArtifactCount/, "Java blocks are on GitHub Packages, not Central (ADR-019)");
  assert.doesNotMatch(page, /kz-notebook-list|paper="lines"/, "no ruled-paper list (founder, 2026-10-30)");
});

// Founder, 2026-11-03: « politique Apple : les gens ont besoin de nous, on les laisse venir ». No price of any kind on /services:
// no amount, no « à partir de », no tiers, no « sur devis » / « on quote » — the words of the page, its metadata and its llms line.
const PRICE_WORDS =
  /\d[\d\s.,]*\s?(\$|€|CAD|USD|CA\$)|\$\s?\d|à partir de|from CA|starting at|from \$|devis|quote|\btier|forfait|tarif|pricing|\bprice|\bprix|coûte|cost\b|\{floor/i;

test("/services shows no price of any kind, no « sur devis » and no « on quote », in both languages", () => {
  for (const l of ["en", "fr"]) {
    assert.doesNotMatch(JSON.stringify(msg(l).services), PRICE_WORDS, `${l}: site.services`);
    assert.doesNotMatch(msg(l).nav.services?.desc ?? "", PRICE_WORDS, `${l}: nav entry`);
  }
  const page = read("app/[locale]/services/page.tsx");
  assert.doesNotMatch(
    page.slice(page.indexOf("generateMetadata"), page.indexOf("const PROOF_ICON")),
    PRICE_WORDS,
    "metadata",
  );
  const llms = read("content/llms.txt")
    .split("\n")
    .filter((x) => x.includes("/services"));
  assert.ok(llms.length > 0);
  assert.doesNotMatch(llms.join("\n"), PRICE_WORDS, "llms.txt");
  assert.doesNotMatch(
    read("lib/structured-data.ts").slice(read("lib/structured-data.ts").indexOf("buildServiceJsonLd")),
    /offers|price/,
  );
});

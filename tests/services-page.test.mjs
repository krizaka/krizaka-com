import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SERVICES_PAGE_ORDER, SERVICES_PROOF } from "../lib/services-page.ts";
import { CONTACT_TOPICS, contactHref, topicForSource, validateContact } from "../lib/contact.ts";

// 2026-10-30 (founder, krizaka-com#487): « Nos services » — Krizaka Entreprise, the one offer for companies.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const msg = (l) => JSON.parse(read(`messages/${l}.json`)).site;

test("every step of the page has its words in both languages, with no price and no invented figure", () => {
  for (const l of ["en", "fr"]) {
    const s = msg(l).services;
    for (const id of SERVICES_PAGE_ORDER.offers) {
      const o = s.offers[id];
      assert.ok(o.name && o.unit, `${l}: offers.${id}`);
      assert.ok(
        o.features.length >= 3 && o.features.length <= 4,
        `${l}: offers.${id} says what you get, in a few lines`,
      );
    }
    for (const id of SERVICES_PAGE_ORDER.steps) {
      assert.ok(s.steps[id].title, `${l}: steps.${id}`);
      assert.ok(s.steps[id].body.length <= 90, `${l}: steps.${id} is a card's hook (90 characters at most)`);
    }
    for (const id of SERVICES_PAGE_ORDER.faq) assert.ok(s.faq.items[id].q && s.faq.items[id].a, `${l}: faq.${id}`);
    for (const { id } of SERVICES_PROOF)
      assert.ok(s.proofCards[id].title && s.proofCards[id].line, `${l}: proof.${id}`);
    assert.doesNotMatch(JSON.stringify(s), /\d|\$|€|CAD/, `${l}: on quote, no figure and no price`);
  }
});

test("the proof links are public artefacts: the stack's sites, Orazaka's repository, the blog", () => {
  assert.deepEqual(
    SERVICES_PROOF.map((p) => p.id),
    ["ui", "java", "orazaka", "blog"],
  );
  for (const { href } of SERVICES_PROOF) assert.match(href, /^https:\/\//);
});

test("the one action is the contact form with « Entreprise » preselected", () => {
  assert.ok(CONTACT_TOPICS.includes("enterprise"));
  assert.equal(contactHref("services", "enterprise"), "/contact?topic=enterprise&source=services");
  assert.equal(topicForSource("services"), "enterprise");
  const page = read("app/[locale]/services/page.tsx");
  assert.equal((page.match(/contactHref\(/g) ?? []).length, 1, "one destination for every action");
  assert.match(page, /const enterprise = contactHref\("services", "enterprise"\)/);
  assert.equal((page.match(/href=\{enterprise\} variant="primary"/g) ?? []).length, 2, "hero and closing call");
  for (const l of ["en", "fr"]) {
    const c = JSON.parse(read(`messages/${l}.json`));
    assert.ok(JSON.stringify(c).includes('"enterprise"'), l);
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
  assert.match(read("lib/page-templates.ts"), /"\/services": "pricing"/);
  assert.match(read("lib/nav.ts"), /\{ href: "\/services", icon: "services" \}/);
  assert.match(read("app/components/SiteFooter.tsx"), /to\("\/services"\)/);
  assert.match(read("app/sitemap.ts"), /"\/services"/);
  assert.match(read("content/llms.txt"), /\{\{SITE_URL\}\}\/en\/services/);
  const ld = read("lib/structured-data.ts");
  assert.match(ld, /"@type": "Service"/);
  assert.match(ld, /provider: \{ "@id": ORG_ID \}/);
  assert.doesNotMatch(ld.slice(ld.indexOf("buildServiceJsonLd")), /offers|price/, "on quote: no price node");
  assert.match(read("app/[locale]/services/page.tsx"), /<JsonLd\s+data=\{buildServiceJsonLd/);
});

test("the page is built on the pricing template: the parts as its plans, the steps, the proof read at build, the folded questions", () => {
  const page = read("app/[locale]/services/page.tsx");
  assert.match(page, /<PricingPage/);
  assert.match(page, /faq=\{/);
  assert.match(page, /npmPackages\(\)|mavenArtifactCount\(\)/, "figures from the registries, never typed");
  assert.doesNotMatch(page, /kz-notebook-list|paper="lines"/, "no ruled-paper list (founder, 2026-10-30)");
});

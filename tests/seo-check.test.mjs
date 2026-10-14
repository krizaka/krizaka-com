import { test } from "node:test";
import assert from "node:assert/strict";
import { auditHtml, auditRobots } from "../scripts/check-seo.mjs";

const page = (over = {}) => `<html><head><title>${over.title ?? "Orazaka | Krizaka"}</title>
<meta name="description" content="${"A description long enough to be useful to a search engine and its readers. ".repeat(1)}"/>
<link rel="canonical" href="${over.canonical ?? "https://www.krizaka.com/en/products"}"/>
<link rel="alternate" hrefLang="fr-CA" href="https://www.krizaka.com/fr/products"/>
<link rel="alternate" hrefLang="en" href="https://www.krizaka.com/en/products"/>
<link rel="alternate" hrefLang="x-default" href="https://www.krizaka.com/en/products"/>
<script type="application/ld+json">${over.ld ?? '{"@context":"https://schema.org","@type":"FAQPage"}'}</script></head><body></body></html>`;

test("a well-formed product page has no problem", () => {
  assert.deepEqual(auditHtml(page(), "/en/products"), []);
});

test("the apex canonical, a repeated brand and broken JSON-LD are caught", () => {
  const bad = auditHtml(page({ canonical: "https://krizaka.com/en/products", title: "X | Krizaka | Krizaka", ld: "{nope" }), "/en/products");
  assert.ok(bad.some((p) => p.includes("canonical")));
  assert.ok(bad.some((p) => p.includes("brand repeated")));
  assert.ok(bad.some((p) => p.includes("does not parse")));
  assert.ok(bad.some((p) => p.includes("apex")));
});

test("the home without its FAQPage is refused", () => {
  assert.ok(auditHtml(page({ ld: '{"@context":"https://schema.org","@type":"Organization"}' }), "/en").some((p) => p.includes("FAQPage")));
});

test("robots.txt must welcome the AI crawlers", () => {
  const ok = ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"].map((b) => `User-Agent: ${b}\nAllow: /\n`).join("\n") + "Sitemap: https://www.krizaka.com/sitemap.xml";
  assert.deepEqual(auditRobots(ok), []);
  assert.ok(auditRobots("User-Agent: *\nAllow: /").length > 1);
});

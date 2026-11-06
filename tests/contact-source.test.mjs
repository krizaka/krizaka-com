import { test } from "node:test";
import assert from "node:assert/strict";
import { topicForProductSite, topicFromQuery } from "../lib/contact-products.ts";
import { contactHref, contactSourceFromPath, topicForSource, validateContact } from "../lib/contact.ts";

test("names the page a visitor comes from", () => {
  const cases = {
    "/en/products/verikora": "verikora",
    "/fr/products/verikora/demo": "verikora",
    "/en/docs/verikora/api": "verikora",
    "/en/products/sovkora/demos": "sovkora",
    "/fr/products/folioviv": "folioviv",
    "/en/open-source": "open-source",
    "/en/docs/ui/button": "docs-ui",
    "/en/docs/java": "docs-java",
    "/en/story": "story",
    "/en": "home",
    "/": "home",
  };
  for (const [path, source] of Object.entries(cases)) assert.equal(contactSourceFromPath(path), source, path);
});

test("pre-selects the topic the page is about, and nothing for Krizaka as a whole", () => {
  assert.equal(topicForSource("verikora"), "verikora");
  assert.equal(topicForSource("sovkora"), "sovkora");
  assert.equal(topicForSource("folioviv"), "folioviv");
  // A paused product (2026-10-25) is no topic any more.
  assert.equal(topicForSource("unknown-product"), null);
  assert.equal(topicForSource("docs-ui"), "blocks");
  assert.equal(topicForSource("open-source"), "blocks");
  assert.equal(topicForSource("story"), null);
  assert.equal(topicForSource("home"), null);
  assert.equal(topicForSource(null), null);
});

test("builds the link", () => {
  assert.equal(contactHref("verikora"), "/contact?source=verikora");
  assert.equal(contactHref("open-source", "blocks"), "/contact?topic=blocks&source=open-source");
  assert.equal(contactHref(null), "/contact");
});

test("keeps a clean slug as source and drops anything else", () => {
  const base = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    topic: "verikora",
    message: "Hello there, a real message.",
  };
  const ok = validateContact({ ...base, source: "verikora" });
  assert.equal(ok.ok === true && ok.value.source, "verikora");
  const bad = validateContact({ ...base, source: "<script>alert(1)</script>" });
  assert.equal(bad.ok === true && bad.value.source, null);
});

// Réunion 6 (2026-11-05, krizaka-internal#2629): the waiting pages write « Nous écrire » with the product's commercial name
// (`?topic=verikora&source=verikora-com`); the form takes it, and the old code-name topics still work.
test("takes a product by its commercial name as a topic or a source, and still by its old name", () => {
  assert.equal(topicFromQuery("verikora"), "verikora");
  assert.equal(topicFromQuery("sovkora"), "sovkora");
  assert.equal(topicFromQuery("folioviv"), "folioviv");
  assert.equal(topicFromQuery("verikora"), "verikora");
  assert.equal(topicFromQuery("blocks"), "blocks");
  assert.equal(topicFromQuery("kridoc"), "other");
  assert.equal(topicFromQuery("nope"), null);
  assert.equal(topicFromQuery(null), null);
  assert.equal(topicForProductSite("verikora-com"), "verikora");
  assert.equal(topicForProductSite("sovkora-com"), "sovkora");
  assert.equal(topicForProductSite("folioviv-com"), "folioviv");
  assert.equal(topicForProductSite("kridoc-com"), null);
});

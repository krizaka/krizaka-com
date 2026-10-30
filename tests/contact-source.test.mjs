import { test } from "node:test";
import assert from "node:assert/strict";
import { contactHref, contactSourceFromPath, topicForSource, validateContact } from "../lib/contact.ts";

test("names the page a visitor comes from", () => {
  const cases = {
    "/en/products/yomizaka": "yomizaka",
    "/fr/products/yomizaka/demo": "yomizaka",
    "/en/docs/yomizaka/api": "yomizaka",
    "/en/products/orazaka/demos": "orazaka",
    "/fr/products/akinaza": "akinaza",
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
  assert.equal(topicForSource("yomizaka"), "yomizaka");
  assert.equal(topicForSource("orazaka"), "orazaka");
  assert.equal(topicForSource("akinaza"), "akinaza");
  // A paused product (2026-10-25) is no topic any more.
  assert.equal(topicForSource("unknown-product"), null);
  assert.equal(topicForSource("docs-ui"), "blocks");
  assert.equal(topicForSource("open-source"), "blocks");
  assert.equal(topicForSource("story"), null);
  assert.equal(topicForSource("home"), null);
  assert.equal(topicForSource(null), null);
});

test("builds the link", () => {
  assert.equal(contactHref("yomizaka"), "/contact?source=yomizaka");
  assert.equal(contactHref("open-source", "blocks"), "/contact?topic=blocks&source=open-source");
  assert.equal(contactHref(null), "/contact");
});

test("keeps a clean slug as source and drops anything else", () => {
  const base = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    topic: "yomizaka",
    message: "Hello there, a real message.",
  };
  const ok = validateContact({ ...base, source: "yomizaka" });
  assert.equal(ok.ok === true && ok.value.source, "yomizaka");
  const bad = validateContact({ ...base, source: "<script>alert(1)</script>" });
  assert.equal(bad.ok === true && bad.value.source, null);
});

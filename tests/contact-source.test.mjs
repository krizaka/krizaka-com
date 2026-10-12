import { test } from "node:test";
import assert from "node:assert/strict";
import { contactHref, contactSourceFromPath, topicForSource, validateContact } from "../lib/contact.ts";

test("names the page a visitor comes from", () => {
  const cases = {
    "/en/products/orochia": "orochia",
    "/fr/products/orochia/demo": "orochia",
    "/en/docs/orochia/api": "orochia",
    "/en/products/orazaka/demos": "orazaka",
    "/fr/products/yazakia": "yazakia",
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
  assert.equal(topicForSource("orochia"), "orochia");
  assert.equal(topicForSource("orazaka"), "orazaka");
  assert.equal(topicForSource("yazakia"), "yazakia");
  assert.equal(topicForSource("docs-ui"), "blocks");
  assert.equal(topicForSource("open-source"), "blocks");
  assert.equal(topicForSource("story"), null);
  assert.equal(topicForSource("home"), null);
  assert.equal(topicForSource(null), null);
});

test("builds the link", () => {
  assert.equal(contactHref("orochia"), "/contact?source=orochia");
  assert.equal(contactHref("open-source", "blocks"), "/contact?topic=blocks&source=open-source");
  assert.equal(contactHref(null), "/contact");
});

test("keeps a clean slug as source and drops anything else", () => {
  const base = { name: "Ada Lovelace", email: "ada@example.com", topic: "orochia", message: "Hello there, a real message." };
  const ok = validateContact({ ...base, source: "orochia" });
  assert.equal(ok.ok === true && ok.value.source, "orochia");
  const bad = validateContact({ ...base, source: "<script>alert(1)</script>" });
  assert.equal(bad.ok === true && bad.value.source, null);
});

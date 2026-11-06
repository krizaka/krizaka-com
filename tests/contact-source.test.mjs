import { test } from "node:test";
import assert from "node:assert/strict";
import { presetForProductSite, presetFromQuery } from "../lib/contact-products.ts";
import { contactHref, contactSourceFromPath, presetForSource, validateContact } from "../lib/contact.ts";

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

test("pre-selects the product (and kind) the page is about, and nothing for Krizaka as a whole", () => {
  assert.deepEqual(presetForSource("yomizaka"), { kind: null, product: "verikora" });
  assert.deepEqual(presetForSource("orazaka"), { kind: null, product: "sovkora" });
  assert.deepEqual(presetForSource("akinaza"), { kind: null, product: "folioviv" });
  assert.deepEqual(presetForSource("unknown-product"), { kind: null, product: null });
  assert.deepEqual(presetForSource("docs-ui"), { kind: null, product: "blocks" });
  assert.deepEqual(presetForSource("open-source"), { kind: null, product: "blocks" });
  assert.deepEqual(presetForSource("services"), { kind: "business", product: null });
  assert.deepEqual(presetForSource("story"), { kind: null, product: null });
  assert.deepEqual(presetForSource("home"), { kind: null, product: null });
  assert.deepEqual(presetForSource(null), { kind: null, product: null });
});

test("builds the link: kind as topic, the product by its commercial id, the source", () => {
  assert.equal(
    contactHref("verikora-footer", "support", "verikora"),
    "/contact?topic=support&product=verikora&source=verikora-footer",
  );
  assert.equal(contactHref("services", "business"), "/contact?topic=business&source=services");
  assert.equal(contactHref("home", undefined, "verikora"), "/contact?product=verikora&source=home");
  assert.equal(contactHref("story"), "/contact?source=story");
  assert.equal(contactHref(null), "/contact");
});

test("keeps a clean slug as source and drops anything else", () => {
  const base = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    kind: "support",
    message: "Hello there, a real message.",
  };
  const ok = validateContact({ ...base, source: "yomizaka" });
  assert.equal(ok.ok === true && ok.value.source, "yomizaka");
  const bad = validateContact({ ...base, source: "<script>alert(1)</script>" });
  assert.equal(bad.ok === true && bad.value.source, null);
});

// Réunion 6 (2026-11-05, krizaka-internal#2629) and the founder's rule of 2026-11-06 (no public address: « Support » is a
// kind of the form): `?topic=` takes a kind, `?product=` a product by its commercial id; the old code-name ids and topics still work.
test("takes the kind and the product from the link, and still understands the old ones", () => {
  const q = (topic, product = null, source = null) => presetFromQuery({ topic, product, source });
  assert.deepEqual(q("support", "verikora"), { kind: "support", product: "verikora" });
  assert.deepEqual(q("business"), { kind: "business", product: null });
  assert.deepEqual(q("other", "kridoc"), { kind: "other", product: "kridoc" });
  // Old links: a product in `topic`, by commercial name or code name, or an old topic.
  assert.deepEqual(q("verikora"), { kind: null, product: "verikora" });
  assert.deepEqual(q("sovkora"), { kind: null, product: "sovkora" });
  assert.deepEqual(q("folioviv"), { kind: null, product: "folioviv" });
  assert.deepEqual(q("yomizaka"), { kind: null, product: "verikora" });
  assert.deepEqual(q("akinaza"), { kind: null, product: "folioviv" });
  assert.deepEqual(q("orazaka"), { kind: null, product: "sovkora" });
  assert.deepEqual(q("kridoc"), { kind: null, product: "kridoc" });
  assert.deepEqual(q("kachizaka"), { kind: null, product: "kridoc" });
  assert.deepEqual(q("blocks"), { kind: null, product: "blocks" });
  assert.deepEqual(q("enterprise"), { kind: "business", product: null });
  assert.deepEqual(q("partnership"), { kind: "business", product: null });
  // `product=` takes the old ids too; an explicit value beats the source; garbage is ignored.
  assert.deepEqual(q("support", "yomizaka"), { kind: "support", product: "verikora" });
  assert.deepEqual(q("support", "nope"), { kind: "support", product: null });
  assert.deepEqual(q("nope"), { kind: null, product: null });
  assert.deepEqual(q(null, null, "verikora-com"), { kind: null, product: "verikora" });
  assert.deepEqual(q("support", null, "verikora-com"), { kind: "support", product: "verikora" });
  assert.deepEqual(q(null, "folioviv", "verikora-com"), { kind: null, product: "folioviv" });
  assert.deepEqual(q(null, null, "services"), { kind: "business", product: null });
  assert.deepEqual(presetFromQuery({ topic: null, product: null, source: null }), { kind: null, product: null });
  assert.equal(presetForProductSite("verikora-com")?.product, "verikora");
  assert.equal(presetForProductSite("sovkora-com")?.product, "sovkora");
  assert.equal(presetForProductSite("folioviv-com")?.product, "folioviv");
  assert.equal(presetForProductSite("kridoc-com")?.product, "kridoc");
  assert.equal(presetForProductSite("story"), null);
});

test("a message from an old client (a legacy topic in the body) is still accepted, mapped to a kind and a product", () => {
  const base = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there, a real message." };
  const old = validateContact({ ...base, topic: "yomizaka" });
  assert.deepEqual(old.ok === true && [old.value.kind, old.value.product], ["other", "verikora"]);
  assert.deepEqual(validateContact({ ...base }), { ok: false, field: "kind" });
  assert.deepEqual(validateContact({ ...base, kind: "sales" }), { ok: false, field: "kind" });
  assert.deepEqual(validateContact({ ...base, kind: "support", product: "nope" }), { ok: false, field: "product" });
  const ok = validateContact({ ...base, kind: "support", product: "yomizaka" });
  assert.deepEqual(ok.ok === true && [ok.value.kind, ok.value.product], ["support", "verikora"]);
  const none = validateContact({ ...base, kind: "business", product: "" });
  assert.deepEqual(none.ok === true && [none.value.kind, none.value.product], ["business", null]);
});

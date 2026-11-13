import { test } from "node:test";
import assert from "node:assert/strict";
import { findCodeNames } from "@krizaka/org";
import { readFileSync } from "node:fs";
import { PRODUCTS } from "../lib/products.ts";
import { IN_DESIGN } from "../lib/products-in-design.ts";
import { PRODUCT_HIGHLIGHTS } from "../lib/product-highlights.ts";

// Each product card of the home says one thing a buyer will love (founder, 2026-11-06, krizaka-internal#2695), about a
// feature that runs today: the feature is data with its source (repository and file), the words are messages. A product
// in conception has none, since nothing of it is built.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const messages = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };
const showcase = read("app/components/home/ProductShowcase.tsx");

test("every product has its highlight, and it names a feature listed with its source", () => {
  assert.deepEqual(Object.keys(PRODUCT_HIGHLIGHTS).sort(), PRODUCTS.map((p) => p.id).sort());
  for (const p of PRODUCTS) {
    const h = PRODUCT_HIGHLIGHTS[p.id];
    assert.ok(h.features.length >= 1 && h.features.length <= 3, `${p.id}: 1 to 3 features`);
    assert.ok(
      h.features.some((f) => f.id === h.highlight),
      `${p.id}: the highlight is one of its features`,
    );
    for (const f of h.features) {
      assert.match(f.repo, /^krizaka\/[a-z0-9-]+$/, `${p.id}/${f.id}: a krizaka repository`);
      assert.match(f.path, /^[\w./-]+\.\w+$/, `${p.id}/${f.id}: a file path`);
    }
    assert.equal(new Set(h.features.map((f) => f.id)).size, h.features.length, `${p.id}: no feature twice`);
  }
});

test("a product in design has no highlight", () => {
  for (const p of IN_DESIGN) assert.ok(!(p.id in PRODUCT_HIGHLIGHTS), p.id);
  for (const l of ["en", "fr"])
    for (const p of IN_DESIGN) assert.ok(!(p.id in messages[l].site.home.products.highlights), `${l}: ${p.id}`);
});

test("each highlight is one short line in both languages, honest words, commercial names only", () => {
  for (const l of ["en", "fr"]) {
    const lines = messages[l].site.home.products.highlights;
    assert.deepEqual(Object.keys(lines).sort(), PRODUCTS.map((p) => p.id).sort(), l);
    for (const [id, line] of Object.entries(lines)) {
      assert.ok(line.length > 0 && line.length <= 90, `${l}/${id}: ≤ 90 characters (${line.length})`);
      assert.ok(!line.includes("—"), `${l}/${id}: no em dash`);
      assert.deepEqual(findCodeNames(line), [], `${l}/${id}: no code name`);
      assert.doesNotMatch(
        line,
        /\$|€|prix|price|gratuit|free|beta|bêta|inscri|sign up|waiting list|liste d'attente|bientôt|soon|\b20\d\d\b/i,
        `${l}/${id}: no price, no date, no sign-up`,
      );
    }
  }
});

test("the card shows the highlight under its line, from the data and the messages", () => {
  // Since krizaka-internal#3243 the home's rows say one neutral line each: the highlight is no longer on the home.
  assert.ok(!showcase.includes("kz-entry-crush"), "the rows carry no highlight");
  assert.ok(!showcase.includes("PRODUCT_HIGHLIGHTS"), "the home does not read the highlights");
});

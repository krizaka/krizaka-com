import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { heroMarkOrder } from "../lib/home-sections.ts";
const PRODUCTS = ["orazaka", "yomizaka", "akinaza"].map((id) => ({ id }));

const msg = (l) => JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8"));

// Oussama, 2026-10-22: the honest chronology. Orazaka first, then the open stack, then the products, then the company.
test("the marks under the hero: Orazaka, then Akinaza, Yomizaka, then the rest as listed", () => {
  const ids = heroMarkOrder(PRODUCTS).map((p) => p.id);
  assert.deepEqual(ids.slice(0, 3), ["orazaka", "akinaza", "yomizaka"]);
  assert.deepEqual(
    ids.slice(3),
    PRODUCTS.map((p) => p.id).filter((id) => !ids.slice(0, 3).includes(id)),
  );
  assert.equal(ids.length, PRODUCTS.length);
});

test("the hero lead tells the order in short sentences, no em dash", () => {
  for (const l of ["en", "fr"]) {
    const { lead } = msg(l).site.home.hero;
    assert.match(lead, /Orazaka.*Krizaka UI.*Krizaka Java/s, l);
    assert.doesNotMatch(lead, /[\u2014\u2013]/, l);
    assert.ok(lead.split(/[.]\s/).length <= 3, `${l}: two or three sentences`);
  }
});

test("Orazaka is entry KZ-01: the products' own plate and specimen tag, its flow as fig. 1, the duck, what it gives folded in", () => {
  const src = readFileSync(new URL("../app/components/home/ProductShowcase.tsx", import.meta.url), "utf8");
  const fn = src.slice(src.indexOf("function EngineEntry"), src.indexOf("function ProductEntry"));
  assert.match(fn, /<SpecimenTag/, "the same tag as the products");
  assert.match(fn, /\{\.\.\.tagProps\(p, t\)\}/, "it wears the tag props the products wear");
  assert.match(src, /code: code\(p\)/, "its catalogue number is KZ-01 (first of lib/products.ts)");
  assert.match(fn, /<EngineFlowView/);
  assert.match(fn, /<Caption figure=\{figNo\(s\.figureLabel, p\)\}/, "the flow is a numbered figure like the others");
  assert.match(
    fn,
    /className=\{cn\("kz-entry", "kz-entry-engine", "brand-" \+ p\.id\)\}/,
    "same entry, its brand light",
  );
  assert.match(fn, /<details className="kz-entry-gives"/, "what it gives is folded in the tag");
  assert.match(fn, /<Bird bird=\{PRODUCT_BIRD\[p\.id\]\}/, "its mascot, the data's");
  assert.doesNotMatch(fn, /kz-foundation/, "the foundation plate is gone");
  assert.match(fn, /ENGINE_USES/, "what it powers is read from lib/engine-uses.ts");
  assert.match(fn, /href=\{`#product-\$\{x\.id\}`\}/, "each powered product is a link to its entry");
  assert.match(src, /href="#product-orazaka"/, "each product's card links back to the engine");
  assert.doesNotMatch(fn, /webhook|run events|SSE/i, "only what runs is said (orazaka#189)");
  assert.match(
    readFileSync(new URL("../lib/story.ts", import.meta.url), "utf8"),
    /orazaka: "duck"/,
    "the duck builds: Orazaka's bird everywhere",
  );
  const css = readFileSync(new URL("../app/components/home/home.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /\.kz-foundation/);
  assert.doesNotMatch(
    css.slice(css.indexOf(".kz-entry-gives")),
    /#[0-9a-f]{3,6}\b|glow|blur\(|radial-gradient/i,
    "tokens only",
  );
  for (const l of ["en", "fr"]) {
    const e = msg(l).site.home.engine;
    assert.deepEqual(Object.keys(e.gives), ["models", "pipeline", "analytics"], l);
    assert.doesNotMatch(JSON.stringify(e), /[\u2014\u2013]/, l);
  }
});

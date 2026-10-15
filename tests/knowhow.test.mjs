import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Krizaka's story is its know-how (2026-10-14): each product proves one thing the studio knows how to do. The home,
// /products, /open-source and /story are cut that way; a product added to lib/products.ts must say what it proves.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`)).site;
const ids = [...read("lib/products.ts").matchAll(/\{ id: "(\w+)", name:/g)].map((m) => m[1]);

test("every product of lib/products.ts proves a know-how, in both languages", () => {
  assert.ok(ids.length >= 4, ids.join());
  for (const lang of ["en", "fr"]) {
    const k = messages(lang).products.knowhow;
    assert.deepEqual(Object.keys(k).sort(), [...ids].sort(), `${lang}: site.products.knowhow`);
    for (const id of ids) {
      assert.ok(k[id].name.length > 3 && k[id].proof.length > 40, `${lang}: ${id}`);
      assert.match(messages(lang).products.proofBy, /\{name\}/);
    }
  }
});

test("the known know-hows are the ones Oussama named", () => {
  const k = messages("en").products.knowhow;
  assert.match(k.orazaka.name, /engine/i);
  assert.match(k.orochia.name, /media/i);
  assert.match(k.yasakia.name, /geolocation/i);
  assert.match(k.yororis.name, /voice/i);
});

test("one product card for the whole site: the home, /products and /story render the same ProductCard from PRODUCTS", () => {
  const card = read("app/components/ProductCard.tsx");
  assert.match(card, /h\.knowhow\[p\.id\]/);
  assert.match(card, /<ArgumentCard/);
  assert.match(card, /href: p\.devUrl/);
  assert.match(card, /href: p\.repoUrl/);
  assert.match(card, /PRODUCTS\.filter/);
  for (const file of ["app/components/home/WhatWeBuild.tsx", "app/[locale]/products/page.tsx", "app/[locale]/story/page.tsx"]) {
    assert.match(read(file), /from "(@\/app\/components|\.\.)\/ProductCard"/, `${file} reads the shared card`);
  }
  for (const file of ["app/[locale]/story/StoryClient.tsx", "app/[locale]/story/page.tsx"]) {
    assert.doesNotMatch(read(file), /ProfileCard|StatGauge|ChoiceGrid|<ProductLogo/, `${file} draws its own product tile`);
  }
  const os = read("app/[locale]/open-source/page.tsx");
  assert.match(os, /id="knowhow"/);
  assert.match(os, /href=\{`#\$\{nav\.id\}`\}/, "a card of the foundation leads to the product's repositories");
  assert.match(os, /id="runs-on"/, "the runs-on table stays");
});

test("a product card's one line is a hook: 90 characters at most, in both languages", () => {
  for (const lang of ["en", "fr"]) {
    for (const [id, c] of Object.entries(messages(lang).products.cards)) assert.ok(c.line.length <= 90, `${lang}: products.cards.${id}.line (${c.line.length})`);
  }
});

test("/story keeps its spine: founder, refusal, engine, first proofs, roster, open blocks — and the roster is the rest of PRODUCTS", () => {
  for (const lang of ["en", "fr"]) {
    const st = messages(lang).story.stages;
    assert.deepEqual(Object.keys(st), ["founder", "refusal", "engine", "proves", "roster", "open"], `${lang}: site.story.stages`);
    assert.deepEqual(st.founder.places, ["Montréal", "Maroc", "Grenoble"]);
    assert.equal(messages(lang).story.chapters, undefined, `${lang}: the per-product chapters are gone`);
  }
  const story = read("lib/story.ts");
  assert.match(story, /PROVES_FIRST[^=]*= \["yomizaka", "orochia"\]/);
  assert.match(story, /ROSTER[^=]*= PRODUCTS\.map/);
  const bars = /StatGauge|NumberTicker value=\{1\}|percent\(1\)/;
  assert.doesNotMatch(read("app/[locale]/story/StoryClient.tsx"), bars, "no 100 % bar that measures nothing");
});

test("Orochia's know-how is worded neutrally", () => {
  const pitch = /creator|créat|payout|paid|payé|payment|paiement|\btips?\b|pourboire|90 ?%|adult|adulte|18\+/i;
  for (const lang of ["en", "fr"]) assert.doesNotMatch(JSON.stringify(messages(lang).products.knowhow.orochia), pitch, lang);
});

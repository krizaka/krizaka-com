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

test("the home, /products and /open-source read the know-how of each product — and every card leads somewhere", () => {
  const home = read("app/components/home/WhatWeBuild.tsx");
  assert.match(home, /products\.knowhow\[p\.id\]/);
  assert.match(home, /<LinkCard[\s\S]*href=\{p\.devUrl\}/);
  const cards = read("app/components/home/ProductCards.tsx");
  assert.match(cards, /h\.knowhow\[p\.id\]/);
  assert.match(cards, /href=\{p\.devUrl\}/);
  assert.match(cards, /href=\{p\.repoUrl\}/);
  const os = read("app/[locale]/open-source/page.tsx");
  assert.match(os, /id="knowhow"/);
  assert.match(os, /href=\{`#\$\{nav\.id\}`\}/, "a card of the foundation leads to the product's repositories");
  assert.match(os, /id="runs-on"/, "the runs-on table stays");
});

test("every chapter of /story names the know-how it proves; the planned guard words stay", () => {
  for (const lang of ["en", "fr"]) {
    const chapters = messages(lang).story.chapters;
    for (const [id, c] of Object.entries(chapters)) assert.ok(c.knowhow, `${lang}: story.chapters.${id}.knowhow`);
    assert.equal(messages(lang).story.roles, undefined);
  }
});

test("Orochia's know-how is worded neutrally", () => {
  const pitch = /creator|créat|payout|paid|payé|payment|paiement|\btips?\b|pourboire|90 ?%|adult|adulte|18\+/i;
  for (const lang of ["en", "fr"]) assert.doesNotMatch(JSON.stringify(messages(lang).products.knowhow.orochia), pitch, lang);
});

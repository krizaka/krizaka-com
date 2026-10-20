import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The home's #products as Cahier field-guide entries (ADR-004 of krizaka-ui, #417; Oussama 2026-10-20: « our showcase,
// refined, less AI, very complete and designed »). Each product is an entry: a plate (the live visual and its numbered
// caption), a specimen tag (number, name, the stamp of its honest status, its line, its bird, what it runs on Orazaka)
// and a sourced footnote. The engine leads with its own tag and the flow.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const showcase = read("app/components/home/ProductShowcase.tsx");
const css = read("app/components/home/home.css");
const vcss = read("app/components/home/visuals/visuals.css");
const visuals = read("app/components/home/visuals/ProductVisuals.tsx");
const messages = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };
const ids = [...read("lib/products.ts").matchAll(/\{ id: "(\w+)", name:/g)].map((m) => m[1]);

test("built from the Cahier's blocks of @krizaka/ui, on lined paper with its margin and its number — no eyebrow", () => {
  for (const part of ['from "@krizaka/ui/specimen-tag"', 'from "@krizaka/ui/footnote"', 'from "@krizaka/ui/mascots"']) assert.ok(showcase.includes(part), part);
  assert.match(showcase, /<SpecimenTag\b/);
  assert.match(showcase, /<Caption figure=/);
  assert.match(showcase, /<Footnotes\b/);
  assert.match(showcase, /<FootnoteRef\b/);
  assert.match(showcase, /<Section id="products" number=\{s\.number\}[^>]*paper="lines"[^>]*margin/);
  assert.doesNotMatch(showcase, /eyebrow=/, "no overline above the heading");
  assert.doesNotMatch(showcase, /<ProductStatus status=/, "the status is a stamp, not an uppercase mono chip");
  for (const l of ["en", "fr"]) assert.equal(messages[l].site.home.products.number, "§ 2", l);
});

test("the stamp says the status honestly, from the data", () => {
  assert.match(showcase, /devPreview: "ok"/);
  assert.match(showcase, /development: "wip"/);
  assert.match(showcase, /construction: "construction"/);
  assert.match(showcase, /upcoming: "neutral"/);
  assert.match(showcase, /status=\{\{ label: t\.site\.nav\.status\[p\.status\]\.label, tone: STAMP\[p\.status\] \}\}/);
});

test("each product wears its bird; the five birds of the film say their promise word for word, the family birds their name", () => {
  assert.match(showcase, /PRODUCT_BIRD\[p\.id\]/);
  assert.match(showcase, /t\.site\.story\.world\.cues/, "a film bird's line is the film's cue itself, never retyped");
  for (const l of ["en", "fr"]) {
    const birds = messages[l].site.home.products.birds;
    assert.deepEqual(Object.keys(birds).sort(), ["beaver", "crane", "lovebird", "magpie"], `${l}: only the family birds are named here`);
    for (const b of Object.values(birds)) assert.ok(b.length < 20, `${l}: ${b} is a name, not an invented promise`);
  }
});

test("every entry has a numbered figure caption and a sourced note, in both languages", () => {
  for (const l of ["en", "fr"]) {
    const p = messages[l].site.home.products;
    assert.deepEqual(Object.keys(p.figures).sort(), [...ids].sort(), `${l}: a caption per product`);
    assert.deepEqual(Object.keys(p.notes).sort(), [...ids].sort(), `${l}: a sourced note per product`);
  }
  assert.match(showcase, /figure=\{`\$\{s\.figureLabel\} \$\{/);
  assert.match(showcase, /notes=\{/);
});

test("no em-dash in the showcase's words, and no uppercase, tracked caps, blur or glow in its styles (#417)", () => {
  for (const l of ["en", "fr"]) {
    const words = JSON.stringify([messages[l].site.home.products, messages[l].site.home.visuals, Object.values(messages[l].site.products.cards).map((c) => c.line)]);
    assert.doesNotMatch(words, /—/, `${l}: an em-dash in the products' words`);
  }
  for (const [name, src] of [["home.css", css], ["visuals.css", vcss]]) {
    assert.doesNotMatch(src, /text-transform:\s*uppercase/, `${name}: uppercase`);
    assert.doesNotMatch(src, /letter-spacing:\s*0\.\d+em/, `${name}: tracked caps`);
    assert.doesNotMatch(src, /blur\(|radial-gradient|backdrop-filter/, `${name}: a blur or a glow`);
  }
  assert.doesNotMatch(visuals, /uppercase|tracking-/, "the visuals' classes");
});

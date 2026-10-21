import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// A few more touches of the Cahier (krizaka-ui ADR-004, #417), with restraint: § 4 and § 5 sit on ruled paper with the
// red margin, the five rules are a numbered notebook list, § 5 carries a small stamp, and two folios (page numbers)
// close the pages. The rest of the site stays calm.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const principles = read("app/components/home/Principles.tsx");
const company = read("app/components/home/Company.tsx");
const css = read("app/components/home/home.css");
const msgs = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };

test("§ 4 and § 5 are on ruled paper with the red margin", () => {
  for (const [name, src] of [["Principles", principles], ["Company", company]]) {
    assert.match(src, /<Section\b[^>]*paper="lines"/s, `${name}: no ruled paper`);
    assert.match(src, /<Section\b[^>]*\bmargin\b/s, `${name}: no margin`);
  }
});

test("the five rules are a numbered notebook list, no box in a box", () => {
  assert.match(principles, /<ol className="kz-notebook-list"/);
  assert.match(css, /\.kz-notebook-list\b[^{]*\{/);
  assert.match(css, /counter-increment/);
  assert.match(css, /var\(--kz-paper-rule-margin\)/);
  assert.doesNotMatch(css.match(/\.kz-notebook-list[^{]*\{[^}]*\}/g)?.join("") ?? "", /box-shadow|border-radius|radial-gradient|blur\(/);
});

test("§ 5 wears a small stamp, and both pages end on a folio", () => {
  assert.match(company, /<Stamp\b/);
  assert.match(principles, /kz-folio/);
  assert.match(company, /kz-folio/);
  assert.match(css, /\.kz-folio\b[^{]*\{/);
  for (const l of ["en", "fr"]) {
    const h = msgs[l].site.home;
    assert.ok(h.company.stamp, `${l}: company.stamp`);
    assert.match(h.principles.folio, /4/, `${l}: principles.folio`);
    assert.match(h.company.folio, /5/, `${l}: company.folio`);
  }
});

test("the touches stay quiet: static, tokens only, reduced motion untouched", () => {
  const mine = css.slice(css.indexOf("Cahier touches")).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(css.includes("Cahier touches"));
  assert.doesNotMatch(mine, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|animation|transition|@keyframes/);
  for (const src of [principles, company]) assert.doesNotMatch(src, /"use client"/);
});

test("no em dash in § 4 and § 5 messages, in English or French", () => {
  for (const l of ["en", "fr"]) {
    const h = msgs[l].site.home;
    assert.doesNotMatch(JSON.stringify({ p: h.principles, c: h.company }), /[—–]/, `${l}: dash`);
  }
});

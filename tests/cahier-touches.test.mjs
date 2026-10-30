import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// A few more touches of the Cahier (krizaka-ui ADR-004, #417), with restraint: § 4 sits on ruled paper with the
// red margin, the five rules are a numbered notebook list, and a folio (page number)
// closes the page. The rest of the site stays calm.
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const principles = read("app/components/home/Principles.tsx");
const css = read("app/components/home/home.css");
const msgs = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };

test("§ 4 is on ruled paper with the red margin", () => {
  for (const [name, src] of [["Principles", principles]]) {
    assert.match(src, /<Section\b[^>]*paper="lines"/s, `${name}: no ruled paper`);
    assert.match(src, /<Section\b[^>]*\bmargin\b/s, `${name}: no margin`);
  }
});

test("the five rules are a numbered notebook list, no box in a box", () => {
  assert.match(principles, /<ol className="kz-notebook-list"/);
  assert.match(css, /\.kz-notebook-list\b[^{]*\{/);
  assert.match(css, /counter-increment/);
  assert.match(css, /var\(--kz-paper-rule-margin\)/);
  assert.doesNotMatch(
    css.match(/\.kz-notebook-list[^{]*\{[^}]*\}/g)?.join("") ?? "",
    /box-shadow|border-radius|radial-gradient|blur\(/,
  );
});

test("§ 4 ends on a folio, derived from the section list", () => {
  assert.match(principles, /kz-folio/);
  assert.match(css, /\.kz-folio\b[^{]*\{/);
  for (const l of ["en", "fr"]) {
    const h = msgs[l].site.home;
    assert.match(h.principles.folio, /\{page\}.*\{total\}/, `${l}: principles.folio`);
  }
});

test("the touches stay quiet: static, tokens only, reduced motion untouched", () => {
  const mine = css.slice(css.indexOf("Cahier touches")).replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(css.includes("Cahier touches"));
  assert.doesNotMatch(mine, /#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(|animation|transition|@keyframes/);
  for (const src of [principles]) assert.doesNotMatch(src, /"use client"/);
});

test("no em dash in § 4 messages, in English or French", () => {
  for (const l of ["en", "fr"]) {
    const h = msgs[l].site.home;
    assert.doesNotMatch(JSON.stringify({ p: h.principles }), /[—–]/, `${l}: dash`);
  }
});

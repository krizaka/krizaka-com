import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const msgs = (l) =>
  JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8")).site.legal.privacy;

const LINES = {
  en: "Person in charge of the protection of personal information: the president of Technologies Krizaka Inc. — confidentialite@krizaka.com",
  fr: "Responsable de la protection des renseignements personnels : le président de Technologies Krizaka Inc. — confidentialite@krizaka.com",
};

test("Loi 25: the privacy page names the person in charge by role (the president) and confidentialite@, no person, no home address", () => {
  for (const l of ["en", "fr"]) {
    const s = msgs(l).sections.find((x) => x.id === "privacy-officer");
    assert.ok(s, `${l}: a privacy officer section`);
    const text = s.paragraphs.join(" ");
    assert.ok(s.paragraphs.includes(LINES[l]), `${l}: the exact line`);
    assert.match(text, /confidentialite@krizaka\.com/);
    assert.doesNotMatch(text, /contact@krizaka\.com/, `${l}: privacy matters go to confidentialite@`);
    assert.doesNotMatch(text, /Sainte-Marguerite|H4C/, `${l}: no home/registered address`);
    assert.doesNotMatch(JSON.stringify(msgs(l)), /fondateur|founder/i, `${l}: the role is the president, not a person`);
  }
});

test("Loi 25: the legal pages' date follows the change", () => {
  const m = (l) =>
    JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8")).site.legal.updated;
  assert.match(m("en"), /November 5, 2026/);
  assert.match(m("fr"), /5 novembre 2026/);
});

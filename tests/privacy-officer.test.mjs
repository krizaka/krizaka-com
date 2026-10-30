import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const msgs = (l) =>
  JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), "utf8")).site.legal.privacy;

test("Loi 25: the privacy page publishes the officer's title, contact, company and city, no home address", () => {
  for (const [l, title] of [
    ["en", "Responsable de la protection des renseignements personnels"],
    ["fr", "Responsable de la protection des renseignements personnels"],
  ]) {
    const s = msgs(l).sections.find((x) => /officer|Responsable de la protection/.test(x.title));
    assert.ok(s, `${l}: a privacy officer section`);
    const text = s.paragraphs.join(" ");
    assert.ok(text.includes(title), `${l}: role title`);
    assert.match(text, /contact@krizaka\.com/);
    assert.match(text, /Technologies Krizaka Inc\./);
    assert.match(text, /Montréal/);
    assert.doesNotMatch(text, /Sainte-Marguerite|H4C/, `${l}: no home/registered address`);
  }
});

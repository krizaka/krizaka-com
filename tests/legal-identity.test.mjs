import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const site = read("lib/site.ts");

test("the company is data: its legal name and its NEQ, as the REQ publishes them", () => {
  assert.match(site, /legalName: "Technologies Krizaka Inc\."/);
  assert.match(site, /neq: "1182652231"/);
});

test("the footer and both legal pages name the company with its NEQ, in both languages", () => {
  assert.match(read("app/components/SiteFooter.tsx"), /format\(f\.company, COMPANY\)/);
  assert.match(read("app/components/LegalPage.tsx"), /format\(p, COMPANY\)/);
  for (const l of ["en", "fr"]) {
    const s = JSON.parse(read(`messages/${l}.json`)).site;
    assert.match(s.footer.company, /\{legalName\}.*NEQ \{neq\}/, `${l}: footer`);
    for (const page of ["privacy", "terms"]) assert.match(s.legal[page].sections[0].paragraphs[0], /\{legalName\}.*\{neq\}/, `${l}: ${page}`);
  }
});

test("nothing private reaches the site: no street, postal code, phone or tax account number", () => {
  for (const l of ["en", "fr"]) {
    const text = read(`messages/${l}.json`);
    assert.doesNotMatch(text, /Sainte-Marguerite|H4C\s?\d|clicS[ÉE]QUR|\bTPS\b.*\d{9}|\bTVQ\b.*\d{10}|\(?514\)?[ -.]?\d{3}[ -.]?\d{4}/, l);
  }
  assert.doesNotMatch(site, /Sainte-Marguerite|H4C/);
});

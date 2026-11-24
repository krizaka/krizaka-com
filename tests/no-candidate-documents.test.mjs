import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Founder rule of 2026-11-23 (krizaka-internal#4793): no public promise on a tenant candidate's documents
// before the lawyer review. Verikora is presented as reading a lease, nothing else.
const FORBIDDEN =
  /pay ?stubs?|payslips?|talons? de paie|relev[ée]s? (?:bancaires?|de compte)|bank statements?|\bstatements\b|\brelevés\b/i;

for (const locale of ["fr", "en"]) {
  test(`${locale}: no public message names pay stubs or statements`, () => {
    const messages = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
    const hits = [];
    const walk = (node, path) => {
      if (typeof node === "string") {
        if (FORBIDDEN.test(node)) hits.push(path);
      } else if (node && typeof node === "object") {
        for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
      }
    };
    walk(messages, locale);
    assert.deepEqual(hits, []);
  });

  test(`${locale}: the home lead says Verikora reads a lease`, () => {
    const messages = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
    assert.match(messages.site.home.hero.lead, locale === "fr" ? /bail/ : /lease/);
  });
}

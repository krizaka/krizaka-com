// krizaka.com claims no Law 25 / GDPR / PIPEDA conformity: Orazaka keeps data on the operator's machines,
// it holds no certification. The machine-read surfaces (llms-full.txt, the Organization JSON-LD) say so too.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("llms-full.txt does not claim Law 25, GDPR or PIPEDA conformity", () => {
  const text = read("content/llms-full.txt");
  assert.doesNotMatch(text, /\((Law 25|GDPR|PIPEDA)[^)]*by architecture\)/);
  assert.doesNotMatch(text, /\b(GDPR|Law 25)[- ]compli/i);
});

test("the Organization does not list a compliance it does not hold", () => {
  const text = read("lib/structured-data.ts");
  assert.doesNotMatch(text, /"GDPR compliance"/);
  assert.doesNotMatch(text, /compliance"/i);
});

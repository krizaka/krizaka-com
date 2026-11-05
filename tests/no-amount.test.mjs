import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// No price anywhere (founder, 2026-11-03), and an example is read as our price: the home's engine demo said « Prix : 120 $ par
// mois » (meeting of 2026-11-05). A money amount may appear in the messages only inside a quoted document passage (`passage`,
// e.g. the lease clause Verikora flags), never in our own words.
const AMOUNT = /\d\s?\$|\$\s?\d|\d\s?€|\b(?:CAD|USD)\b/;

function amounts(node, path, out) {
  if (typeof node === "string") {
    if (AMOUNT.test(node) && !path.endsWith(".passage")) out.push(`${path}: ${node}`);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) amounts(value, path ? `${path}.${key}` : key, out);
  }
  return out;
}

for (const locale of ["en", "fr"]) {
  test(`${locale}: no money amount in our words, only in a quoted passage`, () => {
    const messages = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
    assert.deepEqual(amounts(messages, "", []), []);
  });
}

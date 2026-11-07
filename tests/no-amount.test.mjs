import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// No price anywhere (founder, 2026-11-03), and an example is read as our price: the home's engine demo said « Prix : 120 $ par
// mois » (meeting of 2026-11-05). A money amount may appear in the messages only inside a quoted document passage (`passage`,
// e.g. the lease clause Verikora flags) or a line of a film's transcript (the film's own titles, quoted as its text
// alternative: the Sovkora trailer says « 7 plans, 1,76 $ de GPU », krizaka-internal#2837), never in our own words.
const AMOUNT = /\d\s?\$|\$\s?\d|\d\s?€|\b(?:CAD|USD)\b/;
const QUOTED = /\.passage$|^site\.home\.films\.[^.]+\.transcript\.lines\.\d+$/;

function amounts(node, path, out) {
  if (typeof node === "string") {
    if (AMOUNT.test(node) && !QUOTED.test(path)) out.push(`${path}: ${node}`);
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) amounts(value, path ? `${path}.${key}` : key, out);
  }
  return out;
}

test("the exemption is a quoted passage or a film transcript's line, never our own words", () => {
  const words = { site: { home: { films: { t: { caption: "1,76 $", transcript: { lines: ["1,76 $"] } } } } } };
  assert.deepEqual(amounts(words, "", []), ["site.home.films.t.caption: 1,76 $"]);
  assert.deepEqual(amounts({ a: { passage: "120 $" }, b: "120 $" }, "", []), ["b: 120 $"]);
});

for (const locale of ["en", "fr"]) {
  test(`${locale}: no money amount in our words, only in a quoted passage`, () => {
    const messages = JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
    assert.deepEqual(amounts(messages, "", []), []);
  });
}

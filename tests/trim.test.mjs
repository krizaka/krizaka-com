import test from "node:test";
import assert from "node:assert/strict";
import { dropLastWord, stripTrailingSlashes, withFinalPeriod } from "../lib/trim.ts";

const SAMPLES = [
  "",
  " ",
  "a",
  "a b",
  "a b ",
  "a  b  c",
  "a b c.",
  "x.. ",
  "https://x.y//",
  "///",
  "tab\tword\t",
  "one two\n",
  "  lead",
];

test("stripTrailingSlashes equals /\\/+$/", () => {
  for (const s of SAMPLES) assert.equal(stripTrailingSlashes(s), s.replace(/\/+$/, ""), JSON.stringify(s));
});

test("withFinalPeriod equals /[.\\s]*$/ -> '.'", () => {
  for (const s of SAMPLES) assert.equal(withFinalPeriod(s), s.replace(/[.\s]*$/, "."), JSON.stringify(s));
});

test("dropLastWord equals /\\s+\\S*$/ -> ''", () => {
  for (const s of SAMPLES) assert.equal(dropLastWord(s), s.replace(/\s+\S*$/, ""), JSON.stringify(s));
});

test("a long run of the character stays fast", () => {
  const long = "/".repeat(200_000);
  const t = Date.now();
  assert.equal(stripTrailingSlashes(`a${long}`), "a");
  assert.equal(dropLastWord(" ".repeat(200_000) + "x"), "");
  assert.ok(Date.now() - t < 500);
});

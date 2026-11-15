import { test } from "node:test";
import assert from "node:assert/strict";
import { localized, messageAt } from "../lib/footer.ts";

test("messageAt reads a dotted key and refuses a missing or non-text one", () => {
  const dictionary = { site: { footer: { story: "Our story", nested: { a: 1 } } } };
  assert.equal(messageAt(dictionary, "site.footer.story"), "Our story");
  assert.throws(() => messageAt(dictionary, "site.footer.missing"), {
    name: "TypeError",
    message: /no message at site\.footer\.missing/,
  });
  assert.throws(() => messageAt(dictionary, "site.footer.nested"), TypeError);
  assert.throws(() => messageAt(undefined, "a.b"), TypeError);
});

test("localized puts the locale before an internal path, keeps an absolute address", () => {
  assert.equal(localized("/story", "fr"), "/fr/story");
  assert.equal(localized("/", "en"), "/en");
  assert.equal(localized("https://ui.krizaka.com", "fr"), "https://ui.krizaka.com");
  assert.equal(localized("mailto:hello@example.com", "en"), "mailto:hello@example.com");
});

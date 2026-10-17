// The bar's language switch is the family's (krizaka-ui NavBar.Language), in the bar and in the phone panel — never a pill
// naming the other language, never a hand-made toggle.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const bar = read("app/components/TopNavBar.tsx");
const panel = read("app/components/MobilePanel.tsx");
const hook = read("app/components/LanguageSwitch.tsx");
const messages = { en: JSON.parse(read("messages/en.json")), fr: JSON.parse(read("messages/fr.json")) };

test("the bar and the phone panel use NavBar.Language, and no toggle that swaps to the other language", () => {
  for (const source of [bar, panel]) {
    assert.match(source, /NavBar\.Language/);
    assert.doesNotMatch(source, /toggleLocale|languageShort|otherLanguage|switchLanguage/);
  }
});

test("the languages are the page at its address in each language, by their own names, and the choice is remembered", () => {
  assert.match(hook, /languagesFor\(pathname, LOCALES\)/);
  assert.match(hook, /LOCALE_COOKIE/);
  assert.doesNotMatch(hook, /hrefLang=/);
});

test("the switch is named in both languages, and the old pill's messages are gone", () => {
  assert.equal(messages.en.site.menu.language, "Language");
  assert.equal(messages.fr.site.menu.language, "Langue");
  for (const m of Object.values(messages)) for (const key of ["languageShort", "otherLanguage", "switchLanguage"]) assert.equal(m.site.menu[key], undefined);
});

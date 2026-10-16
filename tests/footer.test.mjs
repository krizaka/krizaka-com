import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// The story lives in the footer's Krizaka column (not in the top bar): the footer must link /story in both languages.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const messages = (lang) => JSON.parse(read(`messages/${lang}.json`));
const footer = read("app/components/SiteFooter.tsx");

test("the footer's Krizaka column links Our story to /story", () => {
  const column = footer.slice(footer.indexOf('<FamilyFooter.Column title="Krizaka">'), footer.indexOf("</FamilyFooter.Column>"));
  assert.match(column, /<Link href="\/story" prefetch=\{false\}>\{f\.story\}<\/Link>/);
});

test("the footer's story label exists in both languages", () => {
  assert.equal(messages("en").site.footer.story, "Our story");
  assert.ok(messages("fr").site.footer.story, "fr: site.footer.story");
});

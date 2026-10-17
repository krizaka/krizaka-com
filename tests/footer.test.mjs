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

// One footer, one contentinfo: the locale layout renders it once, outside every page's <main>; no page, template or
// component renders a second one (a footer inside <main> is not a landmark, and a page footer under the layout's doubles it).
import { readdirSync, statSync } from "node:fs";

const walk = (dir) =>
  readdirSync(new URL(`../${dir}/`, import.meta.url)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    return statSync(new URL(`../${rel}`, import.meta.url)).isDirectory() ? walk(rel) : [rel];
  });

test("the locale layout renders the footer once, after the page and outside any <main>", () => {
  const layout = read("app/[locale]/layout.tsx");
  assert.equal(layout.match(/<SiteFooter \/>/g)?.length, 1);
  assert.ok(layout.indexOf("{children}") < layout.indexOf("<SiteFooter />"));
  assert.doesNotMatch(layout, /<main/);
});

test("no page renders a footer of its own", () => {
  const offenders = walk("app")
    .filter((file) => /\.tsx$/.test(file) && file !== "app/components/SiteFooter.tsx" && file !== "app/[locale]/layout.tsx")
    .filter((file) => /<SiteFooter\b|<FamilyFooter\b|<footer\b/.test(read(file)));
  assert.deepEqual(offenders, []);
});

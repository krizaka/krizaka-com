// One footer, one band (Oussama, 2026-10-21: « les doubles footers, je les vois partout »). The page ends with exactly one
// @krizaka/ui SiteFooter, rendered once in the locale layout; nothing else here draws a footer-like band.
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const walk = (dir) =>
  readdirSync(new URL(`../${dir}`, import.meta.url)).flatMap((f) => {
    const p = join(dir, f);
    return statSync(new URL(`../${p}`, import.meta.url)).isDirectory() ? walk(p) : [p];
  });
const sources = walk("app").filter((f) => /\.(tsx|ts)$/.test(f));

test("the locale layout renders the footer exactly once", () => {
  assert.equal((read("app/[locale]/layout.tsx").match(/<SiteFooter\b/g) ?? []).length, 1);
});

test("no other file draws a <footer> or imports the family footer", () => {
  const offenders = sources
    .filter((f) => f !== "app/components/SiteFooter.tsx")
    .filter((f) => /<footer\b|@krizaka\/ui\/site-footer/.test(read(f)));
  assert.deepEqual(offenders, []);
});

test("the footer is the family's: no site block, no second strip, the page is told so the current company link says it", () => {
  const src = read("app/components/SiteFooter.tsx");
  assert.match(src, /@krizaka\/ui\/site-footer/);
  assert.match(src, /variant="site"/);
  assert.doesNotMatch(src, /family=\{false\}/);
  assert.match(src, /path=\{pathname\}/, "« Our story » on /story says so (aria-current) and scrolls to the top");
});

test("the installed footer has one rule only: its own top edge (no bottom bar under the columns)", () => {
  const dir = new URL("../node_modules/@krizaka/ui/dist/", import.meta.url);
  const file = readdirSync(dir).find(
    (f) => /^site-footer.*\.js$/.test(f) && /border-t/.test(readFileSync(new URL(f, dir), "utf8")),
  );
  assert.ok(file, "the footer's styles are in the installed package");
  const rules = readFileSync(new URL(file, dir), "utf8").match(/border-t(?!-)/g) ?? [];
  assert.equal(rules.length, 1);
});

// The home's products read as a timeline (founder, 2026-11-01, krizaka-internal#683): the tag and the plate swapping sides
// from one entry to the next; one column below 1024 px. Since krizaka-internal#2445 Verikora opens it, and the engine is a
// line further down (its side, computed after the products, is unused on the home).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { entrySide, heroMarkOrder } from "../lib/home-sections.ts";
import { PRODUCTS } from "../lib/products.ts";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("the sides alternate in the market's order: Verikora's tag left, then the plate, then the tag", () => {
  const order = heroMarkOrder(PRODUCTS).map((p) => [p.id, entrySide(PRODUCTS, p.id)]);
  assert.deepEqual(order.slice(0, 3), [
    ["yomizaka", "card-left"],
    ["akinaza", "plate-left"],
    ["orazaka", "card-left"],
  ]);
  for (let i = 1; i < order.length; i++) assert.notEqual(order[i][1], order[i - 1][1], `${order[i][0]} swaps sides`);
});

test("every entry carries its side from the data, never from its place in a list; the ones in design go on alternating", () => {
  const src = read("app/components/home/ProductShowcase.tsx");
  assert.equal(src.match(/data-side=\{entrySide\(PRODUCTS, p\.id\)\}/g)?.length, 1, "each product's");
  assert.match(src, /const DESIGN_SIDE = SHOWN\.length % 2 === 0 \? "card-left" : "plate-left";/);
  assert.match(src, /data-side=\{DESIGN_SIDE\}/);
  assert.doesNotMatch(src, /nth-child/);
});

test("the tag goes first on a wide screen when its side is left, and the page is one column below 1024 px", () => {
  const css = read("app/components/home/home.css");
  assert.match(css, /\.kz-entry\[data-side="card-left"\] \.kz-entry-tag \{\s*order: -1;/);
  const wide = css.slice(css.indexOf("@media (min-width: 1024px)"));
  assert.match(
    wide,
    /\.kz-entry\[data-side="card-left"\] \{\s*grid-template-columns: minmax\(0, 5fr\) minmax\(0, 7fr\);/,
  );
  assert.doesNotMatch(css, /@media \(min-width: 640px\) \{\s*\.kz-entry \{/, "no two columns on a phone or a tablet");
});

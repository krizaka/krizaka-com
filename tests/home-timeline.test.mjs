// The home's products alternate (founder, 2026-11-01, krizaka-internal#683), in the row's order (krizaka-internal#2450),
// Sovkora first since 2026-11-06 (#2714): Sovkora with its carousel on the left, Verikora with its tag on the left, Folioviv;
// the tag and the carousel swap sides from one entry to the next; one column below 1024 px.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { entrySide, productOrder } from "../lib/home-sections.ts";
import { PRODUCTS } from "../lib/products.ts";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("the sides alternate in the row's order: Sovkora's carousel left, Verikora's tag left, Folioviv's carousel left", () => {
  const order = productOrder(PRODUCTS).map((p) => [p.id, entrySide(PRODUCTS, p.id)]);
  assert.deepEqual(order.slice(0, 3), [
    ["orazaka", "plate-left"],
    ["yomizaka", "card-left"],
    ["akinaza", "plate-left"],
  ]);
  for (let i = 1; i < order.length; i++) assert.notEqual(order[i][1], order[i - 1][1], `${order[i][0]} swaps sides`);
});

test("every entry, the engine's too, carries its side from the data, never from its place in a list", () => {
  const src = read("app/components/home/ProductShowcase.tsx");
  assert.equal(
    src.match(/data-side=\{entrySide\(PRODUCTS, p\.id\)\}/g)?.length,
    1,
    "one entry for the engine and the products alike",
  );
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

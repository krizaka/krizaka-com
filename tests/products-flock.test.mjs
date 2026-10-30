// The flock opens the products section (Oussama 2026-10-21: « it doesn't seem to belong here, it looks stuck in the middle »):
// a full-width band, no frame, its ground running into the section; each bird IS a product — hover, focus or tap lights its
// row and its node, and the row lights its bird; a name on hover or focus, a link to its entry; no layout shift.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { BAND_TALL, BAND_WIDE, HERO_FLOCK } from "../lib/products-flock.ts";
import { PRODUCT_RECORDS, cssDecls, hasCode, jsx, jsxAll, strings } from "./helpers/source.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const ids = PRODUCT_RECORDS().map((p) => p.id);
const PRODUCT_BIRD = Object.fromEntries(
  [...read("lib/story.ts").matchAll(/^\s+(\w+): "(\w+)",$/gm)].map((m) => [m[1], m[2]]),
);

test("every product has its bird on the band, in both cuts, inside the frame, the engine's duck in the middle and larger", () => {
  for (const band of [BAND_WIDE, BAND_TALL]) {
    assert.deepEqual(band.birds.map((b) => b.product).sort(), [...ids].sort());
    for (const b of band.birds) {
      assert.equal(b.bird, PRODUCT_BIRD[b.product], b.product);
      assert.ok(b.x - b.size / 2 >= 0 && b.x + b.size / 2 <= 100 && b.y > 60 && b.y < 100, b.product);
    }
    const engine = band.birds.find((b) => b.product === "orazaka");
    assert.equal(engine.x, 50);
    assert.ok(band.birds.every((b) => b === engine || b.size < engine.size));
  }
});

test("the wide band holds the three products, the engine's duck between the two it powers", () => {
  assert.deepEqual(
    BAND_WIDE.birds.map((b) => b.product),
    ["akinaza", "orazaka", "yomizaka"],
  );
});

test("the hero's five film birds are placed in the tall scene as data", () => {
  assert.equal(HERO_FLOCK.ratio, 4 / 5);
  assert.deepEqual(
    HERO_FLOCK.birds.map((b) => b.bird),
    ["falcon", "owl", "duck", "flamingo", "pigeon"],
  );
  for (const b of HERO_FLOCK.birds) {
    assert.ok(b.x - b.size / 2 >= 0 && b.x + b.size / 2 <= 100 && b.y > 60 && b.y < 100, b.bird);
  }
});

test("the band opens the products section, outside the hero, full width, without a frame", () => {
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.match(
    showcase,
    /<div id="products" className="kz-products">\s*\{\/\*[^]*?\*\/\}\s*<ProductsFlock set=\{VALLEY\} \/>\s*<Section id="products-guide"/,
  );
  const css = read("app/components/home/home.css");
  const band = css.slice(css.indexOf(".kz-band {"), css.indexOf(".kz-band-stage"));
  assert.match(band, /width: 100%/);
  assert.match(band, /aspect-ratio: 16 \/ 6\.1/, "its height is reserved (no layout shift)");
  assert.doesNotMatch(band, /border|box-shadow/, "no frame");
  assert.match(css, /\.kz-band-stage \{[^}]*bottom: calc\(-0\.13 \* 56\.25cqw\)/, "cropped at the ground");
});

test("each bird is a link to its product's entry and says its name; the band and the list light each other", () => {
  const flock = "app/components/home/ProductsFlock.tsx";
  assert.ok(hasCode(flock, "href={`#product-${b.product}`}"));
  assert.ok(jsx(flock).some((e) => e.attrs["aria-label"] === "{nameOf(b.product)}"));
  assert.ok(hasCode(flock, "onFocus={() => point(b.product)}"));
  assert.ok(strings(flock).includes("kz-products-lit"));
  assert.ok(jsxAll(flock, "Flock").some((e) => "greet" in e.attrs && "active" in e.attrs));
  const link = "app/components/home/ProductsLink.tsx";
  assert.ok(strings(link).includes("kz-products-point"));
  assert.ok(strings(link).includes("kz-products-lit"));
  assert.ok(strings(link).includes(".kz-entry[data-product]"), "only the rows follow the scroll, not the birds");
  const hit = cssDecls(
    "app/components/home/home.css",
    ".kz-band-hit:is(:hover, :focus-visible, [data-lit]) .kz-band-cap",
  );
  assert.equal(hit.opacity, "1");
});

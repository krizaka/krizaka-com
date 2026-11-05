// The home's showcase shows work, not decoration (founder, 2026-11-04: « krizaka.com, c'est notre vitrine »;
// krizaka-internal#2229): the valley plate left the home. It showed no action and no result, pushed the products below the
// fold and gave the products other birds than the rest of the page. Its files stay on the CDN; its code is gone.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";

import { cssSelectors, importsOf, read, strings } from "./helpers/source.mjs";

const HOME = [
  "app/[locale]/page.tsx",
  "app/components/home/HomeHero.tsx",
  "app/components/home/ProductShowcase.tsx",
  "app/components/home/Showcase.tsx",
  "app/components/home/ShowcaseCarousel.tsx",
];

test("the home shows no decorative valley: no flock, no ambient loop, no taped photo", () => {
  for (const file of HOME) {
    const from = importsOf(file).map((i) => i.from);
    for (const gone of ["@krizaka/ui/flock", "@krizaka/ui/taped-photo", "./ProductsFlock", "./AmbientLoop"])
      assert.ok(!from.includes(gone), `${file} imports ${gone}`);
    assert.ok(!from.some((f) => /home-ambient|products-flock/.test(f)), `${file} imports the valley's data`);
    assert.doesNotMatch(read(file), /home-valley|brand-films\/ambient/, `${file} names the valley's files`);
  }
});

test("the valley's code is deleted, and nothing listens for its birds", () => {
  for (const file of [
    "app/components/home/ProductsFlock.tsx",
    "app/components/home/AmbientLoop.tsx",
    "lib/home-ambient.ts",
    "lib/products-flock.ts",
  ])
    assert.ok(!existsSync(new URL(`../${file}`, import.meta.url)), `${file} is deleted`);
  for (const file of HOME.slice(1)) {
    const words = strings(file);
    assert.ok(
      !words.includes("kz-products-point") && !words.includes("kz-products-lit"),
      `${file}: no event from a flock`,
    );
  }
  const css = cssSelectors("app/components/home/home.css");
  assert.ok(!css.some((s) => /\.kz-(band|ambient)/.test(s)), "no rule of the band left");
});

test("§ 2 opens on its heading: the products section starts with its Section", () => {
  const src = read("app/components/home/ProductShowcase.tsx");
  assert.match(src, /<div id="products" className="kz-products">\s*<Section id="products-guide"/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

/* One share image per page, in the Cahier (founder, 2026-11-07, krizaka-internal#2833). Every page of the sitemap draws its
   own card from its own words, and the card draws only from the tokens and the fonts' files. The built pages are checked by
   scripts/check-seo.mjs in the container smoke (each page's og:title, og:image and og:url its own). */
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const pages = read("lib/og-pages.ts");
const routeOf = (page) =>
  page === "home" ? "app/[locale]/opengraph-image.tsx" : `app/[locale]/${page}/opengraph-image.tsx`;

test("every page with words in lib/og-pages.ts has its own image route, which draws its own card", () => {
  const ids = [...pages.matchAll(/^ {2}(\w+): \(\{ site \}/gm)].map((m) => m[1]);
  assert.deepEqual(ids, ["home", "docs", "services", "story", "changelog", "contact", "privacy", "terms"]);
  for (const id of ids) {
    assert.ok(existsSync(new URL(`../${routeOf(id)}`, import.meta.url)), `${id}: ${routeOf(id)}`);
    assert.match(read(routeOf(id)), new RegExp(`shareImage\\(shareCardOf\\("${id}", locale\\)\\)`), id);
  }
});

test("every page of the sitemap has an image of its own: a route of its own, or the film's poster", () => {
  const sitemap = read("app/sitemap.ts");
  const paths = [...sitemap.matchAll(/^\s+"(\/[a-z-]*)",$/gm)].map((m) => m[1]);
  for (const path of ["", ...paths]) {
    const id = path === "" ? "home" : path.slice(1);
    assert.ok(existsSync(new URL(`../${routeOf(id)}`, import.meta.url)), `${path || "/"} has no opengraph-image`);
  }
  assert.ok(existsSync(new URL("../app/[locale]/open-source/[block]/opengraph-image.tsx", import.meta.url)));
  assert.match(
    read("app/[locale]/films/[id]/page.tsx"),
    /images: \[video\(f\.base\)\.poster\]/,
    "the film's card is its poster",
  );
});

test("the card is the Cahier: the tokens' paper and ink, the fonts' faces, no gradient, no glow, no typed colour", () => {
  const card = read("lib/og-card.tsx");
  assert.match(card, /themes\.light/);
  assert.match(
    card,
    /"node_modules\/@krizaka\/fonts\/files\/native\/YoungSerif-Regular\.ttf"/,
    "@krizaka/fonts' file, never a copy",
  );
  for (const face of ["YoungSerif-Regular.ttf", "CourierPrime-Regular.ttf"]) assert.ok(card.includes(face), face);
  const code = card.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  assert.doesNotMatch(code, /#[0-9a-f]{3,8}\b|rgba?\(|gradient|blur|boxShadow|borderRadius/i);
  assert.match(card, /§/);
});

test("every page sets its own share title and an og:url that is its canonical", () => {
  const seo = read("lib/seo.ts");
  assert.match(seo, /\.\.\.shareMetadata\(locale, opts\.path, copy\.og \?\? copy\)/, "localizedMetadata always shares");
  for (const f of ["privacy", "terms", "films/[id]", "open-source/[block]"])
    assert.match(read(`app/[locale]/${f}/page.tsx`), /shareMetadata\(/, f);
});

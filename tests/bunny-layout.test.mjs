import { test } from "node:test";
import assert from "node:assert/strict";
import { FOREIGN_WRITERS, LAYOUT_README, RETIRED, ZONE, assertUnder, libraryPath, misplaced, placement } from "../scripts/bunny-layout.mjs";

test("each writer stays under its prefix", () => {
  assert.equal(assertUnder("site", "site/home/a.1234567890.jpg"), "site/home/a.1234567890.jpg");
  assert.throws(() => assertUnder("site", "pr-assets/x/y/z.png"), /outside site\//);
  assert.throws(() => assertUnder("pr-assets", "pr-assets/../site/a.png"), /outside/);
  assert.throws(() => assertUnder("site", "krizaka-assets/site/a.png"), /outside/);
});

test("the audit accepts the layout and flags the rest", () => {
  for (const ok of [
    "README.txt",
    "site/products/yomizaka/tour/alex-bid.3f2a9c1b7e.mp4",
    "site/people/akinaza/hana-512.b0be072833.webp",
    "site/docs/orazaka/mobile/clip-watch-poster.9fc5d19c39.webp",
    "site/brand-films/loops/owl-square-dark.0123456789.mp4",
    "site/brand-films/film/le-monde-de-krizaka-en.0123456789.vtt",
    "maps/v1/tiles/quebec-20261012.pmtiles",
    "maps/v1/fonts/Noto Sans Regular/0-255.pbf",
    "pr-assets/krizaka-com/111-mobile-promo/clip.mp4",
    "brand/akinaza/logo-dark.svg",
    "brand/manifest.json",
    "people/defaults/v1/yomizaka/person-3-256.webp",
    "defaults/v1/person/boom-bap-512.webp",
    "defaults/v1/folder/folder-2.svg",
    "defaults/v1/banner/the-neon-flamingo-1920.webp",
    "defaults/v1/manifest.json",
    "people/personas/ui/ada-512.webp",
    "products/orazaka/tour/tea-pour.mp4",
    "ui/maps/cluster-dark.731f2c4fa2.png",
  ]) assert.equal(misplaced(ok), null, ok);
  for (const bad of [
    "krizaka-assets/pr-assets/krizaka-com/_probe/probe.txt",
    "site/misc/a.1234567890.png",
    "site/home/a.png",
    "maps/tiles/world.pmtiles",
    "pr-assets/krizaka-com/loose.png",
    "tmp/test.txt",
    "brand/retired/logo-dark.svg",
    "brand/unknown",
    "people/avatars/a.png",
    "defaults/v1/avatar/x-256.webp",
    "defaults/v1/person/Boom.webp",
    "defaults/person/a-256.webp",
    "products/akinaza/misc/a.png",
    "ui/loose.png",
  ]) assert.ok(misplaced(bad), bad);
});

test("the README names every prefix", () => {
  for (const prefix of Object.keys(ZONE)) assert.match(LAYOUT_README, new RegExp(`^${prefix}/`, "m"));
});

test("the library maps what site/ serves to human names, and retires the folders of the departed products", () => {
  assert.equal(libraryPath("home/backdrop/orazaka.mp4"), "products/orazaka/home/backdrop.mp4");
  assert.equal(libraryPath("products/orazaka/tour/a.mp4"), "products/orazaka/tour/a.mp4");
  assert.equal(libraryPath("docs/orazaka/mobile/x.webp"), "products/orazaka/docs/mobile/x.webp");
  assert.equal(libraryPath("people/ui/ada-256.webp"), "people/personas/ui/ada-256.webp");
  assert.equal(libraryPath("home/kit/frames/a.png"), null);
  // krizaka/.github#413: the folders of Orochia, Yasakia (Yazakia), Yororis and Kachizaka are retired, `prune --retired` deletes them.
  for (const p of ["site/people/yazakia/hana-256.5f2982c652.webp", "site/products/yasakia/mobile/loop-dark.46dbace273.mp4", "site/docs/orochia/mobile/a.0123456789.webp", "site/brand-films/orochia/a.0123456789.mp4", "site/products/yororis/tour/a.0123456789.mp4", "site/products/kachizaka/tour/a.0123456789.mp4"]) assert.ok(RETIRED.some((re) => re.test(p)), p);
  assert.ok(!RETIRED.some((re) => re.test("site/products/akinaza/tour/a.0123456789.mp4")));
});

test("the departed products' folders of layout v2 are retired, not misplaced (the storage-zone audit stays green until they are deleted)", () => {
  for (const p of ["sites/orochia/mobile/06-home-dark.79f01c0bf5.webp", "sites/kachizaka/tour/a.0123456789.mp4", "org/v1/brand/yororis/mark-dark.svg", "org/v1/defaults/tones/yasakia/plain-5-512.webp", "apps/orochia/uploads/a.png"]) {
    assert.equal(misplaced(p), null, p);
    assert.equal(placement(p).state, "legacy", p);
  }
  assert.ok(misplaced("sites/nosuch/mobile/x.png"), "an unknown site is still checked");
});

test("the prefixes another writer owns are declared once, in the layout, and prune never lists them", () => {
  // Orazaka's generated clips (gallery-video, video) are written by the Orazaka GPU batch, not by this site's manifest.
  for (const prefix of ["site/products/orazaka/gallery-video/", "site/products/orazaka/video/"]) {
    assert.ok(FOREIGN_WRITERS.some((p) => prefix.startsWith(p)), `${prefix} is owned by another writer`);
  }
  assert.ok(FOREIGN_WRITERS.includes("site/blog/"));
  // The other product sites name their landing recordings the same way (their lib/tour.ts): never pruned here either.
  for (const product of ["orazaka", "yomizaka", "akinaza"]) {
    const clip = `site/products/${product}/tour/phone-keep.abcdef1234.mp4`;
    assert.ok(FOREIGN_WRITERS.some((p) => clip.startsWith(p)), `${clip} is owned by dev.${product}.com`);
  }
});

test("Akinaza's first-client journey clips are a legitimate kind of a site's media (storage-zone audit: 37 objects)", () => {
  for (const p of ["site/products/akinaza/first-client/phone-akinaza-books-en.8206ffd160.mp4", "site/products/akinaza/first-client/desktop-akinaza-books-fr-captions.f7b918ee3b.vtt"]) {
    assert.equal(misplaced(p), null, p);
    assert.equal(placement(p).state, "legacy", p);
  }
  assert.equal(misplaced("sites/akinaza/first-client/phone-akinaza-books-en.8206ffd160.mp4"), null);
  assert.ok(misplaced("sites/akinaza/nosuch-kind/a.8206ffd160.mp4"), "other kinds are still checked");
});

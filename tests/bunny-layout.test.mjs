import { test } from "node:test";
import assert from "node:assert/strict";
import { LAYOUT_README, RETIRED, ZONE, assertUnder, libraryPath, misplaced } from "../scripts/bunny-layout.mjs";

test("each writer stays under its prefix", () => {
  assert.equal(assertUnder("site", "site/home/a.1234567890.jpg"), "site/home/a.1234567890.jpg");
  assert.throws(() => assertUnder("site", "pr-assets/x/y/z.png"), /outside site\//);
  assert.throws(() => assertUnder("pr-assets", "pr-assets/../site/a.png"), /outside/);
  assert.throws(() => assertUnder("site", "krizaka-assets/site/a.png"), /outside/);
});

test("the audit accepts the layout and flags the rest", () => {
  for (const ok of [
    "README.txt",
    "site/products/orochia/tour/alex-bid.3f2a9c1b7e.mp4",
    "site/people/yasakia/hana-512.b0be072833.webp",
    "site/docs/orochia/mobile/clip-watch-poster.9fc5d19c39.webp",
    "maps/v1/tiles/quebec-20261012.pmtiles",
    "maps/v1/fonts/Noto Sans Regular/0-255.pbf",
    "pr-assets/krizaka-com/111-mobile-promo/clip.mp4",
    "brand/orochia/logo-dark.svg",
    "brand/manifest.json",
    "people/defaults/v1/yasakia/person-3-256.webp",
    "people/personas/orochia/alex-512.webp",
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
    "brand/yazakia/logo-dark.svg",
    "brand/orochia",
    "people/avatars/a.png",
    "products/orochia/misc/a.png",
    "ui/loose.png",
  ]) assert.ok(misplaced(bad), bad);
});

test("the README names every prefix", () => {
  for (const prefix of Object.keys(ZONE)) assert.match(LAYOUT_README, new RegExp(`^${prefix}/`, "m"));
});

test("the library maps what site/ serves to human names, and retires the old Yazakia names", () => {
  assert.equal(libraryPath("home/backdrop/orochia.mp4"), "products/orochia/home/backdrop.mp4");
  assert.equal(libraryPath("home/kit-native/yororis-dark.webm"), "products/yororis/home/kit-native-dark.webm");
  assert.equal(libraryPath("products/orazaka/tour/a.mp4"), "products/orazaka/tour/a.mp4");
  assert.equal(libraryPath("products/yazakia/mobile/loop-dark.mp4"), "products/yasakia/mobile/loop-dark.mp4");
  assert.equal(libraryPath("docs/orochia/mobile/x.webp"), "products/orochia/docs/mobile/x.webp");
  assert.equal(libraryPath("people/ui/ada-256.webp"), "people/personas/ui/ada-256.webp");
  assert.equal(libraryPath("people/yazakia/hana-256.webp"), null);
  assert.equal(libraryPath("home/kit/frames/a.png"), null);
  for (const p of ["site/people/yazakia/hana-256.5f2982c652.webp", "site/products/yazakia/mobile/loop-dark.46dbace273.mp4"]) assert.ok(RETIRED.some((re) => re.test(p)), p);
  assert.ok(!RETIRED.some((re) => re.test("site/people/yasakia/hana-256.5f2982c652.webp")));
});

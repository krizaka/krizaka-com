import { test } from "node:test";
import assert from "node:assert/strict";
import { LAYOUT_README, ZONE, assertUnder, misplaced } from "../scripts/bunny-layout.mjs";

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
    "site/people/yazakia/hana-512.b0be072833.webp",
    "site/docs/orochia/mobile/clip-watch-poster.9fc5d19c39.webp",
    "maps/v1/tiles/quebec-20261012.pmtiles",
    "maps/v1/fonts/Noto Sans Regular/0-255.pbf",
    "pr-assets/krizaka-com/111-mobile-promo/clip.mp4",
  ]) assert.equal(misplaced(ok), null, ok);
  for (const bad of [
    "krizaka-assets/pr-assets/krizaka-com/_probe/probe.txt",
    "site/misc/a.1234567890.png",
    "site/home/a.png",
    "maps/tiles/world.pmtiles",
    "pr-assets/krizaka-com/loose.png",
    "tmp/test.txt",
  ]) assert.ok(misplaced(bad), bad);
});

test("the README names every prefix", () => {
  for (const prefix of Object.keys(ZONE)) assert.match(LAYOUT_README, new RegExp(`^${prefix}/`, "m"));
});

// The home's birds are live (krizaka-ui Flock) on a valley film that has none: five birds in the order of the story, on
// the ridge, in both cuts; the flock sits in the film's frame; it never covers the figures (the scene is in the flow).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { FLOCK_TALL, FLOCK_WIDE } from "../lib/home-flock.ts";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

test("five birds in the order of the story, inside the frame, on the ridge, in both cuts", () => {
  for (const cut of [FLOCK_WIDE, FLOCK_TALL]) {
    assert.deepEqual(cut.birds.map((b) => b.bird), ["falcon", "owl", "duck", "flamingo", "pigeon"]);
    for (const b of cut.birds) assert.ok(b.x - b.size / 2 >= 0 && b.x + b.size / 2 <= 100 && b.y > 70 && b.y < 100, b.bird);
  }
  assert.ok(FLOCK_TALL.birds[0].size > FLOCK_WIDE.birds[0].size, "larger in the phone's cut");
});

test("the film has no birds and the flock stands on it, in the film's frame, still under reduced motion", () => {
  assert.match(read("app/components/home/HomeHero.tsx"), /home-valley-/);
  const loop = read("app/components/home/AmbientLoop.tsx");
  assert.match(loop, /<Flock className="kz-flock kz-flock-wide" tone="own"/);
  assert.match(loop, /<Flock className="kz-flock kz-flock-tall" tone="own"/);
  const css = read("app/components/home/home.css");
  assert.match(css, /\.kz-ambient-layer \.kz-flock \{[^}]*width: max\(100cqw, calc\(100cqh \* 16 \/ 9\)\)/);
  assert.match(css, /@media \(max-width: 640px\) \{ \.kz-ambient-layer \.kz-flock-wide \{ display: none/);
});

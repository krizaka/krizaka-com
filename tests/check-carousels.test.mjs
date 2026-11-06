import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { carouselProblems, cases } from "../scripts/carousels-lib.mjs";

// The journey of the home's carousels (krizaka-internal#2658): how a reading is judged, without a browser.
const on = { path: "/fr", vp: { name: "phone" }, theme: "dark", reducedMotion: "no-preference" };
const calm = { ...on, reducedMotion: "reduce" };
const k = (over = {}) => ({ ratio: 16 / 9, video: true, playing: true, pause: true, ...over });

test("covers French and English, phone and desktop, both themes, both motion preferences", () => {
  assert.equal(cases().length, 16);
});

test("a moving home passes: four 16:9 carousels, a clip playing, a pause each, it turns and holds under the pointer", () => {
  assert.deepEqual(carouselProblems(on, { carousels: [k(), k(), k(), k()], advanced: true, held: true }), []);
});

test("refuses a vertical frame, a failed clip, a missing pause, a carousel that does not turn or does not hold", () => {
  const problems = carouselProblems(on, {
    carousels: [k({ playing: false }), k({ ratio: 0.8 }), k({ error: "4" }), k({ pause: false })],
    advanced: false,
    held: false,
  });
  assert.deepEqual(problems, [
    "/fr phone dark no-preference: carousel 2 is 0.80:1, not 16:9",
    "/fr phone dark no-preference: carousel 3's clip failed (4)",
    "/fr phone dark no-preference: the first carousel's clip does not play",
    "/fr phone dark no-preference: a carousel without its visible pause (WCAG 2.2.2)",
    "/fr phone dark no-preference: the first carousel did not advance on its own",
    "/fr phone dark no-preference: the first carousel advanced under the pointer",
  ]);
});

test("under reduced motion nothing moves: no clip, no pause, no turn", () => {
  const still = k({ video: false, playing: false, pause: false });
  assert.deepEqual(
    carouselProblems(calm, { carousels: [still, still, still, still], advanced: false, held: true }),
    [],
  );
  assert.equal(carouselProblems(calm, { carousels: [k(), still, still, still], advanced: true, held: true }).length, 3);
});

test("the container smoke runs the journey", () => {
  const smoke = readFileSync(new URL("../scripts/ci-container-smoke.sh", import.meta.url), "utf8");
  assert.match(smoke, /node scripts\/check-carousels\.mjs --base http:\/\/localhost:3000/);
});

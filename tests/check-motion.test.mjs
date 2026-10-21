import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cases, motionProblems, PATHS } from "../scripts/motion-lib.mjs";

// The engine flow's dots sat still on every Krizaka site (krizaka-ui: a unitless keyframe value is not interpolable with
// a length, so each dot flipped between two equivalent offsets). check-overflow runs under reduced motion and could not
// see it; check-motion runs in a real browser with reduced motion OFF. The judgement is pure and tested here.
const c = { path: "/en", vp: { name: "desktop" }, theme: "dark", reducedMotion: "no-preference" };
const moving = { readings: [["-1px", "-3px", "-5.5px", "-8px", "-10px"], ["0px", "-2px", "-4px", "-7px"]], running: true, hub: "kz-flow-breathe" };
const reduced = { ...c, reducedMotion: "reduce" };

test("the home and the story's engine chapter are sampled on desktop and phone, in both themes, with motion on and off", () => {
  assert.deepEqual(PATHS, ["/en", "/en/story"]);
  assert.equal(cases().length, 2 * 2 * 2 * 2);
});

test("a figure whose dots travel and whose engine breathes passes", () => {
  assert.deepEqual(motionProblems(c, moving), []);
});

test("the frozen figure of 2026-10-20 fails: two readings per dot, one of them a calc()", () => {
  const frozen = { readings: [["0px", "calc(-12.887px)"], ["0px", "calc(-12.887px)"]], running: true, hub: "none" };
  const lines = motionProblems(c, frozen);
  assert.equal(lines.length, 3);
  assert.match(lines.join("\n"), /not an interpolated length/);
  assert.match(lines.join("\n"), /do not travel \(2 distinct/);
  assert.match(lines.join("\n"), /engine does not breathe/);
});

test("under reduced motion the figure must rest; moving there is a failure", () => {
  assert.deepEqual(motionProblems(reduced, { readings: [["0px"], ["-4px"]], running: false, hub: "none" }), []);
  assert.match(motionProblems(reduced, moving)[0], /move \(2 positions\) under reduced motion|move \(4 positions\)/);
});

test("a page without a visible flow is a failure, not a pass", () => {
  assert.match(motionProblems(c, { error: "no visible EngineFlow stage" })[0], /no visible EngineFlow stage/);
});

test("CI runs the check against the container", () => {
  // The pipeline is the org's node-ci.yml; the container job runs this repository's smoke script against the image.
  const ci = readFileSync(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
  assert.match(ci, /container-smoke: scripts\/ci-container-smoke\.sh/);
  const smoke = readFileSync(new URL("../scripts/ci-container-smoke.sh", import.meta.url), "utf8");
  assert.match(smoke, /node scripts\/check-motion\.mjs --base http:\/\/localhost:3000/);
});

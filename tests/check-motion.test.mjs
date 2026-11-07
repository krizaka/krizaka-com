import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cases, motionProblems, openFlowFolds, PATHS, sampleFlowInPage } from "../scripts/motion-lib.mjs";

// The engine flow's dots sat still on every Krizaka site (krizaka-ui: a unitless keyframe value is not interpolable with
// a length, so each dot flipped between two equivalent offsets). check-overflow runs under reduced motion and could not
// see it; check-motion runs in a real browser with reduced motion OFF. The judgement is pure and tested here.
const c = { path: "/en", vp: { name: "desktop" }, theme: "dark", reducedMotion: "no-preference" };
const moving = {
  readings: [
    ["-1px", "-3px", "-5.5px", "-8px", "-10px"],
    ["0px", "-2px", "-4px", "-7px"],
  ],
  running: true,
  hub: "kz-flow-breathe",
};
const reduced = { ...c, reducedMotion: "reduce" };

test("the story's engine chapter, the one page that draws the flow, is sampled on desktop and phone, in both themes, with motion on and off", () => {
  assert.deepEqual(PATHS, ["/en/story"]);
  assert.equal(cases().length, 1 * 2 * 2 * 2);
});

test("a figure whose dots travel and whose engine breathes passes", () => {
  assert.deepEqual(motionProblems(c, moving), []);
});

test("the frozen figure of 2026-10-20 fails: two readings per dot, one of them a calc()", () => {
  const frozen = {
    readings: [
      ["0px", "calc(-12.887px)"],
      ["0px", "calc(-12.887px)"],
    ],
    running: true,
    hub: "none",
  };
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

// /story's engine chapter shows a clip and keeps the flow in its fold (#2800). A closed <details> keeps the stage laid out
// (it has client rects) but never renders it, so its animations do not run: the check read a frozen figure and failed the
// container job of #659. The visitor opens the fold to see the flow; the check opens it the same way, and a stage that is
// laid out but not rendered is not a visible one.
const fold = (open) => {
  const details = { open, summary: { click: () => (details.open = !details.open) } };
  details.querySelector = (sel) => (sel === "summary" ? details.summary : null);
  return details;
};
const flowIn = (details) => ({ closest: (sel) => (sel === "details" ? details : null) });
const docOf = (flows) => ({ querySelectorAll: (sel) => (sel === ".kz-flow" ? flows : []) });

test("a flow in a closed fold is opened from its summary, as a visitor would, before it is sampled", () => {
  const closed = fold(false);
  assert.equal(openFlowFolds(docOf([flowIn(closed)])), 1);
  assert.equal(closed.open, true);
  const open = fold(true);
  assert.equal(
    openFlowFolds(docOf([flowIn(open), flowIn(null)])),
    0,
    "an open fold and a flow outside any fold stay as they are",
  );
  assert.equal(open.open, true);
});

test("a stage that is laid out but not rendered (a closed fold) is not a visible stage", async () => {
  const hidden = { getClientRects: () => [{}], checkVisibility: () => false, querySelectorAll: () => [] };
  const doc = { querySelectorAll: (sel) => (sel === ".kz-flow-stage" ? [hidden] : []) };
  assert.deepEqual(await sampleFlowInPage(doc), { error: "no visible EngineFlow stage" });
});

test("check-motion opens the flow's fold before it scrolls to it and samples it", () => {
  const check = readFileSync(new URL("../scripts/check-motion.mjs", import.meta.url), "utf8");
  const open = check.indexOf("page.evaluate(openFlowFolds)");
  assert.ok(open > 0, "check-motion opens the folds in the page");
  assert.ok(open < check.indexOf("scrollIntoViewIfNeeded") && open < check.indexOf("page.evaluate(sampleFlowInPage)"));
});

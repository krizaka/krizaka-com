import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// « Le cadre » (founder, 2026-11-05, krizaka-internal#2645): a blue box round the page's h1. RouteArrival focuses the h1
// by script (tabindex="-1"); after a key press the browser calls that focus :focus-visible, and the site's unlayered
// :focus-visible ring beat the preset's rule (in @layer base) that hides the ring on a non-control. AGENTS.md §4: the
// 2 px ring is for the keyboard on a control, never for a heading focused by script.
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("globals.css hides the ring of a non-control focused by script, after the unlayered :focus-visible", () => {
  const ring = css.indexOf(":focus-visible {");
  const hide = css.indexOf('[tabindex="-1"]:is(:focus, :focus-visible)');
  assert.ok(ring > -1 && hide > ring, "the rule comes after the ring");
  assert.ok(!css.slice(0, hide).includes("@layer base {") || css.lastIndexOf("@layer base {", hide) < ring);
});

// The same rules in a real browser (a heading or a dialog focused by script has no ring, a keyboard-focused button keeps it)
// need Chromium: scripts/check-focus-ring.mjs, run by scripts/ci-container-smoke.sh after `playwright install`.

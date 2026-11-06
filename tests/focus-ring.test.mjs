import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// « Le cadre » (founder, 2026-11-05, krizaka-internal#2645): a blue box round the page's h1. RouteArrival focuses the h1
// by script (tabindex="-1"); after a key press the browser calls that focus :focus-visible, and the site's unlayered
// :focus-visible ring beat the preset's rule (in @layer base) that hides the ring on a non-control. AGENTS.md §4: the
// 2 px ring is for the keyboard on a control, never for a heading focused by script.
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

// The real cascade, in Chromium: the site's own focus rules (cut from globals.css) after a base layer like the preset's.
const page = (extra) => `<style>
  @layer base { :focus-visible { outline: 2px solid rgb(0, 0, 255); } }
  ${extra}
</style>
<h1 id="h" tabindex="-1">Par où</h1>
<div id="dlg" role="dialog" tabindex="-1">Dialog</div>
<button id="b">Go</button>`;

test("globals.css hides the ring of a non-control focused by script, after the unlayered :focus-visible", () => {
  const ring = css.indexOf(":focus-visible {");
  const hide = css.indexOf('[tabindex="-1"]:is(:focus, :focus-visible)');
  assert.ok(ring > -1 && hide > ring, "the rule comes after the ring");
  assert.ok(!css.slice(0, hide).includes("@layer base {") || css.lastIndexOf("@layer base {", hide) < ring);
});

test("a heading focused by script after a key press has no outline; a keyboard-focused button keeps its ring", async () => {
  const start = css.indexOf(":focus-visible {");
  const end = css.indexOf("[cmdk-input]:focus-visible");
  const site = css.slice(start, end).replaceAll("var(--kz-accent)", "rgb(0, 0, 255)");
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  try {
    const p = await browser.newPage();
    await p.setContent(page(site));
    await p.keyboard.press("Shift"); // the last interaction is the keyboard's
    await p.evaluate(() => document.getElementById("h").focus());
    const outline = (id) => p.evaluate((i) => getComputedStyle(document.getElementById(i)).outlineStyle, id);
    assert.equal(await p.evaluate(() => document.getElementById("h").matches(":focus-visible")), true, "premise");
    assert.equal(await outline("h"), "none", "the h1 has no ring");
    await p.evaluate(() => document.getElementById("dlg").focus());
    assert.equal(await outline("dlg"), "none", "a dialog focused by script has no ring");
    await p.keyboard.press("Tab");
    await p.evaluate(() => document.getElementById("b").focus());
    assert.equal(await outline("b"), "solid", "the button keeps its ring for the keyboard");
    assert.equal(await p.evaluate(() => getComputedStyle(document.getElementById("b")).outlineWidth), "2px");
  } finally {
    await browser.close();
  }
});

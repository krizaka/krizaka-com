// « Le cadre » (founder, 2026-11-05, krizaka-internal#2645), in a real browser: a heading or a dialog focused by script
// after a key press shows no ring; a keyboard-focused button keeps its 2 px ring (AGENTS.md §4). It needs Chromium, so it
// runs in scripts/ci-container-smoke.sh after `playwright install`, never in `npm test` (tests/no-browser-in-unit-tests).
// The page is the site's own focus rules (cut from app/globals.css) after a base layer like the preset's: no server needed.
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

/** The site's focus rules, from the unlayered ring to the first rule that is not about it. */
function siteFocusRules(globals) {
  const start = globals.indexOf(":focus-visible {");
  const end = globals.indexOf("[cmdk-input]:focus-visible");
  if (start < 0 || end < start) {
    throw new Error("check-focus-ring: the focus rules of app/globals.css moved; update the cut");
  }
  return globals.slice(start, end).replaceAll("var(--kz-accent)", "rgb(0, 0, 255)");
}

const page = (extra) => `<style>
  @layer base { :focus-visible { outline: 2px solid rgb(0, 0, 255); } }
  ${extra}
</style>
<h1 id="h" tabindex="-1">Par où</h1>
<div id="dlg" role="dialog" tabindex="-1">Dialog</div>
<button id="b">Go</button>`;

async function main() {
  const problems = [];
  const browser = await chromium.launch();
  try {
    const p = await browser.newPage();
    await p.setContent(page(siteFocusRules(css)));
    await p.keyboard.press("Shift"); // the last interaction is the keyboard's
    await p.evaluate(() => document.getElementById("h").focus());
    const outline = (id) => p.evaluate((i) => getComputedStyle(document.getElementById(i)).outlineStyle, id);
    if (!(await p.evaluate(() => document.getElementById("h").matches(":focus-visible")))) {
      problems.push("premise: the h1 focused by script after a key press is not :focus-visible");
    }
    if ((await outline("h")) !== "none") {
      problems.push("the h1 focused by script wears a ring");
    }
    await p.evaluate(() => document.getElementById("dlg").focus());
    if ((await outline("dlg")) !== "none") {
      problems.push("a dialog focused by script wears a ring");
    }
    await p.keyboard.press("Tab");
    await p.evaluate(() => document.getElementById("b").focus());
    if ((await outline("b")) !== "solid") {
      problems.push("the keyboard-focused button lost its ring");
    }
    const width = await p.evaluate(() => getComputedStyle(document.getElementById("b")).outlineWidth);
    if (width !== "2px") {
      problems.push(`the button's ring is ${width}, not 2px`);
    }
  } finally {
    await browser.close();
  }
  if (problems.length) {
    console.error(`check-focus-ring: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
    process.exitCode = 1;
  } else {
    console.log(
      "check-focus-ring: the ring is for the keyboard on a control, never for a heading or a dialog focused by script",
    );
  }
}

await main();

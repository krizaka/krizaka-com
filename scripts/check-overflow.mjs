#!/usr/bin/env node
/* No horizontal scroll, ever: every page of scripts/overflow-lib.mjs at 360, 768, 1024 and 1440 px, dark and light, in
   a real browser (Playwright's Chromium), against a running site. CI runs it on the container:
     node scripts/check-overflow.mjs --base http://localhost:3000
   Exits 1 with one line per page, width and theme that scrolls sideways, naming the elements that pass the edge. */

import { cases, overflowProblem } from "./overflow-lib.mjs";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
};
const base = arg("--base", "http://localhost:3000").replace(/\/$/, "");

const { chromium } = await import("playwright");
const browser = await chromium.launch();
const problems = [];
try {
  for (const c of cases()) {
    const context = await browser.newContext({ viewport: { width: c.width, height: 900 }, colorScheme: c.theme, reducedMotion: "reduce" });
    await context.addInitScript((theme) => {
      try {
        localStorage.setItem("kz-theme", theme);
        sessionStorage.setItem("kz-intro", "done");
      } catch {}
    }, c.theme);
    const page = await context.newPage();
    // `load`, then a short settle: a live page may never go network-idle (the contact page's captcha keeps polling).
    await page.goto(base + c.path, { waitUntil: "load", timeout: 60_000 });
    await page.waitForTimeout(1500);
    const { scrollWidth, culprits } = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const wide = [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > w + 0.5)
        .slice(0, 3)
        .map((el) => el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""));
      return { scrollWidth: document.documentElement.scrollWidth, culprits: wide };
    });
    const problem = overflowProblem(c, scrollWidth, culprits);
    if (problem) problems.push(problem);
    await context.close();
  }
} finally {
  await browser.close();
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`check-overflow: ${cases().length} page × width × theme, no horizontal scroll`);

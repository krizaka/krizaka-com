#!/usr/bin/env node
/* A row of figures is one line of lining numbers, in a real browser on the real container (scripts/figures-lib.mjs).
     node scripts/check-figures.mjs --base http://localhost:3000
   Exits 1 with one line per page, width, theme and fault. */

import { cases, FIGURES, figureProblems, sampleFigures } from "./figures-lib.mjs";

const i = process.argv.indexOf("--base");
const base = (i > 0 ? process.argv[i + 1] : "http://localhost:3000").replace(/\/$/, "");

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
    await page.goto(base + c.path, { waitUntil: "load", timeout: 60_000 });
    await page.evaluate(() => document.fonts.ready);
    problems.push(...figureProblems(c, await page.evaluate(sampleFigures, FIGURES)));
    await context.close();
  }
} finally {
  await browser.close();
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`check-figures: ${cases().length} page × width × theme, every figure lining and tabular, one baseline per row`);

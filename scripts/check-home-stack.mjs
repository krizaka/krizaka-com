#!/usr/bin/env node
/* The home's stack section stays short (Oussama, 2026-10-23): no code block, no playground control, one still picture of
   one height per tile, the tiles of a row as tall as each other, nothing empty under a picture — on the home the server
   really sends, in a real browser (Playwright's Chromium), at 390 and 1440 px, dark and light, EN and FR.
     node scripts/check-home-stack.mjs --base http://localhost:3000
   Exits 1 with one line per problem. The rule and the sample are scripts/home-stack-lib.mjs (tested). */

import { cases, homeStackProblems, sampleHomeStackInPage } from "./home-stack-lib.mjs";

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
    await page.locator("#stack").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // the section reveals once in view; fonts settle
    problems.push(...homeStackProblems(c, await page.evaluate(sampleHomeStackInPage)));
    await context.close();
  }
} finally {
  await browser.close();
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`check-home-stack: ${cases().length} page × width × theme, the stack section is short and aligned`);

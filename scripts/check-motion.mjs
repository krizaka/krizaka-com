#!/usr/bin/env node
/* Motion is real: the engine flow's photons travel and the engine breathes, in a real browser with reduced motion OFF
   (and rest with it ON). check-overflow runs under reduced motion, so it could never see a frozen figure.
     node scripts/check-motion.mjs --base http://localhost:3000
   Exits 1 with one line per page, viewport, theme and preference that does not behave. */

import { cases, motionProblems, sampleFlowInPage } from "./motion-lib.mjs";

const i = process.argv.indexOf("--base");
const base = (i > 0 ? process.argv[i + 1] : "http://localhost:3000").replace(/\/$/, "");

const { chromium } = await import("playwright");
const browser = await chromium.launch();
const problems = [];
try {
  for (const c of cases()) {
    const context = await browser.newContext({ viewport: { width: c.vp.width, height: c.vp.height }, colorScheme: c.theme, reducedMotion: c.reducedMotion });
    await context.addInitScript((theme) => {
      try {
        localStorage.setItem("kz-theme", theme);
        sessionStorage.setItem("kz-intro", "done");
      } catch {}
    }, c.theme);
    const page = await context.newPage();
    await page.goto(base + c.path, { waitUntil: "load", timeout: 60_000 });
    await page.locator(".kz-flow").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000); // the loops start ~1.2 s after load (html[data-motion])
    problems.push(...motionProblems(c, await page.evaluate(sampleFlowInPage)));
    await context.close();
  }
} finally {
  await browser.close();
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`check-motion: ${cases().length} page × viewport × theme × motion preference, the engine flow moves (and rests under reduced motion)`);

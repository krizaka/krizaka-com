#!/usr/bin/env node
/* The home's carousels in a real browser (krizaka-internal#2658, @krizaka/ui MediaCarousel v2): four carousels, each a
   16:9 frame on a phone and a desktop, dark and light, French and English. Motion on: the first one's clip plays, every one
   has its visible pause, the first advances on its own and holds under the pointer. Reduced motion: no clip, no pause,
   nothing advances.
     node scripts/check-carousels.mjs --base http://localhost:3000
   Exits 1 with one line per case that does not behave. */

import { carouselProblems, cases, countInPage, readCarouselsInPage } from "./carousels-lib.mjs";
import { baseFromArgv, report, visitPages } from "./site-pages.mjs";

// @fixed: a slide without a measured duration stays 6.5 s (MediaCarousel's reading time); wait a little longer.
const TURN_MS = 7500;

const problems = await visitPages(
  baseFromArgv(),
  cases(),
  async (page, c) => {
    const first = page.locator("section[data-frame]").first();
    await first.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1500); // the clip mounts after the page's load
    const carousels = await page.evaluate(readCarouselsInPage);
    const before = await page.evaluate(countInPage, 0);
    await page.waitForTimeout(TURN_MS);
    const advanced = (await page.evaluate(countInPage, 0)) !== before;
    let held = true;
    if (c.reducedMotion !== "reduce") {
      await first.hover();
      const under = await page.evaluate(countInPage, 0);
      await page.waitForTimeout(TURN_MS);
      held = (await page.evaluate(countInPage, 0)) === under;
    }
    return carouselProblems(c, { carousels, advanced, held });
  },
  { viewport: (c) => ({ width: c.vp.width, height: c.vp.height }), reducedMotion: (c) => c.reducedMotion },
);
report(
  problems,
  `check-carousels: ${cases().length} cases, the home's carousels are 16:9, play, advance, hold, and rest under reduced motion`,
);

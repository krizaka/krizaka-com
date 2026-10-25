#!/usr/bin/env node
/* Motion is real: the engine flow's photons travel and the engine breathes, in a real browser with reduced motion OFF
   (and rest with it ON). check-overflow runs under reduced motion, so it could never see a frozen figure.
     node scripts/check-motion.mjs --base http://localhost:3000
   Exits 1 with one line per page, viewport, theme and preference that does not behave. */

import { cases, motionProblems, sampleFlowInPage } from "./motion-lib.mjs";
import { baseFromArgv, report, visitPages } from "./site-pages.mjs";

const problems = await visitPages(
  baseFromArgv(),
  cases(),
  async (page, c) => {
    await page.locator(".kz-flow").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000); // the loops start ~1.2 s after load (html[data-motion])
    return motionProblems(c, await page.evaluate(sampleFlowInPage));
  },
  { viewport: (c) => ({ width: c.vp.width, height: c.vp.height }), reducedMotion: (c) => c.reducedMotion },
);
report(problems, `check-motion: ${cases().length} page × viewport × theme × motion preference, the engine flow moves (and rests under reduced motion)`);

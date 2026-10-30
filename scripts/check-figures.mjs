#!/usr/bin/env node
/* A row of figures is one line of lining numbers, in a real browser on the real container (scripts/figures-lib.mjs).
     node scripts/check-figures.mjs --base http://localhost:3000
   Exits 1 with one line per page, width, theme and fault. */

import { cases, FIGURES, figureProblems, sampleFigures } from "./figures-lib.mjs";
import { baseFromArgv, report, visitPages } from "./site-pages.mjs";

const problems = await visitPages(baseFromArgv(), cases(), async (page, c) => {
  await page.evaluate(() => document.fonts.ready);
  return figureProblems(c, await page.evaluate(sampleFigures, FIGURES));
});
report(
  problems,
  `check-figures: ${cases().length} page × width × theme, every figure lining and tabular, one baseline per row`,
);

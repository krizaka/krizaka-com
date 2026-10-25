#!/usr/bin/env node
/* The home's stack section stays short (Oussama, 2026-10-23): no code block, no playground control, one still picture per
   tile in a box of one height, the tiles of a row as tall as each other, nothing empty under a picture — on the home the
   server really sends, in a real browser (scripts/site-pages.mjs), at 390 and 1440 px, dark and light, EN and FR.
     node scripts/check-home-stack.mjs --base http://localhost:3000
   Exits 1 with one line per problem. The rule and the sample are scripts/home-stack-lib.mjs (tested). */

import { cases, homeStackProblems, sampleHomeStackInPage } from "./home-stack-lib.mjs";
import { baseFromArgv, report, visitPages } from "./site-pages.mjs";

const problems = await visitPages(baseFromArgv(), cases(), async (page, c) => {
  await page.locator("#stack").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // the section reveals once in view; fonts settle
  return homeStackProblems(c, await page.evaluate(sampleHomeStackInPage));
});
report(problems, `check-home-stack: ${cases().length} page × width × theme, the stack section is short and aligned`);

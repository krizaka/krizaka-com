#!/usr/bin/env node
/* The home's stack section is one row per publication (krizaka-com#392): a visual of one fixed height and a specimen tag
   (library code, stamp, name, site / registry / licence, two actions), the rows alternating on a wide screen and the tag
   under its visual on a phone — on the home the server really sends, in a real browser (scripts/site-pages.mjs), at 390
   and 1440 px, dark and light, EN and FR.
     node scripts/check-home-stack.mjs --base http://localhost:3000
   Exits 1 with one line per problem. The rule and the sample are scripts/home-stack-lib.mjs (tested). */

import { cases, homeStackProblems, sampleHomeStackInPage } from "./home-stack-lib.mjs";
import { baseFromArgv, report, visitPages } from "./site-pages.mjs";

const problems = await visitPages(baseFromArgv(), cases(), async (page, c) => {
  await page.locator("#stack").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // the section reveals once in view; fonts settle
  return homeStackProblems(c, await page.evaluate(sampleHomeStackInPage));
});
report(problems, `check-home-stack: ${cases().length} page × width × theme, the stack rows alternate, with a fixed visual and a tag each`);

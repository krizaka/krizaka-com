#!/usr/bin/env node
/* No horizontal scroll, ever: every page of scripts/overflow-lib.mjs at 360, 768, 1024 and 1440 px, dark and light, in
   a real browser (scripts/site-pages.mjs), against a running site. CI runs it on the container:
     node scripts/check-overflow.mjs --base http://localhost:3000
   Exits 1 with one line per page, width and theme that scrolls sideways, naming the elements that pass the edge. */

import { cases, overflowProblem } from "./overflow-lib.mjs";
import { baseFromArgv, report, visitPages } from "./site-pages.mjs";

const problems = await visitPages(baseFromArgv(), cases(), async (page, c) => {
  await page.waitForTimeout(1500);
  const { scrollWidth, culprits } = await page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > w + 0.5)
      .slice(0, 3)
      .map(
        (el) =>
          el.tagName.toLowerCase() +
          (el.className && typeof el.className === "string"
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : ""),
      );
    return { scrollWidth: document.documentElement.scrollWidth, culprits: wide };
  });
  const problem = overflowProblem(c, scrollWidth, culprits);
  return problem ? [problem] : [];
});
report(problems, `check-overflow: ${cases().length} page × width × theme, no horizontal scroll`);

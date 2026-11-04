#!/usr/bin/env node
/* No horizontal scroll, ever: every page of scripts/overflow-lib.mjs at 360, 768, 1024 and 1440 px, dark and light, in
   a real browser (scripts/site-pages.mjs), against a running site. CI runs it on the container:
     node scripts/check-overflow.mjs --base http://localhost:3000
   Exits 1 with one line per page, width and theme that scrolls sideways, naming the elements that pass the edge. */

import { cases, FRAMED, frameProblem, overflowProblem } from "./overflow-lib.mjs";
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
  // The frame: the headings and cards stay between the edges of the bar (the one shell of every page).
  const { frame, boxes } = await page.evaluate((selector) => {
    const bar = document.querySelector(".kz-site-bar")?.getBoundingClientRect();
    return {
      frame: bar ? { left: bar.left, right: bar.right } : undefined,
      boxes: [...document.querySelectorAll(selector)]
        .map((el) => ({
          name: el.tagName.toLowerCase() + "." + String(el.className).split(/\s+/)[0],
          ...el.getBoundingClientRect().toJSON(),
        }))
        .filter((b) => b.width > 0),
    };
  }, FRAMED);
  return [overflowProblem(c, scrollWidth, culprits), frame && frameProblem(c, frame, boxes)].filter(Boolean);
});
report(problems, `check-overflow: ${cases().length} page × width × theme, no horizontal scroll`);

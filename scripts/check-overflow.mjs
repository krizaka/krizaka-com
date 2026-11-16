#!/usr/bin/env node
/* No horizontal scroll, ever: every page of scripts/overflow-lib.mjs at 360, 768, 1024 and 1440 px, dark and light, in
   a real browser (scripts/site-pages.mjs), against a running site. CI runs it on the container:
     node scripts/check-overflow.mjs --base http://localhost:3000
   Exits 1 with one line per page, width and theme that scrolls sideways, naming the elements that pass the edge. */

import { cases, edgeCulprits, FRAMED, frameProblem, overflowProblem, readingProblem } from "./overflow-lib.mjs";
import { baseFromArgv, report, visitPages } from "./site-pages.mjs";

// `--only /films/` keeps the pages whose path contains it (the fast loop on one family of pages).
const only = process.argv.includes("--only") ? process.argv[process.argv.indexOf("--only") + 1] : "";
const all = cases().filter((c) => c.path.includes(only));
const problems = await visitPages(baseFromArgv(), all, async (page, c) => {
  await page.waitForTimeout(1500);
  const { scrollWidth, width, items } = await page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    // Walks up to the first ancestor that scrolls sideways or hides its content (clip rect / clip-path, the sr-only pattern).
    const context = (el) => {
      let hidden = false;
      for (let a = el; a && a !== document.body; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.clip !== "auto" || cs.clipPath.startsWith("inset(50%")) hidden = true;
        if (a !== el && (cs.overflowX === "auto" || cs.overflowX === "scroll")) return { scrolled: true, hidden };
      }
      return { scrolled: false, hidden };
    };
    const wide = [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > w + 0.5)
      .map((el) => ({
        name:
          el.tagName.toLowerCase() +
          (el.className && typeof el.className === "string"
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : ""),
        right: el.getBoundingClientRect().right,
        reading: Boolean(el.closest("main .rd-stack")),
        ...context(el),
      }));
    return { scrollWidth: document.documentElement.scrollWidth, width: w, items: wide };
  });
  const culprits = edgeCulprits(items, width);
  // A watch page's reading blocks (timeline, list of the other films) hold their text: a box whose content is wider than
  // itself, or one of their elements past the edge, is text cut even when the page does not scroll (krizaka-internal#3909).
  const cut = c.path.includes("/films/")
    ? [
        ...(await page.evaluate(() =>
          [...document.querySelectorAll("main .rd-stack, main .rd-stack *")]
            .filter((el) => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1)
            .map(
              (el) =>
                el.tagName.toLowerCase() + "." + String(el.className).split(/\s+/)[0] + " (content wider than its box)",
            ),
        )),
        ...edgeCulprits(
          items.filter((i) => i.reading),
          width,
        ),
      ]
    : [];
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
  return [
    overflowProblem(c, scrollWidth, culprits),
    readingProblem(c, cut),
    frame && frameProblem(c, frame, boxes),
  ].filter(Boolean);
});
report(problems, `check-overflow: ${all.length} page × width × theme, no horizontal scroll`);

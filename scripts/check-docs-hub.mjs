#!/usr/bin/env node
/* The docs hub is the notebook's sommaire, not cards (founder, 2026-11-06, krizaka-internal#2799): /fr/docs and /en/docs
   at 375, 768, 1280 and 1470 px, dark and light, in a real browser (scripts/site-pages.mjs), against a running site.
   CI runs it on the container:
     node --experimental-strip-types scripts/check-docs-hub.mjs --base http://localhost:3000
   Each reading checks the rows of lib/docs-start.ts (§ n, title, line, every link), that nothing in the sommaire draws a
   box (border, shadow, radius, a filled link), and that the page neither scrolls sideways nor leaves the bar's frame.
   Exits 1 with one line per problem. */

import { START_PATHS } from "../lib/docs-start.ts";
import { expectedRows, hubCases, hubProblems } from "./docs-hub-lib.mjs";
import { frameProblem, overflowProblem } from "./overflow-lib.mjs";
import { baseFromArgv, report, visitPages } from "./site-pages.mjs";

const problems = await visitPages(baseFromArgv(), hubCases(), async (page, c) => {
  await page.waitForTimeout(800);
  const seen = await page.evaluate(() => {
    const name = (el) =>
      el.tagName.toLowerCase() +
      (typeof el.className === "string" && el.className ? "." + el.className.split(/\s+/)[0] : "");
    // The section is named by its heading (`Section` puts the id on the h2): « Commencer ici » / « Start here ».
    const hub = document.querySelector("main section[aria-labelledby='start']");
    const list = hub?.querySelector(".kz-contents");
    const cards = document.querySelectorAll(
      "main .kz-tpl-collections > li, main section[aria-labelledby='start'] [class*='card']",
    ).length;
    if (!list) {
      return { found: false, cards, rows: [], boxed: [], frame: undefined, boxes: [] };
    }
    const rows = [...list.querySelectorAll(":scope > li")].map((li) => ({
      number: li.querySelector(".kz-contents-no")?.textContent.trim(),
      href: li.querySelector(".kz-contents-title a")?.getAttribute("href"),
      line: li.querySelector(".kz-contents-line")?.textContent.trim() ?? "",
      links: [...li.querySelectorAll(".kz-contents-links a")].map((a) => a.getAttribute("href")),
    }));
    const boxed = [list, ...list.querySelectorAll("*")].flatMap((el) => {
      const s = getComputedStyle(el);
      const why = [];
      const sides = ["Top", "Right", "Bottom", "Left"];
      if (sides.some((k) => s[`border${k}Style`] !== "none" && parseFloat(s[`border${k}Width`]) > 0)) {
        why.push("border");
      }
      if (s.boxShadow !== "none") {
        why.push("box-shadow");
      }
      if (parseFloat(s.borderTopLeftRadius) > 0) {
        why.push("radius");
      }
      if (el.tagName === "A" && s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent") {
        why.push("filled");
      }
      return why.length ? [`${name(el)} (${why.join(", ")})`] : [];
    });
    const bar = document.querySelector(".kz-site-bar")?.getBoundingClientRect();
    const boxes = [...list.querySelectorAll(":scope > li, .kz-contents-links > li")]
      .map((el) => ({ name: name(el), ...el.getBoundingClientRect().toJSON() }))
      .filter((b) => b.width > 0);
    return { found: true, cards, rows, boxed, frame: bar ? { left: bar.left, right: bar.right } : undefined, boxes };
  });
  const { scrollWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth }));
  const locale = c.path.split("/")[1];
  return [
    ...hubProblems(c, seen, expectedRows(START_PATHS, locale)),
    overflowProblem(c, scrollWidth),
    seen.frame && frameProblem(c, seen.frame, seen.boxes),
  ].filter(Boolean);
});
report(problems, `check-docs-hub: ${hubCases().length} page × width × theme, the sommaire whole, no box, no overflow`);

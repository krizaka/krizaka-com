#!/usr/bin/env node
/* A footer link brings you to the top of its page, with its heading in view and focused, its own footer link marked
   current — and every page has exactly one footer landmark. In a real browser, on the real server, phone and desktop:
     node scripts/check-arrival.mjs --base http://localhost:3000
   Exits 1 with one line per arrival that does not behave. */

import { PAGES, VIEWPORTS, arrivalProblems, footerProblems, isAnchor } from "./arrival-lib.mjs";

const i = process.argv.indexOf("--base");
const base = (i > 0 ? process.argv[i + 1] : "http://localhost:3000").replace(/\/$/, "");

const { chromium } = await import("playwright");
const browser = await chromium.launch();
const problems = [];
let arrivals = 0;

const toBottom = (page) => page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));

try {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await context.addInitScript(() => {
      try {
        sessionStorage.setItem("kz-intro", "done");
      } catch {}
    });
    const page = await context.newPage();

    for (const path of PAGES) {
      await page.goto(base + path, { waitUntil: "load", timeout: 60_000 });
      problems.push(
        ...footerProblems(`${vp.name} ${path}`, {
          contentinfo: await page.getByRole("contentinfo").count(),
          footer: await page.locator("footer").count(),
        }),
      );
    }

    for (const from of ["/en", "/en/story"]) {
      await page.goto(base + from, { waitUntil: "load", timeout: 60_000 });
      const links = await page.evaluate(() =>
        [...document.querySelectorAll("footer a[href^='/']")].map((a) => ({ href: a.getAttribute("href"), label: (a.textContent || "").trim() })),
      );
      for (const link of links) {
        await page.goto(base + from, { waitUntil: "load", timeout: 60_000 });
        await toBottom(page);
        await page.waitForTimeout(400);
        const c = { vp: vp.name, from, ...link };
        const target = new URL(link.href, base);
        if (target.pathname.replace(/^\/(en|fr)(?=\/|$)/, "") === from.replace(/^\/(en|fr)(?=\/|$)/, "") && !isAnchor(link.href)) continue; // the page's own link: nowhere to arrive
        await page.locator(`footer a[href="${link.href}"]`).first().click();
        try {
          if (!isAnchor(link.href)) await page.waitForFunction((p) => location.pathname.replace(/^\/(en|fr)(?=\/|$)/, "") === p.replace(/^\/(en|fr)(?=\/|$)/, ""), target.pathname, { timeout: 30_000 });
          await page.waitForTimeout(1500);
          const r = await page.evaluate(
            ({ hash }) => {
              const h1 = document.querySelector("h1");
              const rect = h1?.getBoundingClientRect();
              const mine = [...document.querySelectorAll("footer a")].find((a) => new URL(a.href).pathname === location.pathname && !new URL(a.href).hash);
              const section = hash ? document.getElementById(hash) : null;
              const s = section?.getBoundingClientRect();
              return {
                scrollY: Math.round(window.scrollY),
                h1: h1?.textContent?.trim().slice(0, 40),
                h1Visible: Boolean(rect && rect.bottom > 0 && rect.top < window.innerHeight),
                h1Focused: document.activeElement === h1,
                focus: document.activeElement?.tagName.toLowerCase(),
                hasFooterLink: Boolean(mine),
                current: mine?.getAttribute("aria-current"),
                targetInView: Boolean(s && s.bottom > 0 && s.top < window.innerHeight),
              };
            },
            { hash: target.hash.slice(1) },
          );
          problems.push(...arrivalProblems(c, r));
        } catch (e) {
          problems.push(...arrivalProblems(c, { error: String(e.message).split("\n")[0] }));
        }
        arrivals++;
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`check-arrival: ${arrivals} footer arrivals at the top with the heading focused, one footer on ${PAGES.length} pages, phone and desktop`);

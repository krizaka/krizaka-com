#!/usr/bin/env node
// Accessibility guard: axe-core (WCAG 2.1 AA, through @krizaka/a11y-audit) on every page of the sitemap, in dark and light, at a
// phone and a desktop width, in the browser loop the other checks share (scripts/site-pages.mjs). A ratchet holds the result:
// `a11y-baseline.json` counts the violations per rule; a new one fails, the count only goes down (`--a11y-update` lowers it,
// `--a11y-init` records today's counts).
//
//   node scripts/check-a11y.mjs --base http://localhost:3000
import { fileURLToPath } from "node:url";

import { A11yCollector, auditPage, finish } from "@krizaka/a11y-audit";

import { cases } from "./overflow-lib.mjs";
import { baseFromArgv, visitPages } from "./site-pages.mjs";

export const WIDTHS = [390, 1440];
export const THEMES = ["dark", "light"];
export const EXTRA_PAGES = ["/en/this-page-does-not-exist"];
export const BASELINE = fileURLToPath(new URL("../a11y-baseline.json", import.meta.url));

/** The pages to visit: every address of the sitemap (en and fr), plus the 404. */
export function routesOf(sitemapXml) {
  const paths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/");
  return [...new Set([...paths, ...EXTRA_PAGES])];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const base = baseFromArgv();
  const routes = routesOf(await fetch(`${base}/sitemap.xml`).then((r) => r.text()));
  const a11y = new A11yCollector("krizaka-com");
  await visitPages(base, cases(routes, WIDTHS, THEMES), async (page, c) => {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    a11y.add({ route: c.path, theme: c.theme }, await auditPage(page));
    return [];
  });
  const { problems, notes } = finish(a11y, { baseline: BASELINE });
  for (const note of notes) console.log(note);
  if (problems.length) {
    console.error(`${problems.length} accessibility problem(s):\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`accessibility (axe-core WCAG 2.1 AA): ${routes.length} pages x ${WIDTHS.length} widths x ${THEMES.length} themes, no new violation`);
}

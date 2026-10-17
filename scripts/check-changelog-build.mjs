#!/usr/bin/env node
/* After `next build`: /changelog is prerendered in both languages, shows the latest release, carries the anchor the footer
   links to (/changelog#<site version>), and the RSS feed exists. A page that cannot be right does not ship.
   Usage: node scripts/check-changelog-build.mjs   (run by `npm run build`) */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

/** The problems of a prerendered changelog page (empty = fine). */
export function changelogProblems(html, { latest, siteVersion }) {
  const problems = [];
  if (!/<h1[^>]*>/.test(html)) problems.push("no h1");
  if (latest && !html.includes(`${latest.source} ${latest.version}`)) problems.push(`the latest release (${latest.source} ${latest.version}) is not on the page`);
  if (siteVersion && !html.includes(`id="${siteVersion}"`)) problems.push(`no anchor #${siteVersion} for the footer's link`);
  return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const data = JSON.parse(readFileSync(path.join(root, "lib", "changelog.json"), "utf8"));
  const latest = data.releases?.[0];
  const failures = [];
  for (const locale of ["en", "fr"]) {
    const page = path.join(root, ".next", "server", "app", locale, "changelog.html");
    if (!existsSync(page)) {
      failures.push(`${locale}: /changelog was not prerendered`);
      continue;
    }
    for (const p of changelogProblems(readFileSync(page, "utf8"), { latest, siteVersion: data.platform?.site })) failures.push(`${locale}: ${p}`);
    if (!existsSync(path.join(root, ".next", "server", "app", locale, "changelog", "feed.xml.body"))) failures.push(`${locale}: the RSS feed was not generated`);
  }
  if (failures.length) {
    console.error(`changelog check failed:\n- ${failures.join("\n- ")}`);
    process.exit(1);
  }
  console.log("changelog check: /changelog (en, fr) and its feed are built");
}

/* « Dev preview » as data (krizaka/.github docs/standards/dev-preview.md, ADR-002). Pure functions, no network: the build
   script (gen-dev-preview.mjs) and tests/dev-preview.test.mjs both use them. The criteria below are the standard's. */

import { org } from "@krizaka/org";

export const CRITERIA = [
  "site.healthy",
  "site.signup-closed",
  "site.qa-signin",
  "journey.core",
  "journey.ai-via-sovkora",
  "ui.krizaka-ui",
  "ui.themes-devices",
  "ux.ia-review",
  "mobile.build",
  "mobile.ux-review",
  "quality.ci-green",
  "quality.tests",
  "security.alerts",
  "docs.current",
  "seo.family",
  "ops.cost",
  "admin.gated",
  "admin.noindex",
  "admin.operator-tasks",
  "admin.audit-log",
  "admin.shell",
  "admin.ux-review",
  "admin.ci",
];

/** Where `na` (not applicable, with a reason) is allowed. */
export const NA_ALLOWED = new Set([
  "journey.ai-via-sovkora",
  "mobile.build",
  "mobile.ux-review",
  ...CRITERIA.filter((c) => c.startsWith("admin.")),
]);

/** A checklist older than this no longer proves anything. */
export const MAX_AGE_DAYS = 60;

/** Products that wore « Dev preview » before the gate existed keep it until this date while their gaps close. The test
 *  `the real waivers have not expired` fails the day it ends. */
export const WAIVERS = {}; // none: Sovkora is `development`

const DAY = 86_400_000;
const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);

/** Judge one checklist (the parsed dev-preview.json). `complete` = every criterion has fresh evidence or a justified na. */
export function validateChecklist(c, { today }) {
  const problems = [];
  const crit = c?.criteria ?? {};
  for (const id of Object.keys(crit)) if (!CRITERIA.includes(id)) problems.push(`${id}: unknown criterion`);
  for (const id of CRITERIA) {
    const e = crit[id];
    if (!e) {
      problems.push(`${id}: missing`);
      continue;
    }
    if (e.na !== undefined) {
      if (!NA_ALLOWED.has(id)) problems.push(`${id}: na is not allowed for this criterion`);
      else if (typeof e.na !== "string" || e.na.length < 20)
        problems.push(`${id}: na needs a reason of at least 20 characters`);
      continue;
    }
    if (e.evidence === null || e.evidence === undefined) {
      problems.push(`${id}: no evidence yet${e.gap ? ` (${e.gap})` : ""}`);
      continue;
    }
    if (typeof e.evidence !== "string" || !e.evidence.startsWith("https://")) {
      problems.push(`${id}: evidence must be an https URL`);
      continue;
    }
    if (!e.checked || Number.isNaN(Date.parse(e.checked))) {
      problems.push(`${id}: evidence needs its checked date`);
      continue;
    }
    if (days(e.checked, today) > MAX_AGE_DAYS)
      problems.push(`${id}: evidence is stale (checked ${e.checked}, more than ${MAX_AGE_DAYS} days ago)`);
  }
  return { complete: problems.length === 0, problems };
}

/** The statuses the site shows, read from the org data (`org.products` of @krizaka/org): `{ id: status }`. */
export function readProductStatuses(products = org.products) {
  return Object.fromEntries(products.map((p) => [p.id, p.status]));
}

/** The status literals typed in a source file (`status: "development"`): the site reads each status from the org data,
 *  so a product file that types one is the old shape (krizaka-internal#3425). */
export function statusLiterals(src) {
  const set = "design|upcoming|construction|development|paused|devPreview";
  return [...src.matchAll(new RegExp(`\\bstatus\\s*:\\s*["'](${set})["']`, "g"))].map((m) => m[0]);
}

/** The problems that forbid the statuses: only `devPreview` is gated; a waiver (until a date) lifts it for a product. */
export function assertStatuses(statuses, checklists, { today, waivers = WAIVERS }) {
  const problems = [];
  for (const [id, status] of Object.entries(statuses)) {
    if (status !== "devPreview") continue;
    const until = waivers[id];
    if (until && today <= until) continue;
    const prefix = until ? `${id}: the Dev preview waiver ended ${until}; ` : `${id}: `;
    const c = checklists[id];
    if (!c) {
      problems.push(`${prefix}wears devPreview but has no checklist (dev-preview.json)`);
      continue;
    }
    if (c.product !== id) {
      problems.push(`${prefix}checklist is for product "${c.product}"`);
      continue;
    }
    const r = validateChecklist(c, { today });
    for (const p of r.problems) problems.push(`${prefix}${p}`);
  }
  return problems;
}

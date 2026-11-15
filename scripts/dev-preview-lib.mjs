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

/** The one problem with a criterion's entry (`undefined` when it is fine). */
function criterionProblem(id, e, today) {
  if (!e) return `${id}: missing`;
  if (e.na !== undefined) {
    if (!NA_ALLOWED.has(id)) return `${id}: na is not allowed for this criterion`;
    if (typeof e.na !== "string" || e.na.length < 20) return `${id}: na needs a reason of at least 20 characters`;
    return undefined;
  }
  if (e.evidence === null || e.evidence === undefined) {
    const gap = e.gap ? ` (${e.gap})` : "";
    return `${id}: no evidence yet${gap}`;
  }
  if (typeof e.evidence !== "string" || !e.evidence.startsWith("https://"))
    return `${id}: evidence must be an https URL`;
  if (!e.checked || Number.isNaN(Date.parse(e.checked))) return `${id}: evidence needs its checked date`;
  if (days(e.checked, today) > MAX_AGE_DAYS) {
    return `${id}: evidence is stale (checked ${e.checked}, more than ${MAX_AGE_DAYS} days ago)`;
  }
  return undefined;
}

/** Judge one checklist (the parsed dev-preview.json). `complete` = every criterion has fresh evidence or a justified na. */
export function validateChecklist(c, { today }) {
  const crit = c?.criteria ?? {};
  const problems = [
    ...Object.keys(crit)
      .filter((id) => !CRITERIA.includes(id))
      .map((id) => `${id}: unknown criterion`),
    ...CRITERIA.map((id) => criterionProblem(id, crit[id], today)).filter(Boolean),
  ];
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
  return [...src.matchAll(new RegExp(String.raw`\bstatus\s*:\s*["'](${set})["']`, "g"))].map((m) => m[0]);
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

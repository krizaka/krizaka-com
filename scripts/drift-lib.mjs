/* The weekly drift check, pure (scripts/check-drift.mjs does the network; tests/drift.test.mjs proves these rules).
   A claim of the site is compared with its true source; a finding is either `drift` (the source moved: the update PR
   fixes it) or `missing` (the source cannot be read: the check fails loudly, nothing is guessed). */

import { validateChecklist } from "./dev-preview-lib.mjs";

const DAY = 86_400_000;

/** A snapshot committed to the repository (lib/product-manifests.json) older than `maxDays` is a drift to refresh. */
export function staleSnapshot(readAt, { today, maxDays = 8 }) {
  if (!readAt || Number.isNaN(Date.parse(readAt))) {
    return [{ kind: "missing", claim: "product-manifests", message: "readAt is absent or not a date" }];
  }
  const age = Math.round((Date.parse(today) - Date.parse(readAt)) / DAY);
  return age > maxDays
    ? [
        {
          kind: "drift",
          claim: "product-manifests",
          message: `read ${age} days ago (limit ${maxDays}): run scripts/gen-product-manifests.mjs`,
        },
      ]
    : [];
}

/** The statuses of lib/products.ts against the dev-preview.json of each product (`checklists[id]` undefined = unreadable). */
export function statusFindings(statuses, checklists, { today }) {
  const out = [];
  for (const [id, status] of Object.entries(statuses)) {
    const c = checklists[id];
    if (!c) {
      out.push({ kind: "missing", claim: `${id}.status`, message: `dev-preview.json of ${id} cannot be read` });
      continue;
    }
    const { complete } = validateChecklist(c, { today });
    if (complete && status !== "devPreview") {
      out.push({
        kind: "drift",
        claim: `${id}.status`,
        message: `its checklist is complete: lib/products.ts says "${status}", the source supports "devPreview"`,
      });
    }
    if (!complete && status === "devPreview") {
      out.push({
        kind: "drift",
        claim: `${id}.status`,
        message: `lib/products.ts says "devPreview", its checklist is incomplete`,
      });
    }
  }
  return out;
}

/** `answers`: `{ url: httpStatus | null }` (null = unreachable). Every URL a page links to or loads must answer < 400. */
export function urlFindings(claim, answers) {
  return Object.entries(answers)
    .filter(([, s]) => s === null || s >= 400)
    .map(([url, s]) => ({
      kind: "missing",
      claim,
      message: s === null ? `${url} is unreachable` : `${url} answers ${s}`,
    }));
}

/** The report and the exit code: any `missing` fails; a `drift` is fixed by the update PR, so it only fails with `strict`. */
export function verdict(findings, { strict = false } = {}) {
  const missing = findings.filter((f) => f.kind === "missing");
  const drift = findings.filter((f) => f.kind === "drift");
  const lines = [...missing, ...drift].map((f) => `${f.kind.toUpperCase()} ${f.claim}: ${f.message}`);
  return {
    ok: missing.length === 0 && (!strict || drift.length === 0),
    lines,
    drift: drift.length,
    missing: missing.length,
  };
}

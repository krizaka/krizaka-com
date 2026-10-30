/* Reads each product's dev-preview.json from GitHub (raw, main), writes the git-ignored lib/dev-preview-checklists.json
   and FAILS the build when lib/products.ts shows « Dev preview » for a product whose checklist, evidence or waiver does
   not support it (scripts/dev-preview-lib.mjs, tests/dev-preview.test.mjs). Other statuses are never gated.
   `--offline` skips the network (the gate then only judges what is in the cache file). */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { assertStatuses, readProductStatuses } from "./dev-preview-lib.mjs";

const OUT = new URL("../lib/dev-preview-checklists.json", import.meta.url);
const statuses = readProductStatuses(readFileSync(new URL("../lib/products.ts", import.meta.url), "utf8"));
const today = new Date().toISOString().slice(0, 10);
const offline = process.argv.includes("--offline");
const checklists = {};
const warnings = [];

if (offline) {
  if (existsSync(OUT)) Object.assign(checklists, JSON.parse(readFileSync(OUT, "utf8")).checklists);
} else {
  for (const id of Object.keys(statuses)) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/krizaka/${id}/main/dev-preview.json`, {
        signal: AbortSignal.timeout(20_000),
      });
      if (res.ok) checklists[id] = await res.json();
      else warnings.push(`${id}: dev-preview.json answers ${res.status}`);
    } catch (e) {
      warnings.push(`${id}: dev-preview.json unreachable (${e.message})`);
    }
  }
}

const problems = assertStatuses(statuses, checklists, { today });

// The evidence of a product that wears the status must answer (GitHub's security pages are private, never fetched).
if (!offline) {
  for (const [id, status] of Object.entries(statuses)) {
    if (status !== "devPreview" || !checklists[id]) continue;
    for (const [crit, e] of Object.entries(checklists[id].criteria ?? {})) {
      if (!e.evidence || /github\.com\/krizaka\/[^/]+\/(security|actions)/.test(e.evidence)) continue;
      try {
        const r = await fetch(e.evidence, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(20_000) });
        if (r.status >= 400) problems.push(`${id}: ${crit}: evidence ${e.evidence} answers ${r.status}`);
      } catch (err) {
        problems.push(`${id}: ${crit}: evidence ${e.evidence} unreachable (${err.message})`);
      }
    }
  }
}

writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), statuses, checklists }, null, 2));
for (const w of warnings) console.warn(`dev-preview: ${w}`);
if (problems.length) {
  console.error("dev-preview: the status is not supported by the evidence:\n  " + problems.join("\n  "));
  console.error(
    "Fix the product's dev-preview.json, or change its status in lib/products.ts (krizaka/.github docs/standards/dev-preview.md).",
  );
  process.exit(1);
}
console.log(
  `dev-preview: ${Object.values(statuses).filter((s) => s === "devPreview").length} product(s) with the status, all supported (${Object.keys(checklists).length} checklist(s) read).`,
);

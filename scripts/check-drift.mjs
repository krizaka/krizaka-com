#!/usr/bin/env node
/* The weekly drift check (.github/workflows/drift.yml): what krizaka.com claims against its true sources.
     node scripts/check-drift.mjs [--strict] [--media-only]
   - product status (lib/products.ts) against each product's dev-preview.json on GitHub;
   - the committed snapshot of the products' manifests (lib/product-manifests.json) against its age;
   - every product's repository answers;
   - every media file of lib/cdn-manifest.json (videos, posters) answers on the pull zone.
   A source that cannot be read fails loudly (exit 1). Drift alone exits 0 unless --strict: the workflow's update PR fixes it. */
import { readFileSync } from "node:fs";
import { readProductStatuses } from "./dev-preview-lib.mjs";
import { objectPath } from "./cdn-assets.mjs";
import { staleSnapshot, statusFindings, urlFindings, verdict } from "./drift-lib.mjs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const status = async (url) => {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(20_000),
      headers: { "user-agent": "krizaka-com-drift" },
    });
    return res.status;
  } catch {
    return null;
  }
};
const statusWithRetry = async (u) => {
  let s = null;
  for (let i = 0; i < 3 && s === null; i++) {
    s = await status(u);
  }
  return s;
};
/** HEAD each URL, 6 at a time, three tries on a network error (the pull zone refuses a burst of 600). */
const answersOf = async (urls) => {
  const out = {};
  let next = 0;
  const worker = async () => {
    while (next < urls.length) {
      const u = urls[next++];
      out[u] = await statusWithRetry(u);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  return out;
};

const readChecklist = async (id) => {
  const res = await fetch(`https://raw.githubusercontent.com/krizaka/${id}/main/dev-preview.json`, {
    signal: AbortSignal.timeout(20_000),
  }).catch(() => null);
  return res?.ok ? await res.json() : undefined;
};
const readChecklists = async (ids) =>
  Object.fromEntries(await Promise.all(ids.map(async (id) => [id, await readChecklist(id)])));

const today = new Date().toISOString().slice(0, 10);
const findings = [];

if (!process.argv.includes("--media-only")) {
  const src = read("lib/products.ts");
  const statuses = readProductStatuses(src);
  const checklists = await readChecklists(Object.keys(statuses));
  findings.push(...statusFindings(statuses, checklists, { today }));
  findings.push(...staleSnapshot(JSON.parse(read("lib/product-manifests.json")).readAt, { today }));
  const repos = new Set([...src.matchAll(/https:\/\/github\.com\/krizaka\/[\w.-]+/g)].map((m) => m[0]));
  findings.push(...urlFindings("product repositories", await answersOf([...repos])));
}

const cdn = process.env.NEXT_PUBLIC_MEDIA_CDN_URL ?? "https://krizaka-assets.b-cdn.net";
const manifest = JSON.parse(read("lib/cdn-manifest.json"));
const media = Object.entries(manifest.files).map(
  ([p, hash]) => `${cdn}/${objectPath(manifest.root, p, hash).split("/").map(encodeURIComponent).join("/")}`,
);
findings.push(...urlFindings("media (videos, posters)", await answersOf(media)));

const v = verdict(findings, { strict: process.argv.includes("--strict") });
for (const l of v.lines) {
  console.log(l);
}
console.log(`check-drift: ${v.missing} source(s) missing, ${v.drift} drift(s), ${media.length} media file(s) checked.`);
process.exit(v.ok ? 0 : 1);

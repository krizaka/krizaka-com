#!/usr/bin/env node
/* The org's standards, read at build from krizaka/.github (main): the intro of ci-and-deploy.md between its
   `<!-- intro:start/end -->` markers (shown first on /open-source) and one card per file of docs/standards (title and
   summary), so a new standard appears by itself. Writes the git-ignored lib/standards.json.
   Fallback: when GitHub cannot be read (or the markers are gone), the previous file is kept; without one the script
   FAILS — a section is never rendered empty. GITHUB_TOKEN, when set, lifts the API rate limit.
   Usage: node scripts/gen-standards.mjs   (run on install, by `dev` and by `build`) */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  absolutizeLinks,
  CI_STANDARD,
  describeStandard,
  extractIntro,
  orderStandards,
  resolveSnapshot,
  STANDARDS_BLOB,
  STANDARDS_DIR,
  STANDARDS_REPO,
} from "../lib/standards.ts";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "standards.json");
const headers = {
  "user-agent": "krizaka-com-build",
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};
const get = async (url, as) => {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return as === "json" ? res.json() : res.text();
};

async function read() {
  const listing = await get(
    `https://api.github.com/repos/${STANDARDS_REPO}/contents/${STANDARDS_DIR}?ref=main`,
    "json",
  );
  const files = listing.filter((f) => f.type === "file" && f.name.endsWith(".md"));
  const docs = await Promise.all(
    files.map(async (f) => [f.name.replace(/\.md$/, ""), await get(f.download_url, "text")]),
  );
  const ci = docs.find(([id]) => id === CI_STANDARD)?.[1];
  const intro = ci ? extractIntro(ci) : null;
  if (!intro) throw new Error(`${CI_STANDARD}.md has no <!-- intro:start --> … <!-- intro:end --> block`);
  const standards = docs.flatMap(([id, md]) => {
    const d = describeStandard(md);
    return d ? [{ id, ...d, url: `${STANDARDS_BLOB}/${id}.md` }] : [];
  });
  return {
    fetchedAt: new Date().toISOString(),
    intro: { paragraphs: intro.paragraphs.map(absolutizeLinks), bullets: intro.bullets.map(absolutizeLinks) },
    standards: orderStandards(standards),
  };
}

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : null;
let fresh = null;
let reason = "";
try {
  fresh = await read();
} catch (e) {
  reason = String(e.message ?? e);
  console.warn(`gen-standards: ${reason}`);
}
try {
  const snapshot = resolveSnapshot(fresh, previous, reason);
  if (snapshot !== fresh) console.warn("gen-standards: keeping the last good copy");
  writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + "\n");
} catch (e) {
  console.error(`gen-standards: ${e.message}`);
  process.exit(1);
}

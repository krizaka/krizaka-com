#!/usr/bin/env node
/* The organisation's figures that the site states (the home hero: "{count} public repositories"), read from GitHub at
   build time — never written by hand.

   Writes the git-ignored lib/org-stats.json: { publicRepositories, org, fetchedAt }. GitHub's organisation endpoint
   gives `public_repos` in one request (GITHUB_TOKEN, when set, lifts the anonymous rate limit — CI passes it).
   When GitHub cannot be reached (offline, rate limit), the previous file is kept; without one, nothing is written and
   lib/org-stats.ts falls back to the repositories the generated product data knows (lib/org-data.ts). The build
   never fails for it.

   Usage: node scripts/gen-org-stats.mjs   (run by `dev` and `build`) */

import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ORG = "krizaka";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "org-stats.json");

async function main() {
  const headers = { accept: "application/vnd.github+json", "user-agent": "krizaka-com-build" };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`https://api.github.com/orgs/${ORG}`, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
    const { public_repos: publicRepositories } = await res.json();
    if (!Number.isInteger(publicRepositories) || publicRepositories <= 0) throw new Error("no public_repos in the answer");
    writeFileSync(OUT, JSON.stringify({ org: ORG, publicRepositories, fetchedAt: new Date().toISOString() }, null, 2) + "\n");
    console.log(`org-stats: ${publicRepositories} public repositories in ${ORG}`);
  } catch (error) {
    const kept = existsSync(OUT) ? "keeping the previous lib/org-stats.json" : "falling back to the generated repository list";
    console.warn(`org-stats: GitHub unreachable (${error.message}) — ${kept}`);
  }
}

await main();

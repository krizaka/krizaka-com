#!/usr/bin/env node
/* Which repositories of the organisation have Discussions and Issues on, read from GitHub at build time — the contact
   page's « Or talk in public » links Discussions only where it is on (lib/public-channels.ts).

   Writes the git-ignored lib/github-channels.json: { org, repos: { <name>: { discussions, issues } }, fetchedAt }.
   APP_GITHUB_TOKEN, when set, lifts the anonymous rate limit. When GitHub cannot be reached, the previous file is
   kept; without one nothing is written and no Discussions link is claimed (questions go to an issue). Never fails the build.

   Usage: node scripts/gen-github-channels.mjs   (run by `dev` and `build`) */

import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stateFromRepositories } from "./github-channels-lib.mjs";

const ORG = "krizaka";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "github-channels.json");
const headers = { accept: "application/vnd.github+json", "user-agent": "krizaka-com-build" };
if (process.env.APP_GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.APP_GITHUB_TOKEN}`;

async function main() {
  try {
    const all = [];
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(`https://api.github.com/orgs/${ORG}/repos?type=public&per_page=100&page=${page}`, { headers, signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
      const batch = await res.json();
      all.push(...batch);
      if (batch.length < 100) break;
    }
    if (all.length === 0) throw new Error("no repository in the answer");
    const repos = stateFromRepositories(all.filter((r) => !r.archived));
    writeFileSync(OUT, JSON.stringify({ org: ORG, repos, fetchedAt: new Date().toISOString() }, null, 2) + "\n");
    const on = Object.values(repos).filter((r) => r.discussions).length;
    console.log(`github-channels: ${on} of ${Object.keys(repos).length} repositories have Discussions on`);
  } catch (error) {
    console.warn(`github-channels: GitHub unreachable (${error.message}) — ${existsSync(OUT) ? "keeping the previous lib/github-channels.json" : "no Discussions link will be claimed"}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();

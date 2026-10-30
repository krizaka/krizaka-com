#!/usr/bin/env node
/* The organisation's figures and repositories that the site states (the home hero: "{count} public repositories",
   /open-source: every repository of every product), read from GitHub at build time — never written by hand.

   Writes the git-ignored lib/org-stats.json: { org, publicRepositories, repositories: [{ name, description, url,
   topics, language, archived, pushedAt }], fetchedAt }. The organisation endpoint gives `public_repos`; the repositories come
   from /orgs/<org>/repos (paginated, public only). APP_GITHUB_TOKEN, when set, lifts the anonymous rate limit — CI and the
   DigitalOcean build pass it. When GitHub cannot be reached (offline, rate limit), the previous file is kept; without
   one, nothing is written and lib/org-repositories.ts falls back to the repositories the generated product data knows
   (lib/org-data.ts). The build never fails for it.

   Usage: node scripts/gen-org-stats.mjs   (run by `dev` and `build`) */

import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ORG = "krizaka";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "org-stats.json");

const headers = { accept: "application/vnd.github+json", "user-agent": "krizaka-com-build" };
const token = process.env.APP_GITHUB_TOKEN;
if (token) headers.authorization = `Bearer ${token}`;

async function get(url) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  return res.json();
}

/** Every public repository of the organisation, the fields the site shows — sorted by name. */
export async function fetchRepositories(org = ORG) {
  const all = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await get(`https://api.github.com/orgs/${org}/repos?type=public&per_page=100&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all
    .filter((r) => !r.private && !r.fork)
    .map((r) => ({
      name: r.name,
      description: r.description ?? "",
      url: r.html_url,
      topics: r.topics ?? [],
      language: r.language ?? null,
      archived: Boolean(r.archived),
      pushedAt: r.pushed_at ?? null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** A value from the network, as one log line (no line break can forge a log entry). */
export const oneLine = (v) =>
  String(v)
    .replace(/[\r\n\t]+/g, " ")
    .slice(0, 200);

async function main() {
  try {
    const [{ public_repos: publicRepositories }, repositories] = await Promise.all([
      get(`https://api.github.com/orgs/${ORG}`),
      fetchRepositories(),
    ]);
    if (!Number.isInteger(publicRepositories) || publicRepositories <= 0)
      throw new Error("no public_repos in the answer");
    if (repositories.length === 0) throw new Error("no repository in the answer");
    writeFileSync(
      OUT,
      JSON.stringify({ org: ORG, publicRepositories, repositories, fetchedAt: new Date().toISOString() }, null, 2) +
        "\n",
    );
    console.log(
      `org-stats: ${oneLine(publicRepositories)} public repositories in ${ORG} (${repositories.length} listed)`,
    );
  } catch (error) {
    const kept = existsSync(OUT)
      ? "keeping the previous lib/org-stats.json"
      : "falling back to the generated repository list";
    console.warn(`org-stats: GitHub unreachable (${oneLine(error.message)}) — ${kept}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();

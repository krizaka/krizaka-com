#!/usr/bin/env node
/* The company changelog, read at build from the release data of the family — never written by hand.

   Writes the git-ignored lib/changelog.json ({ releases: Release[], platform: { site, ui, tokens }, fetchedAt }), the shape of lib/changelog.ts:
   - the @krizaka packages of krizaka-ui: each package's changesets CHANGELOG.md (raw GitHub), dated from the npm
     registry's publish times;
   - GitHub Releases of the products and of Krizaka Java (krizaka-build): their bodies parsed for tagged changes.
   Only highlights: a release without a change a reader would care about is dropped; the list is cut at 60 entries.
   GITHUB_TOKEN (when set) lifts the API rate limit. When a source cannot be reached the previous file is kept; without
   one an empty file is written, and the page says so honestly. The build never fails for it.

   Usage: node scripts/gen-changelog.mjs   (run by `dev` and `build`) */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { newestFirst, parseChangesets, parseReleaseBody } from "../lib/changelog.ts";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "changelog.json");
const PACKAGES = ["ui", "tokens", "icons", "i18n", "tailwind", "charts"]; // krizaka-ui/packages/<dir>
const PRODUCT_REPOS = [
  ["orazaka", "Orazaka"],
  ["orochia", "Orochia"],
  ["yomizaka", "Yomizaka"],
  ["yasakia", "Yasakia"],
  ["yororis", "Yororis"],
  ["kachizaka", "Kachizaka"],
  ["akinaza", "Akinaza"],
  ["krizaka-build", "Krizaka Java"],
];
const MAX = 60;
const headers = { "user-agent": "krizaka-com-build", ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
const get = async (url, as = "json") => {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return as === "json" ? res.json() : res.text();
};

async function packageReleases(dir) {
  const name = dir === "ui" || PACKAGES.includes(dir) ? `@krizaka/${dir}` : dir;
  const [md, meta] = await Promise.all([
    get(`https://raw.githubusercontent.com/krizaka/krizaka-ui/main/packages/${dir}/CHANGELOG.md`, "text"),
    get(`https://registry.npmjs.org/${encodeURIComponent(name)}`),
  ]);
  const releases = parseChangesets(md, name, (v) => meta.time?.[v]?.slice(0, 10));
  return releases.map((r) => ({ ...r, url: `https://www.npmjs.com/package/${name}/v/${r.version}` }));
}

async function repoReleases([repo, source]) {
  const list = await get(`https://api.github.com/repos/krizaka/${repo}/releases?per_page=10`);
  return list
    .filter((r) => !r.draft && r.published_at)
    .map((r) => ({
      source,
      version: String(r.tag_name).replace(/^v/, ""),
      date: r.published_at.slice(0, 10),
      url: r.html_url,
      changes: parseReleaseBody(r.body ?? ""),
    }))
    .filter((r) => r.changes.length > 0);
}

const settled = await Promise.allSettled([...PACKAGES.map(packageReleases), ...PRODUCT_REPOS.map(repoReleases)]);
const releases = settled.flatMap((s) => (s.status === "fulfilled" ? s.value : [])).sort(newestFirst).slice(0, MAX);
const failed = settled.filter((s) => s.status === "rejected");
if (failed.length) console.warn(`changelog: ${failed.length} source(s) unreachable (${failed.map((f) => f.reason?.message).join("; ")})`);

// The versions the site runs on, read from what is installed (the lockfile's result), never typed.
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const versionOf = (file) => {
  try {
    return JSON.parse(readFileSync(path.join(root, file), "utf8")).version;
  } catch {
    return undefined;
  }
};
const platform = { site: versionOf("package.json"), ui: versionOf("node_modules/@krizaka/ui/package.json"), tokens: versionOf("node_modules/@krizaka/tokens/package.json") };

if (releases.length || !existsSync(OUT)) {
  writeFileSync(OUT, `${JSON.stringify({ releases, platform, fetchedAt: new Date().toISOString() }, null, 1)}\n`);
  console.log(`changelog: ${releases.length} releases`);
} else {
  // Sources unreachable: keep the releases, refresh the platform line.
  const previous = JSON.parse(readFileSync(OUT, "utf8"));
  writeFileSync(OUT, `${JSON.stringify({ ...previous, platform }, null, 1)}\n`);
  console.warn("changelog: nothing read, previous releases kept");
}

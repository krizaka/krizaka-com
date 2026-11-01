#!/usr/bin/env node
/* The company changelog, read at build from the release data of the family — never written by hand.

   Writes the git-ignored lib/changelog.json ({ releases: Release[], platform: { site, release }, fetchedAt }), the shape of lib/changelog.ts:
   - the @krizaka packages of krizaka-ui: each package's changesets CHANGELOG.md (raw GitHub), dated from the npm
     registry's publish times;
   - GitHub Releases of the products (Orazaka is several repositories) and of Krizaka Java: the repositories are the
     list of krizaka/.github `release-repos.json` (one source, also read by the weekly digest); a release written by the
     shared `release-notes` workflow carries an English and a French section, both kept.
   Only highlights: a release without a change a reader would care about is dropped; the list is cut at 60 entries.
   The public text is linted (lib/changelog.ts `releaseProblems`): no personal name, no em dash; a line that still has
   one fails the build, and the previous deployment stays up.
   GITHUB_TOKEN (when set) lifts the API rate limit. When a source cannot be reached the previous file is kept; without
   one an empty file is written, and the page says so honestly. The build never fails for it.

   Usage: node scripts/gen-changelog.mjs   (run by `dev` and `build`) */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE_REPO,
  newestFirst,
  parseChangesets,
  parseReleaseBodies,
  releaseProblems,
  siteReleaseUrl,
} from "../lib/changelog.ts";
import { commercialWords } from "../lib/commercial-words.ts";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "changelog.json");
const PACKAGES = ["ui", "tokens", "icons", "i18n", "tailwind", "charts"]; // krizaka-ui/packages/<dir>
const REPOS_LIST = "https://raw.githubusercontent.com/krizaka/.github/main/release-repos.json";
const MAX = 60;
const headers = {
  "user-agent": "krizaka-com-build",
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};
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

async function repoReleases({ id, name, repo, parts }) {
  const list = await get(`https://api.github.com/repos/krizaka/${repo}/releases?per_page=10`);
  return list
    .filter((r) => !r.draft && r.published_at)
    .map((r) => {
      const { en, fr } = parseReleaseBodies(r.body ?? "");
      return {
        source: name,
        product: id,
        ...(parts ? { part: repo.replace(`${id}-`, "") } : {}),
        version: String(r.tag_name).replace(/^v/, ""),
        date: r.published_at.slice(0, 10),
        url: r.html_url,
        changes: en,
        ...(fr ? { fr } : {}),
      };
    })
    .filter((r) => r.changes.length > 0);
}

/** One task per repository of every product, from the shared list. */
async function productTasks() {
  const { products } = await get(REPOS_LIST);
  return products.flatMap(({ id, name, repos }) =>
    repos.map((repo) => () => repoReleases({ id, name, repo, parts: repos.length > 1 })),
  );
}

const tasks = [
  ...PACKAGES.map((dir) => () => packageReleases(dir)),
  ...(await productTasks().catch((e) => (console.warn(`changelog: ${e.message}`), []))),
];
const settled = await Promise.allSettled(tasks.map((run) => run()));
const releases = settled
  .flatMap((s) => (s.status === "fulfilled" ? s.value : []))
  .sort(newestFirst)
  .slice(0, MAX);
const problems = releaseProblems(releases);
if (problems.length) {
  console.error(`changelog: public text refused:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
const failed = settled.filter((s) => s.status === "rejected");
if (failed.length)
  console.warn(
    `changelog: ${failed.length} source(s) unreachable (${failed.map((f) => f.reason?.message).join("; ")})`,
  );

// krizaka.com's own version only (package.json, bumped by release-please), never the packages it runs on: those belong to
// a deployment, not to the page. The footer links its GitHub release when it is published (the releases list before).
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).version;
const published = await get(`https://api.github.com/repos/${SITE_REPO}/releases/tags/v${site}`).then(
  () => true,
  () => false,
);
const platform = { site, release: siteReleaseUrl(site, published) };

const say = (lines) => lines?.map((c) => ({ ...c, text: commercialWords(c.text) }));
const commercial = releases.map((r) => ({
  ...r,
  source: commercialWords(r.source),
  changes: say(r.changes),
  ...(r.fr ? { fr: say(r.fr) } : {}),
}));

if (releases.length || !existsSync(OUT)) {
  writeFileSync(
    OUT,
    `${JSON.stringify({ releases: commercial, platform, fetchedAt: new Date().toISOString() }, null, 1)}\n`,
  );
  console.log(`changelog: ${releases.length} releases`);
} else {
  // Sources unreachable: keep the releases, refresh the platform line.
  const previous = JSON.parse(readFileSync(OUT, "utf8"));
  writeFileSync(OUT, `${JSON.stringify({ ...previous, platform }, null, 1)}\n`);
  console.warn("changelog: nothing read, previous releases kept");
}

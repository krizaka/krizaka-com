#!/usr/bin/env node
/* The versions the site states (the badges of /open-source, the Maven list, the samples), read from the registries at
   build time — one source, never written by hand.

   Writes the git-ignored lib/registry-versions.json: { npm: { "@krizaka/ui": "2.4.0", … }, npmMeta: { "@krizaka/ui":
   { description, keywords, repository, homepage, weeklyDownloads, weeklySeries } }, maven: { "krizaka-bom": "0.2.0", … },
   mavenMeta: { "krizaka-bom": { description, parent, scm } }, fetchedAt }.
   - npm: every package of the @krizaka scope (registry search), then each package's `latest` dist-tag; its description,
     keywords, repository and homepage as published, and its downloads of the last week (api.npmjs.org; absent when
     unknown) and its 12 weekly sums (range endpoint, scripts/npm-downloads-lib.mjs) — /open-source's packages table (lib/package-catalogue.ts).
   - Maven Central: every artifact under com/krizaka on repo1 (its directory listing), then each maven-metadata.xml's
     <release> — the authoritative file, not the search index (which lags) — and the released POM's <description>,
     its com.krizaka <parent> and <scm><url> (the repository is derived from them).
   When a registry cannot be reached, the previous file is kept; without one, an empty one is written and the site
   hides what it cannot know. The build never fails for it.

   Usage: node scripts/gen-registry-versions.mjs   (run on install, by `dev` and by `build`) */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { rangeWindow, weeklyBuckets } from "./npm-downloads-lib.mjs";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "registry-versions.json");
const TIMEOUT = 8000;
const get = async (url, as = "json") => {
  const res = await fetch(url, {
    headers: { "user-agent": "krizaka-com-build" },
    signal: AbortSignal.timeout(TIMEOUT),
  });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return as === "json" ? res.json() : res.text();
};

/** api.npmjs.org rate-limits bursts (429): the range requests go one at a time, each retried after a pause. */
async function getPaced(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      return await get(url);
    } catch (e) {
      if (i === tries - 1 || !/429/.test(String(e.message))) return null;
      await new Promise((r) => setTimeout(r, 3000 * (i + 1)));
    }
  }
  return null;
}

async function npmVersions() {
  const { objects } = await get("https://registry.npmjs.org/-/v1/search?text=%40krizaka&size=100");
  const names = objects.map((o) => o.package.name).filter((n) => n.startsWith("@krizaka/"));
  const entries = [];
  for (const name of names) {
    entries.push(
      await (async () => {
        const [latest, downloads] = await Promise.all([
          get(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`),
          get(`https://api.npmjs.org/downloads/point/last-week/${name}`).catch(() => null),
        ]);
        // npm posts its counts a day or two late: the window ends on the day `last-week` itself ends on (never on a
        // day not yet counted, which would read as 0), so the newest bucket equals the weekly figure.
        const endDay = /^\d{4}-\d{2}-\d{2}$/.test(downloads?.end ?? "") ? downloads.end : null;
        const window = endDay ? rangeWindow(endDay, 12) : null;
        const range = window
          ? await getPaced(`https://api.npmjs.org/downloads/range/${window.start}:${window.end}/${name}`)
          : null;
        const series = window ? weeklyBuckets(range, window.end, 12) : null;
        const repository = typeof latest.repository === "string" ? latest.repository : latest.repository?.url;
        return [
          name,
          latest.version,
          {
            description: latest.description ?? "",
            keywords: Array.isArray(latest.keywords) ? latest.keywords : [],
            ...(repository ? { repository: githubUrl(repository) } : {}),
            ...(typeof latest.homepage === "string" ? { homepage: latest.homepage } : {}),
            ...(Number.isInteger(downloads?.downloads) ? { weeklyDownloads: downloads.downloads } : {}),
            ...(series ? { weeklySeries: series } : {}),
          },
        ];
      })(),
    );
  }
  const published = entries.filter(([, v]) => typeof v === "string");
  return {
    versions: Object.fromEntries(published.map(([n, v]) => [n, v])),
    meta: Object.fromEntries(published.map(([n, , m]) => [n, m])),
  };
}

/** `git+https://github.com/krizaka/krizaka-ui.git` → `https://github.com/krizaka/krizaka-ui`. */
export function githubUrl(repository) {
  return repository
    .replace(/^git\+/, "")
    .replace(/^git:\/\//, "https://")
    .replace(/\.git$/, "")
    .replace(/^github:/, "https://github.com/");
}

/** What a released POM says about itself: its description, its com.krizaka parent, its scm url. */
export function pomMeta(xml) {
  const own = xml.replace(/<parent>[\s\S]*?<\/parent>/, "").replace(/<dependencies>[\s\S]*$/, "");
  const parent = xml.match(
    /<parent>[\s\S]*?<groupId>com\.krizaka<\/groupId>[\s\S]*?<artifactId>([^<]+)<\/artifactId>[\s\S]*?<\/parent>/,
  )?.[1];
  const description = own
    .match(/<description>([\s\S]*?)<\/description>/)?.[1]
    ?.replace(/\s+/g, " ")
    .trim();
  const scm = xml.match(/<scm>[\s\S]*?<url>([^<]+)<\/url>/)?.[1];
  return { ...(description ? { description } : {}), ...(parent ? { parent } : {}), ...(scm ? { scm } : {}) };
}

async function mavenVersions() {
  const base = "https://repo1.maven.org/maven2/com/krizaka/";
  const listing = await get(base, "text");
  const artifacts = [...listing.matchAll(/href="([a-z0-9-]+)\/"/g)].map((m) => m[1]);
  const entries = await Promise.all(
    artifacts.map(async (a) => {
      const xml = await get(`${base}${a}/maven-metadata.xml`, "text").catch(() => "");
      const version = xml.match(/<release>([^<]+)<\/release>/)?.[1] ?? xml.match(/<latest>([^<]+)<\/latest>/)?.[1];
      const pom = version ? await get(`${base}${a}/${version}/${a}-${version}.pom`, "text").catch(() => "") : "";
      return [a, version, pomMeta(pom)];
    }),
  );
  const found = entries.filter(([, v]) => v);
  return {
    versions: Object.fromEntries(found.map(([a, v]) => [a, v])),
    meta: Object.fromEntries(found.map(([a, , m]) => [a, m])),
  };
}

async function main() {
  const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { npm: {}, npmMeta: {}, maven: {} };
  const [npm, maven] = await Promise.allSettled([npmVersions(), mavenVersions()]);
  const npmOk = npm.status === "fulfilled" && Object.keys(npm.value.versions).length > 0;
  const mavenOk = maven.status === "fulfilled" && Object.keys(maven.value.versions).length > 0;
  const out = {
    npm: npmOk ? npm.value.versions : previous.npm,
    npmMeta: npmOk ? npm.value.meta : (previous.npmMeta ?? {}),
    maven: mavenOk ? maven.value.versions : previous.maven,
    mavenMeta: mavenOk ? maven.value.meta : (previous.mavenMeta ?? {}),
    fetchedAt: new Date().toISOString(),
  };
  for (const [name, r] of [
    ["npm", npm],
    ["Maven Central", maven],
  ])
    if (r.status === "rejected")
      console.warn(`registry-versions: ${name} unreachable (${r.reason?.message}) — keeping what was known`);
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `registry-versions: ${Object.keys(out.npm).length} npm packages, ${Object.keys(out.maven).length} Maven artifacts`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();

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
   Requests are paced and retried (scripts/registry-fetch-lib.mjs, Retry-After honoured). A package with no fresh figure
   takes the one of the previous file; when some still have none, CI and production builds FAIL (the deploy keeps the
   last release rather than shipping half the figures, krizaka-internal#4002), a developer machine only warns.
   When npm cannot be reached at all, the previous file is kept (without one, an empty one is written).

   Usage: node scripts/gen-registry-versions.mjs   (run on install, by `dev` and by `build`) */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createFetcher, missingFigures, withFallback } from "./registry-fetch-lib.mjs";
import { rangeWindow, weeklyBuckets } from "./npm-downloads-lib.mjs";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "registry-versions.json");
const get = createFetcher({ log: (m) => console.warn(`registry-versions: ${m}`) });

export async function npmVersions(get) {
  const { objects } = await get("https://registry.npmjs.org/-/v1/search?text=%40krizaka&size=100");
  const names = objects.map((o) => o.package.name).filter((n) => n.startsWith("@krizaka/"));
  const entries = [];
  for (const name of names) {
    entries.push(
      await (async () => {
        const [latest, downloads] = await Promise.all([
          get(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`),
          get(`https://api.npmjs.org/downloads/point/last-week/${name}`).catch((e) => {
            console.warn(`registry-versions: ${name}: no weekly figure (${e.message})`);
            return null;
          }),
        ]);
        // npm posts its counts a day or two late: the window ends on the day `last-week` itself ends on (never on a
        // day not yet counted, which would read as 0), so the newest bucket equals the weekly figure.
        const endDay = /^\d{4}-\d{2}-\d{2}$/.test(downloads?.end ?? "") ? downloads.end : null;
        const window = endDay ? rangeWindow(endDay, 12) : null;
        const range = window
          ? await get(`https://api.npmjs.org/downloads/range/${window.start}:${window.end}/${name}`).catch(() => null)
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

async function mavenVersions(get) {
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

/** CI and production builds stop on a missing figure (the deploy keeps the last release); a developer machine warns. */
export function figureVerdict({ missing, total, runtime }) {
  const strict = Boolean(runtime.CI || runtime.NODE_ENV === "production" || runtime.KRIZAKA_GEN_STRICT);
  const bad = missing.length > 0 || total === 0;
  const what = missing.length ? missing.join(", ") : "any package (npm unreachable)";
  return {
    fail: strict && bad,
    message: `registry-versions: no weekly download figure for ${what} after retries — failing the build (krizaka-internal#4002)`,
  };
}

async function main() {
  const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { npm: {}, npmMeta: {}, maven: {} };
  const [npm, maven] = await Promise.allSettled([npmVersions(get), mavenVersions(get)]);
  if (npm.status === "fulfilled") {
    const { meta, kept } = withFallback(npm.value.meta, previous.npmMeta);
    npm.value.meta = meta;
    if (kept.length)
      console.warn(`registry-versions: ${kept.length} figure(s) kept from the last good snapshot: ${kept.join(", ")}`);
  }
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
      console.warn(`registry-versions: ${String(name)} unreachable (${r.reason?.message}) — keeping what was known`);
  const missing = npmOk ? missingFigures(out.npmMeta) : [];
  const total = Object.keys(out.npm).length;
  console.log(`registry-versions: ${total - missing.length}/${total} npm packages have a weekly download figure`);
  // A build that ships half the figures hides « What gets used » on the home: in CI and in production the build stops
  // (the deploy keeps running the previous release), on a developer machine it only warns.
  const verdict = figureVerdict({ missing, total, runtime: process["env"] });
  if (verdict.fail) {
    console.error(verdict.message);
    process.exit(1);
  }
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `registry-versions: ${Object.keys(out.npm).length} npm packages, ${Object.keys(out.maven).length} Maven artifacts`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();

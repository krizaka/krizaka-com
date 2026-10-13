#!/usr/bin/env node
/* The versions the site states (the badges of /open-source, the Maven list, the samples), read from the registries at
   build time — one source, never written by hand.

   Writes the git-ignored lib/registry-versions.json: { npm: { "@krizaka/ui": "2.4.0", … }, npmMeta: { "@krizaka/ui":
   { description, keywords } }, maven: { "krizaka-bom": "0.2.0", … }, fetchedAt }.
   - npm: every package of the @krizaka scope (registry search), then each package's `latest` dist-tag; its description
     and keywords as published (the /open-source npm section summarises and groups them — lib/npm-catalogue.ts).
   - Maven Central: every artifact under com/krizaka on repo1 (its directory listing), then each maven-metadata.xml's
     <release> — the authoritative file, not the search index (which lags).
   When a registry cannot be reached, the previous file is kept; without one, an empty one is written and the site
   hides what it cannot know. The build never fails for it.

   Usage: node scripts/gen-registry-versions.mjs   (run on install, by `dev` and by `build`) */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "registry-versions.json");
const TIMEOUT = 8000;
const get = async (url, as = "json") => {
  const res = await fetch(url, { headers: { "user-agent": "krizaka-com-build" }, signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return as === "json" ? res.json() : res.text();
};

async function npmVersions() {
  const { objects } = await get("https://registry.npmjs.org/-/v1/search?text=%40krizaka&size=100");
  const names = objects.map((o) => o.package.name).filter((n) => n.startsWith("@krizaka/"));
  const entries = await Promise.all(
    names.map(async (name) => {
      const latest = await get(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`);
      return [name, latest.version, { description: latest.description ?? "", keywords: Array.isArray(latest.keywords) ? latest.keywords : [] }];
    }),
  );
  const published = entries.filter(([, v]) => typeof v === "string");
  return {
    versions: Object.fromEntries(published.map(([n, v]) => [n, v])),
    meta: Object.fromEntries(published.map(([n, , m]) => [n, m])),
  };
}

async function mavenVersions() {
  const base = "https://repo1.maven.org/maven2/com/krizaka/";
  const listing = await get(base, "text");
  const artifacts = [...listing.matchAll(/href="([a-z0-9-]+)\/"/g)].map((m) => m[1]);
  const entries = await Promise.all(
    artifacts.map(async (a) => {
      const xml = await get(`${base}${a}/maven-metadata.xml`, "text").catch(() => "");
      return [a, xml.match(/<release>([^<]+)<\/release>/)?.[1] ?? xml.match(/<latest>([^<]+)<\/latest>/)?.[1]];
    }),
  );
  return Object.fromEntries(entries.filter(([, v]) => v));
}

async function main() {
  const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : { npm: {}, npmMeta: {}, maven: {} };
  const [npm, maven] = await Promise.allSettled([npmVersions(), mavenVersions()]);
  const npmOk = npm.status === "fulfilled" && Object.keys(npm.value.versions).length > 0;
  const out = {
    npm: npmOk ? npm.value.versions : previous.npm,
    npmMeta: npmOk ? npm.value.meta : (previous.npmMeta ?? {}),
    maven: maven.status === "fulfilled" && Object.keys(maven.value).length ? maven.value : previous.maven,
    fetchedAt: new Date().toISOString(),
  };
  for (const [name, r] of [["npm", npm], ["Maven Central", maven]])
    if (r.status === "rejected") console.warn(`registry-versions: ${name} unreachable (${r.reason?.message}) — keeping what was known`);
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`registry-versions: ${Object.keys(out.npm).length} npm packages, ${Object.keys(out.maven).length} Maven artifacts`);
}

await main();

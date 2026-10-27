#!/usr/bin/env node
/* The version each product's dev site runs, read at build time from its /api/healthz — one source, never typed.

   Writes the git-ignored lib/dev-versions.json: { versions: { orazaka: "1.0.0+8ff8f61", … }, fetchedAt }. When a dev site cannot
   be reached the previous value is kept, and without one the product shows no version (the page never invents one). The build
   never fails for it.

   Usage: node scripts/gen-dev-versions.mjs   (run by `dev` and by `build`) */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { healthzUrl, mergeVersions, versionOfHealthz } from "./dev-versions-lib.mjs";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "dev-versions.json");
const IDS = ["orazaka", "yomizaka", "akinaza"];

const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const fresh = {};
await Promise.all(
  IDS.map(async (id) => {
    try {
      const res = await fetch(healthzUrl(id), { headers: { "user-agent": "krizaka-com-build" }, signal: AbortSignal.timeout(8000) });
      const version = res.ok ? versionOfHealthz(await res.json()) : undefined;
      if (version) fresh[id] = version;
      else console.warn(`dev-versions: ${id} answered no usable version`);
    } catch (e) {
      console.warn(`dev-versions: ${id}: ${e.message}`);
    }
  }),
);
const versions = mergeVersions(IDS, fresh, previous);
writeFileSync(OUT, JSON.stringify({ versions, fetchedAt: new Date().toISOString() }, null, 2) + "\n");
console.log(`dev-versions: ${Object.entries(versions).map(([id, v]) => `${id} ${v}`).join(", ") || "none"}`);

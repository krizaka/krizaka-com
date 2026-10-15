#!/usr/bin/env node
/* The proof behind the table "What each product runs on" (/open-source): what each product's repositories really
   depend on, read from their manifests on GitHub (public, main branch) and written to lib/product-manifests.json —
   which is committed, so the test (tests/product-stack.test.mjs) and the build need no network.

   Per product: the @krizaka/* npm dependencies of its package.json files, the krizaka-* Maven artifacts of its pom.xml
   files (the Java platform kit), and the existence of the files that prove what a manifest cannot (Orazaka's own SSE
   hook). Run it when a product adopts or drops a package, then edit lib/product-stack.ts if a cell changed.

   Usage: node scripts/gen-product-manifests.mjs */

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib", "product-manifests.json");
const RAW = "https://raw.githubusercontent.com/krizaka";

/** repo → manifests to read; `evidence` files must exist (a hook a manifest cannot show); `engineRun` is the file that
    records a real Orazaka run of the product on dev (its run id) — the only proof that it runs on the engine. */
const PRODUCTS = {
  orazaka: {
    npm: ["orazaka-web-client:package.json", "orazaka-web-admin:package.json", "orazaka-mobile-client:package.json"],
    maven: ["orazaka-edge", "orazaka-ai-engine", "orazaka-automation-service", "orazaka-conversation-service", "orazaka-job-service", "orazaka-knowledge-service"].map((r) => `${r}:pom.xml`),
    evidence: ["orazaka-web-client:src/core/hooks/useJobSSE.ts"],
  },
  orochia: { npm: ["orochia:apps/web/package.json", "orochia-admin:package.json", "orochia-mobile:package.json"], maven: ["orochia:pom.xml"] },
  yasakia: { npm: ["yasakia:apps/web/package.json", "yasakia-mobile:package.json"], maven: ["yasakia:pom.xml"] },
  yororis: { npm: ["yororis:site/package.json", "yororis-mobile:package.json"], maven: ["yororis:pom.xml"] },
  yomizaka: { npm: ["yomizaka:apps/web/package.json"], maven: [], engineRun: "yomizaka:apps/web/lib/demo-run.ts" },
};

/** The run id a recorded-run file holds (`"runId": "<uuid>"`), or null — never a guess. */
export const runIdIn = (text) => /"runId":\s*"([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"/i.exec(text ?? "")?.[1] ?? null;

const read = async (spec) => {
  const [repo, file] = spec.split(":");
  const res = await fetch(`${RAW}/${repo}/main/${file}`, { headers: { "user-agent": "krizaka-com" } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`${spec} answered ${res.status}`);
  return res.text();
};

const out = {};
for (const [id, spec] of Object.entries(PRODUCTS)) {
  const npm = new Set();
  const maven = new Set();
  const sources = [];
  for (const s of spec.npm) {
    const text = await read(s);
    if (!text) continue;
    const pkg = JSON.parse(text);
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }).filter((n) => n.startsWith("@krizaka/"));
    deps.forEach((d) => npm.add(d));
    sources.push(s);
  }
  for (const s of spec.maven) {
    const text = await read(s);
    if (!text) continue;
    for (const m of text.matchAll(/<artifactId>(krizaka-[a-z0-9-]+)<\/artifactId>/g)) maven.add(m[1]);
    sources.push(s);
  }
  const evidence = [];
  for (const e of spec.evidence ?? []) if (await read(e)) evidence.push(e);
  const engineRun = spec.engineRun ? runIdIn(await read(spec.engineRun)) : null;
  out[id] = { sources, npm: [...npm].sort(), maven: [...maven].sort(), evidence, ...(engineRun ? { engineRun } : {}) };
}
writeFileSync(OUT, JSON.stringify({ readAt: new Date().toISOString().slice(0, 10), products: out }, null, 2) + "\n");
console.log(JSON.stringify(out, null, 1));

#!/usr/bin/env node
/* Writes lib/assets.json, the registry of the site's assets (krizaka-internal#4482), from its sources: lib/cdn-manifest.json,
   the committed media (git ls-files), content/asset-rules.json and the home storyboard. scripts/cdn-assets.mjs upload runs it
   after it records a file; by hand: `npm run assets:registry`. tests/assets-registry.test.mjs fails when the committed
   registry is not the one built here; the org's assets-guard (.github/workflows/assets-guard.yml) checks it in CI. */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildRegistry } from "./assets-registry-lib.mjs";

const MEDIA = /\.(jpe?g|png|webp|avif|svg|gif|ico|mp4|webm)$/i;
const ROOT = join(import.meta.dirname, "..");
const json = (root, f) => JSON.parse(readFileSync(join(root, f), "utf8"));

/** The committed media of the repository, test fixtures aside (they are no asset of the site). */
export const committedMedia = (root, run = execFileSync) =>
  run("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
    .split("\0")
    .filter((p) => MEDIA.test(p) && !p.startsWith("tests/"));

/** The sources of the registry, read from a checkout. */
export const readSources = (root = ROOT) => ({
  manifest: json(root, "lib/cdn-manifest.json"),
  local: committedMedia(root),
  rules: json(root, "content/asset-rules.json"),
  storyboard: json(root, "content/films/home-showcase.json"),
});

/** Builds and writes lib/assets.json; returns its path. */
export function writeRegistry(root = ROOT) {
  const file = join(root, "lib/assets.json");
  writeFileSync(file, `${JSON.stringify(buildRegistry(readSources(root)), null, 2)}\n`);
  return file;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = writeRegistry();
  console.log(`${file}: ${json(ROOT, "lib/assets.json").assets.length} asset(s)`);
}

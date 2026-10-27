#!/usr/bin/env node
/* Runs the generators of lib/*.json in parallel, skipping those whose file is fresh (scripts/gen-fresh-lib.mjs).
   Used by `dev` and `postinstall` only. KRIZAKA_GEN_MAX_AGE_MIN overrides the 6 h limit (0 = always refetch);
   KRIZAKA_GEN_FORCE=1 or CI forces the fetch. */
import { spawn } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_MAX_AGE_MIN, isFresh } from "./gen-fresh-lib.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const GENERATORS = [
  ["gen-org-stats.mjs", "lib/org-stats.json"],
  ["gen-registry-versions.mjs", "lib/registry-versions.json"],
  ["gen-dev-versions.mjs", "lib/dev-versions.json"],
  ["gen-changelog.mjs", "lib/changelog.json"],
];
const e = process["env"];
const maxAgeMin = e.KRIZAKA_GEN_MAX_AGE_MIN === undefined ? DEFAULT_MAX_AGE_MIN : Number(e.KRIZAKA_GEN_MAX_AGE_MIN);
const mtime = (f) => {
  try {
    return statSync(path.join(root, f)).mtimeMs;
  } catch {
    return null;
  }
};

const jobs = GENERATORS.map(
  ([script, out]) =>
    new Promise((resolve) => {
      if (isFresh({ mtimeMs: mtime(out), now: Date.now(), maxAgeMin, ci: Boolean(e.CI), force: Boolean(e.KRIZAKA_GEN_FORCE) })) {
        console.log(`${script}: ${out} is fresh, not fetched`);
        return resolve(0);
      }
      spawn(process.execPath, [path.join(root, "scripts", script)], { stdio: "inherit" }).on("close", (code) => resolve(code ?? 1));
    }),
);
const codes = await Promise.all(jobs);
process.exit(codes.find((c) => c !== 0) ?? 0);

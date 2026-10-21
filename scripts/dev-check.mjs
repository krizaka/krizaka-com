#!/usr/bin/env node
/* `npm run dev:check` — the fast local gate: ESLint on the files changed against origin/main, a type-check and the unit
   tests (node:test, seconds). CI still runs the whole `npm run lint`, `npm test` and `npm run build`; this is what to
   run on every save-and-think, not what merges. */
import { execFileSync, spawnSync } from "node:child_process";

const LINTABLE = /\.(?:[cm]?[jt]sx?)$/;

/** The changed, still existing, lintable files from `git diff --name-only` style output. */
export function lintableFiles(names) {
  return names.filter((n) => LINTABLE.test(n) && !n.startsWith("node_modules/") && !n.endsWith(".d.ts"));
}

function changed() {
  const git = (...a) => execFileSync("git", a, { encoding: "utf8" }).split("\n").filter(Boolean);
  let base = "origin/main";
  try {
    base = git("merge-base", "HEAD", "origin/main")[0] ?? base;
  } catch {
    /* no origin/main: diff against HEAD only */
  }
  return [...new Set([...git("diff", "--name-only", "--diff-filter=d", base), ...git("ls-files", "--others", "--exclude-standard")])];
}

const step = (label, cmd, args) => {
  const t = Date.now();
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  console.log(`dev:check ${label}: ${r.status === 0 ? "ok" : "FAILED"} (${((Date.now() - t) / 1000).toFixed(1)} s)`);
  return r.status === 0;
};

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  const files = lintableFiles(changed());
  const ok = [
    files.length ? step(`eslint (${files.length} changed file${files.length > 1 ? "s" : ""})`, "npx", ["eslint", ...files]) : true,
    step("tsc --noEmit", "npx", ["tsc", "--noEmit"]),
    step("unit tests", "npm", ["test", "--silent"]),
  ].every(Boolean);
  process.exit(ok ? 0 : 1);
}

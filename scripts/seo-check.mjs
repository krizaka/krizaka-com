#!/usr/bin/env node
// `npm run seo:check -- --base <origin>` (the precheck serves the app on a free port) appends a second `--base` after the one in the
// script; krizaka-seo-family reads the first, so it audited port 3000 and failed with « fetch failed ». The last `--base` wins here.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const BIN = fileURLToPath(new URL("../node_modules/@krizaka/config/bin/krizaka-seo-family.mjs", import.meta.url));

/** The arguments with every `--base <value>` removed but the last one. */
export function lastBaseWins(args) {
  const at = args.map((a, i) => (a === "--base" ? i : -1)).filter((i) => i >= 0);
  const drop = new Set(at.slice(0, -1).flatMap((i) => [i, i + 1]));
  return args.filter((_, i) => !drop.has(i));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = lastBaseWins(process.argv.slice(2).filter((a) => a !== "--"));
  process.exit(spawnSync(process.execPath, [BIN, ...args], { stdio: "inherit" }).status ?? 1);
}

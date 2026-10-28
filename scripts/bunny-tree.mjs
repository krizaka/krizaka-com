#!/usr/bin/env node
// The storage zone as a tree, for the founder's cockpit (and anyone browsing): folders down to five levels, each with its
// object count, its weight in MB and the audit of ADR-014 (`misplaced` true when anything under it is outside the layout,
// and how many objects are still `legacy`).
//
//   node scripts/bunny-tree.mjs [--out <file>] [--depth 5] [--env-file <path>]
//
// Default output: ~/Documents/krizaka/tools/cockpit-next/data/bunny-tree.json. It reuses cdn-assets' listing and the layout
// of scripts/bunny-layout.mjs; credentials as scripts/cdn-assets.mjs (never printed, never written to the file).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { DEFAULT_PULL_ZONE, listZone } from "./cdn-assets.mjs";
import { MAX_FOLDERS, TARGET, placement } from "./bunny-layout.mjs";
import { loadConfig, parseArgs, parseEnvFile } from "./pr-assets.mjs";

export const DEFAULT_OUT = join(homedir(), "Documents/krizaka/tools/cockpit-next/data/bunny-tree.json");
const mb = (bytes) => Math.round((bytes / 1048576) * 100) / 100;

/** A folder of the tree, before serialisation. */
const node = (name, path) => ({ name, path, count: 0, bytes: 0, legacy: 0, misplacedCount: 0, issues: new Set(), children: new Map() });

/** The folders of <path> under <root>, `depth` at most, created on the way: [root, …, deepest]. */
function chainOf(root, path, depth) {
  const chain = [root];
  for (const f of path.split("/").slice(0, -1).slice(0, depth)) {
    const at = chain.at(-1);
    if (!at.children.has(f)) at.children.set(f, node(f, at.path ? `${at.path}/${f}` : f));
    chain.push(at.children.get(f));
  }
  return chain;
}

/** `target` (layout v2), `legacy` (an old copy kept until its code switches, with the issues that switch it) or `misplaced`. */
function statusOf(n) {
  if (n.misplacedCount > 0) return "misplaced";
  return n.legacy > 0 ? "legacy" : "target";
}

const serialise = (n) => ({
  name: n.name,
  path: n.path,
  status: statusOf(n),
  ...(n.issues.size ? { issues: [...n.issues].sort((a, b) => a.localeCompare(b)) } : {}),
  count: n.count,
  mb: mb(n.bytes),
  legacy: n.legacy,
  misplaced: n.misplacedCount > 0,
  misplacedCount: n.misplacedCount,
  children: [...n.children.values()].sort((a, b) => a.name.localeCompare(b.name)).map(serialise),
});

const ROOTS = Object.keys(TARGET);
function rank(n) {
  if (ROOTS.includes(n.name)) return ROOTS.indexOf(n.name);
  return ROOTS.length + (n.status === "legacy" ? 0 : 1);
}

/** [{ path, size }] → the folder tree, `depth` levels deep (files are counted in their folder, never listed). */
export function buildTree(objects, { depth = MAX_FOLDERS, now = new Date() } = {}) {
  const root = node("", "");
  for (const o of objects) {
    const { state, issue } = placement(o.path);
    for (const n of chainOf(root, o.path, depth)) {
      if (issue) n.issues.add(issue);
      n.count++;
      n.bytes += o.size;
      n.legacy += state === "legacy" ? 1 : 0;
      n.misplacedCount += state === "misplaced" ? 1 : 0;
    }
  }
  const tree = serialise(root);
  return {
    generatedAt: now.toISOString(),
    zone: "krizaka-assets",
    layout: "krizaka/.github docs/adr/ADR-014-bunny-org-cdn-and-apps.md",
    depth,
    totals: {
      count: tree.count,
      mb: tree.mb,
      legacy: tree.legacy,
      misplaced: tree.misplacedCount,
      legacyRoots: tree.children.filter((n) => n.status === "legacy").length,
    },
    // The v2 roots first, in their reading order (org, sites, apps, pr-assets), then the legacy folders.
    tree: [...tree.children].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name)),
  };
}

export async function main(argv, { env = process.env, fetchImpl = globalThis.fetch, log = console.log } = {}) {
  const args = parseArgs(argv);
  const fileEnv = args.envFile ? parseEnvFile(readFileSync(args.envFile, "utf8")) : {};
  const merged = { MEDIA_CDN_HOSTNAME: DEFAULT_PULL_ZONE, ...fileEnv, ...Object.fromEntries(Object.entries(env).filter(([, v]) => v)) };
  const objects = await listZone(loadConfig(merged), fetchImpl);
  const result = buildTree(objects, { depth: args.depth ? Number(args.depth) : MAX_FOLDERS });
  const out = args.out ?? DEFAULT_OUT;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
  log(`${out}: ${result.totals.count} object(s), ${result.totals.mb} MB, ${result.totals.legacy} legacy in ${result.totals.legacyRoots} legacy root(s), ${result.totals.misplaced} misplaced`);
  return result.totals.misplaced ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  try {
    process.exit(await main(process.argv.slice(2)));
  } catch (err) {
    console.error(`bunny-tree: ${err.message}`);
    process.exit(1);
  }
}

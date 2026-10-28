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
import { MAX_FOLDERS, placement } from "./bunny-layout.mjs";
import { loadConfig, parseArgs, parseEnvFile } from "./pr-assets.mjs";

export const DEFAULT_OUT = join(homedir(), "Documents/krizaka/tools/cockpit-next/data/bunny-tree.json");
const mb = (bytes) => Math.round((bytes / 1048576) * 100) / 100;

/** [{ path, size }] → the folder tree, `depth` levels deep (files are counted in their folder, never listed). */
export function buildTree(objects, { depth = MAX_FOLDERS, now = new Date() } = {}) {
  const node = (name, path) => ({ name, path, count: 0, bytes: 0, legacy: 0, misplacedCount: 0, children: new Map() });
  const root = node("", "");
  for (const o of objects) {
    const p = placement(o.path);
    const folders = o.path.split("/").slice(0, -1).slice(0, depth);
    const chain = [root];
    let at = root;
    for (const f of folders) {
      const path = at.path ? `${at.path}/${f}` : f;
      if (!at.children.has(f)) at.children.set(f, node(f, path));
      at = at.children.get(f);
      chain.push(at);
    }
    for (const n of chain) {
      n.count++;
      n.bytes += o.size;
      if (p.state === "legacy") n.legacy++;
      if (p.state === "misplaced") n.misplacedCount++;
    }
  }
  const out = (n) => ({
    name: n.name,
    path: n.path,
    count: n.count,
    mb: mb(n.bytes),
    legacy: n.legacy,
    misplaced: n.misplacedCount > 0,
    misplacedCount: n.misplacedCount,
    children: [...n.children.values()].sort((a, b) => a.name.localeCompare(b.name)).map(out),
  });
  const tree = out(root);
  return {
    generatedAt: now.toISOString(),
    zone: "krizaka-assets",
    layout: "krizaka/.github docs/adr/ADR-014-bunny-org-cdn-and-apps.md",
    depth,
    totals: { count: tree.count, mb: tree.mb, legacy: tree.legacy, misplaced: tree.misplacedCount },
    tree: tree.children,
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
  log(`${out}: ${result.totals.count} object(s), ${result.totals.mb} MB, ${result.totals.legacy} legacy, ${result.totals.misplaced} misplaced`);
  return result.totals.misplaced ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(`bunny-tree: ${err.message}`);
      process.exit(1);
    },
  );
}

#!/usr/bin/env node
// The site's media (product tours, the gallery, the home backdrop) live on Bunny Storage, never in the repository.
//
//   node scripts/cdn-assets.mjs upload <file-or-dir> --to <path> [--env-file <path>] [--dry-run]
//   node scripts/cdn-assets.mjs check [--env-file <path>]
//   node scripts/cdn-assets.mjs prune [--env-file <path>] [--yes]
//   node scripts/cdn-assets.mjs tree [--env-file <path>]
//   node scripts/cdn-assets.mjs readme [--env-file <path>]
//
// `upload` sends each file to `site/<to>/<name>.<hash>.<ext>` — the hash is the first 10 hex of the file's SHA-256, so
// a URL never changes content and the CDN may cache it for good — then records `<to>/<name>.<ext>` → hash in
// lib/cdn-manifest.json, which lib/cdn.ts resolves at build. A file whose hash is already recorded is not sent again.
// `check` asks the pull zone for every recorded file (HEAD) and fails on anything but 200. `prune` lists `site/` on
// the storage zone and deletes the objects no manifest names any more (old versions) — a preview without --yes. "No
// manifest" means this one AND the one of every other branch (main, unmerged work): a file another branch still uses is kept.
// `tree` counts and weighs the zone by folder and lists what does not belong (docs: scripts/bunny-layout.mjs, AGENTS.md §5.2);
// `library` mirrors what site/ serves into the browsable folders (products/<product>/…, people/personas/…) under human names;
// `prune --retired` also removes the folders of a renamed product (RETIRED in bunny-layout.mjs) that no manifest of main names.
// `readme` publishes the layout as README.txt at the zone root. This script writes only under site/.
//
// Areas under site/ (PR captures are apart, under pr-assets/ — scripts/pr-assets.mjs; the basemap under maps/):
//   site/home/…      the home page (backdrop loops, the kit in a phone)
//   site/products/<product>/{tour,gallery,mobile}/…   recordings and images of a product's pages
//   site/docs/<product>/…                              media of the documentation pages
//   site/people/<product>/<person>-{256,512}.webp      the demo personas' portraits
//
// Credentials: the same as scripts/pr-assets.mjs (MEDIA_STORAGE_API_KEY, MEDIA_STORAGE_ZONE, MEDIA_STORAGE_ENDPOINT,
// MEDIA_CDN_HOSTNAME), from the environment or --env-file — never printed. `check` only needs the pull zone,
// which defaults to the one the site reads (lib/cdn.ts). No dependency: Node ≥ 20.

import { createHash } from "node:crypto";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { LAYOUT_README, README_NAME, RETIRED, SITE_AREA_NAMES, assertUnder, layoutHelp, libraryPath, misplaced } from "./bunny-layout.mjs";
import { contentTypeFor, listFiles, loadConfig, parseArgs, parseEnvFile } from "./pr-assets.mjs";

export const ROOT = "site";
export const DEFAULT_PULL_ZONE = "krizaka-assets.b-cdn.net";
export const MANIFEST = resolve(dirname(fileURLToPath(import.meta.url)), "../lib/cdn-manifest.json");

/** The first 10 hex of the SHA-256: enough to tell two versions apart, short enough to read. */
export const hashOf = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 10);

/** `products/orochia/tour/alex-bid.mp4` + `3f2a…` → `products/orochia/tour/alex-bid.3f2a….mp4`. */
export function versioned(path, hash) {
  const dot = path.lastIndexOf(".");
  if (dot <= path.lastIndexOf("/")) throw new Error(`${path} has no extension`);
  return `${path.slice(0, dot)}.${hash}${path.slice(dot)}`;
}

/** A logical path: lower-case segments of letters, digits, `-` and `_`, an extension. */
export function logicalPath(value, name = "to") {
  const p = String(value ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (!/^[a-z0-9_-]+(\/[a-z0-9_-]+)*(\.[a-z0-9]+)?$/.test(p)) throw new Error(`--${name} "${value}" is not a path like products/orochia/tour`);
  const area = p.split("/")[0];
  if (!SITE_AREA_NAMES.includes(area)) throw new Error(`--${name} "${value}": "${area}" is not an area of site/ (${SITE_AREA_NAMES.join(", ")})`);
  return p;
}

export function readManifest(file = MANIFEST) {
  try {
    const m = JSON.parse(readFileSync(file, "utf8"));
    return { root: m.root ?? ROOT, files: { ...(m.files ?? {}) } };
  } catch (err) {
    if (err.code === "ENOENT") return { root: ROOT, files: {} };
    throw err;
  }
}

export function writeManifest(manifest, file = MANIFEST) {
  const files = Object.fromEntries(Object.entries(manifest.files).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(file, `${JSON.stringify({ root: manifest.root, files }, null, 2)}\n`);
}

const objectPath = (root, path, hash) => assertUnder(ROOT, `${root}/${versioned(path, hash)}`);
const enc = (p) => p.split("/").map(encodeURIComponent).join("/");
const storageUrl = (cfg, p) => `https://${cfg.endpoint}/${encodeURIComponent(cfg.zone)}/${enc(p)}`;
const cdnUrl = (cfg, p) => `https://${cfg.pullZone}/${enc(p)}`;

/** The files of <src> (a file, or a directory walked recursively) with their logical path under <to>. */
export function plan(src, to) {
  const target = logicalPath(to);
  const abs = resolve(src);
  const files = statSync(abs).isDirectory()
    ? listFiles(abs).map((f) => ({ path: f.path, logical: `${target}/${f.rel}` }))
    : [{ path: abs, logical: `${target}/${basename(abs)}` }];
  for (const f of files) logicalPath(f.logical, "to (file)");
  return files;
}

export async function upload({ src, to, cfg, manifest, dryRun = false, fetchImpl = globalThis.fetch, log = console.log }) {
  const out = [];
  for (const f of plan(src, to)) {
    const body = readFileSync(f.path);
    const hash = hashOf(body);
    const path = objectPath(manifest.root, f.logical, hash);
    const same = manifest.files[f.logical] === hash;
    if (!same && !dryRun) {
      const res = await fetchImpl(storageUrl(cfg, path), {
        method: "PUT",
        headers: {
          AccessKey: cfg.apiKey,
          "Content-Type": contentTypeFor(f.logical),
          Checksum: createHash("sha256").update(body).digest("hex").toUpperCase(),
        },
        body,
      });
      if (!res.ok) throw new Error(`upload of ${f.logical} failed: HTTP ${res.status}`);
    }
    if (!dryRun) manifest.files[f.logical] = hash;
    const state = same ? "unchanged" : dryRun ? "would send" : "sent";
    log(`${state.padEnd(10)} ${(body.length / 1024).toFixed(0).padStart(6)} kB  ${cdnUrl(cfg, path)}`);
    out.push({ ...f, hash, path, url: cdnUrl(cfg, path), size: body.length, changed: !same, sent: !same && !dryRun });
  }
  return out;
}

/** HEAD every recorded file on the pull zone; returns the ones that do not answer 200. */
export async function check({ cfg, manifest, fetchImpl = globalThis.fetch, log = console.log }) {
  const failed = [];
  const entries = Object.entries(manifest.files);
  for (let i = 0; i < entries.length; i += 8) {
    await Promise.all(
      entries.slice(i, i + 8).map(async ([logical, hash]) => {
        const url = cdnUrl(cfg, objectPath(manifest.root, logical, hash));
        const res = await fetchImpl(url, { method: "HEAD" });
        if (res.status !== 200) failed.push({ url, status: res.status });
      }),
    );
  }
  log(`${entries.length - failed.length}/${entries.length} file(s) served by ${cfg.pullZone}`);
  for (const f of failed) log(`  HTTP ${f.status}  ${f.url}`);
  return failed;
}

/** Every object under <dir> on the storage zone (Bunny's listing API: a JSON array per directory). */
async function listObjects(cfg, dir, fetchImpl) {
  const res = await fetchImpl(`${storageUrl(cfg, dir)}/`, { headers: { AccessKey: cfg.apiKey, Accept: "application/json" } });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`listing of ${dir}/ failed: HTTP ${res.status}`);
  const out = [];
  for (const item of await res.json()) {
    const p = `${dir}/${item.ObjectName}`;
    if (item.IsDirectory) out.push(...(await listObjects(cfg, p, fetchImpl)));
    else out.push({ path: p, changed: item.LastChanged ? Date.parse(`${item.LastChanged}Z`) : 0, size: item.Length ?? 0 });
  }
  return out;
}

/** The hashed object paths still named by work outside this checkout's manifest, so a file used by unmerged work is never
    pruned: the manifest of every branch not yet merged into origin/main (plus origin/main itself) and the working copy of
    every git worktree (uncommitted uploads). Merged branches are history, not a reason to keep. Outside git: nothing. */
export function otherBranchPaths(manifestFile = MANIFEST, run = execFileSync) {
  const keep = new Set();
  const add = (m) => {
    for (const [l, h] of Object.entries(m.files ?? {})) keep.add(objectPath(m.root ?? ROOT, l, h));
  };
  try {
    const cwd = dirname(manifestFile);
    const git = (...args) => run("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const rel = git("ls-files", "--full-name", manifestFile).trim() || "lib/cdn-manifest.json";
    const base = "origin/main";
    const unmerged = git("for-each-ref", `--no-merged=${base}`, "--format=%(refname)", "refs/heads", "refs/remotes").split("\n").filter(Boolean);
    for (const ref of [base, ...unmerged]) {
      try {
        add(JSON.parse(git("show", `${ref}:${rel}`)));
      } catch {
        /* a branch without a manifest */
      }
    }
    // The working copy of a worktree counts when its branch is unmerged or its manifest has uncommitted changes
    // (an upload not yet committed); a worktree left on a merged branch is history.
    for (const block of git("worktree", "list", "--porcelain").split("\n\n")) {
      const dir = /^worktree (.+)$/m.exec(block)?.[1];
      const branch = /^branch (.+)$/m.exec(block)?.[1];
      if (!dir) continue;
      try {
        const dirty = run("git", ["status", "--porcelain", "--", rel], { cwd: dir, encoding: "utf8" }).trim() !== "";
        if (dirty || !branch || unmerged.includes(branch)) add(JSON.parse(readFileSync(join(dir, rel), "utf8")));
      } catch {
        /* a worktree without a manifest */
      }
    }
  } catch {
    /* not a git checkout */
  }
  return keep;
}

/** Objects younger than this are left alone: another session may have uploaded them and not yet committed its manifest. */
export const MIN_AGE_MS = 24 * 3600 * 1000;

/**
 * Media that other sites carry (dev.orazaka.com, dev.orochia.com name their files by hash in their own repositories;
 * blog.krizaka.com names its images and clips in krizaka-blog's `lib/media.json`, under `site/blog/`): `prune` never
 * deletes under these, krizaka.com's manifest does not list them.
 */
export const PRODUCT_OWNED = ["site/products/orazaka/", "site/products/orochia/", "site/blog/"];

export async function prune({ cfg, manifest, yes = false, retired = false, extraKeep = new Set(), minAgeMs = MIN_AGE_MS, now = Date.now(), fetchImpl = globalThis.fetch, log = console.log }) {
  const keep = new Set([...Object.entries(manifest.files).map(([l, h]) => objectPath(manifest.root, l, h)), ...extraKeep]);
  // --retired: only the folders of a renamed product (RETIRED), named by no manifest of main — work on old branches that predates the rename does not keep them.
  const all = await listObjects(cfg, manifest.root, fetchImpl);
  const unnamed = retired
    ? all.filter((o) => RETIRED.some((re) => re.test(o.path)) && !Object.entries(manifest.files).some(([l, h]) => objectPath(manifest.root, l, h) === o.path))
    : all.filter((o) => !keep.has(o.path) && !PRODUCT_OWNED.some((prefix) => o.path.startsWith(prefix)));
  const stale = unnamed.filter((o) => !o.changed || now - o.changed >= minAgeMs).map((o) => o.path);
  const recent = unnamed.length - stale.length;
  if (recent) log(`kept ${recent} unnamed object(s) uploaded in the last ${minAgeMs / 3600000} h (another session may still be committing its manifest)`);
  for (const p of stale) {
    assertUnder(ROOT, p);
    if (yes) {
      const res = await fetchImpl(storageUrl(cfg, p), { method: "DELETE", headers: { AccessKey: cfg.apiKey } });
      if (!res.ok) throw new Error(`deletion of ${p} failed: HTTP ${res.status}`);
    }
    log(`${yes ? "deleted" : "would delete"}  ${p}`);
  }
  log(`${stale.length} stale object(s) under ${manifest.root}/${yes ? "" : " — run again with --yes to delete them"}`);
  return stale;
}

/**
 * Mirrors what site/ serves into the browsable library (products/<product>/…, people/personas/…) under human names:
 * the newest hashed file of each logical name is copied (downloaded from the pull zone, sent to its library path) unless
 * the library already holds a file of the same size. Nothing under site/ is touched.
 */
export async function library({ cfg, dryRun = false, fetchImpl = globalThis.fetch, log = console.log }) {
  const site = await listObjects(cfg, ROOT, fetchImpl);
  const newest = new Map();
  for (const o of site) {
    const logical = o.path.slice(ROOT.length + 1).replace(/\.[0-9a-f]{10}(\.[a-z0-9]+)$/, "$1");
    const target = libraryPath(logical);
    if (!target) continue;
    const prev = newest.get(target);
    if (!prev || o.changed > prev.changed) newest.set(target, o);
  }
  const existing = new Map();
  for (const top of ["products", "people/personas"]) for (const o of await listObjects(cfg, top, fetchImpl)) existing.set(o.path, o.size);
  let sent = 0;
  for (const [target, o] of [...newest].sort(([a], [b]) => a.localeCompare(b))) {
    if (existing.get(target) === o.size) continue;
    log(`${dryRun ? "would copy" : "copy"}  ${o.path}  →  ${target}`);
    if (dryRun) continue;
    const src = await fetchImpl(cdnUrl(cfg, o.path));
    if (!src.ok) throw new Error(`download of ${o.path} failed: HTTP ${src.status}`);
    const body = Buffer.from(await src.arrayBuffer());
    const res = await fetchImpl(storageUrl(cfg, target), { method: "PUT", headers: { AccessKey: cfg.apiKey, "Content-Type": contentTypeFor(target) }, body });
    if (!res.ok) throw new Error(`upload of ${target} failed: HTTP ${res.status}`);
    sent++;
  }
  log(`${newest.size} library file(s), ${dryRun ? "to copy" : "copied"}: ${dryRun ? [...newest].filter(([t, o]) => existing.get(t) !== o.size).length : sent}`);
  return newest;
}

/** The whole zone, listed from its root: [{ path, size }]. */
async function listZone(cfg, fetchImpl) {
  const out = [];
  const walk = async (dir) => {
    const res = await fetchImpl(`${storageUrl(cfg, dir).replace(/\/$/, "")}/`, { headers: { AccessKey: cfg.apiKey, Accept: "application/json" } });
    if (!res.ok) throw new Error(`listing of ${dir || "/"} failed: HTTP ${res.status}`);
    for (const item of await res.json()) {
      const p = `${dir}${item.ObjectName}`;
      if (item.IsDirectory) await walk(`${p}/`);
      else out.push({ path: p, size: item.Length ?? 0 });
    }
  };
  await walk("");
  return out;
}

/** Counts and weight per folder (two levels under site/ and maps/, the repository and topic under pr-assets/), then what does not belong. */
export async function tree({ cfg, fetchImpl = globalThis.fetch, log = console.log }) {
  const objects = await listZone(cfg, fetchImpl);
  const depth = (p) => (p === README_NAME ? 1 : p.startsWith("people/") || p.startsWith("products/") || p.startsWith("brand/") ? 2 : 3);
  const rows = new Map();
  for (const o of objects) {
    const key = o.path.split("/").slice(0, Math.min(depth(o.path), o.path.split("/").length - 1) || 1).join("/");
    const r = rows.get(key) ?? { n: 0, bytes: 0 };
    r.n++;
    r.bytes += o.size;
    rows.set(key, r);
  }
  for (const [key, r] of [...rows].sort(([a], [b]) => a.localeCompare(b))) log(`${key.padEnd(64)} ${String(r.n).padStart(5)}  ${(r.bytes / 1048576).toFixed(1).padStart(8)} MB`);
  const total = objects.reduce((a, o) => a + o.size, 0);
  log(`\n${objects.length} object(s), ${(total / 1048576).toFixed(0)} MB`);
  const bad = objects.map((o) => ({ ...o, why: misplaced(o.path) })).filter((o) => o.why);
  for (const b of bad) log(`  MISPLACED  ${b.path} — ${b.why}`);
  log(bad.length ? `${bad.length} object(s) outside the layout` : "every object follows the layout");
  return { objects, misplaced: bad };
}

/** Publishes the layout as README.txt at the root of the zone — the only file allowed there. */
export async function publishReadme({ cfg, fetchImpl = globalThis.fetch, log = console.log }) {
  const res = await fetchImpl(storageUrl(cfg, README_NAME), { method: "PUT", headers: { AccessKey: cfg.apiKey, "Content-Type": "text/plain; charset=utf-8" }, body: LAYOUT_README });
  if (!res.ok) throw new Error(`upload of ${README_NAME} failed: HTTP ${res.status}`);
  log(`${cdnUrl(cfg, README_NAME)} published`);
}

const USAGE = `usage:
  node scripts/cdn-assets.mjs upload <file-or-dir> --to <path> [--env-file <path>] [--dry-run]
  node scripts/cdn-assets.mjs check [--env-file <path>]
  node scripts/cdn-assets.mjs prune [--env-file <path>] [--min-age <hours, default 24>] [--retired] [--yes]
  node scripts/cdn-assets.mjs library [--env-file <path>] [--dry-run]   mirror site/ into products/ and people/personas/ (human names)
  node scripts/cdn-assets.mjs tree [--env-file <path>]      count/size per folder, and what is outside the layout
  node scripts/cdn-assets.mjs readme [--env-file <path>]    publish the layout as README.txt at the zone root
${layoutHelp()}`;

export async function main(argv, { env = process.env, fetchImpl, log = console.log, manifestFile = MANIFEST } = {}) {
  const args = parseArgs(argv.filter((a) => a !== "--yes" && a !== "--retired"));
  const yes = argv.includes("--yes");
  const [command, target] = args._;
  if (args.help || !command) {
    log(USAGE);
    return args.help ? 0 : 1;
  }
  const fileEnv = args.envFile ? parseEnvFile(readFileSync(args.envFile, "utf8")) : {};
  const merged = { MEDIA_CDN_HOSTNAME: DEFAULT_PULL_ZONE, ...fileEnv, ...Object.fromEntries(Object.entries(env).filter(([, v]) => v)) };
  const manifest = readManifest(manifestFile);
  if (command === "upload") {
    if (!target) throw new Error("upload needs a file or a directory");
    const cfg = loadConfig(merged, { requireKey: !args.dryRun });
    const entries = await upload({ src: target, to: args.to, cfg, manifest, dryRun: args.dryRun, fetchImpl, log });
    if (!args.dryRun) {
      const sent = entries.find((e) => e.sent);
      if (sent) {
        const res = await (fetchImpl ?? globalThis.fetch)(sent.url, { method: "HEAD" });
        if (!res.ok) throw new Error(`uploaded, but ${sent.url} answers HTTP ${res.status}: check the pull zone`);
      }
      writeManifest(manifest, manifestFile);
    }
    const sentCount = entries.filter((e) => e.changed).length;
    log(`\n${entries.length} file(s), ${sentCount} ${args.dryRun ? "to send" : "sent"}${args.dryRun ? "" : `; ${join("lib", basename(manifestFile))} updated`}`);
    return 0;
  }
  if (command === "check") {
    const failed = await check({ cfg: loadConfig(merged, { requireKey: false }), manifest, fetchImpl, log });
    return failed.length ? 1 : 0;
  }
  if (command === "prune") {
    await prune({ cfg: loadConfig(merged), manifest, yes, retired: argv.includes("--retired"), minAgeMs: args.minAge === undefined ? MIN_AGE_MS : Number(args.minAge) * 3600000, extraKeep: otherBranchPaths(manifestFile), fetchImpl, log });
    return 0;
  }
  if (command === "library") {
    await library({ cfg: loadConfig(merged), dryRun: args.dryRun, fetchImpl, log });
    return 0;
  }
  if (command === "tree") {
    const { misplaced: bad } = await tree({ cfg: loadConfig(merged), fetchImpl, log });
    return bad.length ? 1 : 0;
  }
  if (command === "readme") {
    await publishReadme({ cfg: loadConfig(merged), fetchImpl, log });
    return 0;
  }
  log(USAGE);
  return 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(`cdn-assets: ${err.message}`);
      process.exit(1);
    },
  );
}

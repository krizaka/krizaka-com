#!/usr/bin/env node
// The site's media (product tours, the gallery, the home backdrop) live on Bunny Storage, never in the repository.
//
//   node scripts/cdn-assets.mjs upload <file-or-dir> --to <path> [--env-file <path>] [--dry-run]
//   node scripts/cdn-assets.mjs check [--env-file <path>]
//   node scripts/cdn-assets.mjs prune [--env-file <path>] [--yes]
//
// `upload` sends each file to `site/<to>/<name>.<hash>.<ext>` — the hash is the first 10 hex of the file's SHA-256, so
// a URL never changes content and the CDN may cache it for good — then records `<to>/<name>.<ext>` → hash in
// lib/cdn-manifest.json, which lib/cdn.ts resolves at build. A file whose hash is already recorded is not sent again.
// `check` asks the pull zone for every recorded file (HEAD) and fails on anything but 200. `prune` lists `site/` on
// the storage zone and deletes the objects the manifest no longer names (old versions) — a preview without --yes.
//
// Layout of the storage zone (PR captures are apart, under pr-assets/ — scripts/pr-assets.mjs):
//   site/home/backdrop/<product>.<hash>.{webm,mp4,jpg}       the blurred loops behind the home hero
//   site/products/<product>/tour/<clip>.<hash>.{webm,mp4,jpg} recordings of the real applications
//   site/products/<product>/gallery/<id>.<hash>.webp          images a product made
//
// Credentials: the same as scripts/pr-assets.mjs (BUNNY_STORAGE_API_KEY, BUNNY_STORAGE_ZONE, BUNNY_STORAGE_ENDPOINT,
// BUNNY_PULL_ZONE_HOSTNAME), from the environment or --env-file — never printed. `check` only needs the pull zone,
// which defaults to the one the site reads (lib/cdn.ts). No dependency: Node ≥ 20.

import { createHash } from "node:crypto";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
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

const objectPath = (root, path, hash) => `${root}/${versioned(path, hash)}`;
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
    else out.push(p);
  }
  return out;
}

export async function prune({ cfg, manifest, yes = false, fetchImpl = globalThis.fetch, log = console.log }) {
  const keep = new Set(Object.entries(manifest.files).map(([l, h]) => objectPath(manifest.root, l, h)));
  const stale = (await listObjects(cfg, manifest.root, fetchImpl)).filter((p) => !keep.has(p));
  for (const p of stale) {
    if (yes) {
      const res = await fetchImpl(storageUrl(cfg, p), { method: "DELETE", headers: { AccessKey: cfg.apiKey } });
      if (!res.ok) throw new Error(`deletion of ${p} failed: HTTP ${res.status}`);
    }
    log(`${yes ? "deleted" : "would delete"}  ${p}`);
  }
  log(`${stale.length} stale object(s) under ${manifest.root}/${yes ? "" : " — run again with --yes to delete them"}`);
  return stale;
}

const USAGE = `usage:
  node scripts/cdn-assets.mjs upload <file-or-dir> --to <path> [--env-file <path>] [--dry-run]
  node scripts/cdn-assets.mjs check [--env-file <path>]
  node scripts/cdn-assets.mjs prune [--env-file <path>] [--yes]`;

export async function main(argv, { env = process.env, fetchImpl, log = console.log, manifestFile = MANIFEST } = {}) {
  const args = parseArgs(argv.filter((a) => a !== "--yes"));
  const yes = argv.includes("--yes");
  const [command, target] = args._;
  if (args.help || !command) {
    log(USAGE);
    return args.help ? 0 : 1;
  }
  const fileEnv = args.envFile ? parseEnvFile(readFileSync(args.envFile, "utf8")) : {};
  const merged = { BUNNY_PULL_ZONE_HOSTNAME: DEFAULT_PULL_ZONE, ...fileEnv, ...Object.fromEntries(Object.entries(env).filter(([, v]) => v)) };
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
    await prune({ cfg: loadConfig(merged), manifest, yes, fetchImpl, log });
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

#!/usr/bin/env node
// PR captures live on Bunny Storage, never in a repository.
//
//   node scripts/pr-assets.mjs upload <dir> --repo <repo> --key <pr-or-topic> [--env-file <path>] [--dry-run]
//   node scripts/pr-assets.mjs rewrite <file> --repo <repo> [--from docs/screenshots] [--env-file <path>] [--write]
//
// `upload` sends every file of <dir> (recursively) to `pr-assets/<repo>/<key>/…`, sets its
// Content-Type, checks that the first file is served by the pull zone, then prints the CDN URLs
// and a Markdown block to paste in the PR. `rewrite` turns links to a committed capture folder
// (`docs/screenshots/<key>/…`, relative or github.com / raw.githubusercontent.com) into the CDN
// URLs `upload` produced for the same <key> — used to migrate old PR bodies and docs.
//
// Credentials come from the environment, or from a `.env` file given with --env-file:
//   BUNNY_STORAGE_API_KEY   storage zone password (never printed)
//   BUNNY_STORAGE_ZONE      storage zone name
//   BUNNY_STORAGE_ENDPOINT  regional endpoint (default storage.bunnycdn.com)
//   BUNNY_PULL_ZONE_HOSTNAME  pull zone hostname serving the storage zone (e.g. krizaka-assets.b-cdn.net)
// No dependency: Node ≥ 20 (global fetch).

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

export const PREFIX = "pr-assets";

const TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  webm: "video/webm",
  mp4: "video/mp4",
  mov: "video/quicktime",
  json: "application/json",
  html: "text/html; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  csv: "text/csv; charset=utf-8",
  pdf: "application/pdf",
};

export function contentTypeFor(file) {
  const ext = file.split(".").pop().toLowerCase();
  return TYPES[ext] ?? "application/octet-stream";
}

const kind = (file) => contentTypeFor(file).split("/")[0];

/** A path segment safe for a storage key: `feat/x y` → `feat-x-y`. */
export function slug(value, name) {
  const s = String(value ?? "").trim().replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!s || s === "." || s === "..") throw new Error(`--${name} is required (letters, digits, . _ -)`);
  return s;
}

export function parseArgs(argv) {
  const out = { _: [], dryRun: false, write: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--write") out.write = true;
    else if (a === "--help" || a === "-h") out.help = true;
    else if (a.startsWith("--")) {
      const [name, inline] = a.slice(2).split(/=(.*)/s);
      const value = inline ?? argv[++i];
      if (value === undefined) throw new Error(`--${name} needs a value`);
      out[name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
    } else out._.push(a);
  }
  return out;
}

/** Minimal `.env` reader: KEY=value, optional quotes, `#` comments. */
export function parseEnvFile(text) {
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (/^(['"]).*\1$/.test(v)) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, "");
    env[m[1]] = v;
  }
  return env;
}

const host = (v) => String(v ?? "").trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");

export function loadConfig(env, { requireKey = true } = {}) {
  const cfg = {
    apiKey: env.BUNNY_STORAGE_API_KEY ?? "",
    zone: (env.BUNNY_STORAGE_ZONE ?? "").trim(),
    endpoint: host(env.BUNNY_STORAGE_ENDPOINT) || "storage.bunnycdn.com",
    pullZone: host(env.BUNNY_PULL_ZONE_HOSTNAME),
  };
  const missing = [];
  if (requireKey && !cfg.apiKey) missing.push("BUNNY_STORAGE_API_KEY");
  if (requireKey && !cfg.zone) missing.push("BUNNY_STORAGE_ZONE");
  if (!cfg.pullZone) missing.push("BUNNY_PULL_ZONE_HOSTNAME");
  if (missing.length) throw new Error(`missing ${missing.join(", ")} (environment or --env-file)`);
  return cfg;
}

export function listFiles(dir) {
  const root = resolve(dir);
  if (!statSync(root).isDirectory()) throw new Error(`${dir} is not a directory`);
  const files = [];
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith(".")) continue; // .DS_Store, .gitkeep…
      const p = join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile()) files.push({ path: p, rel: relative(root, p).split(sep).join("/") });
    }
  };
  walk(root);
  return files;
}

const encodePath = (p) => p.split("/").map(encodeURIComponent).join("/");

export const objectPath = (repo, key, rel) => `${PREFIX}/${slug(repo, "repo")}/${slug(key, "key")}/${rel}`;
export const cdnUrl = (cfg, path) => `https://${cfg.pullZone}/${encodePath(path)}`;
export const storageUrl = (cfg, path) => `https://${cfg.endpoint}/${encodeURIComponent(cfg.zone)}/${encodePath(path)}`;

/** A Markdown block for a PR body: images inline, videos and data as links, grouped as listed. */
export function markdownBlock(entries) {
  const lines = entries.map(({ rel, url }) =>
    kind(rel) === "image" ? `![${rel}](${url})` : `- [${rel}](${url})`,
  );
  return lines.join("\n");
}

export async function upload({ dir, repo, key, cfg, dryRun = false, fetchImpl = globalThis.fetch, log = console.log }) {
  const files = listFiles(dir);
  if (!files.length) throw new Error(`${dir} has no file to upload`);
  const entries = [];
  for (const f of files) {
    const path = objectPath(repo, key, f.rel);
    const entry = { rel: f.rel, path, url: cdnUrl(cfg, path), type: contentTypeFor(f.rel) };
    if (!dryRun) {
      const body = readFileSync(f.path);
      const res = await fetchImpl(storageUrl(cfg, path), {
        method: "PUT",
        headers: {
          AccessKey: cfg.apiKey,
          "Content-Type": entry.type,
          Checksum: createHash("sha256").update(body).digest("hex").toUpperCase(),
        },
        body,
      });
      if (!res.ok) throw new Error(`upload of ${f.rel} failed: HTTP ${res.status}`);
    }
    log(`${dryRun ? "[dry-run] " : ""}${entry.url}`);
    entries.push(entry);
  }
  if (!dryRun) {
    // The pull zone must serve the files publicly, or the PR shows broken images.
    const res = await fetchImpl(entries[0].url, { method: "HEAD" });
    if (!res.ok) throw new Error(`uploaded, but ${entries[0].url} answers HTTP ${res.status}: check the pull zone`);
  }
  return entries;
}

/**
 * Rewrites links to `<from>/<key>/<file>` (relative, github.com blob/raw, raw.githubusercontent.com)
 * into `https://<pull zone>/pr-assets/<repo>/<key>/<file>`.
 */
export function rewriteLinks(text, { repo, from = "docs/screenshots", cfg, owner = "krizaka" }) {
  const dir = from.replace(/^\.?\/+|\/+$/g, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const gh = `https://(?:github\\.com/${owner}/${repo}/(?:blob|raw)/[^/\\s]+|raw\\.githubusercontent\\.com/${owner}/${repo}/[^/\\s]+)/`;
  const re = new RegExp(`(?:${gh}|(?<![\\w/.-])(?:\\.{1,2}/)*)${dir}/([^\\s)"'\`<>]+?)(\\?raw=true)?(?=[\\s)"'\`<>]|$)`, "g");
  let count = 0;
  const out = text.replace(re, (_m, rest) => {
    count++;
    return `https://${cfg.pullZone}/${PREFIX}/${slug(repo, "repo")}/${rest}`;
  });
  return { text: out, count };
}

const USAGE = `usage:
  node scripts/pr-assets.mjs upload <dir> --repo <repo> --key <pr-or-topic> [--env-file <path>] [--dry-run]
  node scripts/pr-assets.mjs rewrite <file> --repo <repo> [--from docs/screenshots] [--env-file <path>] [--write]`;

export async function main(argv, { env = process.env, fetchImpl, log = console.log } = {}) {
  const args = parseArgs(argv);
  const [command, target] = args._;
  if (args.help || !command) {
    log(USAGE);
    return args.help ? 0 : 1;
  }
  const fileEnv = args.envFile ? parseEnvFile(readFileSync(args.envFile, "utf8")) : {};
  const merged = { ...fileEnv, ...Object.fromEntries(Object.entries(env).filter(([, v]) => v)) };
  if (command === "upload") {
    if (!target) throw new Error("upload needs a directory");
    const cfg = loadConfig(merged, { requireKey: !args.dryRun });
    const entries = await upload({ dir: target, repo: args.repo, key: args.key, cfg, dryRun: args.dryRun, fetchImpl, log });
    log(`\n${entries.length} file(s) ${args.dryRun ? "would be sent" : "sent"} to ${PREFIX}/${slug(args.repo, "repo")}/${slug(args.key, "key")}/ — paste in the PR:\n`);
    log(markdownBlock(entries));
    return 0;
  }
  if (command === "rewrite") {
    if (!target) throw new Error("rewrite needs a file");
    const cfg = loadConfig(merged, { requireKey: false });
    const { text, count } = rewriteLinks(readFileSync(target, "utf8"), { repo: slug(args.repo, "repo"), from: args.from, cfg });
    if (args.write) {
      if (count) writeFileSync(target, text);
      log(`${count} link(s) rewritten in ${target}`);
    } else log(text);
    return 0;
  }
  log(USAGE);
  return 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      console.error(`pr-assets: ${err.message}`);
      process.exit(1);
    },
  );
}

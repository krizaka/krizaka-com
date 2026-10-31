#!/usr/bin/env node
// Retention of the evidence the zone keeps (krizaka-internal#1953), as code:
//   - pr-assets/<repo>/<key>/…  deleted 90 days after the PR (the leading number of <key>) was closed; a key with no
//     PR number, or a PR GitHub no longer shows, is judged by the age of its newest object; an open PR is kept;
//   - site/renders/<run>/…      render candidates, deleted 30 days after the run's last change — except the chosen ones
//     (a `chosen/` folder, or a file whose name holds « chosen »), which stay.
//
//   node scripts/bunny-retention.mjs [--yes] [--summary <file>] [--env-file <path>]
//
// Without --yes it only lists (the weekly Action writes that list to the run summary, then deletes in a second step).
// It deletes under pr-assets/ and site/renders/ only. Credentials as scripts/cdn-assets.mjs, GitHub reads with GITHUB_TOKEN.

import { appendFileSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { listZone } from "./cdn-assets.mjs";
import { loadConfig, parseArgs, parseEnvFile } from "./pr-assets.mjs";

const DAY = 24 * 3600 * 1000;
/** @fixed: a PR's captures are evidence for 90 days after it closes (Oussama, 2026-10-31). */
export const PR_ASSETS_DAYS = 90;
/** @fixed: render candidates not chosen go after 30 days (Oussama, 2026-10-31). */
export const RENDER_DAYS = 30;
export const DELETABLE = ["pr-assets/", "site/renders/"];

/** `pr-assets/<repo>/<key>/…` → { repo, key, pr } (pr: the leading number of the key, else null); null for any other path. */
export function prKeyOf(path) {
  const m = /^pr-assets\/([^/]+)\/([^/]+)\//.exec(path);
  if (!m) return null;
  const n = /^(\d+)(?:$|[-_.])/.exec(m[2]);
  return { repo: m[1], key: m[2], pr: n ? Number(n[1]) : null };
}

/** The chosen render: kept whatever its age. */
export const isChosen = (path) => /(^|\/)chosen\//.test(path) || /chosen/i.test(path.split("/").at(-1));

/**
 * What to delete. `objects`: [{ path, size, changed }]; `prs`: Map "repo#pr" → { closedAt: ms | null } for the PRs GitHub shows
 * (null: still open). Returns [{ path, size, why }].
 */
export function plan(objects, prs, now = Date.now()) {
  const newest = new Map();
  const folderOf = (path) => path.split("/").slice(0, 3).join("/");
  for (const o of objects) newest.set(folderOf(o.path), Math.max(newest.get(folderOf(o.path)) ?? 0, o.changed));
  const out = [];
  for (const o of objects) {
    if (!DELETABLE.some((p) => o.path.startsWith(p))) continue;
    const last = newest.get(folderOf(o.path)) ?? o.changed;
    const pr = prKeyOf(o.path);
    if (pr) {
      const known = pr.pr === null ? undefined : prs.get(`${pr.repo}#${pr.pr}`);
      if (known?.closedAt === null) continue;
      if (known) {
        if (now - known.closedAt > PR_ASSETS_DAYS * DAY)
          out.push({ path: o.path, size: o.size, why: `PR closed more than ${PR_ASSETS_DAYS} days ago` });
      } else if (last && now - last > PR_ASSETS_DAYS * DAY) {
        out.push({ path: o.path, size: o.size, why: `no PR to read, untouched for more than ${PR_ASSETS_DAYS} days` });
      }
    } else if (o.path.startsWith("site/renders/") && !isChosen(o.path) && last && now - last > RENDER_DAYS * DAY) {
      out.push({ path: o.path, size: o.size, why: `render candidate untouched for more than ${RENDER_DAYS} days` });
    }
  }
  return out;
}

/** The markdown listing of a plan, by folder (the run summary). */
export function summary(items, yes) {
  const groups = new Map();
  for (const i of items) {
    const g = i.path.split("/").slice(0, 3).join("/");
    const cur = groups.get(g) ?? { count: 0, size: 0, why: i.why };
    cur.count++;
    cur.size += i.size;
    groups.set(g, cur);
  }
  const rows = [...groups]
    .sort((a, b) => b[1].size - a[1].size)
    .map(([g, v]) => `| ${g} | ${v.count} | ${(v.size / 1e6).toFixed(1)} | ${v.why} |`);
  const total = items.reduce((a, i) => a + i.size, 0);
  return [
    `## Bunny retention - ${yes ? "deleted" : "dry run"}`,
    "",
    `${items.length} object(s), ${(total / 1e9).toFixed(2)} GB`,
    "",
    "| Folder | Objects | MB | Why |",
    "| :-- | --: | --: | :-- |",
    ...rows,
    "",
  ].join("\n");
}

/** The PRs the keys name, as GitHub shows them: "repo#n" → { closedAt }. A PR GitHub does not show is left out. */
export async function readPrs(objects, { token, org = "krizaka", fetchImpl = globalThis.fetch } = {}) {
  const out = new Map();
  const seen = new Set();
  for (const o of objects) {
    const k = prKeyOf(o.path);
    if (!k || k.pr === null || seen.has(`${k.repo}#${k.pr}`)) continue;
    seen.add(`${k.repo}#${k.pr}`);
    const res = await fetchImpl(`https://api.github.com/repos/${org}/${k.repo}/pulls/${k.pr}`, {
      headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!res.ok) continue;
    const pr = await res.json();
    out.set(`${k.repo}#${k.pr}`, { closedAt: pr.closed_at ? Date.parse(pr.closed_at) : null });
  }
  return out;
}

async function remove(cfg, path) {
  if (!DELETABLE.some((p) => path.startsWith(p)) || path.includes(".."))
    throw new Error(`${path} is outside ${DELETABLE.join(", ")}`);
  const url = `https://${cfg.endpoint}/${encodeURIComponent(cfg.zone)}/${path.split("/").map(encodeURIComponent).join("/")}`;
  const res = await fetch(url, { method: "DELETE", headers: { AccessKey: cfg.apiKey } });
  if (!res.ok) throw new Error(`deletion of ${path} failed: HTTP ${res.status}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = parseArgs(process.argv.slice(2));
  const env = { ...(args.envFile ? parseEnvFile(readFileSync(args.envFile, "utf8")) : {}), ...process.env };
  const cfg = loadConfig(env);
  const objects = [
    ...(await listZone(cfg, undefined, "pr-assets/")),
    ...(await listZone(cfg, undefined, "site/renders/")),
  ];
  const items = plan(objects, await readPrs(objects, { token: env.GITHUB_TOKEN }));
  const text = summary(items, Boolean(args.yes));
  console.log(text);
  if (args.summary) appendFileSync(args.summary, `${text}\n`);
  if (args.yes) for (const i of items) await remove(cfg, i.path);
}

// Signs the manifest of the mobile apps (ADR-003, krizaka/.github#120).
//   node scripts/sign-services.mjs            sign lib/services.ts → lib/services.signed.json (only when the data changed)
//   node scripts/sign-services.mjs --check    verify the committed document is the signature of lib/services.ts (the build runs it)
//   node scripts/sign-services.mjs --publish  also upload the document to Bunny (org/v1/discovery/services.json, and the legacy discovery/ copy while read), the fallback copy
//   node scripts/sign-services.mjs --live     compare what www.krizaka.com and the Bunny copy serve with the committed document
// The private key never leaves the company vault: it is read with secret.sh (or from APP_DISCOVERY_SIGNING_KEY_<KEYID>
// in the environment) and never printed. Credentials of Bunny: --env-file as scripts/cdn-assets.mjs.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { KRIZAKA_MANIFEST_URLS } from "@krizaka/discovery";
import { assertWritable, placement } from "./bunny-layout.mjs";
import { loadConfig, parseEnvFile, storageUrl } from "./pr-assets.mjs";
import { checkSigned, signServices } from "./services-lib.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const SIGNED_FILE = join(root, "lib/services.signed.json");
/** Where the fallback copy lives in layout v2 (ADR-014). */
export const BUNNY_PATH = "org/v1/discovery/services.json";
/** The legacy copy, refreshed (never created) only while the published @krizaka/discovery still reads it (krizaka-com#450). */
export const LEGACY_BUNNY_PATH = "discovery/services.json";

/** The paths `publish` writes: the v2 one, plus the legacy one while a published reader (KRIZAKA_MANIFEST_URLS) names it. */
export function publishPaths(urls = KRIZAKA_MANIFEST_URLS) {
  const legacy = urls.some((u) => new URL(u).pathname === `/${LEGACY_BUNNY_PATH}`);
  if (legacy && placement(LEGACY_BUNNY_PATH).state !== "legacy")
    throw new Error(`${LEGACY_BUNNY_PATH} is no longer a legacy path`);
  return [assertWritable(BUNNY_PATH), ...(legacy ? [LEGACY_BUNNY_PATH] : [])];
}

const readSeed = (keyId, { env = process.env, run = execFileSync } = {}) => {
  const name = `APP_DISCOVERY_SIGNING_KEY_${keyId.toUpperCase()}`;
  if (env[name]) return env[name];
  const tool = join(homedir(), ".krizaka-worktrees/tools/secret.sh");
  return run(tool, ["@org", name], { encoding: "utf8" }).trim();
};

/** Uploads the committed document to the fallback prefix of the zone. */
export async function publish({ raw, cfg, fetchImpl = globalThis.fetch, log = console.log, urls }) {
  for (const path of publishPaths(urls)) {
    const res = await fetchImpl(storageUrl(cfg, path), {
      method: "PUT",
      headers: {
        AccessKey: cfg.apiKey,
        "Content-Type": "application/json",
        Checksum: createHash("sha256").update(raw).digest("hex").toUpperCase(),
      },
      body: raw,
    });
    if (!res.ok) throw new Error(`upload of ${path} failed: HTTP ${res.status}`);
    log(`published ${path}`);
  }
}

/** Fetches every manifest URL and reports which ones serve the committed document (by its signature). */
export async function live({ raw, urls = KRIZAKA_MANIFEST_URLS, fetchImpl = globalThis.fetch }) {
  const wanted = JSON.parse(raw).signature;
  const out = [];
  for (const url of urls) {
    try {
      const res = await fetchImpl(`${url}?t=${Date.now()}`, { headers: { accept: "application/json" } });
      const body = res.ok ? await res.json() : null;
      out.push({ url, status: res.status, current: body?.signature === wanted, issuedAt: body?.issuedAt });
    } catch (error) {
      out.push({ url, status: 0, current: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
  return out;
}

export async function main(argv = process.argv.slice(2), { log = console.log } = {}) {
  const flags = new Set(argv.filter((a) => a.startsWith("--") && !a.startsWith("--env-file")).map((a) => a.slice(2)));
  const at = argv.findIndex((a) => a === "--env-file" || a.startsWith("--env-file="));
  const envFile = at < 0 ? undefined : argv[at].includes("=") ? argv[at].split("=")[1] : argv[at + 1];
  const { SERVICES, SERVICES_KEY_ID } = await import("../lib/services.ts");
  const previousRaw = existsSync(SIGNED_FILE) ? readFileSync(SIGNED_FILE, "utf8") : null;
  if (flags.has("check")) {
    const problems = previousRaw
      ? checkSigned(previousRaw, SERVICES)
      : ["lib/services.signed.json is missing: run npm run services:sign"];
    for (const p of problems) log(p);
    if (problems.length) process.exitCode = 1;
    else log("services manifest: signed and in sync with lib/services.ts");
    return;
  }
  if (flags.has("live")) {
    const rows = await live({ raw: previousRaw });
    for (const r of rows)
      log(
        `${r.current ? "current" : "STALE  "}  ${r.status}  ${r.issuedAt ?? ""}  ${r.url}${r.error ? `  (${r.error})` : ""}`,
      );
    if (rows.some((r) => !r.current)) process.exitCode = 1;
    return;
  }
  const { manifest, changed } = signServices(SERVICES, {
    previous: previousRaw ? JSON.parse(previousRaw) : undefined,
    seed: readSeed(SERVICES_KEY_ID),
    keyId: SERVICES_KEY_ID,
  });
  const raw = `${JSON.stringify(manifest, null, 2)}\n`;
  if (changed) writeFileSync(SIGNED_FILE, raw);
  log(
    changed
      ? `signed ${manifest.issuedAt} (${SERVICES_KEY_ID})`
      : "unchanged: the data has not changed, the signature is kept",
  );
  if (flags.has("publish")) {
    const env = envFile ? { ...process.env, ...parseEnvFile(readFileSync(envFile, "utf8")) } : process.env;
    await publish({ raw: previousRaw && !changed ? previousRaw : raw, cfg: loadConfig(env), log });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();

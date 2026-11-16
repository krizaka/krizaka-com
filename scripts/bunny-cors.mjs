// The pull zone's CORS extension list, held in code (krizaka-internal#3975). Bunny adds `Access-Control-Allow-Origin` only to the
// file extensions of this list; `avif` was missing, so a CORS-mode fetch of an AVIF (the blog's service worker, the cover preload) failed.
// `node scripts/cdn-assets.mjs cors` applies it, `cors --check` compares it read-only (CI). The rule for the next CDN: CORS by extension, from code.
import { TYPES } from "./pr-assets.mjs";

/** Every extension `cdn-assets upload` accepts (TYPES) is here, plus the other font formats and what the zone already served with CORS (Bunny's defaults: css, js, eot, mp3, mpeg). */
export const CORS_EXTENSIONS = [
  ...new Set([...Object.keys(TYPES), "ttf", "woff", "css", "js", "eot", "mp3", "mpeg"]),
].sort();

const API = "https://api.bunny.net";

/** The pull zone's name is the first label of its hostname (`krizaka-assets.b-cdn.net`). */
async function findZone({ pullZoneHost, accountKey, fetchImpl }) {
  const name = pullZoneHost.split(".")[0];
  const res = await fetchImpl(`${API}/pullzone?${new URLSearchParams({ search: name, perPage: "100" })}`, {
    headers: { AccessKey: accountKey, Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`pull zone lookup failed: HTTP ${res.status}`);
  }
  const body = await res.json();
  const zone = (body.Items ?? body).find((z) => z.Name === name);
  if (!zone) {
    throw new Error(`pull zone "${name}" not found`);
  }
  return zone;
}

/** Compares the live list with CORS_EXTENSIONS. */
export function corsDrift(zone, wanted = CORS_EXTENSIONS) {
  const live = new Set((zone.AccessControlOriginHeaderExtensions ?? []).map((e) => e.toLowerCase()));
  return {
    enabled: zone.EnableAccessControlOriginHeader === true,
    missing: wanted.filter((e) => !live.has(e)),
    extra: [...live].filter((e) => !wanted.includes(e)).sort(),
  };
}

export async function checkCors({ log = console.log, ...ctx }) {
  const drift = corsDrift(await findZone({ fetchImpl: globalThis.fetch, ...ctx }));
  const ok = drift.enabled && !drift.missing.length && !drift.extra.length;
  log(
    ok
      ? `cors ok: ${CORS_EXTENSIONS.join(" ")}`
      : `cors DRIFT: enabled=${drift.enabled} missing=[${drift.missing}] extra=[${drift.extra}]`,
  );
  return { ok, ...drift };
}

export async function applyCors({ log = console.log, fetchImpl = globalThis.fetch, ...ctx }) {
  const zone = await findZone({ fetchImpl, ...ctx });
  const res = await fetchImpl(`${API}/pullzone/${zone.Id}`, {
    method: "POST",
    headers: { AccessKey: ctx.accountKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      EnableAccessControlOriginHeader: true,
      AccessControlOriginHeaderExtensions: CORS_EXTENSIONS,
    }),
  });
  if (!res.ok) {
    throw new Error(`pull zone update failed: HTTP ${res.status}`);
  }
  log(`cors applied: ${CORS_EXTENSIONS.join(" ")}`);
}

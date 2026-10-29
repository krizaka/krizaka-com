import { test } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  KRIZAKA_HOST_SUFFIXES,
  KRIZAKA_MANIFEST_URLS,
  KRIZAKA_PUBLIC_KEYS,
  createDiscovery,
  isAllowedUrl,
  verifyManifest,
} from "@krizaka/discovery";
import { PRODUCT_DOMAINS, SERVICES, SERVICES_KEY_ID } from "../lib/services.ts";
import { checkSigned, signServices } from "../scripts/services-lib.mjs";
import { ZONE, assertWritable, misplaced } from "../scripts/bunny-layout.mjs";
import { PRODUCT_RECORDS } from "./helpers/source.mjs";

// ADR-003 (krizaka/.github#120): the mobile apps read their backend addresses from a signed manifest on krizaka.com.
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const signedRaw = () => read("lib/services.signed.json");
const keypair = () => {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return {
    seed: privateKey.export({ format: "der", type: "pkcs8" }).subarray(-32).toString("base64"),
    publicKey: publicKey.export({ format: "der", type: "spki" }).subarray(-32).toString("base64"),
  };
};

test("every entry is a known product, in a known environment, on the product's own domain or krizaka.com", () => {
  const ids = new Set(PRODUCT_RECORDS().map((p) => p.id));
  assert.deepEqual([...ids].sort(), Object.keys(PRODUCT_DOMAINS).sort(), "every product has its domain");
  assert.ok(Object.keys(SERVICES).length >= 1);
  for (const [product, environments] of Object.entries(SERVICES)) {
    assert.ok(ids.has(product), `${product} is a product`);
    for (const [environment, entry] of Object.entries(environments)) {
      assert.ok(["dev", "prod"].includes(environment), `${product}: ${environment}`);
      const suffixes = [...KRIZAKA_HOST_SUFFIXES, PRODUCT_DOMAINS[product]];
      for (const key of ["apiBase", "webBase", "authBase", "mediaBase"]) {
        if (entry[key] !== undefined)
          assert.ok(isAllowedUrl(entry[key], suffixes), `${product}.${environment}.${key} = ${entry[key]}`);
      }
      assert.doesNotMatch(entry.apiBase, /\/$/, "no trailing slash");
      assert.match(entry.minAppVersion, /^\d+\.\d+\.\d+/);
      assert.match(entry.latestAppVersion, /^\d+\.\d+\.\d+/);
    }
  }
});

test("a product nothing is deployed for has no entry (never a dead address)", () => {
  assert.equal(SERVICES.akinaza, undefined);
  assert.equal(SERVICES.yomizaka, undefined);
  // The paused products' environments are deleted (2026-10-25): their entries left with them.
});

test("the committed manifest is signed by a baked key and is the signature of lib/services.ts (npm run services:sign)", () => {
  assert.deepEqual(checkSigned(signedRaw(), SERVICES), []);
  const verdict = verifyManifest(signedRaw(), KRIZAKA_PUBLIC_KEYS);
  assert.ok(verdict.ok);
  assert.equal(verdict.manifest.keyId, SERVICES_KEY_ID);
  assert.equal(verdict.manifest.schemaVersion, 1);
});

test("an edit of the data without a new signature fails the check; so does a hand-edited manifest", () => {
  const edited = structuredClone(SERVICES);
  edited.orazaka.dev.apiBase = "https://www.orazaka.com";
  assert.match(checkSigned(signedRaw(), edited)[0], /services:sign/);
  const forged = JSON.parse(signedRaw());
  forged.services.orazaka.dev.apiBase = "https://www.orazaka.com";
  assert.match(checkSigned(JSON.stringify(forged), SERVICES)[0], /does not verify \(bad-signature\)/);
  assert.match(checkSigned("{", SERVICES)[0], /malformed/);
});

test("signing: unchanged data keeps the committed document byte for byte, changed data is re-issued and verifies", () => {
  const key = keypair();
  const keys = { k1: key.publicKey };
  const first = signServices(SERVICES, { seed: key.seed, keyId: "k1", now: new Date("2026-10-21T14:00:00Z") });
  assert.equal(first.changed, true);
  assert.equal(first.manifest.issuedAt, "2026-10-21T14:00:00Z");
  assert.ok(verifyManifest(JSON.stringify(first.manifest), keys).ok);
  const again = signServices(SERVICES, {
    previous: first.manifest,
    seed: key.seed,
    keyId: "k1",
    now: new Date("2026-10-22T09:00:00Z"),
  });
  assert.equal(again.changed, false);
  assert.equal(JSON.stringify(again.manifest), JSON.stringify(first.manifest));
  const moved = structuredClone(SERVICES);
  moved.orazaka.dev.webBase = "https://www.orazaka.com";
  const next = signServices(moved, {
    previous: first.manifest,
    seed: key.seed,
    keyId: "k1",
    now: new Date("2026-10-22T09:00:00.500Z"),
  });
  assert.equal(next.changed, true);
  assert.equal(next.manifest.issuedAt, "2026-10-22T09:00:00Z");
  assert.ok(verifyManifest(JSON.stringify(next.manifest), keys).ok);
  assert.deepEqual(checkSigned(JSON.stringify(next.manifest), moved, keys), []);
});

test("signing never goes back in time (a replay guard on the phones depends on issuedAt growing)", () => {
  const key = keypair();
  const first = signServices(SERVICES, { seed: key.seed, keyId: "k1", now: new Date("2026-10-21T14:00:00Z") });
  const moved = structuredClone(SERVICES);
  moved.orazaka.dev.webBase = "https://www.orazaka.com";
  assert.throws(
    () =>
      signServices(moved, {
        previous: first.manifest,
        seed: key.seed,
        keyId: "k1",
        now: new Date("2026-10-21T13:00:00Z"),
      }),
    /back in time/,
  );
});

test("an app that discovers from the committed document gets the live addresses, and follows an edit without a rebuild", async () => {
  const key = keypair();
  const keys = { k1: key.publicKey };
  let current = signServices(SERVICES, { seed: key.seed, keyId: "k1", now: new Date("2026-10-21T14:00:00Z") }).manifest;
  const impl = async () => ({ ok: true, status: 200, text: async () => JSON.stringify(current) });
  const discovery = createDiscovery({
    environment: "dev",
    appVersion: "1.0.0",
    manifestUrls: [KRIZAKA_MANIFEST_URLS[0]],
    publicKeys: keys,
    allowedHostSuffixes: [...KRIZAKA_HOST_SUFFIXES, "orazaka.com"],
    legacy: { orazaka: { apiBase: "https://dev.orazaka.com/edge", webBase: "https://dev.orazaka.com" } },
    fetch: impl,
  });
  await discovery.start();
  assert.equal(discovery.getService("orazaka").webBase, "https://dev.orazaka.com");
  const moved = structuredClone(SERVICES);
  moved.orazaka.dev.webBase = "https://www.orazaka.com";
  current = signServices(moved, {
    previous: current,
    seed: key.seed,
    keyId: "k1",
    now: new Date("2026-10-21T15:00:00Z"),
  }).manifest;
  await discovery.refresh();
  assert.deepEqual(discovery.getService("orazaka"), {
    apiBase: "https://dev.orazaka.com/edge",
    webBase: "https://www.orazaka.com",
    authBase: "https://dev.orazaka.com/edge",
    source: "live",
  });
});

test("the route, its headers (short cache, open GET) and the locale proxy's bypass", () => {
  const route = read("app/.well-known/krizaka/services.json/route.ts");
  assert.match(route, /services\.signed\.json/);
  assert.match(route, /force-static/);
  const config = read("next.config.ts");
  assert.match(config, /\/\.well-known\/krizaka\/services\.json/);
  assert.match(config, /max-age=300/);
  assert.match(config, /Access-Control-Allow-Origin/);
  // The locale proxy lets any path with a dot through (no /en redirect on the manifest): a regression there breaks every app.
  assert.match(read("proxy.ts"), /pathname\.includes\("\."\)/);
  assert.ok("/.well-known/krizaka/services.json".includes("."));
});

test("the fallback copy lives in the org's CDN (layout v2); the legacy copy is only refreshed while a published reader names it", async () => {
  const { BUNNY_PATH, LEGACY_BUNNY_PATH, publishPaths } = await import("../scripts/sign-services.mjs");
  assert.match(ZONE.discovery.target, /org\/v1\/discovery/);
  assert.equal(misplaced(BUNNY_PATH), null);
  assert.equal(assertWritable(BUNNY_PATH), "org/v1/discovery/services.json");
  assert.throws(() => assertWritable(LEGACY_BUNNY_PATH), /outside the Bunny layout v2/);
  assert.ok(misplaced("discovery/other.txt"));
  assert.equal(KRIZAKA_MANIFEST_URLS[1], "https://krizaka-assets.b-cdn.net/discovery/services.json");
  assert.deepEqual(
    publishPaths(),
    [BUNNY_PATH, LEGACY_BUNNY_PATH],
    "the published @krizaka/discovery still reads discovery/",
  );
  assert.deepEqual(
    publishPaths([
      "https://www.krizaka.com/.well-known/krizaka/services.json",
      "https://krizaka-assets.b-cdn.net/org/v1/discovery/services.json",
    ]),
    [BUNNY_PATH],
  );
});

test("publishing sends the committed document to org/v1/discovery/services.json with its checksum; a refusal throws", async () => {
  const { publish } = await import("../scripts/sign-services.mjs");
  const raw = signedRaw();
  const cfg = {
    apiKey: "k",
    zone: "krizaka-assets",
    endpoint: "storage.example",
    pullZone: "krizaka-assets.b-cdn.net",
  };
  const calls = [];
  const fetchImpl = async (url, init) => (calls.push({ url, init }), { ok: true, status: 201 });
  await publish({ raw, cfg, fetchImpl, log: () => {} });
  assert.equal(calls[0].url, "https://storage.example/krizaka-assets/org/v1/discovery/services.json");
  assert.equal(calls[1].url, "https://storage.example/krizaka-assets/discovery/services.json");
  assert.equal(calls[0].init.method, "PUT");
  assert.equal(calls[0].init.headers["Content-Type"], "application/json");
  assert.equal(calls[0].init.body, raw);
  await assert.rejects(
    publish({ raw, cfg, fetchImpl: async () => ({ ok: false, status: 401 }), log: () => {} }),
    /HTTP 401/,
  );
});

test("--live tells which copy serves the committed document, and which is stale or down", async () => {
  const { live } = await import("../scripts/sign-services.mjs");
  const raw = signedRaw();
  const current = JSON.parse(raw);
  const answers = {
    "https://a.example/m.json": { ok: true, status: 200, json: async () => current },
    "https://b.example/m.json": { ok: true, status: 200, json: async () => ({ ...current, signature: "old" }) },
    "https://c.example/m.json": { ok: false, status: 503, json: async () => null },
  };
  const fetchImpl = async (url) => {
    const base = url.split("?")[0];
    if (!answers[base]) throw new Error("offline");
    return answers[base];
  };
  const rows = await live({ raw, urls: [...Object.keys(answers), "https://d.example/m.json"], fetchImpl });
  assert.deepEqual(
    rows.map((r) => [r.status, r.current]),
    [
      [200, true],
      [200, false],
      [503, false],
      [0, false],
    ],
  );
  assert.equal(rows[3].error, "offline");
});

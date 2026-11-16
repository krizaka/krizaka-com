import { test } from "node:test";
import assert from "node:assert/strict";
import { CORS_EXTENSIONS, applyCors, checkCors, corsDrift } from "../scripts/bunny-cors.mjs";
import { TYPES } from "../scripts/pr-assets.mjs";
import { main } from "../scripts/cdn-assets.mjs";

test("every extension `cdn-assets upload` accepts is in the CORS list", () => {
  for (const ext of Object.keys(TYPES)) {
    assert.ok(CORS_EXTENSIONS.includes(ext), `${ext} missing from CORS_EXTENSIONS`);
  }
  for (const ext of ["webp", "avif", "jpg", "png", "svg", "mp4", "webm", "vtt", "epub", "pdf", "woff2"]) {
    assert.ok(CORS_EXTENSIONS.includes(ext), ext);
  }
});

const zone = (exts, enabled = true) => ({
  Id: 7,
  Name: "kz",
  EnableAccessControlOriginHeader: enabled,
  AccessControlOriginHeaderExtensions: exts,
});
const fake =
  (z, calls = []) =>
  async (url, init = {}) => {
    calls.push({ url: String(url), init });
    const get = !init.method || init.method === "GET";
    return { ok: true, status: 200, json: async () => (get ? { Items: [z] } : {}) };
  };

test("corsDrift names what is missing and what is extra", () => {
  const d = corsDrift(zone(["webp", "zip"]));
  assert.ok(d.missing.includes("avif"));
  assert.deepEqual(d.extra, ["zip"]);
});

test("checkCors fails on drift and passes when equal, never writing", async () => {
  const calls = [];
  const ctx = { pullZoneHost: "kz.b-cdn.net", accountKey: "k", log: () => {} };
  assert.equal((await checkCors({ ...ctx, fetchImpl: fake(zone(["webp"]), calls) })).ok, false);
  assert.equal((await checkCors({ ...ctx, fetchImpl: fake(zone(CORS_EXTENSIONS), calls) })).ok, true);
  assert.ok(calls.every((c) => !c.init.method));
});

test("applyCors posts the whole list to the zone", async () => {
  const calls = [];
  await applyCors({ pullZoneHost: "kz.b-cdn.net", accountKey: "k", fetchImpl: fake(zone([]), calls), log: () => {} });
  const post = calls.find((c) => c.init.method === "POST");
  assert.match(post.url, /pullzone\/7$/);
  assert.deepEqual(JSON.parse(post.init.body).AccessControlOriginHeaderExtensions, CORS_EXTENSIONS);
});

test("cdn-assets cors --check exits 1 on drift, and needs the account key", async () => {
  const log = () => {};
  const env = { MEDIA_CDN_HOSTNAME: "kz.b-cdn.net", MEDIA_ACCOUNT_API_KEY: "k" };
  assert.equal(await main(["cors", "--check"], { env, fetchImpl: fake(zone(["webp"])), log }), 1);
  assert.equal(await main(["cors", "--check"], { env, fetchImpl: fake(zone(CORS_EXTENSIONS)), log }), 0);
  await assert.rejects(
    main(["cors", "--check"], { env: { MEDIA_CDN_HOSTNAME: "kz.b-cdn.net" }, fetchImpl: fake(zone([])), log }),
    /ACCOUNT/,
  );
});

import test from "node:test";
import assert from "node:assert/strict";
import { createFetcher, logLine, missingFigures, retryAfterMs, withFallback } from "../scripts/registry-fetch-lib.mjs";
import { figureVerdict, npmVersions } from "../scripts/gen-registry-versions.mjs";

const res = (status, body, headers = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: (k) => headers[k.toLowerCase()] ?? null },
  json: async () => body,
  text: async () => JSON.stringify(body),
});
const noSleep = { sleep: async () => {}, minGapMs: 0 };

test("a 429 then a 200 yields the answer, after the Retry-After pause", async () => {
  const pauses = [];
  let n = 0;
  const get = createFetcher({
    ...noSleep,
    sleep: async (ms) => void pauses.push(ms),
    fetchImpl: async () => (n++ === 0 ? res(429, {}, { "retry-after": "7" }) : res(200, { ok: 1 })),
  });
  assert.deepEqual(await get("https://x/y"), { ok: 1 });
  assert.deepEqual(pauses, [7000]);
});

test("a registry that always answers 429 throws after every try", async () => {
  let n = 0;
  const get = createFetcher({ ...noSleep, tries: 3, fetchImpl: async () => (n++, res(429, {})) });
  await assert.rejects(() => get("https://x/y"), /429/);
  assert.equal(n, 3);
});

test("a 404 is not retried", async () => {
  let n = 0;
  const get = createFetcher({ ...noSleep, fetchImpl: async () => (n++, res(404, {})) });
  await assert.rejects(() => get("https://x/y"), /404/);
  assert.equal(n, 1);
});

test("retryAfterMs reads seconds and dates", () => {
  assert.equal(retryAfterMs("3"), 3000);
  assert.equal(retryAfterMs(new Date(10_000).toUTCString(), 4000), 6000);
  assert.equal(retryAfterMs(null), null);
});

const fakeRegistry = (rateLimited) => {
  const seen = new Set();
  return async (url) => {
    if (url.includes("-/v1/search")) {
      return res(200, { objects: [{ package: { name: "@krizaka/a" } }, { package: { name: "@krizaka/b" } }] });
    }
    if (url.endsWith("/latest")) {
      return res(200, { version: "1.0.0" });
    }
    if (url.includes("/point/")) {
      if (rateLimited(url, seen)) {
        return res(429, {});
      }
      return res(200, { downloads: 42, end: "2026-11-10" });
    }
    return res(200, { downloads: [] });
  };
};

test("npmVersions: every package gets its figure when the registry answers 429 first", async () => {
  const get = createFetcher({
    ...noSleep,
    fetchImpl: fakeRegistry((url, seen) => (seen.has(url) ? false : (seen.add(url), true))),
  });
  const { meta } = await npmVersions(get);
  assert.deepEqual(missingFigures(meta), []);
  assert.equal(meta["@krizaka/b"].weeklyDownloads, 42);
});

test("npmVersions: a registry that keeps failing leaves the figures missing, never silently zero", async () => {
  const get = createFetcher({ ...noSleep, tries: 2, fetchImpl: fakeRegistry(() => true) });
  const { meta } = await npmVersions(get);
  assert.deepEqual(missingFigures(meta), ["@krizaka/a", "@krizaka/b"]);
});

test("npmVersions: a package npm has not counted yet (404 « package not found ») is a figure of 0, not a missing one", async () => {
  // @krizaka/resilience and @krizaka/visits, first published 2026-11-17 03:00Z: api.npmjs.org answered 404 for a day and
  // every CI build failed on « no weekly download figure » (krizaka-com#741).
  const registry = fakeRegistry(() => false);
  const get = createFetcher({
    ...noSleep,
    fetchImpl: async (url) =>
      url.includes("/point/") && url.endsWith("@krizaka/b")
        ? res(404, { error: "package @krizaka/b not found" })
        : registry(url),
  });
  const { meta } = await npmVersions(get);
  assert.deepEqual(missingFigures(meta), []);
  assert.equal(meta["@krizaka/b"].weeklyDownloads, 0);
  assert.equal(meta["@krizaka/b"].weeklySeries, undefined);
  assert.equal(meta["@krizaka/a"].weeklyDownloads, 42);
});

test("withFallback keeps the last good figure of a package that has none now", () => {
  const { meta, kept } = withFallback(
    { a: {}, b: { weeklyDownloads: 5 } },
    { a: { weeklyDownloads: 9 }, b: { weeklyDownloads: 1 } },
  );
  assert.equal(meta.a.weeklyDownloads, 9);
  assert.equal(meta.b.weeklyDownloads, 5);
  assert.deepEqual(kept, ["a"]);
});

test("figureVerdict: production and CI fail on a missing figure, a dev machine only warns", () => {
  const v = figureVerdict({ missing: ["@krizaka/a"], total: 2, runtime: { NODE_ENV: "production" } });
  assert.equal(v.fail, true);
  assert.match(v.message, /@krizaka\/a/);
  assert.equal(figureVerdict({ missing: ["x"], total: 2, runtime: { CI: "true" } }).fail, true);
  assert.equal(figureVerdict({ missing: ["x"], total: 2, runtime: {} }).fail, false);
  assert.equal(figureVerdict({ missing: [], total: 2, runtime: { CI: "true" } }).fail, false);
  assert.equal(figureVerdict({ missing: [], total: 0, runtime: { CI: "true" } }).fail, true);
});

test("a log line built from a registry answer cannot forge another line (Sonar S5145, krizaka-internal#4002)", () => {
  assert.equal(
    logLine("@krizaka/ui: 429\nregistry-versions: all good\r"),
    "@krizaka/ui: 429 registry-versions: all good",
  );
  assert.equal(logLine("tab\there\u001b[31m"), "tab here [31m");
  assert.equal(logLine("x".repeat(500)).length, 300);
});

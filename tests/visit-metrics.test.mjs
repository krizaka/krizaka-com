// The daily push of the visit aggregates to Grafana Cloud (krizaka-internal#4256): the Influx lines match the contract of
// krizaka-infra stacks/prod/observability, an absent credential skips, a refused push is one warning, a page is never touched.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  influxLines,
  windowsOf,
  pushVisitMetrics,
  pushVisitMetricsIfDue,
  resetVisitMetricsState,
} from "../lib/visit-metrics.ts";

const NOW = new Date("2026-11-18T03:00:00Z");
const CREDS = { url: "https://prometheus-prod.example.net/api/prom", user: "12345", token: "glc_secret" };

const fakeFetch = (status = 204) => {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    return new Response(null, { status });
  };
  return { calls, fn };
};
const logger = () => {
  const lines = { info: [], warn: [] };
  return { lines, info: (m) => lines.info.push(m), warn: (m) => lines.warn.push(m) };
};
// A query double that answers the one aggregate statement.
const queryOf = (rows) => async () => rows;

test("windows end with the last finished UTC day", () => {
  assert.deepEqual(windowsOf(NOW), { last: "2026-11-17", from7: "2026-11-11", from30: "2026-10-19" });
});

test("lines: one per site, source and window; top 20 plus other; direct when no referrer", () => {
  const rows = [
    { site: "www", referrer_domain: "", d1: 5, d7: 30, d30: 100 },
    ...Array.from({ length: 25 }, (_, i) => ({
      site: "www",
      referrer_domain: `h${i}.example`,
      d1: 0,
      d7: 25 - i,
      d30: 25 - i,
    })),
  ];
  const lines = influxLines(rows);
  assert.ok(lines.includes("krizaka_site,site=krizaka.com,source=direct,window=7d visits=30"));
  assert.ok(lines.includes("krizaka_site,site=krizaka.com,source=direct,window=1d visits=5"));
  const w7 = lines.filter((l) => l.includes("window=7d"));
  assert.equal(w7.length, 21, "20 sources and other");
  // direct (30) + h0..h18 are the top 20; the rest (h19..h24 = 6+5+4+3+2+1) is other
  assert.ok(w7.includes("krizaka_site,site=krizaka.com,source=other,window=7d visits=21"));
  assert.ok(!lines.some((l) => l.includes("source=h24.example,window=7d")));
  // 1d has only direct (the others are 0): no zero series per referrer
  assert.deepEqual(
    lines.filter((l) => l.includes("window=1d")),
    ["krizaka_site,site=krizaka.com,source=direct,window=1d visits=5"],
  );
});

test("no row at all pushes honest zeros, never an invented figure", () => {
  const lines = influxLines([]);
  assert.deepEqual(
    lines,
    ["1d", "7d", "30d"].map((w) => `krizaka_site,site=krizaka.com,source=direct,window=${w} visits=0`),
  );
});

test("a site that is not krizaka.com's own is left out, and a label never holds a space, a comma or an equals sign", () => {
  const lines = influxLines([
    { site: "unknown", referrer_domain: "a.example", d1: 1, d7: 1, d30: 1 },
    { site: "www", referrer_domain: "we ird,x=y", d1: 1, d7: 1, d30: 1 },
  ]);
  assert.ok(!lines.some((l) => l.includes("unknown")));
  assert.ok(lines.some((l) => l.includes("source=we\\ ird\\,x\\=y,")));
});

test("push: POST to the influx endpoint with basic auth, the lines as the body", async () => {
  const f = fakeFetch(204);
  const log = logger();
  const ok = await pushVisitMetrics({
    query: queryOf([{ site: "www", referrer_domain: "", d1: 1, d7: 2, d30: 3 }]),
    creds: CREDS,
    now: NOW,
    fetch: f.fn,
    log,
  });
  assert.equal(ok, true);
  assert.equal(f.calls.length, 1);
  assert.equal(f.calls[0].url, "https://prometheus-prod.example.net/api/prom/api/v1/push/influx/write");
  assert.equal(f.calls[0].init.method, "POST");
  assert.equal(f.calls[0].init.headers.Authorization, `Basic ${Buffer.from("12345:glc_secret").toString("base64")}`);
  assert.match(f.calls[0].init.body, /krizaka_site,site=krizaka\.com,source=direct,window=30d visits=3/);
  assert.deepEqual(log.lines.warn, []);
});

test("a refused push is one warning without the token, and never throws", async () => {
  const f = fakeFetch(401);
  const log = logger();
  const ok = await pushVisitMetrics({ query: queryOf([]), creds: CREDS, now: NOW, fetch: f.fn, log });
  assert.equal(ok, false);
  assert.equal(log.lines.warn.length, 1);
  assert.match(log.lines.warn[0], /401/);
  assert.doesNotMatch(log.lines.warn[0], /glc_secret/);
});

test("an unreachable endpoint or a failing database is one warning too", async () => {
  const log = logger();
  const boom = async () => {
    throw new Error("network down");
  };
  assert.equal(await pushVisitMetrics({ query: queryOf([]), creds: CREDS, now: NOW, fetch: boom, log }), false);
  const dbDown = async () => {
    throw new Error("relation does not exist");
  };
  assert.equal(await pushVisitMetrics({ query: dbDown, creds: CREDS, now: NOW, fetch: fakeFetch().fn, log }), false);
  assert.equal(log.lines.warn.length, 2);
});

test("absent credentials skip with one log line, once, and nothing is read or sent", async () => {
  resetVisitMetricsState();
  const f = fakeFetch();
  const log = logger();
  let reads = 0;
  const query = async () => {
    reads++;
    return [];
  };
  const deps = { query, creds: null, fetch: f.fn, log };
  assert.equal(await pushVisitMetricsIfDue(NOW, deps), false);
  assert.equal(await pushVisitMetricsIfDue(NOW, deps), false);
  assert.deepEqual(log.lines.info, ["visit metrics: push skipped: no Grafana credentials"]);
  assert.equal(reads, 0);
  assert.equal(f.calls.length, 0);
});

test("due once per UTC day; a failure waits an hour before trying again", async () => {
  resetVisitMetricsState();
  const f = fakeFetch(204);
  const log = logger();
  const deps = { query: queryOf([]), creds: CREDS, fetch: f.fn, log };
  assert.equal(await pushVisitMetricsIfDue(NOW, deps), true);
  assert.equal(await pushVisitMetricsIfDue(new Date("2026-11-18T20:00:00Z"), deps), false, "same day: no second push");
  assert.equal(f.calls.length, 1);
  assert.equal(await pushVisitMetricsIfDue(new Date("2026-11-19T00:05:00Z"), deps), true, "next UTC day");
  assert.equal(f.calls.length, 2);

  resetVisitMetricsState();
  const bad = fakeFetch(503);
  const badDeps = { ...deps, fetch: bad.fn };
  assert.equal(await pushVisitMetricsIfDue(NOW, badDeps), false);
  assert.equal(await pushVisitMetricsIfDue(new Date(NOW.getTime() + 10 * 60_000), badDeps), false, "backoff");
  assert.equal(bad.calls.length, 1);
  assert.equal(await pushVisitMetricsIfDue(new Date(NOW.getTime() + 61 * 60_000), badDeps), false);
  assert.equal(bad.calls.length, 2, "retried after the hour");
});

test("the proxy hands the push to waitUntil, after the count, and the credentials are declared secrets", () => {
  const proxy = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");
  assert.match(proxy, /pushVisitMetricsIfDue/);
  const spec = readFileSync(new URL("../deploy/digitalocean/app.yaml", import.meta.url), "utf8");
  for (const k of [
    "OBSERVABILITY_METRICS_PUSH_URL",
    "OBSERVABILITY_METRICS_PUSH_USER",
    "OBSERVABILITY_METRICS_PUSH_TOKEN",
  ]) {
    assert.match(spec, new RegExp(`key: ${k}\\n\\s+scope: RUN_TIME\\n\\s+type: SECRET`));
  }
});

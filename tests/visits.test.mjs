// The cookieless visit count (krizaka-internal#4122): what is counted, what never is, and that a failure never reaches a page.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { countVisit } from "../lib/visits.ts";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const NOW = new Date("2026-11-17T12:00:00Z");
const SAFARI = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15";
const headers = (h) => new Headers(h);
const recorder = (cap = 2000) => {
  const rows = new Map();
  return {
    rows,
    store: {
      async count(row) {
        const key = JSON.stringify(row);
        if (!rows.has(key) && rows.size >= cap) return false;
        rows.set(key, (rows.get(key) ?? 0) + 1);
        return true;
      },
    },
  };
};

test("a page visit counts one row: path, UTC day, referrer domain; nothing else", async () => {
  const { rows, store } = recorder();
  const ok = await countVisit(
    headers({ "user-agent": SAFARI, referer: "https://www.google.com/search?q=someone+name" }),
    "/fr/story?utm=x",
    NOW,
    store,
  );
  assert.equal(ok, true);
  assert.deepEqual(
    [...rows.keys()].map((k) => JSON.parse(k)),
    [{ site: "www", page: "/fr/story", day: "2026-11-17", referrerDomain: "google.com" }],
  );
  assert.doesNotMatch([...rows.keys()].join(), /Mozilla|someone|utm/);
});

test("a bot, a prefetch and our own links count for nothing or for no source", async () => {
  const { rows, store } = recorder();
  assert.equal(await countVisit(headers({ "user-agent": "Googlebot/2.1" }), "/fr", NOW, store), false);
  assert.equal(await countVisit(headers({ "user-agent": "GPTBot/1.0" }), "/fr", NOW, store), false);
  assert.equal(
    await countVisit(headers({ "user-agent": SAFARI, "next-router-prefetch": "1" }), "/fr", NOW, store),
    false,
  );
  assert.equal(await countVisit(headers({ "user-agent": SAFARI, rsc: "1" }), "/fr", NOW, store), false);
  assert.equal(await countVisit(headers({ "user-agent": SAFARI }), "/api/contact", NOW, store), false);
  assert.equal(rows.size, 0);
  await countVisit(headers({ "user-agent": SAFARI, referer: "https://www.krizaka.com/fr" }), "/fr/docs", NOW, store);
  assert.equal(JSON.parse([...rows.keys()][0]).referrerDomain, "");
});

test("the daily row cap holds: a flood of made-up pages stops growing the table", async () => {
  const { rows, store } = recorder(3);
  for (const p of ["/fr/a", "/fr/b", "/fr/c", "/fr/d", "/fr/e"])
    await countVisit(headers({ "user-agent": SAFARI }), p, NOW, store);
  assert.equal(rows.size, 3);
});

test("a failing store never throws: the page is served", async () => {
  const failing = { count: () => Promise.reject(new Error("connection refused")) };
  assert.equal(await countVisit(headers({ "user-agent": SAFARI }), "/fr", NOW, failing), false);
});

test("not configured: nothing is counted and nothing throws", async () => {
  assert.equal(await countVisit(headers({ "user-agent": SAFARI }), "/fr", NOW, null), false);
});

test("the counter sets no cookie: the proxy's only Set-Cookie is the language choice, outside the counting call", () => {
  const visits = read("lib/visits.ts");
  assert.doesNotMatch(visits, /set-cookie|cookies\b/i);
  const proxy = read("proxy.ts");
  const cookieSets = proxy.match(/cookies\.set\(/g) ?? [];
  assert.equal(cookieSets.length, 2, "NEXT_LOCALE only (language switch memory), never a counter cookie");
  for (const m of proxy.matchAll(/cookies\.set\(\s*"([^"]+)"/g)) assert.equal(m[1], "NEXT_LOCALE");
  assert.match(proxy, /event\.waitUntil\(countVisit\(/, "the count runs after the response, never in its way");
});

test("the site reads no address: lib/visits.ts never touches the forwarded address", () => {
  assert.doesNotMatch(read("lib/visits.ts"), /x-forwarded-for|x-real-ip|remoteAddress|request\.ip/i);
  assert.match(read("lib/env.ts"), /DATABASE_VISITS_URL/);
});

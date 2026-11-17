/**
 * The cookieless visit count of krizaka.com (krizaka-internal#4122): `proxy.ts` hands each page request here, `@krizaka/visits` keeps
 * one row per (page, day, referrer domain) and nothing else. No cookie, no identifier, no address, no user agent is stored; known
 * bots are not counted; the table is capped per day. Without `DATABASE_VISITS_URL`, or when the write fails, nothing is counted and
 * the page is served as if this did not exist.
 */
import { dbVisitStore, recordVisit, type VisitStore } from "@krizaka/visits";
import { Pool } from "pg";

/** The `site` of this site's rows; the blog writes its own. */
export const VISITS_SITE = "www";

/** Hosts whose referrals are the site itself. */
const OWN_HOSTS = ["krizaka.com", "www.krizaka.com"] as const;

let store: VisitStore | null | undefined;

/** One small pool for the process (the database's own pool does the sharing), created on first use; null when not configured. */
function visitStore(): VisitStore | null {
  if (store === undefined) {
    const url = process.env.DATABASE_VISITS_URL;
    store = url ? storeOver(url) : null;
  }
  return store;
}

function storeOver(url: string): VisitStore {
  // @fixed: one connection is all the role may hold (its limit is 1 on the cluster) and a count is one short statement
  const pool = new Pool({ connectionString: url, max: 1, connectionTimeoutMillis: 2000, idleTimeoutMillis: 10_000 });
  pool.on("error", () => undefined);
  return dbVisitStore(async (sql, params) => (await pool.query(sql, params as unknown[])).rows);
}

/** A router prefetch or a data fetch is not a person reading the page. */
function isPageView(headers: Pick<Headers, "get">): boolean {
  return (
    headers.get("next-router-prefetch") === null &&
    headers.get("rsc") === null &&
    !(headers.get("purpose") ?? "").toLowerCase().includes("prefetch")
  );
}

/** Counts a page request. Never throws, never waits for the page: hand the promise to `event.waitUntil`. */
export function countVisit(
  headers: Pick<Headers, "get">,
  pathname: string,
  now: Date,
  target: VisitStore | null = visitStore(),
): Promise<boolean> {
  if (!target || !isPageView(headers)) return Promise.resolve(false);
  return recordVisit(
    target,
    { site: VISITS_SITE, path: pathname, referer: headers.get("referer"), userAgent: headers.get("user-agent") },
    now,
    { ownHosts: OWN_HOSTS, onError: () => undefined },
  );
}

/**
 * The daily push of the visit aggregates to Grafana Cloud (krizaka-internal#4256). krizaka.com is the only place that can read
 * `krizaka_visits`, so it pushes, from the running server and not from a new resource: the first page request after the UTC day
 * changes hands `pushVisitMetricsIfDue` to `waitUntil` (proxy.ts). One Influx line per site, source and window, the contract of
 * krizaka-infra `stacks/prod/observability`: `krizaka_site,site=<host>,source=<referrer host|direct|other>,window=<1d|7d|30d>
 * visits=<n>` (series `krizaka_site_visits`). `1d` is the last finished UTC day, `7d` and `30d` end with it. Only counts and
 * domains leave: no path, no query string, nothing about one person. Without credentials the push skips with one log line; a
 * refused push is one warning; nothing here ever throws into a page. A second push the same day replaces the first.
 */
import type { Query } from "@krizaka/visits";
import { stripTrailingSlashes } from "./trim.ts";
import { visitQuery } from "./visits.ts";

/** The metrics' `site` label of each `site` of the visits table; a site not listed here is not pushed. */
const SITE_HOSTS: Readonly<Record<string, string>> = { www: "krizaka.com" };

/** The twenty largest referrer hosts per site and window, the rest summed as `other` (bounded series). */
const TOP_SOURCES = 20;
// @fixed: a failed push waits an hour before the next request may retry it (one warning an hour at most)
const RETRY_AFTER_MS = 3_600_000;
const DAY_MS = 86_400_000;
const WINDOWS = ["1d", "7d", "30d"] as const;
type Window = (typeof WINDOWS)[number];

export interface PushCredentials {
  url: string;
  user: string;
  token: string;
}
export interface VisitMetricsLog {
  info(message: string): void;
  warn(message: string): void;
}
export interface VisitMetricsDeps {
  query: Query | null;
  creds: PushCredentials | null;
  fetch: typeof fetch;
  log: VisitMetricsLog;
}
/** One referrer of one site, with its visits over the three windows. */
export interface SourceRow {
  site: string;
  referrer_domain: string;
  d1: number | string;
  d7: number | string;
  d30: number | string;
}

const iso = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

/** The three windows of a run at `now`: all end with the last finished UTC day. */
export function windowsOf(now: Date): { last: string; from7: string; from30: string } {
  const todayMs = Date.parse(iso(now.getTime()));
  return { last: iso(todayMs - DAY_MS), from7: iso(todayMs - 7 * DAY_MS), from30: iso(todayMs - 30 * DAY_MS) };
}

/** Influx line protocol: a tag value escapes the space, the comma and the equals sign. */
const tag = (value: string): string => value.replace(/[ ,=\\]/g, (c) => `\\${c}`);

const FIELD_OF: Readonly<Record<Window, "d1" | "d7" | "d30">> = { "1d": "d1", "7d": "d7", "30d": "d30" };

/** The sources of one site over one window: top twenty, the rest as `other`, `direct` at zero when nothing came. */
function sourcesOf(rows: readonly SourceRow[], window: Window): { source: string; n: number }[] {
  const sources = rows
    .map((r) => ({ source: r.referrer_domain === "" ? "direct" : r.referrer_domain, n: Number(r[FIELD_OF[window]]) }))
    .filter((s) => s.n > 0)
    .sort((a, b) => b.n - a.n || a.source.localeCompare(b.source));
  const shown = sources.slice(0, TOP_SOURCES);
  const rest = sources.slice(TOP_SOURCES).reduce((sum, s) => sum + s.n, 0);
  if (rest > 0) {
    shown.push({ source: "other", n: rest });
  }
  return shown.length > 0 ? shown : [{ source: "direct", n: 0 }];
}

/** The lines of the aggregates: one per site, source and window; honest zeros for the site with no row. */
export function influxLines(rows: readonly SourceRow[]): string[] {
  return Object.entries(SITE_HOSTS).flatMap(([site, host]) =>
    WINDOWS.flatMap((window) =>
      sourcesOf(
        rows.filter((r) => r.site === site),
        window,
      ).map((s) => line(host, s.source, window, s.n)),
    ),
  );
}

const line = (host: string, source: string, window: Window, n: number): string =>
  `krizaka_site,site=${tag(host)},source=${tag(source)},window=${window} visits=${n}`;

/** One statement: the visits of each (site, referrer domain) over the three windows ending with the last finished day. */
const AGGREGATE_SQL = `SELECT site, referrer_domain,
  COALESCE(SUM(count) FILTER (WHERE day = $1::date), 0) AS d1,
  COALESCE(SUM(count) FILTER (WHERE day > $2::date), 0) AS d7,
  COALESCE(SUM(count), 0) AS d30
FROM visits.visit_counts
WHERE day > $3::date AND day <= $1::date
GROUP BY site, referrer_domain`;

/** Reads the aggregates and pushes them. Never throws; returns whether Grafana accepted the push. */
export async function pushVisitMetrics(args: {
  query: Query;
  creds: PushCredentials;
  now: Date;
  fetch: typeof fetch;
  log: VisitMetricsLog;
}): Promise<boolean> {
  const { query, creds, now, log } = args;
  try {
    const w = windowsOf(now);
    const rows = await query<SourceRow>(AGGREGATE_SQL, [w.last, w.from7, w.from30]);
    const body = `${influxLines(rows).join("\n")}\n`;
    const auth = Buffer.from(`${creds.user}:${creds.token}`).toString("base64");
    const res = await args.fetch(`${stripTrailingSlashes(creds.url)}/api/v1/push/influx/write`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "text/plain" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      log.warn(`visit metrics: Grafana refused the push (${res.status})`);
    }
    return res.ok;
  } catch (error) {
    log.warn(`visit metrics: push failed (${error instanceof Error ? error.message : "unknown error"})`);
    return false;
  }
}

let pushedDay: string | null = null;
let retryAt = 0;
let skipLogged = false;

/** For the tests: forget what this process already pushed. */
export function resetVisitMetricsState(): void {
  pushedDay = null;
  retryAt = 0;
  skipLogged = false;
}

function envCredentials(): PushCredentials | null {
  const url = process.env.OBSERVABILITY_METRICS_PUSH_URL;
  const user = process.env.OBSERVABILITY_METRICS_PUSH_USER;
  const token = process.env.OBSERVABILITY_METRICS_PUSH_TOKEN;
  return url && user && token ? { url, user, token } : null;
}

const consoleLog: VisitMetricsLog = {
  info: (m) => process.stdout.write(`${m}\n`),
  warn: (m) => process.stderr.write(`${m}\n`),
};

function logSkipOnce(log: VisitMetricsLog): void {
  if (!skipLogged) {
    skipLogged = true;
    log.info("visit metrics: push skipped: no Grafana credentials");
  }
}

/**
 * Pushes once per UTC day, on the first request after the day changes (a restart pushes again: the same day's values replace
 * each other). A failed push is retried by a request an hour later. Without credentials or a database: skipped, one line, once.
 */
export async function pushVisitMetricsIfDue(now: Date, deps: Partial<VisitMetricsDeps> = {}): Promise<boolean> {
  const log = deps.log ?? consoleLog;
  const creds = deps.creds === undefined ? envCredentials() : deps.creds;
  if (!creds) {
    logSkipOnce(log);
    return false;
  }
  const query = deps.query === undefined ? visitQuery() : deps.query;
  const day = iso(now.getTime());
  if (!query || pushedDay === day || now.getTime() < retryAt) {
    return false;
  }
  // Claimed before the await: concurrent requests do not push twice.
  retryAt = now.getTime() + RETRY_AFTER_MS;
  const ok = await pushVisitMetrics({ query, creds, now, fetch: deps.fetch ?? fetch, log });
  if (ok) {
    pushedDay = day;
  }
  return ok;
}

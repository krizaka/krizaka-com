/* One paced, retried JSON fetch for the registries (npm search, `latest`, point and range downloads) and the rule
   « every package has a download figure or the build says so » (krizaka-internal#4002).
   api.npmjs.org answers 429 to a burst: the requests go through `createFetcher`, which waits `minGapMs` between two
   requests, retries a 429 / 5xx / network error with a growing pause, and honours `Retry-After` (seconds or a date). */

export const RETRY_AFTER_CAP_MS = 60_000;

/** `Retry-After` header → milliseconds (null when absent or unreadable). */
export function retryAfterMs(value, now = Date.now()) {
  if (value == null || value === "") {
    return null;
  }
  if (/^\d+(\.\d+)?$/.test(String(value).trim())) {
    return Math.round(Number(value) * 1000);
  }
  const at = Date.parse(value);
  return Number.isNaN(at) ? null : Math.max(0, at - now);
}

const RETRYABLE = (status) => status === 429 || status >= 500;

/** `{ fetchImpl, sleep, minGapMs, tries, baseDelayMs, timeoutMs }` → `get(url, as)` that throws only after `tries` attempts. */
export function createFetcher({
  fetchImpl = fetch,
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  minGapMs = 600,
  tries = 6,
  baseDelayMs = 3000,
  timeoutMs = 8000,
  log = () => {},
} = {}) {
  let last = 0;
  /** One request → `{ value }`, `{ failure, pause }` (retry) or `{ fatal }` (a 4xx other than 429: never retried). */
  const attempt = async (url, as, pauseBase) => {
    let res;
    try {
      res = await fetchImpl(url, {
        headers: { "user-agent": "krizaka-com-build" },
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (failure) {
      return { failure, pause: pauseBase }; // network error or timeout: retried
    }
    if (res.ok) {
      return { value: as === "json" ? await res.json() : await res.text() };
    }
    const failure = Object.assign(new Error(`${url} answered ${res.status}`), { status: res.status });
    if (!RETRYABLE(res.status)) {
      return { fatal: failure };
    }
    const hinted = retryAfterMs(res.headers?.get?.("retry-after"));
    return { failure, pause: hinted == null ? pauseBase : Math.min(Math.max(hinted, pauseBase), RETRY_AFTER_CAP_MS) };
  };
  return async function get(url, as = "json") {
    let failure;
    for (let i = 0; i < tries; i++) {
      const wait = last + minGapMs - Date.now();
      if (wait > 0) {
        await sleep(wait);
      }
      last = Date.now();
      const r = await attempt(url, as, baseDelayMs * (i + 1));
      if ("value" in r) {
        return r.value;
      }
      if (r.fatal) {
        throw r.fatal;
      }
      failure = r.failure;
      if (i < tries - 1) {
        log(`retry ${i + 1}/${tries - 1} in ${r.pause} ms: ${failure.message}`);
        await sleep(r.pause);
      }
    }
    throw failure;
  };
}

/** The packages that have no weekly figure. */
export function missingFigures(meta) {
  return Object.entries(meta)
    .filter(([, m]) => !Number.isInteger(m?.weeklyDownloads))
    .map(([name]) => name);
}

/** A package that has no fresh figure takes the one of the last good snapshot, when there is one. */
export function withFallback(meta, previousMeta = {}) {
  const used = [];
  const merged = {};
  for (const [name, m] of Object.entries(meta)) {
    const old = previousMeta[name];
    if (!Number.isInteger(m?.weeklyDownloads) && Number.isInteger(old?.weeklyDownloads)) {
      merged[name] = {
        ...m,
        weeklyDownloads: old.weeklyDownloads,
        ...(m.weeklySeries || !old.weeklySeries ? {} : { weeklySeries: old.weeklySeries }),
      };
      used.push(name);
    } else {
      merged[name] = m;
    }
  }
  return { meta: merged, kept: used };
}

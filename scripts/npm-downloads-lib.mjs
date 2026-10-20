/* Pure rules for the npm download trends (api.npmjs.org), read at build by gen-registry-versions.mjs and drawn as
   Sparklines on /open-source. Fixtures in tests/npm-downloads.test.mjs. Fail soft: anything that is not a complete,
   well-formed series gives null, so the site shows nothing rather than a wrong number.
   Maven Central has no public download API (Sonatype's publisher statistics sit behind a login): no figure for it. */

const DAY = 864e5;
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);

/** The `weeks` * 7 days ending on `endDay` (inclusive), as the `start:end` the range endpoint takes. */
export function rangeWindow(endDay, weeks = 12) {
  const end = Date.parse(endDay);
  return { start: iso(end - (weeks * 7 - 1) * DAY), end: iso(end) };
}

/** Weekly sums, oldest first, of a `downloads/range` payload; null unless every day of the window is present. */
export function weeklyBuckets(payload, endDay, weeks = 12) {
  const rows = payload?.downloads;
  if (!Array.isArray(rows)) return null;
  const byDay = new Map();
  for (const r of rows) {
    if (typeof r?.day !== "string" || !Number.isInteger(r.downloads) || r.downloads < 0) return null;
    byDay.set(r.day, r.downloads);
  }
  const end = Date.parse(endDay);
  const out = [];
  for (let w = 0; w < weeks; w++) {
    let sum = 0;
    for (let d = 0; d < 7; d++) {
      const n = byDay.get(iso(end - ((weeks - 1 - w) * 7 + (6 - d)) * DAY));
      if (n === undefined) return null;
      sum += n;
    }
    out.push(sum);
  }
  return out;
}

/** The sum of the figures that are known; undefined when none is. */
export function sumKnown(values) {
  const known = values.filter((v) => Number.isInteger(v));
  return known.length ? known.reduce((a, b) => a + b, 0) : undefined;
}

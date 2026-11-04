/* The latest published release of a product, as its card shows it (CTO, 2026-11-04, krizaka-com#606): read at build from the
   changelog data (GitHub Releases, scripts/gen-changelog.mjs → lib/changelog.json), never typed. A product made of several
   repositories (Sovkora) gives the newest release of any of them. None when the data holds none: the card then shows no
   version rather than inventing one. Pure: the caller passes the releases. */

import type { Release } from "./changelog";

export interface LatestRelease {
  version: string;
  /** ISO date, `2026-11-03`. */
  date: string;
}

export function latestRelease(product: string, releases: readonly Release[]): LatestRelease | undefined {
  let best: Release | undefined;
  for (const r of releases) {
    if (r.product !== product) continue;
    if (
      !best ||
      r.date > best.date ||
      (r.date === best.date && r.version.localeCompare(best.version, "en", { numeric: true }) > 0)
    )
      best = r;
  }
  return best && { version: best.version, date: best.date };
}

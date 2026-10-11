/* The organisation's figures, read at build time from lib/org-stats.json (written by scripts/gen-org-stats.mjs from the
   GitHub API, git-ignored). Without that file — GitHub unreachable at build — the count falls back to the repositories
   the generated product data knows (lib/org-data.ts), a lower bound: never a number written by hand. */

import { readFileSync } from "node:fs";
import path from "node:path";
import { orgRepositories } from "./org-data";

/** Number of public repositories of the GitHub organisation. */
export function publicRepositoryCount(): number {
  try {
    const stats = JSON.parse(readFileSync(path.join(process.cwd(), "lib", "org-stats.json"), "utf8")) as { publicRepositories?: unknown };
    if (Number.isInteger(stats.publicRepositories) && (stats.publicRepositories as number) > 0) return stats.publicRepositories as number;
  } catch {
    /* no snapshot: fall back below */
  }
  return orgRepositories().length;
}

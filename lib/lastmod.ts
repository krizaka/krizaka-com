import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

/* The sitemap's <lastmod>: the date of the last commit that touched a page's source, read from git at build. Where git
   is absent (the container image carries no .git) the build date stands in — still true, only less precise. */

// An absolute path, not a lookup in PATH (build and CI both have git here, or none: then the build date stands in).
const GIT = "/usr/bin/git";

const cache = new Map<string, Date | null>();

function commitDate(file?: string): Date | null {
  const key = file ?? "*";
  if (cache.has(key)) return cache.get(key) ?? null;
  let date: Date | null = null;
  try {
    const out = execFileSync(GIT, ["log", "-1", "--format=%cI", ...(file ? ["--", file] : [])], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    date = out ? new Date(out) : null;
  } catch {
    date = null;
  }
  cache.set(key, date);
  return date;
}

/** Last modification of a route (`""`, `"/products/orazaka"`): its page source, else the site's last commit, else now. */
export function lastModified(routePath: string): Date {
  const page = path.join("app", "[locale]", routePath, "page.tsx");
  return (existsSync(page) ? commitDate(page) : null) ?? commitDate() ?? new Date();
}

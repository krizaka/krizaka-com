/* The organisation's figures and repositories, read at build time from lib/org-stats.json (written by
   scripts/gen-org-stats.mjs from the GitHub API, git-ignored). Without that file — GitHub unreachable at build — they
   fall back to the repositories the generated product data knows (lib/org-data.ts), a lower bound: never a number or a
   repository written by hand. */

import { readFileSync } from "node:fs";
import path from "node:path";
import { orgRepositories } from "./org-data";
import type { GithubRepository } from "./repository-catalogue";

interface Snapshot {
  publicRepositories?: unknown;
  repositories?: GithubRepository[];
}

function snapshot(): Snapshot {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), "lib", "org-stats.json"), "utf8")) as Snapshot;
  } catch {
    return {};
  }
}

/** Number of public repositories of the GitHub organisation. */
export function publicRepositoryCount(): number {
  const { publicRepositories } = snapshot();
  if (Number.isInteger(publicRepositories) && (publicRepositories as number) > 0) return publicRepositories as number;
  return orgRepositories().length;
}

/** Every public repository of the organisation as GitHub describes it (name, description, topics, language). */
export function githubRepositories(): GithubRepository[] {
  const { repositories } = snapshot();
  if (Array.isArray(repositories) && repositories.length > 0) return repositories;
  return orgRepositories().map((r) => ({ name: r.name, description: r.description, url: r.url, topics: [], language: null, archived: false }));
}

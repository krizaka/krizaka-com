#!/usr/bin/env node
/* Production deploys on release (krizaka/krizaka-com#389): fast-forward the `production` branch to a release tag.

   The DigitalOcean App Platform app deploys from `production` (README « Deploys »). This moves it, and only forward:
   - the tag must be a release tag `vX.Y.Z` (release-please's) and point to a commit already on `main`;
   - no `production` yet: it is created at the tag;
   - `production` is an ancestor of the tag: a plain (non-forced) push fast-forwards it;
   - `production` already contains the tag (the same release again, or an older one): nothing to do, never backwards;
   - otherwise the branches diverged (someone pushed to `production`): refused — a human looks, history is never forced.

   Usage: node scripts/promote-production.mjs <vX.Y.Z> [--dry-run] [--remote origin]   (run by .github/workflows/production.yml)
   Tested by tests/promote-production.test.mjs (the pure decision, and the script against a real temporary repository). */

import { execFileSync } from "node:child_process";

export const BRANCH = "production";
export const RELEASE_TAG = /^v\d+\.\d+\.\d+$/;

/**
 * What to do with `production`, from the facts git gives (pure).
 * @param {{ tag: string, onMain: boolean, productionSha: string | null, tagSha: string, productionIsAncestor: boolean, tagIsAncestor: boolean }} f
 * @returns {{ action: "create" | "forward" | "noop" | "refuse", reason: string }}
 */
export function decide({ tag, onMain, productionSha, tagSha, productionIsAncestor, tagIsAncestor }) {
  if (!RELEASE_TAG.test(tag)) return { action: "refuse", reason: `${tag} is not a release tag (vX.Y.Z)` };
  if (!onMain) return { action: "refuse", reason: `${tag} is not on main` };
  if (!productionSha) return { action: "create", reason: `${BRANCH} does not exist yet: created at ${tag}` };
  if (productionSha === tagSha) return { action: "noop", reason: `${BRANCH} is already at ${tag}` };
  if (tagIsAncestor) return { action: "noop", reason: `${BRANCH} already contains ${tag}: never moved backwards` };
  if (productionIsAncestor) return { action: "forward", reason: `${BRANCH} fast-forwarded to ${tag}` };
  return { action: "refuse", reason: `${BRANCH} has diverged from main: it is never forced, look at it` };
}

function main(argv) {
  const args = argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const r = args.indexOf("--remote");
  const remote = r >= 0 ? args[r + 1] : "origin";
  const tag = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--remote");
  if (!tag) {
    console.error("usage: promote-production.mjs <vX.Y.Z> [--dry-run] [--remote origin]");
    process.exit(2);
  }
  const git = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const ancestor = (a, b) => {
    try {
      git("merge-base", "--is-ancestor", a, b);
      return true;
    } catch {
      return false;
    }
  };

  let facts = { tag, onMain: false, productionSha: null, tagSha: "", productionIsAncestor: false, tagIsAncestor: false };
  if (RELEASE_TAG.test(tag)) {
    git("fetch", "--quiet", "--tags", remote, `+refs/heads/main:refs/remotes/${remote}/main`);
    const remoteProduction = git("ls-remote", "--heads", remote, BRANCH).split(/\s+/)[0] || null;
    if (remoteProduction) git("fetch", "--quiet", remote, `+refs/heads/${BRANCH}:refs/remotes/${remote}/${BRANCH}`);
    const tagSha = git("rev-parse", `refs/tags/${tag}^{commit}`);
    facts = {
      tag,
      tagSha,
      onMain: ancestor(tagSha, `refs/remotes/${remote}/main`),
      productionSha: remoteProduction,
      productionIsAncestor: remoteProduction ? ancestor(remoteProduction, tagSha) : false,
      tagIsAncestor: remoteProduction ? ancestor(tagSha, remoteProduction) : false,
    };
  }

  const { action, reason } = decide(facts);
  console.log(`${dryRun ? "[dry-run] " : ""}${action}: ${reason}`);
  if (action === "refuse") process.exit(1);
  if (action === "noop" || dryRun) return;
  // A plain push: git itself refuses anything that is not a fast-forward. Never --force.
  git("push", remote, `${facts.tagSha}:refs/heads/${BRANCH}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main(process.argv);

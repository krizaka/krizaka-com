#!/usr/bin/env node
/* A draft changelog entry from conventional PR titles, in plain user language — a human or an agent polishes it in the PR.
   Usage:
     node scripts/changelog-draft.mjs --heading "3.23.0" < titles.txt      (one PR title per line)
     git log --format=%s v1.0.0..HEAD | node scripts/changelog-draft.mjs --heading "1.1.0"
     node scripts/changelog-draft.mjs --heading "1.1.0" --gh krizaka/orazaka --since 2026-10-10   (merged PRs via gh)
   chore / ci / test / docs / refactor lines are housekeeping and left out; `feat!:` and security words are surfaced. */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { draftFromTitles } from "../lib/changelog.ts";

const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const heading = opt("--heading") ?? "Unreleased";
const repo = opt("--gh");

let titles;
if (repo) {
  const since = opt("--since") ?? "1970-01-01";
  const out = execFileSync("gh", ["pr", "list", "-R", repo, "--state", "merged", "--search", `merged:>=${since}`, "--limit", "200", "--json", "title", "--jq", ".[].title"], { encoding: "utf8" });
  titles = out.split("\n");
} else titles = readFileSync(0, "utf8").split("\n");

process.stdout.write(draftFromTitles(titles.map((t) => t.trim()).filter(Boolean), heading));

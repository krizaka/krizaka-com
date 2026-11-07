/* What the public changelog shows (founder, 2026-11-07, krizaka-internal#2832): what a visitor can see — features and visible
   fixes — never the team's internal work (CI, tooling, tests, dependencies, release bumps, schemas). The rule is data
   (content/changelog-public.json): each kind of internal work is a pattern on a line, with its reason; security and breaking
   changes are always kept. scripts/gen-changelog.mjs applies it to every release it reads, so the page, the feed and the build
   check share one list; a release left with nothing to show is dropped. The repositories' CHANGELOG.md stay complete.
   Pure: tests/changelog-public.test.mjs. */

import type { ChangeItem, Release } from "./changelog.ts";

export interface InternalKind {
  id: string;
  why: string;
  pattern: string;
  flags: string;
}

export interface PublicRule {
  keepTags: readonly string[];
  internal: readonly InternalKind[];
}

/** The kind of internal work a line is, or null when a visitor can see it. Security and breaking lines are never internal. */
export function internalKindOf(change: Pick<ChangeItem, "tag" | "text">, rule: PublicRule): string | null {
  if (rule.keepTags.includes(change.tag)) {
    return null;
  }
  return rule.internal.find((k) => new RegExp(k.pattern, k.flags).test(change.text))?.id ?? null;
}

const visible = (changes: readonly ChangeItem[], rule: PublicRule) => changes.filter((c) => !internalKindOf(c, rule));

/** A release with its internal lines out, or null when none is left. The French lines follow the English ones when the
 *  release wrote both in parallel (same count); otherwise each French line is judged on its own. */
export function publicRelease<R extends Pick<Release, "changes" | "fr">>(release: R, rule: PublicRule): R | null {
  const keep = release.changes.map((c) => !internalKindOf(c, rule));
  const changes = release.changes.filter((_, i) => keep[i]);
  if (changes.length === 0) {
    return null;
  }
  const fr = release.fr;
  if (!fr) {
    return { ...release, changes };
  }
  const french = fr.length === release.changes.length ? fr.filter((_, i) => keep[i]) : visible(fr, rule);
  return { ...release, changes, fr: french };
}

/** Every release as the public page shows it, in the same order; the releases left empty are dropped. */
export const publicReleases = <R extends Pick<Release, "changes" | "fr">>(
  releases: readonly R[],
  rule: PublicRule,
): R[] => releases.map((r) => publicRelease(r, rule)).filter((r): r is R => r !== null);

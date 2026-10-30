/* The libraries' roadmap and release notes live on GitHub — one source per fact (#467): the site links the repository's
   Releases and open issues, it never copies a changelog. Pure: tested by tests/open-source-dev.test.mjs. */

import type { StackPart } from "./stack.ts";

const GITHUB = "https://github.com/krizaka/";

/** The contributor's entry point: open issues labelled « good first issue » across the organisation. */
export const GOOD_FIRST_URL = `https://github.com/search?q=${encodeURIComponent('org:krizaka label:"good first issue" state:open')}&type=issues`;

const base = (repoUrl: string | undefined): string | undefined => {
  if (!repoUrl?.startsWith(GITHUB)) {
    return undefined;
  }
  return repoUrl.endsWith("/") ? repoUrl.slice(0, -1) : repoUrl;
};

/** `https://github.com/krizaka/x` → its Releases page; undefined for any other address. */
export const releasesUrl = (repoUrl: string | undefined): string | undefined => base(repoUrl) && `${base(repoUrl)}/releases`;

/** `https://github.com/krizaka/x` → its open issues. */
export const issuesUrl = (repoUrl: string | undefined): string | undefined => base(repoUrl) && `${base(repoUrl)}/issues`;

export interface RoadmapRow {
  id: StackPart["id"];
  name: string;
  issues: string;
  releases: string;
}

/** One row per stack part: where its next work (issues) and its past work (releases) are told. */
export function roadmapLinks(stack: readonly StackPart[]): RoadmapRow[] {
  return stack.flatMap((p) => {
    const issues = issuesUrl(p.repoUrl);
    const releases = releasesUrl(p.repoUrl);
    return issues && releases ? [{ id: p.id, name: p.name, issues, releases }] : [];
  });
}

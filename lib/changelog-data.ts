/* The company changelog and krizaka.com's own version, read at build from lib/changelog.json (written by
   scripts/gen-changelog.mjs from the family's release data; git-ignored). Empty when the sources could not be reached:
   the page then says so rather than inventing a line. A static JSON import: safe in server and client modules alike. */

import snapshot from "./changelog.json";
import { siteReleaseUrl, type Release } from "./changelog";

const data = snapshot as { releases?: Release[]; platform?: { site?: string; release?: string } };

export const RELEASES: readonly Release[] = data.releases ?? [];

/** krizaka.com's own version (package.json, bumped by release-please) and the page of its GitHub release — never the
    versions of the packages it runs on, which belong to a deployment. */
const site = data.platform?.site ?? "";
export const PLATFORM = { site, release: data.platform?.release ?? siteReleaseUrl(site, false) };

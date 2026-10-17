/* The company changelog and the versions the site runs on, read at build from lib/changelog.json (written by
   scripts/gen-changelog.mjs from the family's release data; git-ignored). Empty when the sources could not be reached:
   the page then says so rather than inventing a line. A static JSON import: safe in server and client modules alike. */

import snapshot from "./changelog.json";
import type { Release } from "./changelog";

const data = snapshot as { releases?: Release[]; platform?: { site?: string; ui?: string; tokens?: string } };

export const RELEASES: readonly Release[] = data.releases ?? [];

/** The site's own version and the platform it runs on (`@krizaka/ui`, tokens) — package.json and the installed packages. */
export const PLATFORM = { site: data.platform?.site ?? "", ui: data.platform?.ui ?? "", tokens: data.platform?.tokens ?? "" };

/** The footer's link: the site's version, on the changelog page's anchor of the same name. */
export const changelogHref = (version: string = PLATFORM.site) => (version ? `/changelog#${version}` : "/changelog");

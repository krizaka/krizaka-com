// Every film watch page (lib/watch-films.ts) must be linked from the page a visitor reads: the bar (lib/nav.ts) or a page
// body (the films' timeline and its list of the other films, /story), never only from the footer (krizaka-internal#3909:
// « la page est accessible uniquement du footer »). Run by `npm run lint`; `orphanFilms()` is the pure rule the test shares.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = join(import.meta.dirname, "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const { WATCH_FILMS, watchPath } = await import(pathToFileURL(join(ROOT, "lib", "watch-films.ts")).href);
const { NAV_BAR_LINKS } = await import(pathToFileURL(join(ROOT, "lib", "nav.ts")).href);

/** The ids of the watch pages no bar entry and no page body links. `withoutNav` / `withoutBody` switch a source off (the test's proof that the check bites). */
export function orphanFilms({ withoutNav = false, withoutBody = false } = {}) {
  const bar = withoutNav ? [] : NAV_BAR_LINKS.map((l) => l.href);
  // A body links every film when each film's page renders the timeline, which lists the series and the other films.
  const timeline = read("app/components/FilmsTimeline.tsx");
  const bodyLinksAll =
    !withoutBody &&
    /<FilmsTimeline\b/.test(read("app/[locale]/films/[id]/page.tsx")) &&
    /WATCH_FILMS/.test(timeline) &&
    /watchPath\(/.test(timeline);
  return WATCH_FILMS.filter((f) => !bar.includes(watchPath(f.id)) && !bodyLinksAll).map((f) => f.id);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const orphans = orphanFilms();
  for (const id of orphans) {
    console.error(`✗ films/${id}: linked only from the footer — link it from the bar or a page body`);
  }
  if (orphans.length) {
    process.exit(1);
  }
  console.log(`✓ films: ${WATCH_FILMS.length} watch pages, each linked beyond the footer`);
}

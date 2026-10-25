/* The changelog's data, one shape for every source — pure, no import, tested by tests/changelog.test.mjs.
   Sources: a changesets CHANGELOG.md (the @krizaka packages), a GitHub Release body (the products), conventional PR
   titles (the draft generator, scripts/changelog-draft.mjs). Nothing is hand-written: scripts/gen-changelog.mjs reads
   the sources at build into the git-ignored lib/changelog.json, and /changelog draws it with @krizaka/ui's template.
   The shape is meant to move to @krizaka/ui as the adapter of the changelog template (krizaka/krizaka-ui#307). */

export type ChangeTag = "feature" | "fix" | "security" | "breaking" | "change";

export interface ChangeItem {
  tag: ChangeTag;
  /** Plain user language, markdown links and backticks removed. */
  text: string;
  /** The pull request that made it, when the source names one. */
  pr?: { number: number; url: string };
}

export interface Release {
  /** What was released: `@krizaka/ui`, `Orazaka`. */
  source: string;
  /** The filter it belongs to (`?produit=`): a product id, `ui` or `java`. */
  product: string;
  /** Which repository of a product made of several (`edge` for orazaka-edge); absent for a single-repository product. */
  part?: string;
  version: string;
  /** ISO date, `2026-10-17`. */
  date: string;
  /** The release's page (GitHub release, npm). */
  url?: string;
  /** The changes in English; `fr` the same in French when the release wrote both (else the reader of /fr gets these). */
  changes: ChangeItem[];
  fr?: ChangeItem[];
}

export const CHANGE_TAGS: readonly ChangeTag[] = ["breaking", "security", "feature", "fix", "change"];

const REPO_PR = /https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/(\d+)/;

/** Public text names no one and carries no em dash: the sources are the team's own words, the page is the company's. */
export const PERSONAL_NAMES = ["Oussama", "Abid"] as const;
const NAME = PERSONAL_NAMES.join("|");
const NAME_ASIDE = new RegExp(`\\s*\\([^)]*\\b(?:${NAME})\\b[^)]*\\)`, "gi");

/** A colon says what an em dash says; an aside that names a person is dropped. */
export const cleanText = (s: string): string => s.replace(NAME_ASIDE, "").replace(/\s+—\s+/g, ": ").replace(/—/g, "-");

/** What is still wrong with a public line after `cleanText` (empty = fine): the lint of the generator. */
export function textProblems(text: string): string[] {
  const problems: string[] = [];
  if (text.includes("—")) problems.push("an em dash");
  const name = new RegExp(`\\b(?:${NAME})\\b`, "i").exec(text)?.[0];
  if (name) problems.push(`a personal name (${name})`);
  return problems;
}

/** Every problem of every public line of the releases, as `<release>: <line> has <problem>` (empty = fine). */
export function releaseProblems(releases: readonly Release[]): string[] {
  return releases.flatMap((r) =>
    [...r.changes, ...(r.fr ?? [])].flatMap((c) => textProblems(c.text).map((p) => `${releaseLabel(r)}: "${c.text.slice(0, 60)}" has ${p}`)),
  );
}

/** A line of markdown as a reader reads it: links keep their words, backticks and emphasis go. */
export function plain(md: string): string {
  return cleanText(md)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

/** The tag a sentence deserves when its source does not say (security and breaking words win). */
export function tagOf(text: string, fallback: ChangeTag): ChangeTag {
  if (/\bBREAKING\b|^\w+(\([^)]*\))?!:/.test(text)) return "breaking";
  if (/\b(security|vulnerabilit\w*|CVE-\d+|XSS|CSRF)\b/i.test(text)) return "security";
  return fallback;
}

/** A highlight, not the whole note: the first sentence when it is short enough, else the text cut at a word. */
const clip = (s: string, max = 220) => {
  const first = /^(.{20,}?[.!?])(\s|$)/.exec(s)?.[1];
  if (first && first.length <= max) return first;
  return s.length <= max ? s : `${s.slice(0, max).replace(/\s+\S*$/, "")}…`;
};

/** The first PR a line links to, read from its markdown (`[#293](…/pull/293)`) or a bare URL. */
export function prOf(line: string): ChangeItem["pr"] {
  const url = REPO_PR.exec(line);
  return url ? { number: Number(url[1]), url: url[0] } : undefined;
}

const CHANGESET_TAG: Record<string, ChangeTag> = { major: "breaking", minor: "feature", patch: "fix" };

/** The releases of a changesets CHANGELOG.md, newest first as written. Dates are not in the file: `dateOf(version)`. */
export function parseChangesets(md: string, source: string, dateOf: (version: string) => string | undefined, product = "ui"): Release[] {
  const releases: Release[] = [];
  let current: Release | undefined;
  let level: ChangeTag = "change";
  for (const raw of md.split("\n")) {
    const h2 = /^## (\d+\.\d+\.\d+\S*)\s*$/.exec(raw);
    if (h2) {
      const date = dateOf(h2[1]);
      current = date ? { source, product, version: h2[1], date, changes: [] } : undefined;
      if (current) releases.push(current);
      continue;
    }
    const h3 = /^### (\w+) Changes/.exec(raw);
    if (h3) {
      level = CHANGESET_TAG[h3[1].toLowerCase()] ?? "change";
      continue;
    }
    // top-level bullets only: "Updated dependencies" and its nested list are plumbing, not news
    const bullet = /^- (.+)$/.exec(raw);
    if (!current || !bullet || /^Updated dependencies/.test(bullet[1])) continue;
    const text = plain(bullet[1].replace(/^(\[[^\]]*\]\([^)]*\)\s*)+(Thanks \[[^\]]*\]\([^)]*\)!\s*)?-\s*/, ""));
    if (!text) continue;
    current.changes.push({ tag: tagOf(text, level === "feature" ? "feature" : level), text: clip(text), pr: prOf(bullet[1]) });
  }
  return releases.filter((r) => r.changes.length > 0);
}

const CONVENTIONAL = /^(feat|fix|perf|security|sec|revert|refactor|docs|chore|ci|test|build|style|deps)(\([^)]*\))?(!)?:\s*(.+)$/i;
const TAG_OF_TYPE: Record<string, ChangeTag> = { feat: "feature", fix: "fix", perf: "change", security: "security", sec: "security", revert: "change" };
/** Types that are the team's housekeeping, not news for a reader. */
const QUIET_TYPES = new Set(["refactor", "docs", "chore", "ci", "test", "build", "style", "deps"]);

/** One conventional PR title as a change, or `null` when it is housekeeping (chore, ci, test, docs…). */
export function changeFromTitle(title: string, prUrl?: string): ChangeItem | null {
  const m = CONVENTIONAL.exec(title.trim());
  const type = m?.[1].toLowerCase();
  if (m && type && QUIET_TYPES.has(type) && !m[3]) return null;
  const body = (m ? m[4] : title).replace(/\s*\(#\d+\)\s*$/, "").trim();
  const sentence = plain(body.replace(/^./, (c) => c.toUpperCase()));
  const tag = tagOf(m?.[3] ? `${type}!: ${body}` : sentence, type ? (TAG_OF_TYPE[type] ?? "change") : "change");
  const num = /\(#(\d+)\)\s*$/.exec(title)?.[1];
  const pr = prUrl ? prOf(prUrl) : num ? { number: Number(num), url: "" } : undefined;
  return { tag, text: sentence.replace(/[.\s]*$/, "."), pr };
}

/** A GitHub Release body: bullets (`* feat: … by @x in <PR url>`, `- Fix …`), conventional titles tagged, the rest «change». */
export function parseReleaseBody(body: string): ChangeItem[] {
  const items: ChangeItem[] = [];
  for (const raw of body.split("\n")) {
    const bullet = /^\s*[-*] (.+)$/.exec(raw);
    if (!bullet) continue;
    const line = bullet[1].replace(/\s+by @[\w-]+ in (https:\/\/\S+)\s*$/, " $1");
    const pr = prOf(line);
    const title = line.replace(/\s*https:\/\/\S+\s*$/, "");
    const item = changeFromTitle(plain(title), pr?.url);
    if (item) items.push({ ...item, pr: pr ?? item.pr, text: clip(item.text) });
  }
  return items;
}

const SECTION = /^## (English|Français)\s*$/gm;

/** A release written by the shared workflow (krizaka/.github `release-notes`): `## English` and `## Français` sections,
    each a list of changes. Any other body (GitHub's generated notes, a hand-written one) is read as English alone. */
export function parseReleaseBodies(body: string): { en: ChangeItem[]; fr?: ChangeItem[] } {
  const marks = [...body.matchAll(SECTION)];
  if (!marks.length) return { en: parseReleaseBody(body) };
  const part = (name: string) => {
    const i = marks.findIndex((m) => m[1] === name);
    return i < 0 ? undefined : body.slice(marks[i].index + marks[i][0].length, marks[i + 1]?.index);
  };
  const en = part("English");
  const fr = part("Français");
  return { en: parseReleaseBody(en ?? fr ?? ""), fr: fr === undefined || en === undefined ? undefined : parseReleaseBody(fr) };
}

/** The draft generator: conventional PR titles → a plain-language draft entry (Markdown) for a human or an agent to polish. */
export function draftFromTitles(titles: readonly string[], heading: string): string {
  const groups = new Map<ChangeTag, string[]>();
  for (const title of titles) {
    const item = changeFromTitle(title);
    if (!item) continue;
    groups.set(item.tag, [...(groups.get(item.tag) ?? []), item.pr?.number ? `${item.text} (#${item.pr.number})` : item.text]);
  }
  const names: Record<ChangeTag, string> = { breaking: "Breaking", security: "Security", feature: "New", fix: "Fixed", change: "Changed" };
  const out = [`## ${heading}`];
  for (const tag of CHANGE_TAGS) {
    const lines = groups.get(tag);
    if (lines?.length) out.push("", `### ${names[tag]}`, ...lines.map((l) => `- ${l}`));
  }
  return `${out.join("\n")}\n`;
}

/** Semver-aware, newest first; falls back to the date. */
export function newestFirst(a: Release, b: Release): number {
  return b.date.localeCompare(a.date) || b.version.localeCompare(a.version, undefined, { numeric: true });
}

/** The changes of a release in a language: French when the release wrote it, else the English lines. */
export const changesFor = (r: Pick<Release, "changes" | "fr">, lang: "en" | "fr"): ChangeItem[] => ({ en: r.changes, fr: r.fr ?? r.changes })[lang];

/** What a release is called: `@krizaka/ui 3.22.0`, `Orazaka edge 2026.10.22.1`. */
export const releaseLabel = (r: Pick<Release, "source" | "part" | "version">): string => [r.source, r.part, r.version].filter(Boolean).join(" ");

/** A stable anchor: `krizaka-ui-3-22-0`; the bare version is the anchor of the site's own entry. */
export const anchorOf = (r: Pick<Release, "source" | "part" | "version">): string =>
  releaseLabel(r).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The changelog as an RSS 2.0 feed. `tagLabel` words the tags in the feed's language. */
export function changelogRss(opts: {
  releases: readonly Release[];
  title: string;
  description: string;
  siteUrl: string;
  pageUrl: string;
  feedUrl: string;
  language: string;
  tagLabel: Record<ChangeTag, string>;
  lang: "en" | "fr";
}): string {
  const items = opts.releases
    .map((r) => {
      const list = changesFor(r, opts.lang).map((c) => `<li><b>${esc(opts.tagLabel[c.tag])}</b> ${esc(c.text)}</li>`).join("");
      const link = `${opts.pageUrl}#${anchorOf(r)}`;
      return `<item><title>${esc(releaseLabel(r))}</title><link>${esc(link)}</link><guid isPermaLink="true">${esc(link)}</guid><pubDate>${new Date(`${r.date}T12:00:00Z`).toUTCString()}</pubDate><description>${esc(`<ul>${list}</ul>`)}</description></item>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(opts.title)}</title><link>${esc(opts.pageUrl)}</link><description>${esc(opts.description)}</description><language>${opts.language}</language><atom:link href="${esc(opts.feedUrl)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}

/* krizaka.com's own version (the release train, release-please): package.json, bumped by « chore: release », tagged
   `v<version>` with a GitHub release. The footer links that release once it exists, the releases list before. */
export const SITE_REPO = "krizaka/krizaka-com";

/** The page of the site's release `v<version>` when it is published, else the releases list (never a dead link). */
export const siteReleaseUrl = (version: string, published: boolean): string =>
  version && published ? `https://github.com/${SITE_REPO}/releases/tag/v${version}` : `https://github.com/${SITE_REPO}/releases`;

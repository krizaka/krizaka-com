/* The org's standards (krizaka/.github `docs/standards/`), read at build by scripts/gen-standards.mjs into the
   git-ignored lib/standards.json. The pure rules live here so the generator and the tests share them: the intro of
   ci-and-deploy.md between its markers, a standard's title and summary, the display order, the last-good-copy rule.
   Erasable TypeScript only (the generator imports this file with Node's type stripping). */

export const STANDARDS_REPO = "krizaka/.github";
export const STANDARDS_DIR = "docs/standards";
export const STANDARDS_BLOB = `https://github.com/${STANDARDS_REPO}/blob/main/${STANDARDS_DIR}`;
export const CI_STANDARD = "ci-and-deploy";

/** The most useful first; any standard not listed goes after them, alphabetically. */
export const STANDARDS_ORDER: readonly string[] = [
  "ci-and-deploy",
  "guards",
  "react-effects",
  "repo-layout",
  "dev-preview",
  "bug-means-missing-guard",
  "supply-chain",
  "secrets-and-workflows",
  "rules",
  "local-loop",
  "coding-agents",
  "repositories",
  "default-media",
  "app-videos",
];

export interface Intro {
  paragraphs: string[];
  bullets: string[];
}
export interface Standard {
  id: string;
  title: string;
  summary: string;
  url: string;
}
export interface StandardsSnapshot {
  fetchedAt: string;
  intro: Intro;
  standards: Standard[];
}

/** The text between `<!-- intro:start -->` and `<!-- intro:end -->` (comment markers, spaces tolerated). */
function between(markdown: string, name: string): string | null {
  const open = markdown.indexOf(`<!-- ${name}:start -->`);
  const close = markdown.indexOf(`<!-- ${name}:end -->`);
  if (open === -1 || close === -1 || close < open) return null;
  return markdown.slice(open + `<!-- ${name}:start -->`.length, close);
}

const bulletText = (line: string): string | null => {
  const t = line.trimStart();
  return (t.startsWith("- ") || t.startsWith("* ")) && t.slice(2).trim() ? t.slice(2).trim() : null;
};

/** The intro: paragraphs, then the `- ` list. Null when the markers are missing, reversed or enclose nothing. */
export function extractIntro(markdown: string): Intro | null {
  const inner = between(markdown, "intro");
  if (inner === null) return null;
  const paragraphs: string[] = [];
  const bullets: string[] = [];
  for (const block of inner.split("\n\n")) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const items = lines.map(bulletText);
    if (items.every((i) => i !== null)) bullets.push(...(items as string[]));
    else paragraphs.push(lines.join(" "));
  }
  return paragraphs.length || bullets.length ? { paragraphs, bullets } : null;
}

/** Plain text of a line of Markdown: links keep their label, emphasis and code marks go. */
function stripInline(s: string): string {
  const plain = parseInline(s).map((t) => t.text).join("");
  return plain.split(/\s+/).filter(Boolean).join(" ");
}

const isProse = (block: string): boolean => {
  const first = block[0];
  return !(first === "#" || first === ">" || first === "|" || first === "-" || first === "*" || (first >= "0" && first <= "9") || block.startsWith("```"));
};

/** A standard's card: its title is the first heading (a trailing « (epic #n) » dropped); its summary the
    `<!-- summary: … -->` marker when present, else the first sentence of the first paragraph. Null when either is missing. */
export function describeStandard(markdown: string): { title: string; summary: string } | null {
  const lines = markdown.split("\n");
  const at = lines.findIndex((l) => l.startsWith("# "));
  if (at === -1) return null;
  const heading = stripInline(lines[at].slice(2));
  const cut = heading.lastIndexOf("(epic #");
  const title = (cut === -1 ? heading : heading.slice(0, cut)).trim();
  const body = lines.slice(at + 1).join("\n");
  const mark = body.indexOf("<!-- summary:");
  const markEnd = mark === -1 ? -1 : body.indexOf("-->", mark);
  let summary = mark !== -1 && markEnd !== -1 ? stripInline(body.slice(mark + "<!-- summary:".length, markEnd)) : "";
  if (!summary) {
    const prose = withoutBlocks(withoutBlocks(body, "<!--", "-->"), "```", "```");
    const first = prose.split("\n\n").map((b) => b.trim()).find((b) => b && isProse(b));
    summary = first ? firstSentence(stripInline(first)) : "";
  }
  if (summary.length > 220) summary = `${summary.slice(0, 217).trimEnd()}…`;
  return title && summary ? { title, summary } : null;
}

/** `text` without every `open … close` span. */
function withoutBlocks(text: string, open: string, close: string): string {
  let out = "";
  let from = 0;
  for (let i = text.indexOf(open); i !== -1; i = text.indexOf(open, from)) {
    const end = text.indexOf(close, i + open.length);
    if (end === -1) break;
    out += text.slice(from, i);
    from = end + close.length;
  }
  return out + text.slice(from);
}

/** A card carries one line: the first sentence of at least 30 characters (a `<!-- summary -->` marker says more). */
function firstSentence(text: string): string {
  for (let i = 29; i < text.length; i++) {
    if (".!?".includes(text[i]) && (i === text.length - 1 || text[i + 1] === " ")) return text.slice(0, i + 1);
  }
  return text;
}

/** The ordering list first, then the rest alphabetically by id. */
export function orderStandards<T extends { id: string }>(list: readonly T[], order: readonly string[] = STANDARDS_ORDER): T[] {
  const rank = (id: string) => {
    const i = order.indexOf(id);
    return i === -1 ? order.length : i;
  };
  return [...list].sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));
}

/** A relative link of the intro (`guards.md`) becomes the file on GitHub; absolute links stay. */
export function absolutizeLinks(text: string): string {
  const parts = text.split("](");
  return parts
    .map((part, i) => {
      if (i === 0) return part;
      const absolute = ["http://", "https://", "#", "mailto:"].some((p) => part.startsWith(p));
      if (absolute) return part;
      const file = part.startsWith("./") ? part.slice(2) : part;
      return STANDARDS_BLOB + "/" + file;
    })
    .join("](");
}

export function isUsable(s: StandardsSnapshot | null | undefined): s is StandardsSnapshot {
  return Boolean(s && s.intro?.paragraphs?.length && s.standards?.length);
}

/** The last-good-copy rule: the fresh snapshot, else the previous one, else a loud error — never an empty section. */
export function resolveSnapshot(fresh: StandardsSnapshot | null, previous: StandardsSnapshot | null, reason = ""): StandardsSnapshot {
  if (isUsable(fresh)) return fresh;
  if (isUsable(previous)) return previous;
  const why = reason ? ": " + reason : "";
  throw new Error("krizaka/.github standards could not be read and there is no earlier copy" + why);
}

export type InlineToken = { kind: "text" | "code" | "bold"; text: string } | { kind: "link"; text: string; href: string };

/** The inline form that starts `rest`, with the length it covers; null when none does. */
function inlineAt(rest: string): { token: InlineToken; length: number } | null {
  if (rest[0] === "`") {
    const end = rest.indexOf("`", 1);
    if (end > 1) return { token: { kind: "code", text: rest.slice(1, end) }, length: end + 1 };
  }
  if (rest.startsWith("**")) {
    const end = rest.indexOf("**", 2);
    if (end > 2) return { token: { kind: "bold", text: rest.slice(2, end) }, length: end + 2 };
  }
  if (rest[0] === "[") {
    const label = rest.indexOf("](");
    const close = label === -1 ? -1 : rest.indexOf(")", label);
    const href = close === -1 ? "" : rest.slice(label + 2, close);
    const web = href.startsWith("https://") || href.startsWith("http://");
    if (label > 1 && web && !href.includes(" ")) return { token: { kind: "link", text: rest.slice(1, label), href }, length: close + 1 };
  }
  return null;
}

/** The few inline forms the standards use: `code`, **bold**, [text](https://…). Anything else stays text. */
export function parseInline(text: string): InlineToken[] {
  const out: InlineToken[] = [];
  let plain = "";
  for (let i = 0; i < text.length; ) {
    const hit = inlineAt(text.slice(i));
    if (!hit) {
      plain += text[i];
      i += 1;
      continue;
    }
    if (plain) out.push({ kind: "text", text: plain });
    plain = "";
    out.push(hit.token);
    i += hit.length;
  }
  if (plain) out.push({ kind: "text", text: plain });
  return out;
}

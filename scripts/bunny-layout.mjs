// The layout of the Bunny storage zone (`krizaka-assets`, served by the pull zone krizaka-assets.b-cdn.net) — one place.
// scripts/cdn-assets.mjs, scripts/pr-assets.mjs and krizaka-ui's tools/map-assets.mjs each write under ONE prefix and
// refuse the others; `node scripts/cdn-assets.mjs tree` audits the zone against this file; `... readme` publishes
// LAYOUT_README at the root of the zone (the only file allowed there).

export const README_NAME = "README.txt";

/** The three prefixes of the zone root, who writes them, and what is allowed under them. */
export const ZONE = {
  site: {
    writer: "scripts/cdn-assets.mjs (krizaka-com)",
    path: "site/<area>/<product?>/<kind>/<name>.<hash>.<ext>",
    what: "media shown by krizaka.com — hashed names, recorded in lib/cdn-manifest.json, never overwritten",
  },
  maps: {
    writer: "tools/map-assets.mjs (krizaka-ui)",
    path: "maps/v1/tiles/<region>-<YYYYMMDD>.pmtiles · maps/v1/fonts/<font stack>/<start>-<end>.pbf",
    what: "the basemap of @krizaka/ui/map — Protomaps extracts and glyphs; a new extract is a new dated file",
  },
  "pr-assets": {
    writer: "scripts/pr-assets.mjs (any repository)",
    path: "pr-assets/<repo>/<pr-or-topic>/<file>",
    what: "review evidence linked from PR and issue bodies — screenshots, recordings, metrics; never committed to a repository",
  },
};

/** What `site/` is made of: the first segment of a logical path given to `cdn-assets upload --to`. */
export const SITE_AREAS = {
  home: "home/backdrop/<product>, home/kit-native/<product>-<theme> — the home page",
  products: "products/<product>/{tour,gallery,mobile}/<clip> — recordings and images of a product's own pages",
  docs: "docs/<product>/{mobile,…}/<name> — media of the documentation pages (screenshots, clips, posters)",
  people: "people/<product>/<person>-{256,512}.webp — the demo personas' portraits, shared by the products",
};

export const SITE_AREA_NAMES = Object.keys(SITE_AREAS);

export const LAYOUT_README = `KRIZAKA ASSETS — layout of this storage zone (served by krizaka-assets.b-cdn.net)
Nothing else lives at the root. Each prefix has ONE script that writes it and refuses the others.

${Object.entries(ZONE)
  .map(([prefix, z]) => `${prefix}/\n  ${z.what}\n  ${z.path}\n  written by ${z.writer}`)
  .join("\n\n")}

site/ areas
${Object.entries(SITE_AREAS)
  .map(([area, text]) => `  ${area.padEnd(9)} ${text}`)
  .join("\n")}

Rules
  - site/ files are immutable: <name>.<10 hex of SHA-256>.<ext>. A change is a new file; the superseded one is removed
    by \`node scripts/cdn-assets.mjs prune\`, which keeps anything named by a manifest of main or of an unmerged branch.
  - pr-assets/ is evidence: kept as long as a PR or an issue links it. Delete a whole <repo>/<topic>/ only when nothing
    links it any more.
  - Add a file with the script of its prefix, never by hand. Audit with \`node scripts/cdn-assets.mjs tree\`.
  - Contract: krizaka-com AGENTS.md section 5.2.
`;

/** Appended to the --help of every script that writes the zone. */
export const layoutHelp = () =>
  `\nBunny layout (full text: AGENTS.md §5.2, README.txt at the zone root):\n${Object.entries(ZONE)
    .map(([prefix, z]) => `  ${prefix.padEnd(10)} ${z.path}  — ${z.writer}`)
    .join("\n")}`;

/** Throws unless <path> is under <prefix>/ — the guard every writer calls before a PUT or a DELETE. */
export function assertUnder(prefix, path) {
  if (!path.startsWith(`${prefix}/`) || path.split("/").includes("..")) {
    throw new Error(`${path} is outside ${prefix}/ — this script only writes under ${prefix}/ (see the Bunny layout)`);
  }
  return path;
}

const SITE_FILE = /^site\/(?:[a-z0-9_-]+\/)+[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\.[0-9a-f]{10}\.[a-z0-9]+$/;

/** Why <path> does not belong in the zone, or null. */
export function misplaced(path) {
  const [root, second, third] = path.split("/");
  if (path === README_NAME) return null;
  if (!ZONE[root]) return `unknown root "${root}/" (allowed: ${Object.keys(ZONE).join(", ")}, ${README_NAME})`;
  if (root === "site") {
    if (!SITE_AREA_NAMES.includes(second)) return `site/${second}/ is not an area (${SITE_AREA_NAMES.join(", ")})`;
    if (!SITE_FILE.test(path)) return "not <name>.<hash>.<ext> under site/<area>/…";
  }
  if (root === "maps" && !/^maps\/v1\/(tiles\/[a-z0-9-]+-\d{8}\.pmtiles|fonts\/[A-Za-z0-9 ]+\/\d+-\d+\.pbf)$/.test(path)) {
    return "not maps/v1/tiles/<region>-<YYYYMMDD>.pmtiles or maps/v1/fonts/<stack>/<a>-<b>.pbf";
  }
  if (root === "pr-assets" && (!second || !third || path.split("/").length < 4)) return "not pr-assets/<repo>/<pr-or-topic>/<file>";
  return null;
}

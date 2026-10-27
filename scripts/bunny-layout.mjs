// The layout of the Bunny storage zone (`krizaka-assets`, served by the pull zone krizaka-assets.b-cdn.net) — one place.
// The zone is the media library of Krizaka: browse it by brand, by person, by product. Each script writes under ONE
// prefix and refuses the others (cdn-assets, pr-assets, and krizaka-ui's tools/export-brand.mjs and tools/map-assets.mjs); `node scripts/cdn-assets.mjs tree` audits the zone against this file; `... readme` publishes
// LAYOUT_README at the root of the zone (the only file allowed there).

export const README_NAME = "README.txt";

export const BRANDS = ["krizaka", "orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"];
/** The kinds of media under products/<product>/. */
export const PRODUCT_KINDS = ["home", "tour", "mobile", "gallery", "studios", "docs"];

/** The prefixes of the zone root, who writes them, and what is allowed under them. */
export const ZONE = {
  brand: {
    writer: "tools/export-brand.mjs (krizaka-ui) — generated from @krizaka/ui, never hand-made",
    path: "brand/<krizaka|orazaka|orochia|yasakia|yororis>/{logo,mark}-{dark,light}[-256|512|1024].{svg,png} · avatar-{500,1024}.png · social-preview-1280x640.png · brand/manifest.json",
    what: "the logos and marks of the family: SVG, PNG on transparent (dark and light variants), account avatar, social preview — stable names, always the latest",
  },
  people: {
    writer: "tools/export-brand.mjs (krizaka-ui) for defaults/ · scripts/cdn-assets.mjs library (krizaka-com) for personas/",
    path: "people/defaults/v1/<brand>/{person,plain}-<1-6>{.svg,-256.webp,-512.webp} · people/personas/<product>/<name>-{256,512}.webp",
    what: "profile pictures: the default avatars a product shows when a person has no photo (generated, versioned by folder), and the demo personas' portraits",
  },
  defaults: {
    writer: "tools/export-defaults.mjs (krizaka-ui) — generated from @krizaka/ui and the founder's set, never hand-made",
    path: "defaults/v1/<person|folder|organisation|shop>/<id>-{256,512,1024}.webp (+ <id>.svg when drawn) · defaults/v1/banner/<id>-{960,1920}.webp · defaults/v1/manifest.json",
    what: "the central default pictures of the family (people, folders, organisations, shops, banners), versioned by folder (a changed picture is v2; v1 keeps serving). Their catalogue — ids, alt EN/FR, URLs — is the `defaults` section of the Krizaka org JSON (@krizaka/org); an app reads the URLs from there, never hard-codes one",
  },
  products: {
    writer: "scripts/cdn-assets.mjs library (krizaka-com) — a readable mirror of what the products serve",
    path: "products/<product>/{home,tour,mobile,gallery,studios,docs}/<name>.<ext>",
    what: "the media of each product — loops, tours, screenshots, posters — under human names, to browse and download. The pages load the hashed copies of site/, not these",
  },
  site: {
    writer: "scripts/cdn-assets.mjs (krizaka-com)",
    path: "site/<area>/<product?>/<kind>/<name>.<hash>.<ext>",
    what: "media loaded by the pages — hashed names, recorded in lib/cdn-manifest.json, never overwritten; URLs published packages still use stay valid",
  },
  discovery: {
    writer: "scripts/sign-services.mjs --publish (krizaka-com) — the signed manifest, never hand-made",
    path: "discovery/services.json",
    what: "the fallback copy of https://www.krizaka.com/.well-known/krizaka/services.json (ADR-003): the mobile apps read it when the www app is down — the same signed document, overwritten on each signing, short cache",
  },
  ui: {
    writer: "krizaka-ui (docs site and Storybook media)",
    path: "ui/<area>/<name>.<hash>.<ext>",
    what: "media of ui.krizaka.com: the map previews, the landing kit",
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

/**
 * Prefixes of site/ written by ANOTHER writer than cdn-assets (one writer per prefix): `prune` never lists or deletes
 * under them, since their objects are not named by this site's manifest. The product sites name their own media
 * (dev.orazaka.com, dev.orochia.com, dev.yasakia.com — its demo recordings under site/products/yasakia/tour/; dev.yomizaka.com,
 * dev.akinaza.com, dev.kachizaka.com and dev.yororis.com — their landing recordings under site/products/<product>/tour/, named
 * in each repository's lib/tour.ts); Orazaka's generated clips (gallery-video/, video/) come from its GPU batch;
 * blog.krizaka.com names its images in krizaka-blog's lib/media.json.
 */
export const FOREIGN_WRITERS = [
  "site/products/orazaka/",
  "site/products/orochia/",
  "site/products/yasakia/",
  "site/products/yomizaka/",
  "site/products/akinaza/",
  "site/products/kachizaka/",
  // Yororis' gallery is still named by this site's manifest: only the landing's recordings are another writer's.
  "site/products/yororis/tour/",
  "site/blog/",
];

/** Folders of the zone that are retired (a renamed product): `cdn-assets prune --retired` deletes them once main no longer names them. */
export const RETIRED = [/^site\/(?:people|products)\/yazakia\//];

/**
 * Where a hashed file of site/ is mirrored in the browsable library, or null when it has no place there.
 * `home/backdrop/orazaka.mp4` → `products/orazaka/home/backdrop.mp4`; `people/ui/ada-256.webp` → `people/personas/ui/ada-256.webp`.
 */
export function libraryPath(logical) {
  // Orochia has its own storage zone and Stream library: its media are never mirrored in this zone (krizaka/orochia#153).
  if (logical.split("/").includes("orochia") || /(^|\/)orochia[-.]/.test(logical)) return null;
  const parts = logical.split("/");
  const [area, a, b] = parts;
  const product = (id) => (id === "yazakia" ? "yasakia" : id);
  if (area === "people" && parts.length === 3) return a === "yazakia" ? null : `people/personas/${a}/${b}`;
  if (area === "products" && parts.length >= 4 && PRODUCT_KINDS.includes(b)) return a === "yazakia" ? `products/yasakia/${parts.slice(2).join("/")}` : logical;
  if (area === "docs" && parts.length >= 3) return `products/${product(a)}/docs/${parts.slice(2).join("/")}`;
  if (area === "home" && a === "backdrop" && parts.length === 3) {
    const [name, ...ext] = b.split(".");
    return `products/${product(name)}/home/backdrop.${ext.join(".")}`;
  }
  if (area === "home" && a === "kit-native" && parts.length === 3) {
    const m = /^([a-z]+)-(dark|light)\.(.+)$/.exec(b);
    return m ? `products/${product(m[1])}/home/kit-native-${m[2]}.${m[3]}` : null;
  }
  return null;
}

/** What `site/` is made of: the first segment of a logical path given to `cdn-assets upload --to`. */
export const SITE_AREAS = {
  home: "home/backdrop/<product>, home/kit-native/<product>-<theme> — the home page",
  products: "products/<product>/{tour,gallery,gallery-video,video,mobile}/<clip> — recordings, images and Orazaka-made videos (.mp4 · .webm · -poster.webp) of a product",
  docs: "docs/<product>/{mobile,…}/<name> — media of the documentation pages (screenshots, clips, posters)",
  people: "people/<product>/<person>-{256,512}.webp — the demo personas' portraits, shared by the products (mirrored in people/personas/)",
  blog: "blog/<post>/<name> — the images of a post of blog.krizaka.com (cover, figures); posts name them by CDN URL, the blog repository never commits media",
  "brand-films": "brand-films/{loops,film}/<name> — the films of the flock, rendered from the code by krizaka-ui tools/brand-films (one loop per bird, « Le monde de Krizaka »); loaded by krizaka.com /story, ui.krizaka.com's brand page and the products' sites",
};

export const SITE_AREA_NAMES = Object.keys(SITE_AREAS);

export const LAYOUT_README = `KRIZAKA ASSETS — layout of this storage zone (served by krizaka-assets.b-cdn.net)
Nothing else lives at the root. Each prefix has ONE script that writes it and refuses the others.

${Object.entries(ZONE)
  .map(([prefix, z]) => `${prefix}/\n  ${z.what}\n  ${z.path}\n  written by ${z.writer}`)
  .join("\n\n")}

Brands: ${BRANDS.join(" · ")}. (Yasakia was called Yazakia: the old names are retired.)

site/ areas
${Object.entries(SITE_AREAS)
  .map(([area, text]) => `  ${area.padEnd(9)} ${text}`)
  .join("\n")}

Orochia has its own storage zone (orochia-dev) and Stream library: its new media do not go in this zone. Plan: move
site/products/orochia and the Orochia personas there (steps: krizaka/orochia issue "Move Orochia's media to its own zone").
Until then they stay where they are under site/ (not mirrored in products/ or people/personas/).

Rules
  - brand/, people/defaults/ and defaults/ are generated from the code of @krizaka/ui: change the component, run the export, never upload by hand.
  - Default media URLs (avatars, banners, logos) come from the Krizaka org JSON (org/v1/org.json), never hard-coded or bundled in an app.
  - products/ and people/personas/ are a mirror of site/ (node scripts/cdn-assets.mjs library): browse here, load from site/.  - site/ files are immutable: <name>.<10 hex of SHA-256>.<ext>. A change is a new file; the superseded one is removed
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

/** The defaults' manifest, and a default picture: `<kind>/<id>-<size>.webp` or `<kind>/<id>.svg` (two patterns, each readable at a glance). */
const DEFAULTS_MANIFEST = /^defaults\/v\d+\/manifest\.json$/;
const DEFAULTS_FILE = /^defaults\/v\d+\/(person|folder|organisation|shop|banner)\/[a-z0-9]+(-[a-z0-9]+)*(\.svg|-\d+\.webp)$/;
const SITE_FILE = /^site\/(?:[a-z0-9_-]+\/)+[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\.[0-9a-f]{10}\.[a-z0-9]+$/;
const FILE = "[A-Za-z0-9._-]+";
const brandAlt = BRANDS.join("|");

/** Why <path> does not belong in the zone, or null. */
export function misplaced(path) {
  const [root, second, third] = path.split("/");
  if (path === README_NAME) return null;
  if (!ZONE[root]) return `unknown root "${root}/" (allowed: ${Object.keys(ZONE).join(", ")}, ${README_NAME})`;
  if (root === "site") {
    if (!SITE_AREA_NAMES.includes(second)) return `site/${second}/ is not an area (${SITE_AREA_NAMES.join(", ")})`;
    if (!SITE_FILE.test(path)) return "not <name>.<hash>.<ext> under site/<area>/…";
  }
  if (root === "brand" && !new RegExp(`^brand/(manifest\\.json|(${brandAlt})/${FILE})$`).test(path)) return `not brand/<${brandAlt}>/<file> or brand/manifest.json`;
  if (root === "people" && !new RegExp(`^people/(defaults/v1/(manifest\\.json|(${brandAlt})/${FILE})|personas/[a-z0-9-]+/${FILE})$`).test(path)) {
    return "not people/defaults/v1/<brand>/<file> or people/personas/<product>/<file>";
  }
  if (root === "defaults" && !DEFAULTS_MANIFEST.test(path) && !DEFAULTS_FILE.test(path)) {
    return "not defaults/v<n>/<person|folder|organisation|shop|banner>/<id>-<size>.webp (or <id>.svg) or defaults/v<n>/manifest.json";
  }
  if (root === "products" && !new RegExp(`^products/(${brandAlt})/(${PRODUCT_KINDS.join("|")})/(${FILE}/)*${FILE}$`).test(path)) {
    return `not products/<${brandAlt}>/<${PRODUCT_KINDS.join("|")}>/<file>`;
  }
  if (root === "discovery" && path !== "discovery/services.json") return "not discovery/services.json";
  if (root === "ui" && path.split("/").length < 3) return "not ui/<area>/<file>";
  if (root === "maps" && !/^maps\/v1\/(tiles\/[a-z0-9-]+-\d{8}\.pmtiles|fonts\/[A-Za-z0-9 ]+\/\d+-\d+\.pbf)$/.test(path)) {
    return "not maps/v1/tiles/<region>-<YYYYMMDD>.pmtiles or maps/v1/fonts/<stack>/<a>-<b>.pbf";
  }
  if (root === "pr-assets" && (!second || !third || path.split("/").length < 4)) return "not pr-assets/<repo>/<pr-or-topic>/<file>";
  return null;
}

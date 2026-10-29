// The layout of the Bunny storage zone (`krizaka-assets`, served by the pull zone krizaka-assets.b-cdn.net) — one place.
// The zone is the media library of Krizaka: browse it by brand, by person, by product. Each script writes under ONE
// prefix and refuses the others (cdn-assets, pr-assets, and krizaka-ui's tools/export-brand.mjs and tools/map-assets.mjs); `node scripts/cdn-assets.mjs tree` audits the zone against this file; `... readme` publishes
// LAYOUT_README at the root of the zone (the only file allowed there).

export const README_NAME = "README.txt";

export const BRANDS = ["krizaka", "orazaka", "yomizaka", "akinaza"];
/** The kinds of media under products/<product>/. */
export const PRODUCT_KINDS = ["home", "tour", "mobile", "gallery", "studios", "docs"];

/** The LEGACY folders (before layout v2): still served while something names them, never written again. `targetOf` maps each object. */
export const ZONE = {
  brand: { target: "org/v1/brand/", path: "brand/<brand>/<file> · brand/{manifest,index}.json", what: "the marks of the family (export-brand)" },
  defaults: { target: "org/v1/defaults/", path: "defaults/v1/<kind>/<id>-<size>.webp · defaults/v1/manifest.json", what: "the default pictures of the org JSON (export-defaults)" },
  people: {
    target: "org/v1/defaults/tones/ (people/defaults/) · deleted when unused (people/personas/, the retired mirror)",
    path: "people/defaults/v1/<brand>/<file> · people/personas/<site>/<file>",
    what: "the generated avatar tones of @krizaka/ui, and the human-name mirror of the personas",
  },
  maps: { target: "org/v1/maps/", path: "maps/v1/{tiles,fonts}/…", what: "the basemap of @krizaka/ui/map (map-assets)" },
  discovery: { target: "org/v1/discovery/", path: "discovery/services.json", what: "the signed services manifest (ADR-003)" },
  site: {
    target: "sites/<site>/<kind>/ · org/v1/films/ · apps/akinaza/defaults/",
    path: "site/<area>/<product?>/<kind>/<name>.<hash>.<ext>",
    what: "the media the pages load (cdn-assets and the product sites), hashed",
  },
  ui: { target: "sites/ui/", path: "ui/<area>/<name>.<hash>.<ext>", what: "media of ui.krizaka.com" },
  products: { target: "none — the retired human-name mirror of site/, deleted when unused", path: "products/<product>/<kind>/<name>.<ext>", what: "a browsable copy of site/" },
};

/**
 * Prefixes of site/ written by ANOTHER writer than cdn-assets (one writer per prefix): `prune` never lists or deletes
 * under them, since their objects are not named by this site's manifest. The product sites name their own media
 * (dev.orazaka.com, dev.yomizaka.com and dev.akinaza.com — their landing recordings under site/products/<product>/tour/, named
 * in each repository's lib/tour.ts); Orazaka's generated clips (gallery-video/, video/) come from its GPU batch;
 * blog.krizaka.com names its images in krizaka-blog's lib/media.json.
 */
export const FOREIGN_WRITERS = [
  "site/products/orazaka/",
  "site/products/yomizaka/",
  "site/products/akinaza/",
  "site/blog/",
];

/** The same writers' folders in layout v2: prune never deletes under them either. */
export const FOREIGN_WRITERS_V2 = ["sites/orazaka/", "sites/yomizaka/", "sites/akinaza/", "apps/akinaza/", "sites/blog/"];

/** Folders of the zone that are retired (a departed or renamed product): `cdn-assets prune --retired` deletes them once main no longer names them. */
export const RETIRED = [/^site\/(?:people|products|docs)\/(?:yazakia|yasakia|orochia|yororis|kachizaka)\//, /^site\/brand-films\/orochia\//];

/**
 * Where a hashed file of site/ is mirrored in the browsable library, or null when it has no place there.
 * `home/backdrop/orazaka.mp4` → `products/orazaka/home/backdrop.mp4`; `people/ui/ada-256.webp` → `people/personas/ui/ada-256.webp`.
 */
export function libraryPath(logical) {
  const parts = logical.split("/");
  const [area, a, b] = parts;
  if (area === "people" && parts.length === 3) return `people/personas/${a}/${b}`;
  if (area === "products" && parts.length >= 4 && PRODUCT_KINDS.includes(b)) return logical;
  if (area === "docs" && parts.length >= 3) return `products/${a}/docs/${parts.slice(2).join("/")}`;
  if (area === "home" && a === "backdrop" && parts.length === 3) {
    const [name, ...ext] = b.split(".");
    return `products/${name}/home/backdrop.${ext.join(".")}`;
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

// ── THE TARGET LAYOUT v2 (ADR-014 as amended, 2026-10-28) ───────────────────────────────────────────────────────────
// « org est la racine de tout ce qui appartient à Krizaka, notre maison mère : elle offre les valeurs par défaut ; puis les
// sites, chacun ses données ; enfin les applications, seulement quand une app lit ou stocke des données à elle. »

/** The version folder of the org's CDN: compatible changes only; a breaking one is v2, published beside v1. */
export const ORG_VERSION = "v1";
/** No object of org/, sites/ or apps/ sits under more than this many folders. */
export const MAX_FOLDERS = 5;
const PRODUCTS = BRANDS.filter((b) => b !== "krizaka");
/** One folder per public site: krizaka.com, the blog, ui.krizaka.com, java.krizaka.com and each product's dev site. */
export const SITES = ["www", "blog", "ui", "java", ...PRODUCTS];
/** One folder per application that reads or stores media of its own at runtime (uploads, generated, its own defaults). */
export const APPS = PRODUCTS;
/** What the org's CDN holds, one generator each. */
export const ORG_PARTS = {
  json: "org.json · org.<hash>.json · org.schema[.<hash>].json · app.schema[.<hash>].json · apps/<app>[.<hash>].json — @krizaka/org scripts/publish.mjs (krizaka-ts)",
  defaults: "defaults/<person|banner|shop|folder|organisation>/<id>-<size>.webp (or <id>.svg) · defaults/tones/<brand>/<file> (the generated tones of @krizaka/ui's Avatar) · defaults/manifest.json — tools/export-defaults.mjs, tools/export-brand.mjs (krizaka-ui)",
  brand: "brand/<brand>/<file> · brand/{manifest,index}.json — tools/export-brand.mjs (krizaka-ui)",
  maps: "maps/tiles/<region>-<YYYYMMDD>.pmtiles · maps/fonts/<stack>/<a>-<b>.pbf — tools/map-assets.mjs (krizaka-ui)",
  films: "films/<series>/<name>.<hash>.<ext> — the films of the flock (krizaka-ui tools/brand-films), uploaded by scripts/cdn-assets.mjs",
  discovery: "discovery/services.json — scripts/sign-services.mjs --publish (krizaka-com), ADR-003",
};
/** The kinds of a site's media (`sites/<site>/<kind>/…`): what the files are for, never who wrote them. */
export const SITE_KINDS = ["home", "tour", "gallery", "gallery-video", "video", "cinema", "compare", "showcase", "web", "mobile", "docs", "personas", "download", "demo", "demo-stories", "films", "posts", "shared", "landing", "maps", "shop"];
/** The kinds of an app's own media (`apps/<app>/<kind>/…`). */
export const APP_KINDS = ["defaults", "uploads", "generated"];

/** The four roots of the target layout, in reading order: the org, the sites, the apps, the evidence. */
export const TARGET = {
  org: {
    writer: "the generator of each part (listed above) — never a hand upload",
    path: `org/${ORG_VERSION}/{org.json,apps,defaults,brand,maps,films,discovery}/…`,
    what: "THE ORG — Krizaka's own data, the values every site and app reads by default: the org JSON and each app's config (@krizaka/org), the default pictures (ADR-011) and avatar tones, the marks, the basemap, the films, the discovery manifest:\n    " + Object.values(ORG_PARTS).join("\n    "),
  },
  sites: {
    writer: "scripts/cdn-assets.mjs (krizaka-com: www) and each site's own media script (its repository names its files)",
    path: "sites/<site>/<kind>/[<sub>/…]<name>.<hash>.<ext>",
    what: `THE SITES — what one public site shows (${SITES.join(" · ")}): home, tour, gallery, video, mobile, docs, personas, download, demo, films; the blog's posts under posts/<post>/. Hashed, immutable`,
  },
  apps: {
    writer: "the application itself (its media script or its runtime) — only when it reads or stores media of its own",
    path: "apps/<app>/<defaults|uploads|generated>/[<sub>/…]<name>.<hash>.<ext>",
    what: `THE APPLICATIONS — runtime data of one app (${APPS.join(" · ")}): its own default art, what its users upload, what it generates`,
  },
  "pr-assets": {
    writer: "scripts/pr-assets.mjs (any repository)",
    path: "pr-assets/<repo>/<pr-or-topic>/<file>",
    what: "review evidence linked from PR and issue bodies — screenshots, recordings, metrics; never committed to a repository",
  },
};

/** The sub-issue of krizaka/.github#368 whose PR switches the readers and writers of a legacy folder (then it is pruned). */
export const SWITCH_ISSUES = [
  [/^site\/blog\//, "krizaka/krizaka-blog#176"],
  [/^site\/(?:products|docs|people)\/akinaza\//, "krizaka/akinaza#493"],
  [/^site\/(?:products|docs|people)\/yomizaka\//, "krizaka/yomizaka#494"],
  [/^site\/(?:products|docs|people)\/orazaka\//, "krizaka/orazaka-web-client#320"],
  [/^site\/people\/ui\/|^ui\/|^maps\/|^brand\/|^site\/brand-films\//, "krizaka/krizaka-ui#817"],
  [/^people\/personas\/ui\//, "krizaka/krizaka-ui#817"],
  [/^defaults\/|^people\/defaults\//, "krizaka/krizaka-ts#200"],
  [/^site\/|^discovery\//, "krizaka/krizaka-com#450"],
];
/** The switch sub-issue of a legacy path, or null (a target path, or a retired folder: nothing to switch, only to prune). */
export const switchIssue = (path) => SWITCH_ISSUES.find(([re]) => re.test(path))?.[1] ?? null;

export const LAYOUT_README = `KRIZAKA ASSETS — layout of this storage zone (served by krizaka-assets.b-cdn.net)
Decision: krizaka/.github docs/adr/ADR-014-bunny-org-cdn-and-apps.md (layout v2). Each prefix has ONE script that writes it
and refuses the others. Nothing else sits at the root.

TARGET LAYOUT — four roots, at most ${MAX_FOLDERS} folders deep: the org, then the sites, then the applications, then the evidence
${Object.entries(TARGET)
  .map(([prefix, z]) => `${prefix}/\n  ${z.what}\n  ${z.path}\n  written by ${z.writer}`)
  .join("\n\n")}

Sites: ${SITES.join(" · ")}. Apps: ${APPS.join(" · ")}. Brands: ${BRANDS.join(" · ")}.

LEGACY FOLDERS — still served only while a published package or a live site names them; copied to the target by
\`node scripts/cdn-assets.mjs migrate\`, never written again, deleted (\`cdn-assets purge-unused\`) once nothing names them.

${Object.entries(ZONE)
  .map(([prefix, z]) => `${prefix}/  →  ${z.target}\n  ${z.what}`)
  .join("\n\n")}

Rules
  - org/ is generated from the code (@krizaka/ui, @krizaka/org): change the component, run the export, never upload by hand.
  - Default media URLs (avatars, banners, logos) come from the Krizaka org JSON (org/v1/org.json), never hard-coded.
  - sites/ and apps/ files are immutable: <name>.<10 hex of SHA-256>.<ext>. A change is a new file; the superseded one is
    removed by \`node scripts/cdn-assets.mjs prune\`, which keeps anything named by a manifest of main or of an unmerged branch.
  - A new write outside the target layout fails (assertWritable).
  - pr-assets/ is evidence: kept as long as a PR or an issue links it.
  - Audit with \`node scripts/cdn-assets.mjs tree\`; browse with the cockpit (scripts/bunny-tree.mjs).
  - Contract: krizaka-com AGENTS.md section 5.2.
`;

/** Appended to the --help of every script that writes the zone. */
export const layoutHelp = () =>
  `\nBunny layout v2 (full text: AGENTS.md §5.2, README.txt at the zone root):\n${Object.entries(TARGET)
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

/** Per legacy root: why <path> does not fit it, or null. */
const LEGACY_RULES = {
  site: (path, [, area]) => {
    if (!SITE_AREA_NAMES.includes(area)) return `site/${area}/ is not an area (${SITE_AREA_NAMES.join(", ")})`;
    return SITE_FILE.test(path) ? null : "not <name>.<hash>.<ext> under site/<area>/…";
  },
  brand: (path) =>
    new RegExp(String.raw`^brand/((manifest|index)\.json|(${brandAlt})/${FILE})$`).test(path) ? null : `not brand/<${brandAlt}>/<file> or brand/{manifest,index}.json`,
  people: (path) =>
    new RegExp(String.raw`^people/(defaults/v1/(manifest\.json|(${brandAlt})/${FILE})|personas/[a-z0-9-]+/${FILE})$`).test(path)
      ? null
      : "not people/defaults/v1/<brand>/<file> or people/personas/<product>/<file>",
  defaults: (path) =>
    DEFAULTS_MANIFEST.test(path) || DEFAULTS_FILE.test(path)
      ? null
      : "not defaults/v<n>/<person|folder|organisation|shop|banner>/<id>-<size>.webp (or <id>.svg) or defaults/v<n>/manifest.json",
  products: (path) =>
    new RegExp(`^products/(${brandAlt})/(${PRODUCT_KINDS.join("|")})/(${FILE}/)*${FILE}$`).test(path) ? null : `not products/<${brandAlt}>/<${PRODUCT_KINDS.join("|")}>/<file>`,
  discovery: (path) => (path === "discovery/services.json" ? null : "not discovery/services.json"),
  ui: (path, parts) => (parts.length < 3 ? "not ui/<area>/<file>" : null),
  maps: (path) =>
    /^maps\/v1\/(tiles\/[a-z0-9-]+-\d{8}\.pmtiles|fonts\/[A-Za-z0-9 ]+\/\d+-\d+\.pbf)$/.test(path) ? null : "not maps/v1/tiles/<region>-<YYYYMMDD>.pmtiles or maps/v1/fonts/<stack>/<a>-<b>.pbf",
  "pr-assets": (path, parts) => (parts.length < 4 || !parts[1] || !parts[2] ? "not pr-assets/<repo>/<pr-or-topic>/<file>" : null),
};

/** Why <path> does not belong in the LEGACY layout (the roots of `ZONE`, still served while they migrate), or null. */
function legacyMisplaced(path) {
  const parts = path.split("/");
  if (path === README_NAME) return null;
  const rule = ZONE[parts[0]] ? LEGACY_RULES[parts[0]] : undefined;
  if (!rule) return `unknown root "${parts[0]}/" (allowed: ${Object.keys(ZONE).join(", ")}, ${README_NAME})`;
  return rule(path, parts);
}

// ── Placement: ok (target), legacy (old layout, with its target), misplaced ─────────────────────────────────────────

const HASHED = String.raw`[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\.[0-9a-f]{10}\.[a-z0-9]+`;
const ORG_FILE = new RegExp(
  [
    String.raw`(?:org|org\.schema|app\.schema)(?:\.[0-9a-f]{10})?\.json`,
    String.raw`apps/[a-z0-9-]+(?:\.[0-9a-f]{10})?\.json`,
    String.raw`defaults/manifest\.json`,
    String.raw`defaults/(?:person|folder|organisation|shop|banner)/[a-z0-9]+(?:-[a-z0-9]+)*(?:\.svg|-\d+\.webp)`,
    String.raw`defaults/tones/manifest\.json`,
    `defaults/tones/(?:${brandAlt})/${FILE}`,
    String.raw`brand/(?:manifest|index)\.json`,
    `brand/(?:${brandAlt})/${FILE}`,
    String.raw`maps/tiles/[a-z0-9-]+-\d{8}\.pmtiles`,
    String.raw`maps/fonts/[A-Za-z0-9 ]+/\d+-\d+\.pbf`,
    `films/[a-z0-9-]+/(?:[a-z0-9-]+/)?${HASHED}`,
    String.raw`discovery/services\.json`,
  ].map((p) => `(?:${p})`).join("|"),
);
const SITE_OBJECT = new RegExp(`^sites/(?:${SITES.join("|")})/(?:${SITE_KINDS.join("|")})/(?:[a-z0-9_-]+/)*${HASHED}$`);
const APP_OBJECT = new RegExp(`^apps/(?:${APPS.join("|")})/(?:${APP_KINDS.join("|")})/(?:[a-z0-9_-]+/)*${HASHED}$`);

/** Why <path> does not belong in the TARGET layout, or null. */
export function targetMisplaced(path) {
  const parts = path.split("/");
  const [root] = parts;
  if (path === README_NAME) return null;
  if (!TARGET[root]) return `unknown root "${root}/" (target: ${Object.keys(TARGET).join(", ")})`;
  if (root !== "pr-assets" && parts.length - 1 > MAX_FOLDERS) return `deeper than ${MAX_FOLDERS} folders`;
  if (root === "org") {
    const m = /^org\/v\d+\/(.+)$/.exec(path);
    if (!m || !new RegExp(`^(?:${ORG_FILE.source})$`).test(m[1])) return `not org/v<n>/<${Object.keys(ORG_PARTS).join("|")}>/… (see ORG_PARTS)`;
  }
  if (root === "sites" && !SITE_OBJECT.test(path)) return `not sites/<${SITES.join("|")}>/<${SITE_KINDS.join("|")}>/…/<name>.<hash>.<ext>`;
  if (root === "apps" && !APP_OBJECT.test(path)) return `not apps/<${APPS.join("|")}>/<${APP_KINDS.join("|")}>/…/<name>.<hash>.<ext>`;
  if (root === "pr-assets" && parts.length < 4) return "not pr-assets/<repo>/<pr-or-topic>/<file>";
  return null;
}

/**
 * Where a LEGACY object goes in the target layout, or null when it has none (the retired mirror, a renamed product):
 * `brand/orazaka/mark-dark.svg` → `org/v1/brand/orazaka/mark-dark.svg`,
 * `site/products/akinaza/tour/a.<hash>.mp4` → `sites/akinaza/tour/a.<hash>.mp4`.
 */
export function targetOf(path) {
  if (RETIRED.some((re) => re.test(path))) return null;
  for (const [re, to] of TARGET_OF) {
    const m = re.exec(path);
    if (m) return to(m);
  }
  return null; // products/ and people/personas/: the retired mirror (ADR-014)
}

const ORG = `org/${ORG_VERSION}`;
const PRODUCT = `(${PRODUCTS.join("|")})`;
/** The legacy → target rules of `targetOf`, first match wins. */
const TARGET_OF = [
  [/^defaults\/v1\/(.+)$/, (m) => `${ORG}/defaults/${m[1]}`],
  [/^people\/defaults\/v1\/(.+)$/, (m) => `${ORG}/defaults/tones/${m[1]}`],
  [/^maps\/v1\/(.+)$/, (m) => `${ORG}/maps/${m[1]}`],
  [/^brand\/(.+)$/, (m) => `${ORG}/brand/${m[1]}`],
  [/^discovery\/(.+)$/, (m) => `${ORG}/discovery/${m[1]}`],
  [/^ui\/(.+)$/, (m) => `sites/ui/${m[1]}`],
  [/^site\/home\/(.+)$/, (m) => `sites/www/home/${m[1]}`],
  [/^site\/blog\/shared\/(.+)$/, (m) => `sites/blog/shared/${m[1]}`],
  [/^site\/blog\/(.+)$/, (m) => `sites/blog/posts/${m[1]}`],
  // Akinaza's trade art is what the app shows a shop without a photo, at runtime: the app's own defaults.
  [/^site\/products\/akinaza\/defaults\/(.+)$/, (m) => `apps/akinaza/defaults/${m[1]}`],
  [new RegExp(`^site/products/${PRODUCT}/(.+)$`), (m) => `sites/${m[1]}/${m[2]}`],
  [new RegExp(`^site/docs/${PRODUCT}/(.+)$`), (m) => `sites/${m[1]}/docs/${m[2]}`],
  [/^site\/people\/ui\/(.+)$/, (m) => `sites/ui/personas/${m[1]}`],
  [new RegExp(`^site/people/${PRODUCT}/(.+)$`), (m) => `sites/${m[1]}/personas/${m[2]}`],
  [/^site\/brand-films\/(.+)$/, (m) => `${ORG}/films/${m[1]}`],
];

/** Why a legacy object has no target (shown by the audit). */
export function frozenReason(path) {
  if (path.startsWith("products/") || path.startsWith("people/personas/")) return "retired: the human-name mirror of site/ (ADR-014 §1), deleted once nothing names it";
  if (RETIRED.some((re) => re.test(path))) return "retired: a departed or renamed product";
  return null;
}

/**
 * The state of an object: `ok` (target layout), `legacy` (a valid object of an old folder, still served, with its
 * `target` or the reason it has none, and its switch `issue`) or `misplaced` (`why`). The audit fails on misplaced, and
 * on legacy with --strict.
 */
export function placement(path) {
  if (path === README_NAME || TARGET[path.split("/")[0]]) {
    const why = targetMisplaced(path);
    return why ? { state: "misplaced", why } : { state: "ok" };
  }
  const why = legacyMisplaced(path);
  if (why) return { state: "misplaced", why };
  const target = targetOf(path);
  if (target) {
    const bad = targetMisplaced(target);
    if (bad) return { state: "misplaced", why: `its target ${target} would be misplaced: ${bad}` };
  }
  return { state: "legacy", target, why: target ? undefined : frozenReason(path), issue: switchIssue(path) };
}

/** Why <path> does not belong in the zone (neither the target layout nor a valid legacy object), or null. */
export function misplaced(path) {
  const p = placement(path);
  return p.state === "misplaced" ? p.why : null;
}

/** Throws unless <path> is in the TARGET layout — every writer calls it before a PUT: a new write outside v2 fails. */
export function assertWritable(path) {
  const why = targetMisplaced(path);
  if (why || path.split("/").includes("..")) throw new Error(`${path} is outside the Bunny layout v2 (${why ?? "'..'"}) — new files go under ${Object.keys(TARGET).join("/, ")}/ only`);
  return path;
}

/**
 * The object of a site manifest entry (`lib/cdn-manifest.json`: a logical path and its hash). `root: "site"` is the
 * legacy form (old branches); any other root is layout v2: `home/backdrop/a.mp4` → `sites/www/home/backdrop/a.<hash>.mp4`.
 */
export function manifestObject(root, logical, hash, versionedPath) {
  const legacy = `site/${versionedPath(logical, hash)}`;
  if (root === "site") return legacy;
  const target = targetOf(legacy);
  if (!target) throw new Error(`${logical} has no place in the Bunny layout v2 (site/ area unknown)`);
  return target;
}

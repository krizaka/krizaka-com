// WHY  The Bunny storage zone (`krizaka-assets`, served by the pull zone krizaka-assets.b-cdn.net) has ONE layout, and its
//      facts (products, brand folders, kinds, roots, README) must be readable as data, apart from the code that checks paths.
// WHAT The constants of the layout: products, brand folders, the legacy ZONE, the target roots (org · sites · apps · pr-assets),
//      the legacy → switch-issue table and the README published at the root of the zone. No function checks a path here.
// HOW  Imported (through scripts/bunny-layout.mjs, the one entry point); nothing to run. Tests: tests/bunny-layout*.test.mjs.
// OWNER krizaka-com (lane platform). Contract: AGENTS.md §5.2, ADR-014.
//
// The zone is the media library of Krizaka: browse it by brand, by person, by product. Each script writes under ONE
// prefix and refuses the others (cdn-assets, pr-assets, and krizaka-ui's tools/export-brand.mjs and tools/map-assets.mjs);
// `node scripts/cdn-assets.mjs tree` audits the zone against this file; `... readme` publishes LAYOUT_README at the root
// of the zone (the only file allowed there).

export const README_NAME = "README.txt";

/** The products, by commercial name (founder, 2026-11-06, krizaka-internal#2659): one site folder and one app folder each. */
export const PRODUCTS = ["sovkora", "verikora", "folioviv"];
/** The legacy folders (site/products/<code>/…) and org/v1/brand/ still carry the code name each product was written under. */
export const LEGACY_PRODUCT = Object.freeze({ orazaka: "sovkora", yomizaka: "verikora", akinaza: "folioviv" });
/** The brand folders of org/v1/brand/ (krizaka-ui's export-brand): the company, the products and Kridoc (marks, no site, no
    app), by commercial name; the code-name folders stay valid until krizaka-ui's commercial-id major re-exports them and
    nothing names the old ones (krizaka-internal#2659). */
export const BRAND_FOLDERS = ["krizaka", ...PRODUCTS, "kridoc", ...Object.keys(LEGACY_PRODUCT), "kachizaka"];
/** The kinds of media under products/<product>/. */
export const PRODUCT_KINDS = ["home", "tour", "mobile", "gallery", "studios", "docs"];

/** The LEGACY folders (before layout v2): still served while something names them, never written again. `targetOf` maps each object. */
export const ZONE = {
  brand: {
    target: "org/v1/brand/",
    path: "brand/<brand>/<file> · brand/{manifest,index}.json",
    what: "the marks of the family (export-brand)",
  },
  defaults: {
    target: "org/v1/defaults/",
    path: "defaults/v1/<kind>/<id>-<size>.webp · defaults/v1/manifest.json",
    what: "the default pictures of the org JSON (export-defaults)",
  },
  people: {
    target: "org/v1/defaults/tones/ (people/defaults/) · deleted when unused (people/personas/, the retired mirror)",
    path: "people/defaults/v1/<brand>/<file> · people/personas/<site>/<file>",
    what: "the generated avatar tones of @krizaka/ui, and the human-name mirror of the personas",
  },
  maps: {
    target: "org/v1/maps/",
    path: "maps/v1/{tiles,fonts}/…",
    what: "the basemap of @krizaka/ui/map (map-assets)",
  },
  discovery: {
    target: "org/v1/discovery/",
    path: "discovery/services.json",
    what: "the signed services manifest (ADR-003)",
  },
  site: {
    target: "sites/<site>/<kind>/ · org/v1/films/ · apps/folioviv/defaults/",
    path: "site/<area>/<product?>/<kind>/<name>.<hash>.<ext>",
    what: "the media the pages load (cdn-assets and the product sites), hashed",
  },
  ui: { target: "sites/ui/", path: "ui/<area>/<name>.<hash>.<ext>", what: "media of ui.krizaka.com" },
  products: {
    target: "none — the retired human-name mirror of site/, deleted when unused",
    path: "products/<product>/<kind>/<name>.<ext>",
    what: "a browsable copy of site/",
  },
};

/**
 * Prefixes of site/ written by ANOTHER writer than cdn-assets (one writer per prefix): `prune` never lists or deletes
 * under them, since their objects are not named by this site's manifest. The product sites name their own media
 * (dev.sovkora.com, dev.verikora.com and dev.folioviv.com — their landing recordings under site/products/<code name>/tour/, named
 * in each repository's lib/tour.ts); Sovkora's generated clips (gallery-video/, video/) come from its GPU batch;
 * blog.krizaka.com names its images in krizaka-blog's lib/media.json.
 */
export const FOREIGN_WRITERS = [
  "site/products/orazaka/",
  "site/products/yomizaka/",
  "site/products/akinaza/",
  "site/blog/",
];

/** The same writers' folders in layout v2: prune never deletes under them either. */
export const FOREIGN_WRITERS_V2 = [
  "sites/sovkora/",
  "sites/verikora/",
  "sites/folioviv/",
  "apps/folioviv/",
  // Their folders under the code names, legacy since 2026-11-06 (`renamedTarget`): never pruned here, purged once nothing names them.
  ...Object.keys(LEGACY_PRODUCT).map((code) => `sites/${code}/`),
  "apps/akinaza/",
  "sites/blog/",
  // krizaka-ui writes its own examples, maps and demo shop here; its published packages name them by hashed URL (krizaka-internal#1953).
  "sites/ui/",
];

/** Folders of the zone that are retired (a departed or renamed product): `cdn-assets prune --retired` deletes them once main no longer names them. */
export const RETIRED = Object.freeze(
  /** @type {RegExp[]} */ (
    [
      // Empty: the folders of the products that left the org are deleted from the zone by the CTO (krizaka/.github#413), and no
      // file of this repository names them. A renamed product's old v2 folder is not retired: it is legacy (`renamedTarget`).
    ]
  ),
);

/** A product folder written under its code name before the renames of 2026-11-06 maps to its commercial name. */
export const productOf = (folder) => LEGACY_PRODUCT[folder] ?? folder;

export const SITE_AREAS = {
  home: "home/backdrop/<product>, home/kit-native/<product>-<theme> — the home page",
  products:
    "products/<product>/{tour,gallery,gallery-video,video,mobile}/<clip> — recordings, images and Sovkora-made videos (.mp4 · .webm · -poster.webp) of a product",
  docs: "docs/<product>/{mobile,…}/<name> — media of the documentation pages (screenshots, clips, posters)",
  people:
    "people/<product>/<person>-{256,512}.webp — the demo personas' portraits, shared by the products (mirrored in people/personas/)",
  blog: "blog/<post>/<name> — the images of a post of blog.krizaka.com (cover, figures); posts name them by CDN URL, the blog repository never commits media",
  "brand-films":
    "brand-films/{loops,film}/<name> — the films of the flock, rendered from the code by krizaka-ui tools/brand-films (one loop per bird, « Le monde de Krizaka »); loaded by krizaka.com /story, ui.krizaka.com's brand page and the products' sites",
};

export const SITE_AREA_NAMES = Object.keys(SITE_AREAS);

// ── THE TARGET LAYOUT v2 (ADR-014 as amended, 2026-10-28) ───────────────────────────────────────────────────────────
// « org est la racine de tout ce qui appartient à Krizaka, notre maison mère : elle offre les valeurs par défaut ; puis les
// sites, chacun ses données ; enfin les applications, seulement quand une app lit ou stocke des données à elle. »

/** The version folder of the org's CDN: compatible changes only; a breaking one is v2, published beside v1. */
export const ORG_VERSION = "v1";
/** No object of org/, sites/ or apps/ sits under more than this many folders. */
export const MAX_FOLDERS = 5;
/** One folder per public site: krizaka.com, the blog, ui.krizaka.com, java.krizaka.com and each product's dev site. */
export const SITES = ["www", "blog", "ui", "java", ...PRODUCTS];
/** One folder per application that reads or stores media of its own at runtime (uploads, generated, its own defaults). */
export const APPS = PRODUCTS;
/** What the org's CDN holds, one generator each. */
export const ORG_PARTS = {
  json: "org.json · org.<hash>.json · org.schema[.<hash>].json · app.schema[.<hash>].json · apps/<app>[.<hash>].json — @krizaka/org scripts/publish.mjs (krizaka-ts)",
  defaults:
    "defaults/<person|banner|shop|folder|organisation>/<id>-<size>.webp (or <id>.svg) · defaults/tones/<brand>/<file> (the generated tones of @krizaka/ui's Avatar) · defaults/manifest.json — tools/export-defaults.mjs, tools/export-brand.mjs (krizaka-ui)",
  brand: "brand/<brand>/<file> · brand/{manifest,index}.json — tools/export-brand.mjs (krizaka-ui)",
  maps: "maps/tiles/<region>-<YYYYMMDD>.pmtiles · maps/fonts/<stack>/<a>-<b>.pbf — tools/map-assets.mjs (krizaka-ui)",
  films:
    "films/<series>/<name>.<hash>.<ext> — the films of the flock (krizaka-ui tools/brand-films), uploaded by scripts/cdn-assets.mjs",
  discovery: "discovery/services.json — scripts/sign-services.mjs --publish (krizaka-com), ADR-003",
};
/** The kinds of a site's media (`sites/<site>/<kind>/…`): what the files are for, never who wrote them. */
export const SITE_KINDS = [
  "home",
  "tour",
  "gallery",
  "gallery-video",
  "video",
  "cinema",
  "compare",
  "showcase",
  "web",
  "mobile",
  "docs",
  "personas",
  "download",
  "demo",
  "demo-stories",
  "films",
  "posts",
  "shared",
  "landing",
  "maps",
  "shop",
  "first-client",
];
/** The kinds of an app's own media (`apps/<app>/<kind>/…`). */
export const APP_KINDS = ["defaults", "uploads", "generated"];

/** The four roots of the target layout, in reading order: the org, the sites, the apps, the evidence. */
export const TARGET = {
  org: {
    writer: "the generator of each part (listed above) — never a hand upload",
    path: `org/${ORG_VERSION}/{org.json,apps,defaults,brand,maps,films,discovery}/…`,
    what:
      "THE ORG — Krizaka's own data, the values every site and app reads by default: the org JSON and each app's config (@krizaka/org), the default pictures (ADR-011) and avatar tones, the marks, the basemap, the films, the discovery manifest:\n    " +
      Object.values(ORG_PARTS).join("\n    "),
  },
  sites: {
    writer:
      "scripts/cdn-assets.mjs (krizaka-com: www) and each site's own media script (its repository names its files)",
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

/** The folders of site/ that carry one product: its commercial name and the code name a legacy object was written under. */
const siteFolders = (code) => ["products", "docs", "people"].map((kind) => `site/${kind}/${code}/`);

/**
 * The sub-issue of krizaka/.github#368 whose PR switches the readers and writers of a legacy folder (then it is pruned),
 * as data: each row is the path prefixes it owns and its issue. The first row that owns a path wins.
 */
export const SWITCH_ISSUES = [
  [["site/blog/"], "krizaka/krizaka-blog#176"],
  [Object.keys(LEGACY_PRODUCT).flatMap((code) => [`sites/${code}/`, `apps/${code}/`]), "krizaka/krizaka-internal#2659"],
  [siteFolders("akinaza"), "krizaka/folioviv#493"],
  [siteFolders("yomizaka"), "krizaka/verikora#494"],
  [siteFolders("orazaka"), "krizaka/krizaka-internal#1274"],
  [["site/people/ui/", "ui/", "maps/", "brand/", "site/brand-films/", "people/personas/ui/"], "krizaka/krizaka-ui#817"],
  [["defaults/", "people/defaults/"], "krizaka/krizaka-ts#200"],
  [["site/", "discovery/"], "krizaka/krizaka-com#450"],
];
/** The switch sub-issue of a legacy path, or null (a target path, or a retired folder: nothing to switch, only to prune). */
export const switchIssue = (path) =>
  SWITCH_ISSUES.find(([prefixes]) => prefixes.some((prefix) => path.startsWith(prefix)))?.[1] ?? null;

export const LAYOUT_README = `KRIZAKA ASSETS — layout of this storage zone (served by krizaka-assets.b-cdn.net)
Decision: krizaka/.github docs/adr/ADR-014-bunny-org-cdn-and-apps.md (layout v2). Each prefix has ONE script that writes it
and refuses the others. Nothing else sits at the root.

TARGET LAYOUT — four roots, at most ${MAX_FOLDERS} folders deep: the org, then the sites, then the applications, then the evidence
${Object.entries(TARGET)
  .map(([prefix, z]) => `${prefix}/\n  ${z.what}\n  ${z.path}\n  written by ${z.writer}`)
  .join("\n\n")}

Sites: ${SITES.join(" · ")}. Apps: ${APPS.join(" · ")}. Brands: ${BRAND_FOLDERS.join(" · ")}.

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

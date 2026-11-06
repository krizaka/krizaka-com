// WHY  Every script that writes the Bunny zone (cdn-assets, pr-assets, krizaka-ui's exports) asks the same question first:
//      « does this object belong in the layout? ». One entry point answers it, so the rule lives in one place.
// WHAT The functions of the layout: where a legacy object goes (`targetOf`), whether a path is in place (`placement`,
//      `misplaced`, `assertWritable`, `assertUnder`), its browsable library path and the site manifest's object. The facts
//      are in bunny-layout-data.mjs, the shapes of a path in bunny-layout-grammar.mjs; both are re-exported here.
// HOW  Imported by the Bunny scripts; nothing to run. `node scripts/cdn-assets.mjs tree` audits the zone with it.
//      Tests: tests/bunny-layout*.test.mjs (npm test).
// OWNER krizaka-com (lane platform). Contract: AGENTS.md §5.2, ADR-014.

import {
  APP_KINDS,
  APPS,
  BRAND_FOLDERS,
  LEGACY_PRODUCT,
  MAX_FOLDERS,
  ORG_PARTS,
  ORG_VERSION,
  PRODUCT_KINDS,
  PRODUCTS,
  README_NAME,
  RETIRED,
  SITE_AREA_NAMES,
  SITE_KINDS,
  SITES,
  TARGET,
  ZONE,
  productOf,
  switchIssue,
} from "./bunny-layout-data.mjs";
import {
  KIT_NATIVE,
  isAppObject,
  isHashedSiteFile,
  isLegacyBrandFile,
  isLegacyDefaultPicture,
  isLegacyPeopleFile,
  isLegacyProductFile,
  isMapFile,
  isDefaultsManifest,
  isOrgFile,
  isSiteObject,
  orgRest,
} from "./bunny-layout-grammar.mjs";

export * from "./bunny-layout-data.mjs";

/** Splits `head/rest` at the first slash, or null when the path has no rest. */
const splitHead = (path) => {
  const slash = path.indexOf("/");
  return slash > 0 && slash < path.length - 1 ? [path.slice(0, slash), path.slice(slash + 1)] : null;
};

/**
 * The v2 folders written under a product's code name before the renames of 2026-11-06 (krizaka-internal#2659) are LEGACY:
 * `cdn-assets migrate` copies them to the commercial folder, the readers switch, then `purge-unused` deletes them.
 * `sites/orazaka/home/a.<hash>.mp4` → `sites/sovkora/home/a.<hash>.mp4`; null for any other path.
 */
export function renamedTarget(path) {
  const [root, afterRoot] = splitHead(path) ?? [];
  if (root !== "sites" && root !== "apps") {
    return null;
  }
  const [code, rest] = splitHead(afterRoot) ?? [];
  return Object.hasOwn(LEGACY_PRODUCT, code) ? `${root}/${LEGACY_PRODUCT[code]}/${rest}` : null;
}

/**
 * Where a hashed file of site/ is mirrored in the browsable library, or null when it has no place there.
 * `home/backdrop/sovkora.mp4` → `products/sovkora/home/backdrop.mp4`; `people/ui/ada-256.webp` → `people/personas/ui/ada-256.webp`.
 */
export function libraryPath(logical) {
  const parts = logical.split("/");
  const [area, a, b] = parts;
  if (area === "people" && parts.length === 3) {
    return `people/personas/${a}/${b}`;
  }
  if (area === "products" && parts.length >= 4 && PRODUCT_KINDS.includes(b)) {
    return logical;
  }
  if (area === "docs" && parts.length >= 3) {
    return `products/${a}/docs/${parts.slice(2).join("/")}`;
  }
  if (area === "home" && a === "backdrop" && parts.length === 3) {
    const [name, ...ext] = b.split(".");
    return `products/${name}/home/backdrop.${ext.join(".")}`;
  }
  if (area === "home" && a === "kit-native" && parts.length === 3) {
    const m = KIT_NATIVE.exec(b);
    return m ? `products/${productOf(m[1])}/home/kit-native-${m[2]}.${m[3]}` : null;
  }
  return null;
}

/** Throws unless <path> is under <prefix>/ — the guard every writer calls before a PUT or a DELETE. */
export function assertUnder(prefix, path) {
  if (!path.startsWith(`${prefix}/`) || path.split("/").includes("..")) {
    throw new Error(`${path} is outside ${prefix}/ — this script only writes under ${prefix}/ (see the Bunny layout)`);
  }
  return path;
}

// ── The LEGACY layout: one rule per old root, each returns why the path does not fit it, or null ───────────────────

const brandAlt = BRAND_FOLDERS.join("|");
const siteAreas = SITE_AREA_NAMES.join(", ");

const LEGACY_RULES = {
  site: (path, parts) => {
    const area = parts[1];
    // Render candidates are transient and named by their run, not hashed: scripts/bunny-retention.mjs deletes them after 30 days.
    if (area === "renders") {
      return parts.length >= 4 ? null : "not site/renders/<run>/<file>";
    }
    if (!SITE_AREA_NAMES.includes(area)) {
      return `site/${area}/ is not an area (${siteAreas})`;
    }
    return isHashedSiteFile(parts) ? null : "not <name>.<hash>.<ext> under site/<area>/…";
  },
  brand: (path, parts) =>
    isLegacyBrandFile(parts) ? null : `not brand/<${brandAlt}>/<file> or brand/{manifest,index}.json`,
  people: (path, parts) =>
    isLegacyPeopleFile(parts) ? null : "not people/defaults/v1/<brand>/<file> or people/personas/<product>/<file>",
  defaults: (path, parts) =>
    isDefaultsManifest(parts) || isLegacyDefaultPicture(parts)
      ? null
      : "not defaults/v<n>/<person|folder|organisation|shop|banner>/<id>-<size>.webp (or <id>.svg) or defaults/v<n>/manifest.json",
  products: (path, parts) =>
    isLegacyProductFile(parts) ? null : `not products/<${brandAlt}>/<${PRODUCT_KINDS.join("|")}>/<file>`,
  discovery: (path) => (path === "discovery/services.json" ? null : "not discovery/services.json"),
  ui: (path, parts) => (parts.length < 3 ? "not ui/<area>/<file>" : null),
  maps: (path, parts) =>
    isMapFile(parts) ? null : "not maps/v1/tiles/<region>-<YYYYMMDD>.pmtiles or maps/v1/fonts/<stack>/<a>-<b>.pbf",
  "pr-assets": (path, parts) =>
    parts.length < 4 || !parts[1] || !parts[2] ? "not pr-assets/<repo>/<pr-or-topic>/<file>" : null,
};

/** Why <path> does not belong in the LEGACY layout (the roots of `ZONE`, still served while they migrate), or null. */
function legacyMisplaced(path) {
  const parts = path.split("/");
  if (path === README_NAME) {
    return null;
  }
  const rule = ZONE[parts[0]] ? LEGACY_RULES[parts[0]] : undefined;
  if (!rule) {
    return `unknown root "${parts[0]}/" (allowed: ${Object.keys(ZONE).join(", ")}, ${README_NAME})`;
  }
  return rule(path, parts);
}

// ── Placement: ok (target), legacy (old layout, with its target), misplaced ─────────────────────────────────────────

/** Why <path> does not belong in the TARGET layout, or null. */
export function targetMisplaced(path) {
  const parts = path.split("/");
  const [root] = parts;
  if (path === README_NAME) {
    return null;
  }
  if (!TARGET[root]) {
    return `unknown root "${root}/" (target: ${Object.keys(TARGET).join(", ")})`;
  }
  if (root !== "pr-assets" && parts.length - 1 > MAX_FOLDERS) {
    return `deeper than ${MAX_FOLDERS} folders`;
  }
  if (root === "org") {
    const rest = orgRest(parts);
    if (!rest || !isOrgFile(rest)) {
      return `not org/v<n>/<${Object.keys(ORG_PARTS).join("|")}>/… (see ORG_PARTS)`;
    }
  }
  if (root === "sites" && !isSiteObject(parts)) {
    return `not sites/<${SITES.join("|")}>/<${SITE_KINDS.join("|")}>/…/<name>.<hash>.<ext>`;
  }
  if (root === "apps" && !isAppObject(parts)) {
    return `not apps/<${APPS.join("|")}>/<${APP_KINDS.join("|")}>/…/<name>.<hash>.<ext>`;
  }
  if (root === "pr-assets" && parts.length < 4) {
    return "not pr-assets/<repo>/<pr-or-topic>/<file>";
  }
  return null;
}

// ── Where a legacy object goes: the rules of `targetOf`, first match wins ──────────────────────────────────────────

const ORG = `org/${ORG_VERSION}`;
/** The folders of a product in site/: its commercial name, or the code name a legacy object was written under. */
const PRODUCT_FOLDERS = [...PRODUCTS, ...Object.keys(LEGACY_PRODUCT)];

/** `from…` → `to…`: what follows the prefix is kept, and must not be empty. */
const moved = (from, to) => (path) =>
  path.startsWith(from) && path.length > from.length ? `${to}${path.slice(from.length)}` : null;

/** `<from><product>/…` → `sites/<commercial name>/<kind>…`, for any product folder (commercial or code name). */
const movedPerProduct = (from, kind) => (path) => {
  if (!path.startsWith(from)) {
    return null;
  }
  const [folder, rest] = splitHead(path.slice(from.length)) ?? [];
  return PRODUCT_FOLDERS.includes(folder) ? `sites/${productOf(folder)}/${kind}${rest}` : null;
};

const TARGET_OF = [
  moved("defaults/v1/", `${ORG}/defaults/`),
  moved("people/defaults/v1/", `${ORG}/defaults/tones/`),
  moved("maps/v1/", `${ORG}/maps/`),
  moved("brand/", `${ORG}/brand/`),
  moved("discovery/", `${ORG}/discovery/`),
  moved("ui/", "sites/ui/"),
  moved("site/home/", "sites/www/home/"),
  moved("site/blog/shared/", "sites/blog/shared/"),
  moved("site/blog/", "sites/blog/posts/"),
  // Folioviv's trade art is what the app shows a shop without a photo, at runtime: the app's own defaults.
  moved("site/products/akinaza/defaults/", "apps/folioviv/defaults/"),
  moved("site/products/folioviv/defaults/", "apps/folioviv/defaults/"),
  movedPerProduct("site/products/", ""),
  movedPerProduct("site/docs/", "docs/"),
  moved("site/people/ui/", "sites/ui/personas/"),
  movedPerProduct("site/people/", "personas/"),
  moved("site/brand-films/", `${ORG}/films/`),
];

/**
 * Where a LEGACY object goes in the target layout, or null when it has none (the retired mirror, a renamed product):
 * `brand/krizaka/mark-dark.svg` → `org/v1/brand/krizaka/mark-dark.svg`,
 * `site/products/akinaza/tour/a.<hash>.mp4` → `sites/folioviv/tour/a.<hash>.mp4` (a legacy code-name folder lands under the product).
 */
export function targetOf(path) {
  if (RETIRED.some((re) => re.test(path))) {
    return null;
  }
  const renamed = renamedTarget(path);
  if (renamed) {
    return renamed;
  }
  for (const rule of TARGET_OF) {
    const target = rule(path);
    if (target) {
      return target;
    }
  }
  return null; // products/ and people/personas/: the retired mirror (ADR-014)
}

/** Why a legacy object has no target (shown by the audit). */
export function frozenReason(path) {
  if (path.startsWith("products/") || path.startsWith("people/personas/")) {
    return "retired: the human-name mirror of site/ (ADR-014 §1), deleted once nothing names it";
  }
  if (RETIRED.some((re) => re.test(path))) {
    return "retired: a departed or renamed product";
  }
  return null;
}

/**
 * The state of an object: `ok` (target layout), `legacy` (a valid object of an old folder, still served, with its
 * `target` or the reason it has none, and its switch `issue`) or `misplaced` (`why`). The audit fails on misplaced, and
 * on legacy with --strict.
 */
export function placement(path) {
  const renamed = renamedTarget(path);
  if (renamed) {
    const bad = targetMisplaced(renamed);
    return bad
      ? { state: "misplaced", why: `its target ${renamed} would be misplaced: ${bad}` }
      : { state: "legacy", target: renamed, issue: switchIssue(path) };
  }
  if (RETIRED.some((re) => re.test(path))) {
    return { state: "legacy", target: null, why: frozenReason(path), issue: switchIssue(path) };
  }
  if (path === README_NAME || TARGET[path.split("/")[0]]) {
    const why = targetMisplaced(path);
    return why ? { state: "misplaced", why } : { state: "ok" };
  }
  const why = legacyMisplaced(path);
  if (why) {
    return { state: "misplaced", why };
  }
  const target = targetOf(path);
  if (target) {
    const bad = targetMisplaced(target);
    if (bad) {
      return { state: "misplaced", why: `its target ${target} would be misplaced: ${bad}` };
    }
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
  if (why || path.split("/").includes("..")) {
    throw new Error(
      `${path} is outside the Bunny layout v2 (${why ?? "'..'"}) — new files go under ${Object.keys(TARGET).join("/, ")}/ only`,
    );
  }
  return path;
}

/**
 * The object of a site manifest entry (`lib/cdn-manifest.json`: a logical path and its hash). `root: "site"` is the
 * legacy form (old branches); any other root is layout v2: `home/backdrop/a.mp4` → `sites/www/home/backdrop/a.<hash>.mp4`.
 */
export function manifestObject(root, logical, hash, versionedPath) {
  const legacy = `site/${versionedPath(logical, hash)}`;
  if (root === "site") {
    return legacy;
  }
  const target = targetOf(legacy);
  if (!target) {
    throw new Error(`${logical} has no place in the Bunny layout v2 (site/ area unknown)`);
  }
  return target;
}

// WHY  « Is this object name in the Bunny layout? » used to be answered by a dozen regexes, one of them 714 characters
//      long, built from lists. A path is a list of segments: each segment is checked by a small named pattern, and each
//      word list stays a list.
// WHAT The named parts (one small regex per kind of segment) and the shapes of the objects, as functions of the path's
//      segments (`path.split("/")`). Every shape returns true or false; the messages stay with the callers.
// HOW  Imported by scripts/bunny-layout.mjs; nothing to run. One test per part: tests/bunny-layout-grammar.test.mjs.
// OWNER krizaka-com (lane platform), ADR-026 phase D.

import { APP_KINDS, APPS, BRAND_FOLDERS, PRODUCT_KINDS, SITE_KINDS, SITES } from "./bunny-layout-data.mjs";

// ── The named parts: one segment each ───────────────────────────────────────────────────────────────────────────────

/** `abc-def`, `a-1-b`: lowercase words joined by single dashes (a default picture's id). */
export const DASHED_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** `quebec-2026`, `-a-`: lowercase letters, digits and dashes, in any order (a series, a region, an app). */
export const DASH_WORD = /^[a-z0-9-]+$/;
/** `home`, `my_dir`: lowercase letters, digits, dash and underscore (a folder of a site). */
export const FOLDER = /^[a-z0-9_-]+$/;
/** `mark-dark.svg`, `Ada.v2.PNG`: any file name made of letters, digits, dot, dash and underscore. */
export const FILE = /^[A-Za-z0-9._-]+$/;
/** `name.<10 hex of SHA-256>.<ext>`: an immutable object, `tour-a.1.3f2a9c1b7e.mp4`. */
export const HASHED_FILE = /^[a-z0-9_-]+(?:\.[a-z0-9_-]+)*\.[0-9a-f]{10}\.[a-z0-9]+$/;
/** `v1`, `v12`: a version folder. */
export const VERSION = /^v\d+$/;
/** `ada-256.webp` or `folder-2.svg`: a default picture (a sized webp, or an svg). */
export const DEFAULT_PICTURE = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.svg|-\d+\.webp)$/;
/** `org.json`, `org.0123456789.json`, `org.schema.json`, `app.schema.<hash>.json`: the org JSON files. */
export const ORG_JSON = /^(?:org|org\.schema|app\.schema)(?:\.[0-9a-f]{10})?\.json$/;
/** `sovkora.json`, `sovkora.<hash>.json`: the config of one app. */
export const APP_JSON = /^[a-z0-9-]+(?:\.[0-9a-f]{10})?\.json$/;
/** `quebec-20261012.pmtiles`: a basemap region and the day it was cut. */
export const TILES_FILE = /^[a-z0-9-]+-\d{8}\.pmtiles$/;
/** `Noto Sans Regular`: the folder of one font stack (spaces allowed). */
export const FONT_STACK = /^[A-Za-z0-9 ]+$/;
/** `0-255.pbf`: one range of glyphs. */
export const FONT_RANGE = /^\d+-\d+\.pbf$/;
/** `orazaka-dark.mp4`: a kit-native recording, `<product>-<theme>.<ext>`. */
export const KIT_NATIVE = /^([a-z]+)-(dark|light)\.(.+)$/;

const is = (re, segment) => segment !== undefined && re.test(segment);
const all = (re, segments) => segments.every((segment) => re.test(segment));

// ── The shapes of the legacy folders (`parts` = the path split on "/") ─────────────────────────────────────────────

/** `site/<dir>/…/<name>.<hash>.<ext>`: at least one folder, then a hashed file. */
export const isHashedSiteFile = (parts) =>
  parts[0] === "site" && parts.length >= 3 && all(FOLDER, parts.slice(1, -1)) && is(HASHED_FILE, parts.at(-1));

/** `brand/{manifest,index}.json` or `brand/<brand>/<file>`. */
export const isLegacyBrandFile = (parts) =>
  parts[0] === "brand" &&
  ((parts.length === 2 && ["manifest.json", "index.json"].includes(parts[1])) ||
    (parts.length === 3 && BRAND_FOLDERS.includes(parts[1]) && is(FILE, parts[2])));

/** `people/defaults/v1/{manifest.json,<brand>/<file>}` or `people/personas/<product>/<file>`. */
export const isLegacyPeopleFile = (parts) => {
  if (parts[0] !== "people") {
    return false;
  }
  if (parts[1] === "defaults") {
    return (
      parts[2] === "v1" &&
      ((parts.length === 4 && parts[3] === "manifest.json") ||
        (parts.length === 5 && BRAND_FOLDERS.includes(parts[3]) && is(FILE, parts[4])))
    );
  }
  return parts[1] === "personas" && parts.length === 4 && is(DASH_WORD, parts[2]) && is(FILE, parts[3]);
};

/** `defaults/v<n>/manifest.json`. */
export const isDefaultsManifest = (parts) =>
  parts.length === 3 && parts[0] === "defaults" && is(VERSION, parts[1]) && parts[2] === "manifest.json";

export const DEFAULT_KINDS = ["person", "folder", "organisation", "shop", "banner"];
/** `<kind>/<id>-<size>.webp` or `<kind>/<id>.svg` below a version folder. */
const isDefaultPicture = (kind, name) => DEFAULT_KINDS.includes(kind) && is(DEFAULT_PICTURE, name);
/** `defaults/v<n>/<kind>/<picture>`. */
export const isLegacyDefaultPicture = (parts) =>
  parts.length === 4 && parts[0] === "defaults" && is(VERSION, parts[1]) && isDefaultPicture(parts[2], parts[3]);

/** `products/<brand>/<kind>/<file>…`: the retired human-name mirror. */
export const isLegacyProductFile = (parts) =>
  parts[0] === "products" &&
  parts.length >= 4 &&
  BRAND_FOLDERS.includes(parts[1]) &&
  PRODUCT_KINDS.includes(parts[2]) &&
  all(FILE, parts.slice(3));

/** `maps/v1/tiles/<region>-<YYYYMMDD>.pmtiles` or `maps/v1/fonts/<stack>/<a>-<b>.pbf`. */
export const isMapFile = (parts) => {
  const [, version, kind] = parts;
  if (parts[0] !== "maps" || version !== "v1") {
    return false;
  }
  if (kind === "tiles") {
    return parts.length === 4 && is(TILES_FILE, parts[3]);
  }
  return kind === "fonts" && parts.length === 5 && is(FONT_STACK, parts[3]) && is(FONT_RANGE, parts[4]);
};

// ── The shapes of the target layout ────────────────────────────────────────────────────────────────────────────────

/** `org/v<n>/<rest>`: the rest below the version folder, or null when the path is not under a version. */
export function orgRest(parts) {
  if (parts[0] !== "org" || !is(VERSION, parts[1])) {
    return null;
  }
  const rest = parts.slice(2);
  return rest.join("/") === "" ? null : rest;
}

/** `defaults/<kind>/<picture>` and `defaults/tones/…`, below org/v<n>/. */
const isOrgDefaults = (rest) => {
  if (rest[0] !== "defaults") {
    return false;
  }
  if (rest[1] === "tones") {
    return (
      (rest.length === 3 && rest[2] === "manifest.json") ||
      (rest.length === 4 && BRAND_FOLDERS.includes(rest[2]) && is(FILE, rest[3]))
    );
  }
  return (
    (rest.length === 2 && rest[1] === "manifest.json") || (rest.length === 3 && isDefaultPicture(rest[1], rest[2]))
  );
};

/** `films/<series>/[<sub>/]<name>.<hash>.<ext>`. */
const isOrgFilm = (rest) =>
  rest[0] === "films" &&
  (rest.length === 3 || rest.length === 4) &&
  all(DASH_WORD, rest.slice(1, -1)) &&
  is(HASHED_FILE, rest.at(-1));

/** Each shape of a file below `org/v<n>/`, by name: the org JSON, the apps, the defaults, the marks, the maps, the films. */
export const ORG_SHAPES = {
  json: (rest) => rest.length === 1 && is(ORG_JSON, rest[0]),
  apps: (rest) => rest.length === 2 && rest[0] === "apps" && is(APP_JSON, rest[1]),
  defaults: isOrgDefaults,
  brand: (rest) =>
    rest[0] === "brand" &&
    ((rest.length === 2 && ["manifest.json", "index.json"].includes(rest[1])) ||
      (rest.length === 3 && BRAND_FOLDERS.includes(rest[1]) && is(FILE, rest[2]))),
  maps: (rest) =>
    rest[0] === "maps" &&
    ((rest.length === 3 && rest[1] === "tiles" && is(TILES_FILE, rest[2])) ||
      (rest.length === 4 && rest[1] === "fonts" && is(FONT_STACK, rest[2]) && is(FONT_RANGE, rest[3]))),
  films: isOrgFilm,
  discovery: (rest) => rest.length === 2 && rest[0] === "discovery" && rest[1] === "services.json",
};

/** True when the path below `org/v<n>/` is one of the files a generator writes. */
export const isOrgFile = (rest) => Object.values(ORG_SHAPES).some((shape) => shape(rest));

/** `<root>/<folder>/<kind>/[<dir>/…]<name>.<hash>.<ext>`: the shape of an object of sites/ and of apps/. */
function isMediaObject(parts, root, folders, kinds) {
  return (
    parts.length >= 4 &&
    parts[0] === root &&
    folders.includes(parts[1]) &&
    kinds.includes(parts[2]) &&
    all(FOLDER, parts.slice(3, -1)) &&
    is(HASHED_FILE, parts.at(-1))
  );
}
export const isSiteObject = (parts) => isMediaObject(parts, "sites", SITES, SITE_KINDS);
export const isAppObject = (parts) => isMediaObject(parts, "apps", APPS, APP_KINDS);

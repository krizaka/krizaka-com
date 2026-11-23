/* The registry of the site's assets (krizaka-internal#4482), built and never hand-written: lib/assets.json, in the shape of
   the org's schema (krizaka-agents schemas/assets.schema.json), checked by its assets-guard in CI. Pure: the sources come in
   as data (scripts/assets-registry.mjs reads them), so tests/assets-registry.test.mjs drives it with fixtures.
   - A CDN file (lib/cdn-manifest.json, keyed by logical path) is registered by its pull-zone address: the hashed object
     lib/cdn.ts serves. A committed file by its repository path.
   - A cover (a picture served at several widths, with an avif rendition) is one entry: its largest web file, and its 480
     web file as `variant480`. A cover whose 480 web file is not in the manifest is refused.
   - Owner, origin and pages come from content/asset-rules.json; a file no rule matches is refused. */

import { DEFAULT_PULL_ZONE, objectPath } from "./cdn-assets.mjs";

const VIDEO = /\.(mp4|webm)$/;
const IMAGE = /\.(jpe?g|png|webp|avif|svg|gif)$/;
/** `<set>-<width>.<webp|avif>`: one rendition of a picture served at several widths. */
const WIDTH = /^(.*)-(\d{3,4})\.(webp|avif)$/;

export const isUrl = (s) => /^https?:\/\//.test(s);

/** The pull-zone address of a logical path of the manifest (the object lib/cdn.ts serves, on the default host). */
export const cdnUrlOf = (manifest, logical) =>
  `https://${DEFAULT_PULL_ZONE}/${objectPath(manifest.root, logical, manifest.files[logical])}`;

/** The renditions of every multi-width picture of the manifest: set → [{ width, ext, logical }]. */
function widthSets(files) {
  const sets = new Map();
  for (const logical of Object.keys(files)) {
    const m = WIDTH.exec(logical);
    if (m) {
      sets.set(m[1], [...(sets.get(m[1]) ?? []), { width: Number(m[2]), ext: m[3], logical }]);
    }
  }
  return sets;
}

/** The covers of the manifest: the multi-width pictures that have an avif rendition (a figure is web only). */
export const coverSets = (files) =>
  [...widthSets(files)].filter(([, r]) => r.some((x) => x.ext === "avif")).map(([set]) => set);

const kindOf = (path) => {
  if (VIDEO.test(path)) {
    return "video";
  }
  if (IMAGE.test(path)) {
    return "image";
  }
  return "other";
};

function ruleOf(rules, path) {
  const rule = rules.rules.find((r) => (r.match.endsWith("/") ? path.startsWith(r.match) : path === r.match));
  if (!rule) {
    throw new Error(`${path}: no rule of content/asset-rules.json names its owner and origin`);
  }
  return rule;
}

/** Under home/showcase/<carousel>/<id>-…: a shot of the storyboard is cut from a founder's reel. */
function originOf(rule, logical, storyboard) {
  const m = /^home\/showcase\/([^/]+)\/(.+)-(wide|tall)\.[a-z0-9]+$/.exec(logical);
  const carousel = m && storyboard?.carousels?.[m[1]];
  if (!carousel) {
    return rule.origin;
  }
  return carousel.shots.some((s) => s.id === m[2]) ? "founder" : "design";
}

const entry = (rule, location, kind, origin = rule.origin) => ({
  location,
  owner: rule.owner,
  origin,
  kind,
  pages: [...rule.pages],
});

/** The covers' entries, and the logical paths they hold. */
function coverEntries(manifest, rules) {
  const sets = widthSets(manifest.files);
  const held = new Set();
  const entries = coverSets(manifest.files).map((set) => {
    const renditions = sets.get(set);
    const web = renditions.filter((r) => r.ext === "webp").sort((a, b) => b.width - a.width);
    const small = web.find((r) => r.width === 480);
    if (!small) {
      throw new Error(`${set}: a cover keeps its 480 web file (${set}-480.webp) in lib/cdn-manifest.json`);
    }
    const main = web[0];
    held.add(main.logical).add(small.logical);
    return {
      ...entry(ruleOf(rules, main.logical), cdnUrlOf(manifest, main.logical), "cover"),
      variant480: cdnUrlOf(manifest, small.logical),
    };
  });
  return { entries, held };
}

/** The registry: { manifest: lib/cdn-manifest.json, local: committed media paths, rules, storyboard? }. */
export function buildRegistry({ manifest, local, rules, storyboard }) {
  const covers = coverEntries(manifest, rules);
  const cdn = Object.keys(manifest.files)
    .filter((logical) => !covers.held.has(logical))
    .map((logical) => {
      const rule = ruleOf(rules, logical);
      return entry(rule, cdnUrlOf(manifest, logical), kindOf(logical), originOf(rule, logical, storyboard));
    });
  const committed = local.map((path) => entry(ruleOf(rules, path), path, kindOf(path)));
  const assets = [...committed, ...covers.entries, ...cdn].sort((a, b) => a.location.localeCompare(b.location));
  return { assets };
}

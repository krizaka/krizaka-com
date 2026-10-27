/* The pure rules of scripts/gen-dev-versions.mjs: what a product's /api/healthz says (`{"status":"ok","version":"0.1.0+df25bed"}`)
   and what the site keeps of it. Tested by tests/dev-versions.test.mjs. */

/** The shape of a version a product reports: semver, with the commit it was built from after a `+`. */
const VERSION = /^\d+\.\d+\.\d+(?:[-.][0-9A-Za-z.-]+)?(?:\+[0-9a-f]{7,40})?$/;

/** The version a /api/healthz answer carries — only when the product says it is `ok` and the version looks like one. */
export function versionOfHealthz(body) {
  if (!body || typeof body !== "object") return undefined;
  if (body.status !== "ok") return undefined;
  return typeof body.version === "string" && VERSION.test(body.version) ? body.version : undefined;
}

/** The healthz address of a product's dev host. */
export const healthzUrl = (id) => `https://dev.${id}.com/api/healthz`;

/** The file's new content: each product's fresh version, or the one the previous file had (a dev site down at build time
    never blanks a version the page already knew), or none. */
export function mergeVersions(ids, fresh, previous = {}) {
  const versions = {};
  for (const id of ids) {
    const v = fresh[id] ?? previous.versions?.[id];
    if (v) versions[id] = v;
  }
  return versions;
}

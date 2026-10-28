// ADR-014 (layout v2): the target layout of the Bunny zone (org/v<n>/, sites/<site>/, apps/<app>/, pr-assets/), the legacy map, the audit
// (cdn-assets tree), the copy to the target (cdn-assets migrate) and the cockpit's tree (bunny-tree).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { APPS, LAYOUT_README, MAX_FOLDERS, SITES, TARGET, assertWritable, misplaced, placement, switchIssue, targetOf } from "../scripts/bunny-layout.mjs";
import { isNamed, migrate, purgeUnused, tree, unusedLegacy } from "../scripts/cdn-assets.mjs";
import { buildTree } from "../scripts/bunny-tree.mjs";

const cfg = { apiKey: "secret-key", zone: "kz-zone", endpoint: "storage.bunnycdn.com", pullZone: "cdn.example.net" };

test("the org's CDN holds the org JSON, the apps, the defaults, the marks, the basemap, the films and discovery", () => {
  for (const ok of [
    "org/v1/org.json",
    "org/v1/org.3d2a6e4e82.json",
    "org/v1/org.schema.json",
    "org/v1/app.schema.45cbb0d0af.json",
    "org/v1/apps/akinaza.json",
    "org/v1/apps/yomizaka.ec69c307dc.json",
    "org/v1/defaults/person/boom-bap-512.webp",
    "org/v1/defaults/folder/folder-2.svg",
    "org/v1/defaults/manifest.json",
    "org/v1/defaults/tones/krizaka/person-1-256.webp",
    "org/v1/defaults/tones/manifest.json",
    "org/v1/brand/orazaka/mark-dark.svg",
    "org/v1/brand/index.json",
    "org/v1/maps/tiles/quebec-20261012.pmtiles",
    "org/v1/maps/fonts/Noto Sans Regular/0-255.pbf",
    "org/v1/films/relay/le-relais-en.0123456789.mp4",
    "org/v1/discovery/services.json",
    "org/v2/org.json",
  ]) assert.deepEqual(placement(ok), { state: "ok" }, ok);
  for (const bad of ["org/org.json", "org/v1/notes.txt", "org/v1/defaults/avatar/x-256.webp", "org/v1/brand/yazakia/logo.svg", "org/v1/films/relay/le-relais.mp4"]) {
    assert.equal(placement(bad).state, "misplaced", bad);
  }
});

test("four roots only: the org, the sites, the apps, the evidence — nothing else at the root", () => {
  assert.deepEqual(Object.keys(TARGET), ["org", "sites", "apps", "pr-assets"]);
  assert.deepEqual(SITES, ["www", "blog", "ui", "java", "orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"]);
  assert.deepEqual(APPS, ["orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"]);
  for (const ok of [
    "sites/akinaza/tour/en/hero.3f2a9c1b7e.mp4",
    "sites/blog/posts/cinematic-ai-videos/cover.0123456789.webp",
    "sites/blog/shared/x.0123456789.png",
    "sites/www/home/kit/frames/a.0123456789.png",
    "sites/ui/personas/ada-256.0123456789.webp",
    "sites/ui/maps/cluster-dark.731f2c4fa2.png",
    "apps/akinaza/defaults/cleaning/cover/c-1-640.434684215c.avif",
    "apps/orochia/uploads/u1/a.0123456789.webp",
  ]) assert.equal(misplaced(ok), null, ok);
  for (const bad of [
    "sites/krizaka/home/a.0123456789.png",
    "sites/www/misc/a.0123456789.png",
    "sites/akinaza/tour/hero.mp4",
    "apps/www/home/a.0123456789.png",
    "apps/akinaza/tour/a.0123456789.png",
    "sites/akinaza/tour/a/b/c/e.0123456789.png",
    "ui/maps/cluster-dark.731f2c4fa2.png".replace(/^ui/, "uix"),
    "tmp/test.txt",
  ]) assert.ok(misplaced(bad), bad);
  assert.equal(MAX_FOLDERS, 5);
  assert.equal(misplaced("pr-assets/akinaza/324/audit/client/deep/x.png"), null, "PR evidence already linked is kept");
});

test("a new write outside layout v2 fails", () => {
  assert.equal(assertWritable("sites/www/home/backdrop/a.0123456789.mp4"), "sites/www/home/backdrop/a.0123456789.mp4");
  for (const old of ["site/home/backdrop/a.0123456789.mp4", "brand/orazaka/mark-dark.svg", "ui/maps/a.0123456789.png", "people/defaults/v1/krizaka/person-1.svg", "sites/../site/a.0123456789.png"]) {
    assert.throws(() => assertWritable(old), /outside the Bunny layout v2/, old);
  }
});

test("every legacy folder maps to its target, or says why it has none, with the issue that switches it", () => {
  const cases = {
    "defaults/v1/person/boom-bap-512.webp": "org/v1/defaults/person/boom-bap-512.webp",
    "people/defaults/v1/krizaka/person-1.svg": "org/v1/defaults/tones/krizaka/person-1.svg",
    "brand/orazaka/mark-dark.svg": "org/v1/brand/orazaka/mark-dark.svg",
    "brand/manifest.json": "org/v1/brand/manifest.json",
    "maps/v1/tiles/world-20261012.pmtiles": "org/v1/maps/tiles/world-20261012.pmtiles",
    "discovery/services.json": "org/v1/discovery/services.json",
    "ui/maps/cluster-dark.731f2c4fa2.png": "sites/ui/maps/cluster-dark.731f2c4fa2.png",
    "site/home/backdrop/orazaka.0123456789.mp4": "sites/www/home/backdrop/orazaka.0123456789.mp4",
    "site/blog/shared/x.0123456789.png": "sites/blog/shared/x.0123456789.png",
    "site/blog/cinematic-ai-videos/x.0123456789.png": "sites/blog/posts/cinematic-ai-videos/x.0123456789.png",
    "site/products/akinaza/tour/a.0123456789.mp4": "sites/akinaza/tour/a.0123456789.mp4",
    "site/products/akinaza/defaults/cleaning/cover/c-1-640.434684215c.avif": "apps/akinaza/defaults/cleaning/cover/c-1-640.434684215c.avif",
    "site/docs/orazaka/mobile/x.0123456789.webp": "sites/orazaka/docs/mobile/x.0123456789.webp",
    "site/people/yasakia/hana-512.b0be072833.webp": "sites/yasakia/personas/hana-512.b0be072833.webp",
    "site/people/ui/ada-256.0123456789.webp": "sites/ui/personas/ada-256.0123456789.webp",
    "site/brand-films/relay/a.0123456789.mp4": "org/v1/films/relay/a.0123456789.mp4",
    "site/brand-films/orochia/a.0123456789.mp4": "sites/orochia/films/a.0123456789.mp4",
  };
  for (const [from, to] of Object.entries(cases)) {
    assert.equal(targetOf(from), to, from);
    const p = placement(from);
    assert.equal(p.state, "legacy", from);
    assert.equal(p.target, to, from);
    assert.match(p.issue, /^krizaka\/[a-z.-]+#\d+$/, from);
  }
  assert.equal(switchIssue("site/blog/shared/x.0123456789.png"), "krizaka/krizaka-blog#176");
  assert.equal(switchIssue("site/products/akinaza/tour/a.0123456789.mp4"), "krizaka/akinaza#493");
  assert.equal(switchIssue("site/home/kit/a.0123456789.png"), "krizaka/krizaka-com#450");
  // The human-name mirror is retired: no target, deleted once unused.
  assert.match(placement("products/orazaka/tour/tea-pour.mp4").why, /retired/);
  assert.match(placement("people/personas/yasakia/hana-512.webp").why, /retired/);
  assert.match(placement("site/products/yazakia/mobile/loop.46dbace273.mp4").why, /renamed/);
  assert.equal(placement("site/misc/a.0123456789.png").state, "misplaced");
});

test("the README describes the target first (org, sites, apps), then the legacy folders", () => {
  for (const prefix of Object.keys(TARGET)) assert.match(LAYOUT_README, new RegExp(`^${prefix}/`, "m"));
  assert.ok(LAYOUT_README.indexOf("TARGET LAYOUT") < LAYOUT_README.indexOf("LEGACY FOLDERS"));
  assert.ok(LAYOUT_README.indexOf("\norg/") < LAYOUT_README.indexOf("\nsites/") && LAYOUT_README.indexOf("\nsites/") < LAYOUT_README.indexOf("\napps/"));
  assert.match(LAYOUT_README, /ADR-014/);
});

test("purge-unused deletes only what is outside v2 and named by nothing, backing it up first", async () => {
  const refs = { urls: new Set(["site/products/akinaza/tour/used.0123456789.mp4", "ui/shop/"]), hex: new Set(["abcdefabcd"]), prefixes: ["brand/"] };
  assert.equal(isNamed("site/products/akinaza/tour/used.0123456789.mp4", refs), true, "by URL");
  assert.equal(isNamed("ui/shop/demo/a.1111111111.webp", refs), true, "by a folder URL above it");
  assert.equal(isNamed("site/blog/x/a.abcdefabcd.png", refs), true, "by its content hash");
  assert.equal(isNamed("brand/orazaka/mark-dark.svg", refs), true, "by a built prefix");
  assert.equal(isNamed("products/orazaka/tour/a.mp4", refs), false);
  const now = Date.parse("2026-10-28T12:00:00Z");
  const old = now - 48 * 3600000;
  const z = zone({
    "products/orazaka/tour/a.mp4": "mp4",
    "people/personas/yasakia/empty.webp": "",
    "brand/orazaka/mark-dark.svg": "<svg/>",
    "sites/www/home/x.2222222222.png": "png",
    "pr-assets/r/1/a.png": "png",
  });
  const objects = [...z.store].map(([path, b]) => ({ path, size: b.length, changed: old }));
  objects.push({ path: "site/home/fresh.3333333333.png", size: 3, changed: now - 3600000 });
  assert.deepEqual(unusedLegacy(objects, refs, { now }).map((o) => o.path).sort(), ["people/personas/yasakia/empty.webp", "products/orazaka/tour/a.mp4"], "targets, named and recent objects are kept");
  const preview = await purgeUnused({ cfg, refs, objects, now, fetchImpl: z.fetchImpl, log: () => {} });
  assert.equal(preview.length, 2);
  assert.equal(z.calls.filter((c) => c.method !== "GET").length, 0, "a preview deletes nothing");
  const backup = mkdtempSync(join(tmpdir(), "purge-"));
  await purgeUnused({ cfg, refs, objects, now, yes: true, backup, fetchImpl: z.fetchImpl, log: () => {} });
  assert.equal(readFileSync(join(backup, "products/orazaka/tour/a.mp4"), "utf8"), "mp4", "backed up before deletion");
  assert.equal(existsSync(join(backup, "people/personas/yasakia/empty.webp")), false, "an empty object is not backed up");
  assert.deepEqual(z.calls.filter((c) => c.method === "DELETE").map((c) => c.path).sort(), ["people/personas/yasakia/empty.webp", "products/orazaka/tour/a.mp4"]);
  assert.ok(z.store.has("brand/orazaka/mark-dark.svg") && z.store.has("sites/www/home/x.2222222222.png"));
});

/** A storage zone in memory, answering Bunny's listing, GET and PUT. */
function zone(files) {
  const store = new Map(Object.entries(files).map(([p, body]) => [p, Buffer.from(body)]));
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    const method = init.method ?? "GET";
    const path = decodeURIComponent(new URL(url).pathname.replace(/^\/kz-zone\//, ""));
    calls.push({ method, path });
    if (method === "PUT") {
      store.set(path, Buffer.from(init.body));
      return { ok: true, status: 201 };
    }
    if (method === "DELETE") {
      store.delete(path);
      return { ok: true, status: 200 };
    }
    if (path.endsWith("/") || path === "") {
      const items = new Map();
      for (const [p, b] of store) {
        if (!p.startsWith(path)) continue;
        const [head, ...more] = p.slice(path.length).split("/");
        items.set(head, more.length ? { ObjectName: head, IsDirectory: true } : { ObjectName: head, IsDirectory: false, Length: b.length });
      }
      return { ok: true, status: 200, json: async () => [...items.values()] };
    }
    const body = store.get(path);
    return body ? { ok: true, status: 200, arrayBuffer: async () => body } : { ok: false, status: 404 };
  };
  return { store, calls, fetchImpl };
}

test("tree passes legacy objects, fails on a misplaced one", async () => {
  const z = zone({ "README.txt": "x", "org/v1/org.json": "{}", "brand/orazaka/mark-dark.svg": "<svg/>", "tmp/loose.txt": "x" });
  const lines = [];
  const r = await tree({ cfg, fetchImpl: z.fetchImpl, log: (l) => lines.push(l) });
  assert.deepEqual(r.misplaced.map((o) => o.path), ["tmp/loose.txt"]);
  assert.deepEqual(r.legacy.map((o) => o.path), ["brand/orazaka/mark-dark.svg"]);
  assert.ok(lines.some((l) => /LEGACY\s+1\s+brand\/orazaka\/ → org\/v1\/brand\//.test(l)));
});

test("migrate previews, then copies each legacy object to its target once, never touching the old path", async () => {
  const z = zone({ "brand/orazaka/mark-dark.svg": "<svg/>", "defaults/v1/person/a-256.webp": "webp", "org/v1/defaults/person/a-256.webp": "webp", "people/defaults/v1/krizaka/person-1.svg": "<svg/>" });
  const preview = await migrate({ cfg, fetchImpl: z.fetchImpl, log: () => {} });
  assert.deepEqual(preview.map((t) => t.to), ["org/v1/brand/orazaka/mark-dark.svg", "org/v1/defaults/tones/krizaka/person-1.svg"], "same size already there: skipped; the avatar tones join the org's defaults");
  assert.equal(z.calls.filter((c) => c.method === "PUT").length, 0, "a preview sends nothing");
  await migrate({ cfg, yes: true, fetchImpl: z.fetchImpl, log: () => {} });
  assert.equal(z.store.get("org/v1/brand/orazaka/mark-dark.svg").toString(), "<svg/>");
  assert.ok(z.store.has("brand/orazaka/mark-dark.svg"), "the old path keeps serving");
  assert.equal((await migrate({ cfg, fetchImpl: z.fetchImpl, log: () => {} })).length, 0, "idempotent");
  assert.equal((await migrate({ cfg, only: "maps/", fetchImpl: z.fetchImpl, log: () => {} })).length, 0, "--only limits the copy");
});

test("bunny-tree: folders five levels deep with counts, MB, legacy and the misplaced flag", () => {
  const out = buildTree(
    [
      { path: "org/v1/org.json", size: 1048576 },
      { path: "brand/orazaka/mark-dark.svg", size: 10 },
      { path: "tmp/a/b/c/d/e/f/loose.txt", size: 5 },
    ],
    { now: new Date("2026-10-28T00:00:00Z") },
  );
  assert.deepEqual(out.totals, { count: 3, mb: 1, legacy: 1, misplaced: 1, legacyRoots: 1 });
  assert.deepEqual(out.tree.map((n) => [n.name, n.status]), [["org", "target"], ["brand", "legacy"], ["tmp", "misplaced"]], "v2 roots first, then legacy, then the rest");
  assert.deepEqual(out.tree[1].issues, ["krizaka/krizaka-ui#817"], "a legacy folder names the issue that switches it");
  assert.equal(out.tree[0].issues, undefined);
  const tmp = out.tree.find((n) => n.name === "tmp");
  assert.equal(tmp.misplaced, true);
  let depth = 0;
  for (let n = tmp; n; n = n.children[0]) depth++;
  assert.equal(depth, 5, "never deeper than five folders");
  assert.equal(out.tree.find((n) => n.name === "org").misplaced, false);
  assert.equal(out.tree.find((n) => n.name === "brand").legacy, 1);
  assert.doesNotMatch(JSON.stringify(out), /secret-key/);
});

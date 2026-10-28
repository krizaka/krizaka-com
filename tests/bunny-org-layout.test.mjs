// ADR-014: the target layout of the Bunny zone (org/v<n>/, apps/<app>/, ui/, pr-assets/), the legacy map, the audit
// (cdn-assets tree), the copy to the target (cdn-assets migrate) and the cockpit's tree (bunny-tree).
import { test } from "node:test";
import assert from "node:assert/strict";
import { APPS, LAYOUT_README, MAX_FOLDERS, TARGET, misplaced, placement, targetOf } from "../scripts/bunny-layout.mjs";
import { migrate, tree } from "../scripts/cdn-assets.mjs";
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

test("apps/ has one folder per app, hashed files, at most five folders deep", () => {
  assert.deepEqual(APPS, ["www", "blog", "orazaka", "orochia", "yasakia", "yororis", "yomizaka", "kachizaka", "akinaza"]);
  for (const ok of ["apps/akinaza/tour/en/hero.3f2a9c1b7e.mp4", "apps/blog/cinematic-ai-videos/cover.0123456789.webp", "apps/akinaza/defaults/cleaning/cover/c-1-640.434684215c.avif", "ui/personas/ada-256.0123456789.webp"]) {
    assert.equal(misplaced(ok), null, ok);
  }
  for (const bad of ["apps/krizaka/home/a.0123456789.png", "apps/akinaza/tour/hero.mp4", "apps/akinaza/a.0123456789.png", "apps/akinaza/a/b/c/d/e.0123456789.png", "tmp/test.txt"]) {
    assert.ok(misplaced(bad), bad);
  }
  assert.equal(MAX_FOLDERS, 5);
  assert.equal(misplaced("pr-assets/akinaza/324/audit/client/deep/x.png"), null, "PR evidence already linked is kept");
});

test("every legacy root maps to its target, or says why it has none", () => {
  const cases = {
    "defaults/v1/person/boom-bap-512.webp": "org/v1/defaults/person/boom-bap-512.webp",
    "brand/orazaka/mark-dark.svg": "org/v1/brand/orazaka/mark-dark.svg",
    "brand/manifest.json": "org/v1/brand/manifest.json",
    "maps/v1/tiles/world-20261012.pmtiles": "org/v1/maps/tiles/world-20261012.pmtiles",
    "discovery/services.json": "org/v1/discovery/services.json",
    "site/home/backdrop/orazaka.0123456789.mp4": "apps/www/home/backdrop/orazaka.0123456789.mp4",
    "site/blog/shared/x.0123456789.png": "apps/blog/shared/x.0123456789.png",
    "site/products/akinaza/tour/a.0123456789.mp4": "apps/akinaza/tour/a.0123456789.mp4",
    "site/docs/orazaka/mobile/x.0123456789.webp": "apps/orazaka/docs/mobile/x.0123456789.webp",
    "site/people/yasakia/hana-512.b0be072833.webp": "apps/yasakia/personas/hana-512.b0be072833.webp",
    "site/people/ui/ada-256.0123456789.webp": "ui/personas/ada-256.0123456789.webp",
    "site/brand-films/relay/a.0123456789.mp4": "org/v1/films/relay/a.0123456789.mp4",
    "site/brand-films/orochia/a.0123456789.mp4": "apps/orochia/films/a.0123456789.mp4",
  };
  for (const [from, to] of Object.entries(cases)) {
    assert.equal(targetOf(from), to, from);
    assert.deepEqual(placement(from), { state: "legacy", target: to, why: undefined }, from);
  }
  // One set of default avatars (ADR-014 §2): the duplicate is frozen, not copied; the mirror is retired.
  assert.match(placement("people/defaults/v1/krizaka/person-1.svg").why, /frozen/);
  assert.match(placement("products/orazaka/tour/tea-pour.mp4").why, /retired/);
  assert.match(placement("site/products/yazakia/mobile/loop.46dbace273.mp4").why, /renamed/);
  assert.equal(placement("site/misc/a.0123456789.png").state, "misplaced");
});

test("the README describes the target first, then the legacy roots", () => {
  for (const prefix of Object.keys(TARGET)) assert.match(LAYOUT_README, new RegExp(`^${prefix}/`, "m"));
  assert.ok(LAYOUT_README.indexOf("TARGET LAYOUT") < LAYOUT_README.indexOf("LEGACY ROOTS"));
  assert.match(LAYOUT_README, /ADR-014/);
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
  assert.deepEqual(preview.map((t) => t.to), ["org/v1/brand/orazaka/mark-dark.svg"], "same size already there: skipped; the frozen set: never copied");
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
  assert.deepEqual(out.totals, { count: 3, mb: 1, legacy: 1, misplaced: 1 });
  const tmp = out.tree.find((n) => n.name === "tmp");
  assert.equal(tmp.misplaced, true);
  let depth = 0;
  for (let n = tmp; n; n = n.children[0]) depth++;
  assert.equal(depth, 5, "never deeper than five folders");
  assert.equal(out.tree.find((n) => n.name === "org").misplaced, false);
  assert.equal(out.tree.find((n) => n.name === "brand").legacy, 1);
  assert.doesNotMatch(JSON.stringify(out), /secret-key/);
});

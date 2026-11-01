import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FOREIGN_WRITERS } from "../scripts/bunny-layout.mjs";
import {
  check,
  hashOf,
  logicalPath,
  main,
  plan,
  prune,
  publishReadme,
  purgeUnhashed,
  readManifest,
  versioned,
} from "../scripts/cdn-assets.mjs";

const cfg = { apiKey: "secret-key", zone: "kz-zone", endpoint: "storage.bunnycdn.com", pullZone: "cdn.example.net" };
const env = {
  MEDIA_STORAGE_API_KEY: "secret-key",
  MEDIA_STORAGE_ZONE: "kz-zone",
  MEDIA_CDN_HOSTNAME: "cdn.example.net",
};

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), "cdn-assets-"));
  mkdirSync(join(dir, "tour"));
  writeFileSync(join(dir, "tour", "alex-bid.mp4"), "mp4");
  writeFileSync(join(dir, "tour", "alex-bid.jpg"), "jpg");
  writeFileSync(join(dir, "tour", ".DS_Store"), "x");
  return dir;
}

function recorder(status = 200) {
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method ?? "GET", headers: init.headers ?? {} });
    return { ok: status >= 200 && status < 300, status, json: async () => [] };
  };
  return { calls, fetchImpl };
}

test("versioned names and logical paths", () => {
  assert.equal(versioned("products/yomizaka/tour/alex-bid.mp4", "abc"), "products/yomizaka/tour/alex-bid.abc.mp4");
  assert.throws(() => versioned("products/x/noext", "abc"));
  assert.equal(logicalPath("/products/yomizaka/tour/"), "products/yomizaka/tour");
  assert.throws(() => logicalPath("../etc"));
  assert.throws(() => logicalPath("Products/X Y"));
  assert.equal(hashOf("mp4").length, 10);
});

test("plan maps a directory under --to, hidden files left out", () => {
  const dir = fixture();
  assert.deepEqual(
    plan(join(dir, "tour"), "products/yomizaka/tour").map((f) => f.logical),
    ["products/yomizaka/tour/alex-bid.jpg", "products/yomizaka/tour/alex-bid.mp4"],
  );
  assert.deepEqual(
    plan(join(dir, "tour", "alex-bid.mp4"), "home/backdrop").map((f) => f.logical),
    ["home/backdrop/alex-bid.mp4"],
  );
});

test("upload sends versioned files, records them, and skips what is already there", async () => {
  const dir = fixture();
  const manifestFile = join(dir, "cdn-manifest.json");
  const logs = [];
  const { calls, fetchImpl } = recorder();
  await main(["upload", join(dir, "tour"), "--to", "products/yomizaka/tour"], {
    env,
    fetchImpl,
    log: (l) => logs.push(l),
    manifestFile,
  });
  const puts = calls.filter((c) => c.method === "PUT");
  assert.equal(puts.length, 2);
  assert.equal(
    puts[1].url,
    `https://storage.bunnycdn.com/kz-zone/sites/yomizaka/tour/alex-bid.${hashOf("mp4")}.mp4`,
    "layout v2: sites/<site>/<kind>/",
  );
  assert.equal(puts[1].headers["Content-Type"], "video/mp4");
  const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
  assert.deepEqual(manifest, {
    root: "sites",
    files: {
      "products/yomizaka/tour/alex-bid.jpg": hashOf("jpg"),
      "products/yomizaka/tour/alex-bid.mp4": hashOf("mp4"),
    },
  });
  assert.ok(!logs.join("\n").includes("secret-key"), "the key is never printed");

  const again = recorder();
  await main(["upload", join(dir, "tour"), "--to", "products/yomizaka/tour"], {
    env,
    fetchImpl: again.fetchImpl,
    log: () => {},
    manifestFile,
  });
  assert.equal(again.calls.filter((c) => c.method === "PUT").length, 0, "idempotent by hash");
});

test("a dry run sends nothing and writes nothing", async () => {
  const dir = fixture();
  const manifestFile = join(dir, "cdn-manifest.json");
  const { calls, fetchImpl } = recorder();
  await main(["upload", join(dir, "tour"), "--to", "products/yomizaka/tour", "--dry-run"], {
    env: {},
    fetchImpl,
    log: () => {},
    manifestFile,
  });
  assert.equal(calls.length, 0);
  assert.ok(!existsSync(manifestFile));
});

test("check reports what the pull zone does not serve", async () => {
  const manifest = { root: "site", files: { "home/backdrop/orazaka.jpg": "abc" } };
  const { fetchImpl } = recorder(404);
  const failed = await check({ cfg, manifest, fetchImpl, log: () => {} });
  assert.deepEqual(failed, [{ url: "https://cdn.example.net/site/home/backdrop/orazaka.abc.jpg", status: 404 }]);
});

test("prune deletes only objects the manifest no longer names, and only with --yes", async () => {
  const manifest = { root: "site", files: { "home/backdrop/orazaka.jpg": "new" } };
  const listing = {
    "https://storage.bunnycdn.com/kz-zone/site/": [{ ObjectName: "home", IsDirectory: true }],
    "https://storage.bunnycdn.com/kz-zone/site/home/": [{ ObjectName: "backdrop", IsDirectory: true }],
    "https://storage.bunnycdn.com/kz-zone/site/home/backdrop/": [
      { ObjectName: "orazaka.new.jpg", IsDirectory: false },
      { ObjectName: "orazaka.old.jpg", IsDirectory: false },
    ],
  };
  const deleted = [];
  const fetchImpl = async (url, init = {}) => {
    if (init.method === "DELETE") deleted.push(url);
    return { ok: true, status: 200, json: async () => listing[url] ?? [] };
  };
  assert.deepEqual(await prune({ cfg, manifest, fetchImpl, log: () => {} }), ["site/home/backdrop/orazaka.old.jpg"]);
  assert.equal(deleted.length, 0);
  await prune({ cfg, manifest, yes: true, fetchImpl, log: () => {} });
  assert.deepEqual(deleted, ["https://storage.bunnycdn.com/kz-zone/site/home/backdrop/orazaka.old.jpg"]);
});

test("the committed manifest names every media the site draws", () => {
  const { root, files } = readManifest();
  assert.equal(root, "sites", "layout v2");
  const need = [
    // The vertical clip the /docs/ui examples play (lib/ui-example-props.ts).
    ...["mp4", "jpg"].map((e) => `home/kit/challenge-v.${e}`),
  ];
  for (const path of need) assert.match(files[path] ?? "", /^[0-9a-f]{10}$/, path);
  // The products carry their own media on their own sites: no product page recording, gallery or doc screenshot is left —
  // but the recordings www.orazaka.com plays (its home take and web steps: orazaka-web-client reads this manifest) and the real takes /story plays in its lightbox (lib/story-takes.ts: the engine's Old Port render) the film and clips www.orazaka.com plays (products/orazaka/films/) and the phone clips of Orazaka's mobile app as the demo persona (products/orazaka/mobile/, orazaka-web-client#245).
  const gone = Object.keys(files).filter((path) =>
    /^(docs\/orazaka\/|home\/backdrop\/|home\/kit-native\/|home\/kit\/(frames|reel)|products\/orazaka\/(?!home\/take-|web\/step-|mobile\/|films\/|video\/old-port))/.test(
      path,
    ),
  );
  assert.deepEqual(gone, []);
  // Only the products krizaka.com presents keep media here; the departed products' folders are gone (krizaka/.github#413).
  assert.deepEqual(
    Object.keys(files).filter((path) => /^(products|people)\/(?!orazaka|yomizaka|akinaza|ui)[a-z]+\//.test(path)),
    [],
  );
});

test("prune never deletes what the product sites carry themselves", async () => {
  const manifest = { root: "site", files: { "home/backdrop/orazaka.jpg": "newnewnew1" } };
  const listing = {
    "https://storage.bunnycdn.com/kz-zone/site/": [{ ObjectName: "products", IsDirectory: true }],
    "https://storage.bunnycdn.com/kz-zone/site/products/": [
      { ObjectName: "orazaka", IsDirectory: true },
      { ObjectName: "yomizaka", IsDirectory: true },
    ],
    "https://storage.bunnycdn.com/kz-zone/site/products/orazaka/": [
      { ObjectName: "clip.abcdef1234.mp4", IsDirectory: false },
    ],
    "https://storage.bunnycdn.com/kz-zone/site/products/yomizaka/": [
      { ObjectName: "clip.abcdef1234.mp4", IsDirectory: false },
    ],
  };
  const fetchImpl = async (url) => ({ ok: true, status: 200, json: async () => listing[url] ?? [] });
  assert.deepEqual(await prune({ cfg, manifest, fetchImpl, log: () => {} }), []);
});

test("uploads are refused outside the areas of site/", () => {
  assert.throws(() => logicalPath("pr-assets/x/y.png"), /not an area/);
  assert.throws(() => logicalPath("krizaka-assets/home"), /not an area/);
  for (const area of ["home", "products/yomizaka/tour", "docs/yomizaka/mobile", "people/ui"])
    assert.equal(logicalPath(area), area);
});

test("prune never touches what other sites own: the products' media and the blog's (site/blog/, named by krizaka-blog)", async () => {
  assert.ok(FOREIGN_WRITERS.includes("site/blog/"));
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url, method: init.method ?? "GET" });
    const tree = {
      "/site/": [{ ObjectName: "blog", IsDirectory: true }],
      "/site/blog/": [{ ObjectName: "shared", IsDirectory: true }],
      "/site/blog/shared/": [{ ObjectName: "a.abc.webp", IsDirectory: false, LastChanged: "2020-01-01T00:00:00" }],
    };
    const key = Object.keys(tree).find((k) => url.endsWith(k));
    return { ok: true, status: 200, json: async () => (key ? tree[key] : []) };
  };
  await prune({ cfg, manifest: { root: "site", files: {} }, yes: true, fetchImpl, log: () => {} });
  assert.equal(calls.filter((c) => c.method === "DELETE").length, 0);
});

test("prune lists nothing under Orazaka's own clips (gallery-video/, video/), which its GPU batch writes", async () => {
  const manifest = { root: "site", files: { "products/yomizaka/tour/x.jpg": "abcdef1234" } };
  const listing = {
    "https://storage.bunnycdn.com/kz-zone/site/": [{ ObjectName: "products", IsDirectory: true }],
    "https://storage.bunnycdn.com/kz-zone/site/products/": [{ ObjectName: "orazaka", IsDirectory: true }],
    "https://storage.bunnycdn.com/kz-zone/site/products/orazaka/": [
      { ObjectName: "gallery-video", IsDirectory: true },
      { ObjectName: "video", IsDirectory: true },
    ],
    "https://storage.bunnycdn.com/kz-zone/site/products/orazaka/gallery-video/": [
      { ObjectName: "scene.0123456789.mp4", IsDirectory: false },
    ],
    "https://storage.bunnycdn.com/kz-zone/site/products/orazaka/video/": [
      { ObjectName: "clip.0123456789-poster.webp", IsDirectory: false },
    ],
  };
  const fetchImpl = async (url) => ({ ok: true, status: 200, json: async () => listing[url] ?? [] });
  assert.deepEqual(await prune({ cfg, manifest, fetchImpl, log: () => {} }), []);
});

test("purgeUnhashed: POSTs the Bunny purge of the file's URL with the account key (not the storage key)", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200 };
  };
  assert.equal(
    await purgeUnhashed({ cfg, paths: ["org/v1/org.json"], accountKey: "acct", fetchImpl, log: () => {} }),
    true,
  );
  assert.equal(
    calls[0].url,
    "https://api.bunny.net/purge?url=https%3A%2F%2Fcdn.example.net%2Forg%2Fv1%2Forg.json&async=false",
  );
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers.AccessKey, "acct");
});
test("purgeUnhashed: without the account key it says so and calls nothing; a refusal is reported", async () => {
  const lines = [];
  assert.equal(
    await purgeUnhashed({
      cfg,
      paths: ["README.txt"],
      fetchImpl: () => assert.fail("no call"),
      log: (l) => lines.push(l),
    }),
    false,
  );
  assert.match(lines[0], /MEDIA_ACCOUNT_API_KEY is not set/);
  const refused = await purgeUnhashed({
    cfg,
    paths: ["README.txt"],
    accountKey: "a",
    fetchImpl: async () => ({ ok: false, status: 401 }),
    log: (l) => lines.push(l),
  });
  assert.equal(refused, false);
  assert.match(lines[1], /NOT purged: HTTP 401/);
});
test("publishReadme: uploads README.txt, then purges it", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, method: init.method });
    return { ok: true, status: 200 };
  };
  await publishReadme({ cfg, accountKey: "acct", fetchImpl, log: () => {} });
  assert.deepEqual(
    calls.map((c) => c.method),
    ["PUT", "POST"],
  );
  assert.match(calls[1].url, /api\.bunny\.net\/purge\?url=.*README\.txt/);
});

test("every manifest key resolves to a layout path without a doubled segment", async () => {
  const { readManifest, objectPath, ROOT } = await import("../scripts/cdn-assets.mjs");
  const manifest = readManifest();
  const bad = [];
  for (const [path, hash] of Object.entries(manifest.files ?? manifest.sites ?? {})) {
    const object = objectPath(ROOT, path, hash);
    if (/(^|\/)([^/]+)\/\2(\/|$)/.test(object)) bad.push(`${path} -> ${object}`);
  }
  assert.deepEqual(bad, []);
});

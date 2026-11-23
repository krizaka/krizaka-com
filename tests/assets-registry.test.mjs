// lib/assets.json, the site's one registry of assets (krizaka-internal#4482): where each asset lives, who owns it, where it
// comes from and the pages that use it. The schema and the guard are the org's (krizaka-agents schemas/assets.schema.json,
// tools/assets-guard.py, run by .github/workflows/assets-guard.yml); these tests hold what only this site knows: the
// registry is the one built from lib/cdn-manifest.json, the committed media and content/asset-rules.json, and every cover
// keeps its 480 web file in the manifest.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { buildRegistry, coverSets, cdnUrlOf, isUrl } from "../scripts/assets-registry-lib.mjs";
import { readSources } from "../scripts/assets-registry.mjs";

const ROOT = join(import.meta.dirname, "..");
const registry = JSON.parse(readFileSync(join(ROOT, "lib/assets.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(ROOT, "lib/cdn-manifest.json"), "utf8"));
const ORIGINS = new Set(["test", "design", "founder"]);
const KINDS = new Set(["cover", "image", "video", "other"]);

const RULES = {
  rules: [
    { match: "blog/", owner: "blog", origin: "design", pages: ["https://blog.krizaka.com/"] },
    { match: "public/favicon.svg", owner: "brand", origin: "design", pages: ["app/manifest.ts"] },
  ],
};
const fixture = (files) => ({ root: "sites", files });
const COVER = {
  "blog/post/a-cover-480.avif": "0000000001",
  "blog/post/a-cover-480.webp": "0000000002",
  "blog/post/a-cover-1200.avif": "0000000003",
  "blog/post/a-cover-1200.webp": "0000000004",
};

test("the committed registry is the one built from its sources (run: npm run assets:registry)", () => {
  assert.deepEqual(registry, buildRegistry(readSources(ROOT)));
});

test("every file of the CDN manifest is registered exactly once, by its pull-zone address", () => {
  const registered = registry.assets.flatMap((a) => [a.location, ...(a.variant480 ? [a.variant480] : [])]);
  const cdn = registered.filter(isUrl);
  assert.equal(new Set(cdn).size, cdn.length, "an address is registered twice");
  const expected = Object.keys(manifest.files).map((logical) => cdnUrlOf(manifest, logical));
  assert.deepEqual([...cdn].sort(), [...expected].sort());
});

test("every cover keeps its 480 web file in lib/cdn-manifest.json", () => {
  const sets = coverSets(manifest.files);
  assert.ok(sets.length > 0, "the manifest holds covers");
  const covers = registry.assets.filter((a) => a.kind === "cover");
  assert.equal(covers.length, sets.length, "one cover entry per cover set");
  for (const set of sets) {
    assert.ok(manifest.files[`${set}-480.webp`], `${set}: its 480 web file is not in the manifest`);
  }
  for (const c of covers) {
    assert.match(c.variant480, /-480\.[0-9a-f]{10}\.webp$/, `${c.location}: its variant480 is not a 480 web file`);
  }
});

test("a cover whose 480 web file is gone from the manifest is refused", () => {
  const files = { ...COVER };
  delete files["blog/post/a-cover-480.webp"];
  assert.throws(() => buildRegistry({ manifest: fixture(files), local: [], rules: RULES }), /a-cover.*480 web file/);
});

test("a cover is one entry: its largest web file, with its 480 web file as variant480", () => {
  const { assets } = buildRegistry({ manifest: fixture(COVER), local: [], rules: RULES });
  const cover = assets.find((a) => a.kind === "cover");
  assert.equal(cover.location, cdnUrlOf(fixture(COVER), "blog/post/a-cover-1200.webp"));
  assert.equal(cover.variant480, cdnUrlOf(fixture(COVER), "blog/post/a-cover-480.webp"));
  assert.equal(assets.length, 3, "the cover, then its two avif files");
});

test("a file that no rule names is refused: its owner and origin are decided, never guessed", () => {
  assert.throws(
    () => buildRegistry({ manifest: fixture({ "people/x/a.webp": "0000000009" }), local: [], rules: RULES }),
    /people\/x\/a\.webp: no rule of content\/asset-rules\.json/,
  );
  assert.throws(
    () => buildRegistry({ manifest: fixture({}), local: ["public/other.svg"], rules: RULES }),
    /public\/other\.svg: no rule/,
  );
});

test("every entry has an owner, an origin of the closed set and at least one page", () => {
  for (const a of registry.assets) {
    assert.ok(a.owner, `${a.location}: no owner`);
    assert.ok(ORIGINS.has(a.origin), `${a.location}: origin ${a.origin}`);
    assert.ok(KINDS.has(a.kind), `${a.location}: kind ${a.kind}`);
    assert.ok(a.pages.length > 0, `${a.location}: no page`);
  }
});

test("every committed asset is registered, and every page of this repository it names exists", () => {
  const local = registry.assets.filter((a) => !isUrl(a.location));
  assert.deepEqual(local.map((a) => a.location).sort(), readSources(ROOT).local.sort());
  for (const a of local) {
    assert.ok(existsSync(join(ROOT, a.location)), `${a.location} is missing`);
  }
  const pages = new Set(
    registry.assets.flatMap((a) => a.pages).filter((p) => !isUrl(p) && !p.startsWith("TO VALIDATE")),
  );
  for (const p of pages) {
    assert.ok(existsSync(join(ROOT, p)), `page ${p} does not exist`);
  }
});

test("a home showcase slide cut from a founder's reel is « founder », a clip is « design »", () => {
  const byLogical = (l) => registry.assets.find((a) => a.location === cdnUrlOf(manifest, l));
  assert.equal(byLogical("home/showcase/hero/bridge-wide.mp4")?.origin, "founder");
  assert.equal(byLogical("home/showcase/hero/river-wide.mp4")?.origin, "design");
});

test("CI runs the org's assets-guard on the registry, in the merge queue too, from a pinned commit", () => {
  const wf = readFileSync(join(ROOT, ".github/workflows/assets-guard.yml"), "utf8");
  assert.match(wf, /^ {2}merge_group:/m);
  assert.match(wf, /repository: krizaka\/krizaka-agents\n\s+ref: [0-9a-f]{40} /);
  assert.match(
    wf,
    /python3 \.org-guard\/tools\/assets-guard\.py --registry lib\/assets\.json --pages 'app\/manifest\.ts'/,
  );
  assert.doesNotMatch(wf, /continue-on-error|\|\| true/, "a finding fails the check");
});

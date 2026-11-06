// The named parts of the Bunny layout (scripts/bunny-layout-grammar.mjs), one test each, and the characterization of the
// layout functions: tests/fixtures/bunny-layout-characterization.json was recorded from the version with the long regexes
// (krizaka-internal#2787, ADR-026 phase D), so the same paths must keep giving the same answers.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  placement,
  targetOf,
  libraryPath,
  switchIssue,
  assertWritable,
  renamedTarget,
} from "../scripts/bunny-layout.mjs";
import * as g from "../scripts/bunny-layout-grammar.mjs";

const accepts = (re, good, bad) => {
  for (const s of good) {
    assert.ok(re.test(s), `${re} should accept ${s}`);
  }
  for (const s of bad) {
    assert.ok(!re.test(s), `${re} should refuse ${s}`);
  }
};

test("DASHED_ID: lowercase words joined by single dashes", () => {
  accepts(g.DASHED_ID, ["abc", "a-1-b", "42"], ["", "-a", "a-", "a--b", "A", "a_b"]);
});
test("DASH_WORD: lowercase letters, digits, dashes", () => {
  accepts(g.DASH_WORD, ["a", "-a-", "a-1"], ["", "A", "a_b", "a.b"]);
});
test("FOLDER: lowercase letters, digits, dash, underscore", () => {
  accepts(g.FOLDER, ["home", "my_dir", "a-1"], ["", "Home", "a.b", "a b"]);
});
test("FILE: letters, digits, dot, dash, underscore", () => {
  accepts(g.FILE, ["mark-dark.svg", "Ada.v2.PNG", "a_b"], ["", "a b", "a/b", "é"]);
});
test("HASHED_FILE: name.<10 hex>.ext", () => {
  accepts(
    g.HASHED_FILE,
    ["a.3f2a9c1b7e.mp4", "tour-a.1.3f2a9c1b7e.mp4"],
    ["a.mp4", "a.3f2a9c1b7.mp4", "A.3f2a9c1b7e.mp4", "a.3f2a9c1b7E.mp4"],
  );
});
test("VERSION: v and digits", () => {
  accepts(g.VERSION, ["v1", "v12"], ["v", "1", "v1a", "V1"]);
});
test("DEFAULT_PICTURE: a sized webp or an svg", () => {
  accepts(
    g.DEFAULT_PICTURE,
    ["ada-256.webp", "folder-2.svg", "a.svg", "the-neon-flamingo-1920.webp"],
    ["a.webp", "A.svg", "a_b.svg", "-a.svg", "a-.svg"],
  );
});
test("ORG_JSON: org, org.schema, app.schema, optionally hashed", () => {
  accepts(
    g.ORG_JSON,
    ["org.json", "org.0123456789.json", "org.schema.json", "app.schema.0123456789.json"],
    ["apps.json", "org.012345678.json", "org.json.bak"],
  );
});
test("APP_JSON: one app's config, optionally hashed", () => {
  accepts(g.APP_JSON, ["sovkora.json", "sovkora.0123456789.json"], ["Sovkora.json", "a.b.json", "a.json.x"]);
});
test("TILES_FILE: region and day", () => {
  accepts(
    g.TILES_FILE,
    ["quebec-20261012.pmtiles", "a-b-20261012.pmtiles"],
    ["q-2026101.pmtiles", "Q-20261012.pmtiles", "q.pmtiles"],
  );
});
test("FONT_STACK and FONT_RANGE", () => {
  accepts(g.FONT_STACK, ["Noto Sans Regular", "a"], ["", "Noto_Sans", "a/b"]);
  accepts(g.FONT_RANGE, ["0-255.pbf", "256-511.pbf"], ["0.pbf", "a-255.pbf", "0-255.png"]);
});
test("KIT_NATIVE: product, theme, extension", () => {
  assert.deepEqual(g.KIT_NATIVE.exec("orazaka-dark.mp4").slice(1), ["orazaka", "dark", "mp4"]);
  assert.equal(g.KIT_NATIVE.exec("X-light.mp4"), null);
  assert.equal(g.KIT_NATIVE.exec("orazaka-blue.mp4"), null);
});

test("shapes of the legacy folders", () => {
  const parts = (p) => p.split("/");
  assert.ok(g.isHashedSiteFile(parts("site/home/a.3f2a9c1b7e.mp4")));
  assert.ok(!g.isHashedSiteFile(parts("site/a.3f2a9c1b7e.mp4")), "needs a folder");
  assert.ok(g.isLegacyBrandFile(parts("brand/manifest.json")));
  assert.ok(g.isLegacyBrandFile(parts("brand/kridoc/mark.svg")));
  assert.ok(!g.isLegacyBrandFile(parts("brand/nope/mark.svg")));
  assert.ok(g.isLegacyPeopleFile(parts("people/defaults/v1/manifest.json")));
  assert.ok(g.isLegacyPeopleFile(parts("people/personas/ui/a.png")));
  assert.ok(!g.isLegacyPeopleFile(parts("people/defaults/v2/kridoc/a.png")));
  assert.ok(g.isDefaultsManifest(parts("defaults/v3/manifest.json")));
  assert.ok(g.isLegacyDefaultPicture(parts("defaults/v1/person/ada-256.webp")));
  assert.ok(!g.isLegacyDefaultPicture(parts("defaults/v1/avatar/ada-256.webp")));
  assert.ok(g.isLegacyProductFile(parts("products/kridoc/docs/a/b.mp4")));
  assert.ok(!g.isLegacyProductFile(parts("products/kridoc/nope/a.mp4")));
  assert.ok(g.isMapFile(parts("maps/v1/tiles/q-20261012.pmtiles")));
  assert.ok(g.isMapFile(parts("maps/v1/fonts/Noto Sans/0-255.pbf")));
  assert.ok(!g.isMapFile(parts("maps/v2/tiles/q-20261012.pmtiles")));
});

test("shapes of the target layout", () => {
  const rest = (p) => g.orgRest(p.split("/"));
  assert.equal(rest("org/v1/"), null);
  assert.equal(rest("org/x/org.json"), null);
  for (const ok of [
    "org.json",
    "apps/sovkora.json",
    "defaults/manifest.json",
    "defaults/person/ada-256.webp",
    "defaults/tones/manifest.json",
    "defaults/tones/kridoc/a.png",
    "brand/index.json",
    "brand/krizaka/mark.svg",
    "maps/tiles/q-20261012.pmtiles",
    "maps/fonts/Noto Sans/0-255.pbf",
    "films/loops/a.3f2a9c1b7e.mp4",
    "films/a/b/c.3f2a9c1b7e.mp4",
    "discovery/services.json",
  ]) {
    assert.ok(g.isOrgFile(rest(`org/v1/${ok}`)), ok);
  }
  for (const bad of [
    "nope.json",
    "defaults/avatar/a-256.webp",
    "brand/nope/a.svg",
    "films/a.3f2a9c1b7e.mp4",
    "discovery/x.json",
  ]) {
    assert.ok(!g.isOrgFile(rest(`org/v1/${bad}`)), bad);
  }
  assert.ok(g.isSiteObject("sites/www/home/a/b.3f2a9c1b7e.mp4".split("/")));
  assert.ok(!g.isSiteObject("sites/www/nope/a.3f2a9c1b7e.mp4".split("/")));
  assert.ok(!g.isSiteObject("sites/www/home/a.mp4".split("/")));
  assert.ok(g.isAppObject("apps/folioviv/uploads/a.3f2a9c1b7e.png".split("/")));
  assert.ok(!g.isAppObject("apps/folioviv/home/a.3f2a9c1b7e.png".split("/")));
});

test("the layout functions answer as they did with the long regexes (characterization)", () => {
  const cases = JSON.parse(
    readFileSync(new URL("./fixtures/bunny-layout-characterization.json", import.meta.url), "utf8"),
  );
  assert.ok(cases.length > 100);
  for (const c of cases) {
    assert.deepEqual(JSON.parse(JSON.stringify(placement(c.path))), c.placement, `placement ${c.path}`);
    assert.equal(targetOf(c.path), c.targetOf, `targetOf ${c.path}`);
    assert.equal(libraryPath(c.path), c.libraryPath, `libraryPath ${c.path}`);
    assert.equal(switchIssue(c.path), c.switchIssue, `switchIssue ${c.path}`);
    let writable = "ok";
    try {
      assertWritable(c.path);
    } catch {
      writable = "throws";
    }
    assert.equal(writable, c.assertWritable, `assertWritable ${c.path}`);
  }
  assert.equal(renamedTarget("sites/orazaka/home/a.3f2a9c1b7e.mp4"), "sites/sovkora/home/a.3f2a9c1b7e.mp4");
  assert.equal(renamedTarget("sites/sovkora/home/a.3f2a9c1b7e.mp4"), null);
});

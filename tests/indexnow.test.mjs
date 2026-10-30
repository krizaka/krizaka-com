import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { buildInfo } from "../scripts/build-info.mjs";

const SHA = "a".repeat(40);

test("the build carries the commit it was made from, lower-cased", () => {
  assert.deepEqual(buildInfo(SHA.toUpperCase()), { commit: SHA });
});

test("anything that is not a full commit says « local » (never a half-id the poll could match by accident)", () => {
  for (const v of [undefined, "", "abc123", "${_self.COMMIT_HASH}", SHA + "0"])
    assert.deepEqual(buildInfo(v), { commit: "local" });
});

test("/build.json is served from the build, the image takes APP_COMMIT and DigitalOcean binds it to the commit", () => {
  assert.match(readFileSync("app/build.json/route.ts", "utf8"), /buildInfo\(process\.env\.APP_COMMIT\)/);
  assert.match(readFileSync("Dockerfile", "utf8"), /ARG APP_COMMIT\nENV APP_COMMIT=\$APP_COMMIT/);
  assert.match(
    readFileSync("deploy/digitalocean/app.yaml", "utf8"),
    /key: APP_COMMIT\n\s+scope: BUILD_TIME\n\s+value: \$\{_self\.COMMIT_HASH\}/,
  );
  assert.match(readFileSync("lib/env.ts", "utf8"), /name: "APP_COMMIT"/);
});

test("the post-deploy caller waits for the deployed commit, pins the org workflow to a SHA and holds one IndexNow key file", () => {
  const wf = readFileSync(".github/workflows/post-deploy.yml", "utf8");
  assert.match(wf, /krizaka\/\.github\/\.github\/workflows\/post-deploy\.yml@[0-9a-f]{40}/);
  assert.match(wf, /branches: \[production\]/, "the deploy is the production branch's");
  assert.match(wf, /version-url: https:\/\/www\.krizaka\.com\/build\.json/);
  assert.match(wf, /expect: \$\{\{ github\.sha \}\}/);
  const key = wf.match(/indexnow-key: ([0-9a-f]{32})/)?.[1];
  assert.ok(key, "the workflow names the IndexNow key");
  assert.equal(readFileSync(`public/${key}.txt`, "utf8").trim(), key, "public/<key>.txt serves the key");
  assert.equal(readdirSync("public").filter((f) => /^[0-9a-f]{32}\.txt$/.test(f)).length, 1);
});

test("the daily ping and its script are gone: the post-deploy workflow is the one IndexNow submission", () => {
  assert.equal(existsSync(".github/workflows/indexnow.yml"), false);
  assert.equal(existsSync("scripts/indexnow.mjs"), false);
});

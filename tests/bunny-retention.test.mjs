import assert from "node:assert/strict";
import { test } from "node:test";
import { FOREIGN_WRITERS_V2 } from "../scripts/bunny-layout.mjs";
import { isChosen, plan, prKeyOf, readPrs, summary } from "../scripts/bunny-retention.mjs";

const DAY = 24 * 3600 * 1000;
const now = Date.parse("2026-10-31T12:00:00Z");
const obj = (path, ageDays, size = 1000) => ({ path, size, changed: now - ageDays * DAY });

test("a key names its PR by its leading number", () => {
  assert.deepEqual(prKeyOf("pr-assets/krizaka-com/193-v2-candidates/a.png"), {
    repo: "krizaka-com",
    key: "193-v2-candidates",
    pr: 193,
  });
  assert.equal(prKeyOf("pr-assets/krizaka-com/hero-topic/a.png").pr, null);
  assert.equal(prKeyOf("site/renders/x/a.png"), null);
});

test("pr-assets go 90 days after the PR closed, never before, never while it is open", () => {
  const objects = [obj("pr-assets/r/1/a.png", 5), obj("pr-assets/r/2/a.png", 5), obj("pr-assets/r/3/a.png", 500)];
  const prs = new Map([
    ["r#1", { closedAt: now - 91 * DAY }],
    ["r#2", { closedAt: now - 89 * DAY }],
    ["r#3", { closedAt: null }],
  ]);
  assert.deepEqual(
    plan(objects, prs, now).map((i) => i.path),
    ["pr-assets/r/1/a.png"],
  );
});

test("a key with no readable PR is judged by the newest object of its folder", () => {
  const objects = [
    obj("pr-assets/r/topic/old.png", 200),
    obj("pr-assets/r/topic/new.png", 10),
    obj("pr-assets/r/old-topic/a.png", 200),
    obj("pr-assets/r/9/a.png", 200),
  ];
  assert.deepEqual(
    plan(objects, new Map(), now).map((i) => i.path),
    ["pr-assets/r/old-topic/a.png", "pr-assets/r/9/a.png"],
  );
});

test("render candidates go after 30 days, the chosen stay", () => {
  const objects = [
    obj("site/renders/2026-09-01-run/a.png", 40),
    obj("site/renders/2026-09-01-run/chosen/b.png", 40),
    obj("site/renders/2026-09-01-run/c-chosen.png", 40),
    obj("site/renders/2026-10-25-run/a.png", 6),
    obj("site/renders/2026-09-01-mixed/old.png", 40),
    obj("site/renders/2026-09-01-mixed/fresh.png", 2),
  ];
  assert.deepEqual(
    plan(objects, new Map(), now).map((i) => i.path),
    ["site/renders/2026-09-01-run/a.png"],
  );
  assert.equal(isChosen("site/renders/x/chosen/b.png"), true);
});

test("nothing outside pr-assets/ and site/renders/ is ever planned", () => {
  const objects = [obj("site/home/a.1234567890.png", 900), obj("org/v1/x.png", 900), obj("sites/blog/x.png", 900)];
  assert.deepEqual(plan(objects, new Map(), now), []);
});

test("the dry-run listing groups by folder with the weight", () => {
  const text = summary(
    [
      { path: "pr-assets/r/1/a.png", size: 2e9, why: "w" },
      { path: "pr-assets/r/1/b.png", size: 1e9, why: "w" },
    ],
    false,
  );
  assert.match(text, /dry run/);
  assert.match(text, /2 object\(s\), 3\.00 GB/);
  assert.match(text, /\| pr-assets\/r\/1 \| 2 \| 3000\.0 \|/);
});

test("PRs are read from GitHub; one it does not show is left out", async () => {
  const fetchImpl = async (url) =>
    url.endsWith("/pulls/1") ? { ok: true, json: async () => ({ closed_at: "2026-01-01T00:00:00Z" }) } : { ok: false };
  const prs = await readPrs(
    [obj("pr-assets/r/1/a.png", 1), obj("pr-assets/r/1/b.png", 1), obj("pr-assets/r/2/a.png", 1)],
    { fetchImpl },
  );
  assert.deepEqual([...prs], [["r#1", { closedAt: Date.parse("2026-01-01T00:00:00Z") }]]);
});

test("the ui site's folder is a foreign writer: prune never names it from this manifest", () => {
  assert.ok(FOREIGN_WRITERS_V2.includes("sites/ui/"));
});

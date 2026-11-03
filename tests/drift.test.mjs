import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { CRITERIA } from "../scripts/dev-preview-lib.mjs";
import * as prettier from "prettier";
import {
  formatSnapshot,
  shopUrls,
  staleSnapshot,
  statusFindings,
  urlFindings,
  verdict,
} from "../scripts/drift-lib.mjs";

// The weekly drift check (scripts/check-drift.mjs): a changed source changes the finding; a missing source fails.
const TODAY = "2026-10-31";
const checklist = (product, over = {}) => {
  const criteria = {};
  for (const id of CRITERIA) criteria[id] = { evidence: `https://example.com/${id}`, checked: "2026-10-30", ...over };
  return { version: 1, product, criteria };
};

test("a complete checklist under a lower status is a drift: the source moved", () => {
  const f = statusFindings({ yomizaka: "development" }, { yomizaka: checklist("yomizaka") }, { today: TODAY });
  assert.equal(f.length, 1);
  assert.equal(f[0].kind, "drift");
  assert.match(f[0].message, /supports "devPreview"/);
});

test("the same product with an incomplete checklist is in line: no finding", () => {
  const c = checklist("yomizaka");
  c.criteria["journey.core"] = { evidence: null, gap: "not yet" };
  assert.deepEqual(statusFindings({ yomizaka: "development" }, { yomizaka: c }, { today: TODAY }), []);
});

test("devPreview over an incomplete checklist is a drift; an unreadable checklist is missing", () => {
  const c = checklist("orazaka");
  c.criteria["site.healthy"] = { evidence: null };
  const f = statusFindings({ orazaka: "devPreview", akinaza: "development" }, { orazaka: c }, { today: TODAY });
  assert.deepEqual(
    f.map((x) => [x.claim, x.kind]),
    [
      ["orazaka.status", "drift"],
      ["akinaza.status", "missing"],
    ],
  );
});

test("a snapshot older than the limit is a drift, a fresh one is not, a bad date is missing", () => {
  assert.equal(staleSnapshot("2026-10-30", { today: TODAY }).length, 0);
  assert.equal(staleSnapshot("2026-10-15", { today: TODAY })[0].kind, "drift");
  assert.equal(staleSnapshot("nope", { today: TODAY })[0].kind, "missing");
});

test("a video or a poster that does not answer is missing, and the verdict fails loudly", () => {
  const url = "https://cdn.example/sites/www/brand-films/relay.0123456789.mp4";
  const f = urlFindings("media", { [url]: 404, "https://cdn.example/ok": 200, "https://cdn.example/down": null });
  assert.equal(f.length, 2);
  const v = verdict(f);
  assert.equal(v.ok, false);
  assert.equal(v.missing, 2);
});

test("drift alone passes (the update PR fixes it) unless strict", () => {
  const f = staleSnapshot("2026-10-01", { today: TODAY });
  assert.equal(verdict(f).ok, true);
  assert.equal(verdict(f, { strict: true }).ok, false);
});

test("the update PR names its branch: persist-credentials is off, so gh cannot infer it", () => {
  const wf = readFileSync(new URL("../.github/workflows/drift.yml", import.meta.url), "utf8");
  const create = wf.split("\n").find((l) => l.includes("gh pr create"));
  assert.match(create, /--head "\$branch"/);
  assert.match(wf, /branch="chore\/drift-[^"]*\$\{GITHUB_RUN_ID\}"/, "one branch per run, so a rerun never collides");
});

test("the products' manifests snapshot is written the way prettier formats it (format:check never fails on a drift PR)", async () => {
  const snapshot = {
    readAt: "2026-11-02",
    products: { akinaza: { sources: ["a:package.json"], npm: ["@krizaka/ui"], maven: [], evidence: [] } },
  };
  const text = await formatSnapshot(snapshot);
  assert.equal(await prettier.check(text, { parser: "json" }), true);
  assert.deepEqual(JSON.parse(text), snapshot);
});

test("every demo-shop address a public page links is found, once, so the weekly check can fetch it (A4)", () => {
  const text =
    'a href="https://pattes-saint-henri.akinaza.shop/" and https://pattes-saint-henri.akinaza.shop/ again, https://www.akinaza.com, https://x.akinaza.shop/menu?a=1)';
  assert.deepEqual(shopUrls(text), ["https://pattes-saint-henri.akinaza.shop/", "https://x.akinaza.shop/menu?a=1"]);
  assert.deepEqual(shopUrls("nothing here"), []);
});

test("a shop address that does not answer fails the check (TLS error = unreachable)", () => {
  const f = urlFindings("shop addresses", { "https://pattes-saint-henri.akinaza.shop/": null });
  assert.equal(verdict(f).ok, false);
  assert.match(verdict(f).lines[0], /unreachable/);
});

test("no public source links a *.akinaza.shop address today (its TLS handshake fails, krizaka-internal#1907)", () => {
  const files = ["lib", "app", "messages", "content"].flatMap((d) =>
    readdirSync(new URL(`../${d}/`, import.meta.url), { recursive: true, withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => join(e.parentPath, e.name)),
  );
  const found = files.flatMap((f) => shopUrls(readFileSync(f, "utf8")));
  assert.deepEqual(found, []);
});

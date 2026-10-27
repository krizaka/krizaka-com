import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { healthzUrl, mergeVersions, versionOfHealthz } from "../scripts/dev-versions-lib.mjs";
import { wwwHost, wwwUrl } from "../lib/product-hosts.ts";

// 2026-10-26: each product's card shows its dev address and the version its dev site runs — read at build from /api/healthz
// (scripts/gen-dev-versions.mjs, like the registries' versions), never typed.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const IDS = ["orazaka", "yomizaka", "akinaza"];

test("a healthz answer gives a version only when the product says ok and the version looks like one", () => {
  assert.equal(versionOfHealthz({ status: "ok", version: "0.1.0+df25bed" }), "0.1.0+df25bed");
  assert.equal(versionOfHealthz({ status: "ok", version: "1.0.0" }), "1.0.0");
  assert.equal(versionOfHealthz({ status: "down", version: "1.0.0" }), undefined);
  assert.equal(versionOfHealthz({ status: "ok", version: "<html>" }), undefined);
  assert.equal(versionOfHealthz({ status: "ok" }), undefined);
  assert.equal(versionOfHealthz(null), undefined);
});

test("an unreachable dev site keeps the previous version, and without one shows none", () => {
  const previous = { versions: { orazaka: "1.0.0+aaaaaaa", yomizaka: "0.1.0+bbbbbbb" } };
  assert.deepEqual(mergeVersions(IDS, { orazaka: "1.0.1+ccccccc" }, previous), { orazaka: "1.0.1+ccccccc", yomizaka: "0.1.0+bbbbbbb" });
  assert.deepEqual(mergeVersions(IDS, {}, {}), {});
});

test("the www address and the healthz address of a product follow its id (dev is exposed as www)", () => {
  assert.equal(wwwHost("akinaza"), "www.akinaza.com");
  assert.equal(wwwUrl("yomizaka"), "https://www.yomizaka.com");
  assert.equal(healthzUrl("orazaka"), "https://www.orazaka.com/api/healthz");
});

test("every product has its www site, and the card shows it with the build-read version", () => {
  const products = read("lib/products.ts");
  for (const id of IDS) assert.match(products, new RegExp(`id: "${id}"[^\\n]*siteUrl: wwwUrl\\("${id}"\\)`), id);
  const showcase = read("app/components/home/ProductShowcase.tsx");
  assert.match(showcase, /import \{ devVersion \} from "@\/lib\/dev-versions"/);
  assert.match(showcase, /href: p\.siteUrl/, "the name and « See the site » go to www (dev is exposed there)");
  assert.match(showcase, /host\(p\.siteUrl\)/);
  assert.match(showcase, /devVersion\(p\.id\)/);
  assert.doesNotMatch(showcase, /\d+\.\d+\.\d+/, "no version typed in the component");
  assert.doesNotMatch(read("lib/dev-versions.ts"), /\d+\.\d+\.\d+/, "no version typed in the reader");
});

test("the versions are generated at build and by dev, git-ignored", () => {
  const pkg = JSON.parse(read("package.json")).scripts;
  assert.match(pkg.build, /gen-dev-versions\.mjs/);
  assert.match(pkg.dev, /gen-dev-versions\.mjs/);
  assert.match(read(".gitignore"), /^lib\/dev-versions\.json$/m);
});

test("the words: « See the site » / « Voir le site » exist in both languages", () => {
  for (const lang of ["en", "fr"]) {
    const m = JSON.parse(read(`messages/${lang}.json`)).site;
    for (const k of ["visitSite", "visitSiteAria"]) assert.ok(m.products[k], `${lang}: products.${k}`);
    for (const k of ["site", "version"]) assert.ok(m.home.products.fields[k], `${lang}: fields.${k}`);
  }
  assert.equal(JSON.parse(read("messages/fr.json")).site.products.visitSite, "Voir le site");
  assert.equal(JSON.parse(read("messages/en.json")).site.products.visitSite, "See the site");
});

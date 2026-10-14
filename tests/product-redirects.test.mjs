import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { PRODUCT_SITES, productRedirects } from "../lib/product-redirects.ts";

// The products live on their own sites (dev.<product>.com): every old address of a product page, demo or documentation
// answers 308 with the product's site. The sources are matched with the same path-to-regexp Next.js compiles them with.
const require = createRequire(import.meta.url);
const { match } = require("next/dist/compiled/path-to-regexp");
const rules = productRedirects().map((rule) => ({ ...rule, matches: match(rule.source, { decode: decodeURIComponent }) }));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

/** Where an old address goes: the first rule that matches it. */
const go = (path) => rules.find((rule) => rule.matches(path));

test("the products' sites: Yazakia is renamed Yasakia", () => {
  assert.deepEqual(PRODUCT_SITES, {
    orazaka: "https://dev.orazaka.com",
    orochia: "https://dev.orochia.com",
    yasakia: "https://dev.yasakia.com",
    yororis: "https://dev.yororis.com",
  });
});

test("every /products/<product> address — with or without the locale, any depth — goes to the product's site, 308", () => {
  for (const [id, site] of Object.entries(PRODUCT_SITES)) {
    for (const path of [`/products/${id}`, `/en/products/${id}`, `/fr/products/${id}`, `/en/products/${id}/demos`, `/fr/products/${id}/usecases/some-case`, `/products/${id}/docs`]) {
      const rule = go(path);
      assert.ok(rule, path);
      assert.equal(rule.destination, site, path);
      assert.equal(rule.statusCode, 308, path);
    }
  }
});

test("Yazakia's old address goes to Yasakia's site, with or without the locale", () => {
  for (const path of ["/products/yazakia", "/en/products/yazakia", "/fr/products/yazakia/demos"]) {
    const rule = go(path);
    assert.ok(rule, path);
    assert.equal(rule.destination, "https://dev.yasakia.com", path);
    assert.equal(rule.statusCode, 308, path);
  }
});

test("the products' documentation goes to the product's site: Orazaka and Orochia to /docs, Yororis to its home", () => {
  for (const [path, destination] of [
    ["/docs/orazaka", "https://dev.orazaka.com/docs"],
    ["/en/docs/orazaka/cli", "https://dev.orazaka.com/docs"],
    ["/fr/docs/orazaka/ui/button", "https://dev.orazaka.com/docs"],
    ["/docs/orochia", "https://dev.orochia.com/docs"],
    ["/en/docs/orochia/admin_console", "https://dev.orochia.com/docs"],
    ["/docs/yororis", "https://dev.yororis.com"],
    ["/fr/docs/yororis", "https://dev.yororis.com"],
  ]) {
    const rule = go(path);
    assert.ok(rule, path);
    assert.equal(rule.destination, destination, path);
    assert.equal(rule.statusCode, 308, path);
  }
});

test("the old Orazaka addresses that redirected to /products/orazaka/… go to its site", () => {
  for (const path of ["/orazaka", "/en/architecture", "/demos", "/fr/editions", "/get-started", "/ingenierie-cognitive", "/en/packages", "/roadmap", "/solutions", "/en/use-cases", "/fr/use-cases/some-case"]) {
    assert.equal(go(path)?.destination, "https://dev.orazaka.com", path);
  }
});

test("what stays on krizaka.com is never redirected", () => {
  for (const path of ["/", "/en", "/products", "/en/products", "/fr/products", "/story", "/open-source", "/en/open-source/ui", "/contact", "/privacy", "/terms", "/docs", "/en/docs", "/en/docs/ui", "/en/docs/ui/button", "/products/orazakax"]) {
    assert.equal(go(path), undefined, path);
  }
});

test("next.config.ts serves these redirects, and no product page, product docs set or kit is left", () => {
  assert.match(read("next.config.ts"), /\.\.\.productRedirects\(\)/);
  assert.deepEqual(readdirSync(new URL("../app/[locale]/products", import.meta.url)), ["page.tsx"]);
  assert.match(read("lib/docs-source.ts"), /export const DOCS_SECTIONS = \["ui"\] as const/);
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies["@krizaka/orazaka-design-system"], undefined);
  assert.equal(pkg.dependencies["@krizaka/orochia-design-system"], undefined);
});

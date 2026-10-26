import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { PRODUCT_SITES, productRedirects } from "../lib/product-redirects.ts";

// The products live on their own sites (www.<product>.com): every old address of a product page, demo or documentation
// answers 308 with the product's site. The sources are matched with the same path-to-regexp (6.x) Next.js compiles them with.
const require = createRequire(import.meta.url);
const { match } = require("path-to-regexp");
const rules = productRedirects().map((rule) => ({ ...rule, matches: match(rule.source, { decode: decodeURIComponent }) }));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

/** Where an old address goes: the first rule that matches it. */
const go = (path) => rules.find((rule) => rule.matches(path));

test("the products' sites: the three presented products, each at www.<product>.com", () => {
  assert.deepEqual(PRODUCT_SITES, {
    orazaka: "https://www.orazaka.com",
    yomizaka: "https://www.yomizaka.com",
    akinaza: "https://www.akinaza.com",
  });
});

test("Yomizaka's documentation goes to its site (#171)", () => {
  const rule = go("/fr/docs/yomizaka/getting-started");
  assert.equal(rule?.destination, "https://www.yomizaka.com");
  assert.equal(rule?.statusCode, 308);
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

test("the paused products' old addresses (2026-10-25) answer 308 with the home's products section, never a 404", () => {
  for (const id of ["orochia", "yasakia", "yazakia", "yororis", "kachizaka"]) {
    for (const path of [`/products/${id}`, `/en/products/${id}`, `/fr/products/${id}/demos`, `/docs/${id}`, `/en/docs/${id}/admin_console`]) {
      const rule = go(path);
      assert.ok(rule, path);
      assert.equal(rule.destination, "/#products", path);
      assert.equal(rule.statusCode, 308, path);
    }
  }
});

test("the products' documentation goes to the product's site", () => {
  for (const [path, destination] of [
    ["/docs/orazaka", "https://www.orazaka.com"],
    ["/en/docs/orazaka/cli", "https://www.orazaka.com"],
    ["/fr/docs/orazaka/ui/button", "https://www.orazaka.com"],
    ["/docs/yomizaka", "https://www.yomizaka.com"],
  ]) {
    const rule = go(path);
    assert.ok(rule, path);
    assert.equal(rule.destination, destination, path);
    assert.equal(rule.statusCode, 308, path);
  }
});

test("the old Orazaka addresses that redirected to /products/orazaka/… go to its site", () => {
  for (const path of ["/orazaka", "/en/architecture", "/demos", "/fr/editions", "/get-started", "/ingenierie-cognitive", "/en/packages", "/roadmap", "/solutions", "/en/use-cases", "/fr/use-cases/some-case"]) {
    assert.equal(go(path)?.destination, "https://www.orazaka.com", path);
  }
});

test("/products merged into the home (two views, 2026-10-17): it answers 308 with the home's products section, same language", () => {
  for (const [path, destination, locale] of [["/products", "/#products"], ["/en/products", "/:locale#products", "en"], ["/fr/products", "/:locale#products", "fr"]]) {
    const rule = go(path);
    assert.equal(rule?.statusCode, 308, path);
    assert.equal(rule.destination, destination, path);
    assert.equal(rule.matches(path).params.locale, locale, path);
  }
});

test("what stays on krizaka.com is never redirected", () => {
  for (const path of ["/", "/en", "/story", "/open-source", "/en/open-source/ui", "/contact", "/privacy", "/terms", "/docs", "/en/docs", "/en/docs/ui", "/en/docs/ui/button", "/products/orazakax"]) {
    assert.equal(go(path), undefined, path);
  }
});

test("next.config.ts serves these redirects, and no product page, product docs set or kit is left", () => {
  assert.match(read("next.config.ts"), /\.\.\.productRedirects\(\)/);
  assert.ok(!existsSync(new URL("../app/[locale]/products", import.meta.url)), "the products page came back");
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies["@krizaka/orazaka-design-system"], undefined);
  assert.equal(pkg.dependencies["@krizaka/orochia-design-system"], undefined);
});

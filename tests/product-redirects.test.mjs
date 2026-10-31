import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { PRODUCT_SITES, lastResortRedirects, productRedirects } from "../lib/product-redirects.ts";

// The products live on their own sites (www.<product>.com): every old address of a product page, demo or documentation
// answers 308 with the product's site. The sources are matched with the same path-to-regexp (6.x) Next.js compiles them with.
const require = createRequire(import.meta.url);
const { match } = require("path-to-regexp");
const rules = productRedirects().map((rule) => ({
  ...rule,
  matches: match(rule.source, { decode: decodeURIComponent }),
}));
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

test("Yomizaka's documentation lands on its /docs page, in the language of the address (#171, yomizaka#387)", () => {
  for (const [path, destination] of [
    ["/fr/docs/yomizaka/getting-started", "https://www.yomizaka.com/:locale/docs"],
    ["/en/docs/yomizaka", "https://www.yomizaka.com/:locale/docs"],
    ["/docs/yomizaka", "https://www.yomizaka.com/docs"],
    ["/docs/yomizaka/api", "https://www.yomizaka.com/docs"],
  ]) {
    const rule = go(path);
    assert.equal(rule?.destination, destination, path);
    assert.equal(rule?.statusCode, 308, path);
  }
});

test("every /products/<product> address — with or without the locale, any depth — goes to the product's site, 308", () => {
  for (const [id, site] of Object.entries(PRODUCT_SITES)) {
    for (const path of [
      `/products/${id}`,
      `/en/products/${id}`,
      `/fr/products/${id}`,
      `/en/products/${id}/demos`,
      `/fr/products/${id}/usecases/some-case`,
      `/products/${id}/docs`,
    ]) {
      const rule = go(path);
      assert.ok(rule, path);
      assert.equal(rule.destination, site, path);
      assert.equal(rule.statusCode, 308, path);
    }
  }
});

test("the old address of a product that left (krizaka/.github#413) answers 308 with the home's products section, never a 404", () => {
  for (const id of ["former", "gone"]) {
    for (const path of [`/products/${id}`, `/en/products/${id}`, `/fr/products/${id}/demos`]) {
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
    ["/docs/yomizaka", "https://www.yomizaka.com/docs"],
  ]) {
    const rule = go(path);
    assert.ok(rule, path);
    assert.equal(rule.destination, destination, path);
    assert.equal(rule.statusCode, 308, path);
  }
});

test("the old Orazaka addresses that redirected to /products/orazaka/… go to its site", () => {
  for (const path of [
    "/orazaka",
    "/en/architecture",
    "/demos",
    "/fr/editions",
    "/get-started",
    "/ingenierie-cognitive",
    "/en/packages",
    "/roadmap",
    "/solutions",
    "/en/use-cases",
    "/fr/use-cases/some-case",
  ]) {
    assert.equal(go(path)?.destination, "https://www.orazaka.com", path);
  }
});

test("/products merged into the home (two views, 2026-10-17): it answers 308 with the home's products section, same language", () => {
  for (const [path, destination, locale] of [
    ["/products", "/#products"],
    ["/en/products", "/:locale#products", "en"],
    ["/fr/products", "/:locale#products", "fr"],
  ]) {
    const rule = go(path);
    assert.equal(rule?.statusCode, 308, path);
    assert.equal(rule.destination, destination, path);
    assert.equal(rule.matches(path).params.locale, locale, path);
  }
});

test("what stays on krizaka.com is never redirected", () => {
  for (const path of [
    "/",
    "/en",
    "/story",
    "/open-source",
    "/en/open-source/ui",
    "/contact",
    "/privacy",
    "/terms",
    "/docs",
    "/en/docs",
    "/en/docs/ui",
    "/en/docs/ui/button",
  ]) {
    assert.equal(go(path), undefined, path);
  }
});

test("next.config.ts serves these redirects, and no product page, product docs set or kit is left", () => {
  assert.match(read("next.config.ts"), /\.\.\.productRedirects\(\)/);
  assert.ok(!existsSync(new URL("../app/[locale]/products", import.meta.url)), "the products page came back");
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.dependencies["@krizaka/orazaka-design-system"], undefined);
});

test("an old documentation address no rule claims goes to the products section, after every other rule (krizaka/.github#413)", () => {
  const last = lastResortRedirects().map((rule) => ({
    ...rule,
    matches: match(rule.source, { decode: decodeURIComponent }),
  }));
  for (const path of [
    "/docs/some-product",
    "/docs/some-product/getting-started",
    "/fr/docs/some-product/api",
    "/en/docs/a/b/c",
  ]) {
    const rule = last.find((r) => r.matches(path));
    assert.equal(rule?.destination, "/#products", path);
    assert.equal(rule?.statusCode, 308, path);
  }
  for (const path of ["/docs", "/en/docs", "/fr/docs"])
    assert.equal(
      last.find((r) => r.matches(path)),
      undefined,
      path,
    );
  const config = read("next.config.ts");
  const at = (name) => config.indexOf(`...${name}()`);
  assert.ok(
    at("lastResortRedirects") > at("uiRedirects") &&
      at("uiRedirects") > at("javaRedirects") &&
      at("javaRedirects") > at("productRedirects"),
    "the last resort is served after the product, Java and UI rules",
  );
});

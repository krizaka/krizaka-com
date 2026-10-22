import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { negotiateLocale } from "../lib/locale-negotiation.ts";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("Loi 96: no cookie and no header opens in French", () => {
  assert.equal(negotiateLocale(undefined, null), "fr");
  assert.equal(negotiateLocale(undefined, ""), "fr");
  assert.equal(negotiateLocale(undefined, "de-DE,de;q=0.9"), "fr");
});

test("French anywhere in the browser's languages wins (Quebec)", () => {
  assert.equal(negotiateLocale(undefined, "fr-CA,fr;q=0.9,en;q=0.8"), "fr");
  assert.equal(negotiateLocale(undefined, "en-CA,en;q=0.9,fr-CA;q=0.5"), "fr");
});

test("English only when the browser prefers it and never asks for French", () => {
  assert.equal(negotiateLocale(undefined, "en-US,en;q=0.9"), "en");
});

test("the cookie always wins", () => {
  assert.equal(negotiateLocale("en", "fr-CA"), "en");
  assert.equal(negotiateLocale("fr", "en-US"), "fr");
  assert.equal(negotiateLocale("xx", "en-US"), "en");
});

test("the proxy uses it, and hreflang x-default points to French (page and sitemap)", () => {
  assert.match(read("proxy.ts"), /negotiateLocale\(/);
  assert.doesNotMatch(read("proxy.ts"), /defaultLocale = "en"/);
  assert.match(read("lib/seo.ts"), /"x-default": `\$\{SITE_URL\}\/fr\$\{p\}`/);
  assert.match(read("app/sitemap.ts"), /"x-default": `\$\{baseUrl\}\/fr\$\{path\}`/);
});

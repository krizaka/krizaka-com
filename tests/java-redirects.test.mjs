import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { JAVA_BLOCK_PAGES, JAVA_PAGES, JAVA_SITE, javaRedirects } from "../lib/java-redirects.ts";

// Krizaka Java's documentation lives on java.krizaka.com: every old /docs/java address answers 308 with the same page there.
const require = createRequire(import.meta.url);
const { match } = require("next/dist/compiled/path-to-regexp");
const rules = javaRedirects().map((rule) => ({ ...rule, matches: match(rule.source, { decode: decodeURIComponent }) }));
const go = (path) => {
  for (const rule of rules) {
    const m = rule.matches(path);
    if (m) return { statusCode: rule.statusCode, destination: rule.destination.replace(":slug", m.params.slug ?? "") };
  }
};

test("the site is java.krizaka.com", () => {
  assert.equal(JAVA_SITE, "https://java.krizaka.com");
});

test("the home of /docs/java goes to the site's home, in each language, 308", () => {
  assert.deepEqual(go("/docs/java"), { statusCode: 308, destination: "https://java.krizaka.com/" });
  assert.deepEqual(go("/en/docs/java"), { statusCode: 308, destination: "https://java.krizaka.com/" });
  assert.deepEqual(go("/fr/docs/java"), { statusCode: 308, destination: "https://java.krizaka.com/fr/" });
});

test("every former guide goes to the same page, with or without the locale", () => {
  for (const slug of JAVA_PAGES) {
    assert.equal(go(`/docs/java/${slug}`)?.destination, `https://java.krizaka.com/${slug}/`, slug);
    assert.equal(go(`/en/docs/java/${slug}`)?.destination, `https://java.krizaka.com/${slug}/`, slug);
    assert.equal(go(`/fr/docs/java/${slug}`)?.destination, `https://java.krizaka.com/fr/${slug}/`, slug);
    assert.equal(go(`/fr/docs/java/${slug}`)?.statusCode, 308, slug);
  }
});

test("every Java building block's page (/open-source/<block>) goes to its page on the site, 308", () => {
  const expected = { "krizaka-platform-kit": "", "krizaka-build": "build/", "krizaka-users": "users/", "krizaka-billing": "billing/", "krizaka-notifications": "notifications/" };
  assert.deepEqual(Object.fromEntries(Object.entries(JAVA_BLOCK_PAGES).map(([k, v]) => [k, v ? `${v}/` : ""])), expected);
  for (const [id, page] of Object.entries(expected)) {
    assert.deepEqual(go(`/open-source/${id}`), { statusCode: 308, destination: `https://java.krizaka.com/${page}` }, id);
    assert.deepEqual(go(`/en/open-source/${id}`), { statusCode: 308, destination: `https://java.krizaka.com/${page}` }, id);
    assert.deepEqual(go(`/fr/open-source/${id}`), { statusCode: 308, destination: `https://java.krizaka.com/fr/${page}` }, id);
  }
});

test("Krizaka UI's block page stays here", () => {
  assert.equal(go("/en/open-source/krizaka-ui"), undefined);
  assert.equal(go("/open-source"), undefined);
});

test("a page the site does not have falls back to its home", () => {
  assert.equal(go("/en/docs/java/removed-page")?.destination, "https://java.krizaka.com/");
  assert.equal(go("/fr/docs/java/a/b")?.destination, "https://java.krizaka.com/fr/");
});

test("what stays on krizaka.com is not redirected", () => {
  for (const path of ["/docs", "/en/docs/ui", "/en/docs/ui/button", "/docs/javascript", "/open-source", "/en/open-source/krizaka-ui", "/en/open-source/krizaka-buildx"]) {
    assert.equal(go(path), undefined, path);
  }
});

test("the guides listed here are the ones java.krizaka.com serves (krizaka-build/site/content/docs)", async () => {
  const res = await fetch("https://raw.githubusercontent.com/krizaka/krizaka-build/main/site/content/docs/meta.json").catch(() => null);
  if (!res?.ok) return; // offline: the redirect list is still checked above
  const pages = (await res.json()).pages.filter((p) => !p.startsWith("---") && p !== "index");
  assert.deepEqual([...JAVA_PAGES].sort(), pages.sort());
});

test("next.config.ts serves them, and nothing of the Java documentation is left here", () => {
  assert.match(readFileSync(new URL("../next.config.ts", import.meta.url), "utf8"), /\.\.\.javaRedirects\(\)/);
  assert.ok(!existsSync(new URL("../content/docs/java", import.meta.url)), "content/docs/java came back");
  assert.ok(!existsSync(new URL("../app/components/diagrams", import.meta.url)), "the module map came back");
  assert.deepEqual(readdirSync(new URL("../content/docs", import.meta.url)), ["ui"]);
});

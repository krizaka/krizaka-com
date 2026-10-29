import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { UI_SITE, uiPathOf, uiRedirects } from "../lib/ui-redirects.ts";

// Krizaka UI's documentation moved to ui.krizaka.com: every old /docs/ui address — with or without the locale — answers
// 308 with its page there. The sources are matched with the same path-to-regexp (6.x) Next.js compiles them with.
const require = createRequire(import.meta.url);
const { match } = require("path-to-regexp");
const rules = uiRedirects().map((rule) => ({ ...rule, matches: match(rule.source, { decode: decodeURIComponent }) }));

/** Where an old address goes: the first rule that matches it, its destination filled with the matched params. */
function go(path) {
  for (const rule of rules) {
    const hit = rule.matches(path);
    if (hit) return { status: rule.statusCode, to: rule.destination.replace(/:(\w+)/g, (_m, k) => hit.params[k]) };
  }
  return null;
}

const CASES = {
  "": "/",
  installation: "/installation",
  theming: "/theming",
  tokens: "/foundations/tokens",
  typography: "/foundations/typography",
  icons: "/foundations/icons",
  motion: "/foundations/motion",
  "brand-marks": "/foundations/brand-marks",
  tailwind: "/packages/tailwind",
  intl: "/packages/intl",
  i18n: "/packages/i18n",
  query: "/packages/query",
  realtime: "/packages/realtime",
  push: "/packages/push",
  config: "/packages/config",
  mobile: "/mobile",
  templates: "/templates",
  screens: "/templates",
  "templates-convince": "/templates/convince",
  "templates-recover": "/templates/recover",
  button: "/components/button",
  "line-chart": "/components/line-chart",
  "page-hero": "/components/page-hero",
};

test("every old /docs/ui page goes to its page on ui.krizaka.com — English at the path, French under /fr — 308", () => {
  for (const [slug, path] of Object.entries(CASES)) {
    const tail = slug ? `/${slug}` : "";
    for (const [from, to] of [
      [`/docs/ui${tail}`, `${UI_SITE}${path}`],
      [`/en/docs/ui${tail}`, `${UI_SITE}${path}`],
      [`/fr/docs/ui${tail}`, `${UI_SITE}/fr${path}`],
    ]) {
      const hit = go(from);
      assert.ok(hit, from);
      assert.equal(hit.status, 308, from);
      assert.equal(hit.to, to.endsWith("/") ? to : `${to}/`, from);
    }
    assert.equal(uiPathOf(slug), path, slug);
  }
});

test("the old documentation hub goes to the open-source page, in the reader's language", () => {
  assert.deepEqual(go("/docs"), { status: 308, to: "/en/open-source" });
  assert.deepEqual(go("/en/docs"), { status: 308, to: "/en/open-source" });
  assert.deepEqual(go("/fr/docs"), { status: 308, to: "/fr/open-source" });
});

test("the redirects leave the rest of krizaka.com alone (Krizaka Java's own rules, the products page)", () => {
  for (const path of ["/docs/java", "/fr/docs/java/build", "/en/products", "/en/docs/uikit", "/en/open-source"])
    assert.equal(go(path), null, path);
});

test("Fumadocs and the generated UI docs are gone from krizaka.com", () => {
  for (const file of [
    "source.config.ts",
    "lib/docs-source.ts",
    "scripts/gen-ui-docs.mjs",
    "content/docs",
    "app/[locale]/docs",
  ]) {
    assert.ok(!existsSync(new URL(`../${file}`, import.meta.url)), `${file} came back`);
  }
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  for (const dep of ["fumadocs-core", "fumadocs-mdx", "fumadocs-ui"])
    assert.equal(pkg.dependencies[dep], undefined, dep);
});

test("the Krizaka UI redirects are wired in next.config", () => {
  const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
  assert.match(config, /uiRedirects\(\)/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import retiredIds from "../lib/retired-product-ids.json" with { type: "json" };
import { existsSync, readFileSync } from "node:fs";
import { openSourceRepositories } from "../lib/repository-catalogue.ts";
import { isOperatedPackage, packageRows } from "../lib/package-catalogue.ts";
import { howItFits } from "../lib/how-it-fits.ts";
import { cssDecls, cssHas, cssSelectors, jsx } from "./helpers/source.mjs";

// 2026-10-26 (Oussama): the libraries leave the home and live on /open-source; /open-source lists only what is open source —
// the products are operated by Krizaka; the cards are pinned tags, slightly tilted, straight under reduced motion.
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
const PRODUCTS = ["sovkora", "verikora", "folioviv"];

test("the home has no library block: the stack rows are gone, /open-source carries the stack", () => {
  const home = read("app/[locale]/page.tsx");
  assert.doesNotMatch(home, /OpenStack|StackCards|StackRow/);
  assert.ok(
    !/export default/.test(read("app/components/home/OpenStack.tsx")),
    "OpenStack keeps only the cards of /open-source and /story",
  );
  assert.ok(!existsSync(new URL("../app/components/home/stack", import.meta.url)), "the rows' visuals are gone");
  assert.match(read("app/[locale]/story/page.tsx"), /<StackTiles locale=\{locale\} \/>/);
  assert.doesNotMatch(read("lib/home-sections.ts"), /"stack"/);
});

test("no product in the open-source repositories", () => {
  const repos = [
    "krizaka-ui",
    "krizaka-ts",
    "krizaka-build",
    "sovkora",
    "sovkora-cli",
    "sovkora-edge-service",
    "verikora",
    "folioviv",
    "template-next-app",
  ].map((name) => ({ name, archived: false }));
  assert.deepEqual(
    openSourceRepositories(repos, PRODUCTS).map((r) => r.name),
    ["krizaka-ui", "krizaka-ts", "krizaka-build", "template-next-app"],
  );
});

test("no product package in the open-source packages", () => {
  const snapshot = {
    npm: {
      "@krizaka/ui": "1.0.0",
      "@krizaka/orazaka-cli": "1.0.0",
      "@krizaka/orazaka-shared": "1.0.0",
      "@krizaka/orazaka-client": "1.0.0",
    },
    npmMeta: {
      "@krizaka/ui": { repository: "https://github.com/krizaka/krizaka-ui" },
      "@krizaka/orazaka-cli": { repository: "https://github.com/krizaka/sovkora-cli" },
      "@krizaka/orazaka-shared": { repository: "https://github.com/krizaka/sovkora-ui-kit" },
      "@krizaka/orazaka-client": { repository: "https://github.com/krizaka/krizaka-ts" },
    },
    maven: {},
  };
  const names = packageRows(snapshot, [], "https://java.example", PRODUCTS).map((r) => r.name);
  assert.deepEqual(
    names,
    ["@krizaka/orazaka-client", "@krizaka/ui"],
    "a library stays, even one that talks to a product",
  );
});

test("how it fits has no product and no engine layer", () => {
  const layers = howItFits({ sovkora: { npm: ["@krizaka/ui"], maven: ["krizaka-bom"] } }, {}, {});
  assert.deepEqual(Object.keys(layers), ["blocks", "services"]);
  assert.match(read("app/[locale]/docs/HowItFits.tsx"), /os-fits/);
  assert.doesNotMatch(read("app/[locale]/docs/HowItFits.tsx"), /ProductLogo|brand-/);
});

test("the open-source page and its tables name no product, claim no licence for one", () => {
  const page = read("app/[locale]/docs/page.tsx");
  assert.match(page, /openSourceRepositories\(allRepositories, PRODUCT_IDS\)/);
  assert.doesNotMatch(page, /ProductStackTable|ENGINE_USES|runs-on/);
  const tables = read("app/[locale]/docs/OpenSourceTables.tsx");
  assert.doesNotMatch(tables, /id: "product"|usedBy/);
  for (const lang of ["en", "fr"]) {
    const o = JSON.parse(read(`messages/${lang}.json`)).site.openSource;
    assert.equal(o.repositories.product, undefined, lang);
    assert.equal(o.runs, undefined, lang);
    const words = JSON.stringify([o.title, o.lead, o.fits, o.repositories]);
    for (const name of ["Sovkora", "Verikora", "Folioviv"])
      assert.doesNotMatch(words, new RegExp(name), `${lang}: ${name}`);
  }
  assert.match(JSON.parse(read("messages/en.json")).site.openSource.lead, /operated by Krizaka/);
});

test("the rows are not cards: no tilt, no transform, no plate, nothing under the pointer (krizaka-internal#3243)", () => {
  const css = "app/components/home/home.css";
  const rows = cssSelectors(css).filter((x) => /\.kz-row/.test(x));
  assert.ok(rows.length > 0, "the rows have their rules");
  for (const sel of rows) {
    const d = cssDecls(css, sel);
    assert.equal(d.transform, undefined, `${sel}: no transform`);
    assert.equal(d.animation, undefined, `${sel}: no animation`);
  }
  assert.ok(!cssSelectors(css).some((x) => /\.kz-entry(?!-flow)/.test(x)), "no entry (tag and plate) rule is left");
});

test("the visuals show what the apps do: the finding with its passage and law, the booking's paid invoice, said as demo", () => {
  const visuals = read("app/components/home/visuals/ProductVisuals.tsx");
  for (const k of ["v.title", "v.badge", "v.passage", "v.law", "v.paid", "v.gst", "v.qst", "receipt("])
    assert.ok(visuals.includes(k), k);
  const css = read("app/components/home/visuals/visuals.css");
  assert.match(css, /aspect-ratio: 16 \/ 9/, "a fixed box");
  assert.match(css, /prefers-reduced-motion: reduce/);
  for (const lang of ["en", "fr"]) {
    const v = JSON.parse(read(`messages/${lang}.json`)).site.home.visuals;
    assert.match(v.verikora.demo, /demo|démo/i, lang);
    assert.match(v.folioviv.demo, /demo|démo/i, lang);
  }
});

test("a package published before the renames still names its repository by the retired id: it stays an operated product's, out of the open-source list", () => {
  const [retired] = Object.keys(retiredIds);
  const snapshot = {
    npm: { "@krizaka/ui": "3.0.0", "@krizaka/old-product-kit": "1.0.0" },
    npmMeta: {
      "@krizaka/ui": { repository: "https://github.com/krizaka/krizaka-ui" },
      "@krizaka/old-product-kit": { repository: `https://github.com/krizaka/${retired}-ui-kit` },
    },
    maven: {},
  };
  const names = packageRows(snapshot, [], "https://java.example", PRODUCTS).map((r) => r.name);
  assert.deepEqual(names, ["@krizaka/ui"]);
});

test("llms.txt lists the open-source packages the way /open-source does: an operated product's own packages are left out", () => {
  const [retired] = Object.keys(retiredIds);
  const meta = {
    "@krizaka/ui": { repository: "https://github.com/krizaka/krizaka-ui" },
    "@krizaka/product-kit": { repository: "https://github.com/krizaka/sovkora-ui-kit" },
    "@krizaka/old-product-kit": { repository: `https://github.com/krizaka/${retired}-ui-kit` },
  };
  assert.deepEqual(
    Object.keys(meta).filter((name) => isOperatedPackage(meta, name, ["sovkora"])),
    ["@krizaka/product-kit", "@krizaka/old-product-kit"],
  );
  assert.match(
    readFileSync(new URL("../lib/llms.ts", import.meta.url), "utf8"),
    /!isOperatedPackage\(data\.npmMeta, name, PRODUCT_IDS\)/,
  );
});

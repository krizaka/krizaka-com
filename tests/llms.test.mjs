import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { productLines, stackLines } from "../lib/llms-sections.ts";
import { PRODUCTS } from "../lib/products.ts";
import { STACK } from "../lib/stack.ts";

/* llms.txt and llms-full.txt said « ships seven products », Folioviv « in development » once it was paused, and pointed to
   /en/open-source (a 308): their products and their stack were typed by hand (krizaka-internal#2807). They are data now. */
const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const about = JSON.parse(read("content/llms-about.json"));
const en = JSON.parse(read("messages/en.json"));
const word = (s) => en.site.nav.status[s].label;
const FILES = ["content/llms.txt", "content/llms-full.txt"];

test("every product and every stack part has its line, and no line is left for what the site does not present", () => {
  assert.deepEqual(Object.keys(about.products).sort(), PRODUCTS.map((p) => p.id).sort());
  assert.deepEqual(Object.keys(about.stack).sort(), STACK.map((s) => s.id).sort());
});

test("each product line says the product's live status, its public address and its source", () => {
  const lines = productLines(PRODUCTS, about, word).split("\n");
  assert.equal(lines.length, PRODUCTS.length);
  for (const p of PRODUCTS) {
    const line = lines.find((l) => l.startsWith(`- ${p.name} (`));
    assert.ok(line, p.id);
    assert.ok(line.includes(`(${word(p.status).toLowerCase()})`), `${p.id}: status ${p.status}`);
    assert.ok(
      line.includes(`Site: ${p.siteUrl}`) &&
        (p.repoUrl ? line.includes(`source: ${p.repoUrl}`) : !line.includes("source:")),
      `${p.id}: addresses`,
    );
  }
  assert.deepEqual(
    lines.map((l) => l.slice(2, l.indexOf(" ("))),
    ["Sovkora", "Verikora", "Folioviv", "Kridoc"].filter((n) => PRODUCTS.some((p) => p.name === n)),
    "the home's order",
  );
});

test("a product or a stack part without its line fails the build, it is never left out quietly", () => {
  assert.throws(() => productLines(PRODUCTS, { products: {}, stack: {} }, word), /no line for the product/);
  assert.throws(() => stackLines(STACK, { products: {}, stack: {} }), /no line for the stack part/);
  assert.equal(stackLines(STACK, about).split("\n").length, STACK.length);
});

test("both files take their products and stack from the data, and type no product line of their own", () => {
  for (const f of FILES) {
    const text = read(f);
    assert.match(text, /\{\{PRODUCTS\}\}/, `${f}: the products are data`);
    assert.match(text, /\{\{STACK\}\}/, `${f}: the stack is data`);
    for (const p of PRODUCTS)
      assert.doesNotMatch(text, new RegExp(`^- ${p.name}\\b`, "m"), `${f}: no typed line for ${p.name}`);
  }
});

test("every krizaka.com address in the files is a page the sitemap lists, never a redirect (/en/open-source answered 308)", () => {
  const sitemap = read("app/sitemap.ts");
  const paths = [...sitemap.matchAll(/^\s+"(\/[a-z-]*)",$/gm)].map((m) => m[1]);
  for (const f of FILES)
    for (const [, path] of read(f).matchAll(/\{\{SITE_URL\}\}\/en(\/[a-z-]+)?/g)) {
      if (path) assert.ok(paths.includes(path), `${f}: /en${path} is not a page of the sitemap`);
    }
});

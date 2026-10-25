import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

// ADR-006: krizaka.com stays in the Cahier register. The 2027 product values (and Plus Jakarta Sans) apply only under
// `data-surface="product"` or a `.brand-<product>` root on html/body, which this site must never set.
const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "node_modules" ? [] : files(path);
    return /\.(tsx|ts)$/.test(name) ? [path] : [];
  });
const sources = ["app", "lib"].flatMap(files).map((f) => [f, readFileSync(f, "utf8")]);

test("no page sets the product surface", () => {
  for (const [file, src] of sources) assert.doesNotMatch(src, /data-surface\s*=\s*["{]/, file);
});

test("no brand root on html or body", () => {
  for (const [file, src] of sources) assert.doesNotMatch(src, /<(html|body)\b[^>]*brand-[a-z]+/, file);
});

test("Plus Jakarta Sans is never loaded here", () => {
  for (const [file, src] of sources) assert.doesNotMatch(src, /plus-jakarta|Plus_Jakarta|font-product-display/i, file);
});

test("the faces come from @krizaka/fonts, never Google Fonts", () => {
  for (const [file, src] of sources) assert.doesNotMatch(src, /next\/font\/google/, file);
});

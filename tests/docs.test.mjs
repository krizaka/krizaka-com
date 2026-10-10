import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolveDocHref } from "../lib/doc-links.ts";

const root = new URL("..", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));

test("written docs links get the reader's locale", () => {
  assert.equal(resolveDocHref("/docs/ui/tokens", "fr"), "/fr/docs/ui/tokens");
  assert.equal(resolveDocHref("https://github.com/krizaka", "fr"), "https://github.com/krizaka");
  assert.equal(resolveDocHref("#props", "en"), "#props");
});

test("synced product links resolve through the manifest, internal docs keep their link", () => {
  const product = { id: "orazaka", manifest: { architecture: {}, auth: {} } };
  assert.equal(resolveDocHref("ARCHITECTURE.md", "en", product), "/en/docs/orazaka/architecture");
  assert.equal(resolveDocHref("./docs/AUTH.md#jwt", "fr", product), "/fr/docs/orazaka/auth#jwt");
  assert.equal(resolveDocHref("../AGENTS.md", "en", product), "../AGENTS.md");
});

test("every @krizaka/ui primitive has a page, a demo and its title/description in both languages", () => {
  const index = read("node_modules/@krizaka/ui/registry/index.json");
  const demos = readFileSync(new URL("lib/ui-demos.ts", root), "utf8");
  const en = read("messages/en.json").docs.pages.ui;
  const fr = read("messages/fr.json").docs.pages.ui;
  assert.ok(index.items.length > 0);
  for (const { name } of index.items) {
    assert.ok(existsSync(new URL(`content/docs/ui/components/${name}.mdx`, root)), `${name}: page`);
    assert.ok(demos.includes(`"@krizaka/ui/registry/demos/${name}"`), `${name}: demo`);
    for (const [lang, pages] of [["en", en], ["fr", fr]]) {
      assert.ok(pages[name]?.title && pages[name]?.description, `${name}: ${lang} title/description`);
    }
    const item = read(`node_modules/@krizaka/ui/registry/${name}.json`);
    assert.ok(item.demo?.content, `${name}: demo source in the registry`);
  }
});

test("every written page has its title/description in both languages", async () => {
  const { readdirSync } = await import("node:fs");
  for (const section of ["ui", "java"]) {
    const en = read("messages/en.json").docs.pages[section];
    const fr = read("messages/fr.json").docs.pages[section];
    for (const file of readdirSync(new URL(`content/docs/${section}/`, root))) {
      if (!file.endsWith(".mdx")) continue;
      const key = file.replace(/\.mdx$/, "");
      assert.ok(en[key]?.title && fr[key]?.title, `${section}/${key}`);
    }
  }
});

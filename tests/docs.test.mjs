import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolveDocHref } from "../lib/doc-links.ts";

const root = new URL("..", import.meta.url);
const require = createRequire(import.meta.url);
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

test("every @krizaka/ui component is documented by its code: meta, examples, a live preview for each web example", () => {
  const index = read("node_modules/@krizaka/ui/registry/index.json");
  const examples = readFileSync(new URL("lib/ui-examples.ts", root), "utf8");
  assert.ok(index.items.length > 0);
  for (const { name } of index.items) {
    const item = read(`node_modules/@krizaka/ui/registry/${name}.json`);
    assert.ok(item.title && item.summary, `${name}: title and summary (meta.ts)`);
    assert.ok(["web", "native", "both"].includes(item.platforms), `${name}: platforms`);
    assert.ok(item.whenToUse.length && item.whenNotToUse.length && item.accessibility.notes.length, `${name}: when to use, when not, accessibility`);
    assert.equal(Boolean(item.web), item.platforms !== "native", `${name}: a web side when it runs on the web`);
    assert.equal(Boolean(item.native), item.platforms !== "web", `${name}: a native side when it runs in React Native`);
    for (const example of item.web?.examples ?? []) {
      assert.ok(examples.includes(`import("${example.module}")`), `${name}: ${example.name} is in lib/ui-examples.ts`);
      assert.ok(example.code.includes("export default function"), `${name}: ${example.name} has its code`);
    }
    for (const example of item.native?.examples ?? []) assert.ok(example.code.includes("@krizaka/ui/native"), `${name}: native ${example.name}`);
  }
});

test("an enrichment page belongs to a component, and the component pages need no message", () => {
  const { readdirSync } = require("node:fs");
  const names = new Set(read("node_modules/@krizaka/ui/registry/index.json").items.map((item) => item.name));
  for (const file of readdirSync(new URL("content/docs/ui/components/", root))) {
    if (file.endsWith(".mdx")) assert.ok(names.has(file.replace(/\.mdx$/, "")), `content/docs/ui/components/${file}`);
  }
  for (const lang of ["en", "fr"]) {
    const pages = read(`messages/${lang}.json`).docs.pages.ui;
    for (const name of names) assert.equal(pages[name], undefined, `${lang}: docs.pages.ui.${name} — a component's title comes from its code`);
  }
});

test("the documentation is one place: no link to a public Storybook", () => {
  for (const file of ["lib/nav.ts", "lib/site.ts", ".env.example", "messages/en.json", "messages/fr.json"]) {
    const text = readFileSync(new URL(file, root), "utf8");
    assert.ok(!/storybook|krizaka\.github\.io\/krizaka-ui|ui\.krizaka\.com/i.test(text), file);
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

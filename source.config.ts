/* Fumadocs collections — four documentation sets, one engine.
   - ui, java: written here (content/docs/**), MDX with the live-preview components.
   - orazaka, orochia: synced from the product repositories (never edited here). Only the files the publication
     manifests list are compiled: an internal doc never reaches the build, let alone the site. */

import { readdirSync } from "node:fs";
import path from "node:path";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins";
import { pageSchema } from "fumadocs-core/source/schema";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import type { Root } from "mdast";
import { DOCS_MANIFEST } from "./lib/docs-manifest";
import { OROCHIA_DOCS_MANIFEST } from "./lib/orochia-docs-manifest";

/** The synced markdown files a manifest publishes (the manifest is keyed by the lower-cased file name). */
function published(dir: string, manifest: Record<string, unknown>): string[] {
  return readdirSync(path.join(process.cwd(), dir)).filter((file) => file.endsWith(".md") && file.replace(/\.md$/, "").toLowerCase() in manifest);
}

/** Synced docs carry no front matter: the manifest gives their title. */
const syncedSchema = pageSchema.extend({ title: pageSchema.shape.title.optional() });

export const ui = defineDocs({ dir: "content/docs/ui" });
export const java = defineDocs({ dir: "content/docs/java" });
export const orazaka = defineDocs({
  dir: "orazaka-content/docs",
  docs: { schema: syncedSchema, files: published("orazaka-content/docs", DOCS_MANIFEST) },
});
export const orochia = defineDocs({
  dir: "orochia-content/docs",
  docs: { schema: syncedSchema, files: published("orochia-content/docs", OROCHIA_DOCS_MANIFEST) },
});

/** The page renders the title (manifest or messages): a document's own leading `# Title` would repeat it. */
const PREAMBLE = new Set(["yaml", "mdxjsEsm", "html"]);
function remarkDropLeadingTitle() {
  return (tree: Root) => {
    const first = tree.children.findIndex((node) => !PREAMBLE.has(node.type));
    const node = tree.children[first];
    if (node?.type === "heading" && node.depth === 1) tree.children.splice(first, 1);
  };
}

export default defineConfig({
  mdxOptions: {
    // Before the defaults, so the table of contents never lists the dropped title.
    remarkPlugins: (defaults) => [remarkDropLeadingTitle, ...defaults, remarkMdxMermaid],
    rehypeCodeOptions: { themes: { light: "github-light", dark: "github-dark" } },
  },
});

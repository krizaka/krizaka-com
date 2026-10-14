/* Fumadocs collections — two documentation sets, one engine: ui and java, written here (content/docs/**), MDX with the
   live-preview components. The products' documentation is on their sites. */

import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import type { Root } from "mdast";
import { remarkStructuredDiagrams } from "./lib/remark-diagrams";

export const ui = defineDocs({ dir: "content/docs/ui" });
export const java = defineDocs({ dir: "content/docs/java" });

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
    // The schema blocks (```architecture, ```pipeline, ```sequence, ```states) become components; ```mermaid fails.
    remarkPlugins: (defaults) => [remarkDropLeadingTitle, remarkStructuredDiagrams, ...defaults],
    rehypeCodeOptions: { themes: { light: "github-light", dark: "github-dark" } },
  },
});

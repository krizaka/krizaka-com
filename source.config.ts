/* Fumadocs collection — Krizaka UI, written here (content/docs/ui), MDX with the live-preview components. The products'
   documentation is on their sites, and Krizaka Java's on java.krizaka.com (built from krizaka/krizaka-build). */

import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import type { Root } from "mdast";

export const ui = defineDocs({ dir: "content/docs/ui" });

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
    remarkPlugins: (defaults) => [remarkDropLeadingTitle, ...defaults],
    rehypeCodeOptions: { themes: { light: "github-light", dark: "github-dark" } },
  },
});

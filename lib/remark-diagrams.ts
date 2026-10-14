/* The schema a doc asks for, as a fenced block (AGENTS.md §4): ```architecture becomes the module map, drawn from
   the generated model — the same block reads as plain text on GitHub. Mermaid is retired: a
   ```mermaid fence in a published doc fails the build, with what to write instead. The blocks' own
   grammar is parsed and checked where they render (lib/structured-diagrams.ts). */

import type { Code, Root } from "mdast";

const COMPONENT: Record<string, string> = {
  architecture: "ArchitectureView",
};

type Parent = { children: unknown[] };

export function remarkStructuredDiagrams() {
  return (tree: Root, file: { path?: string }) => {
    const visit = (node: Parent) => {
      node.children.forEach((child, i) => {
        const c = child as Code & Partial<Parent>;
        if (c.type === "code" && c.lang === "mermaid") {
          throw new Error(
            `${file.path ?? "a doc"}: a Mermaid diagram — Mermaid is retired (krizaka-com AGENTS.md §4). Write an \`\`\`architecture block instead.`,
          );
        }
        if (c.type === "code" && c.lang && c.lang in COMPONENT) {
          node.children[i] = {
            type: "mdxJsxFlowElement",
            name: COMPONENT[c.lang],
            attributes: [{ type: "mdxJsxAttribute", name: "source", value: c.value }],
            children: [],
          };
          return;
        }
        if (Array.isArray(c.children)) visit(c as Parent);
      });
    };
    visit(tree as unknown as Parent);
  };
}

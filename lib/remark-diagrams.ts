/* The schemas a doc asks for, as fenced blocks (AGENTS.md §4): ```architecture, ```pipeline, ```sequence and
   ```states become the site's structured components, drawn from the generated model — the same blocks read as plain
   text on GitHub. Mermaid is retired: a ```mermaid fence in a published doc fails the build, with what to write
   instead. The blocks' own grammar is parsed and checked where they render (lib/structured-diagrams.ts). */

import type { Code, Root } from "mdast";

const COMPONENT: Record<string, string> = {
  architecture: "ArchitectureView",
  pipeline: "PipelineView",
  sequence: "SequenceDiagram",
  states: "StateDiagram",
};

type Parent = { children: unknown[] };

export function remarkStructuredDiagrams() {
  return (tree: Root, file: { path?: string }) => {
    const visit = (node: Parent) => {
      node.children.forEach((child, i) => {
        const c = child as Code & Partial<Parent>;
        if (c.type === "code" && c.lang === "mermaid") {
          throw new Error(
            `${file.path ?? "a doc"}: a Mermaid diagram — Mermaid is retired (krizaka-com AGENTS.md §4). Write a \`\`\`architecture, \`\`\`sequence, \`\`\`states or \`\`\`pipeline block instead, in the source repository.`,
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

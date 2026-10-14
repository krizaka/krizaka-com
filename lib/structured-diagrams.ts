/* The grammar of the ```architecture block a doc writes (lib/remark-diagrams.ts turns the fence into the module map).
   Parsed at build time; a block that does not parse, or that names a module the generated model does not have,
   fails the build with the line at fault.

   ```architecture
   product: java
   focus: krizaka-security
   mode: runtime | build
   owner: krizaka
*/

import { checkModules, moduleMapData, type Product, isProduct, type Mode } from "@/lib/architecture-model";

class DiagramError extends Error {
  constructor(kind: string, line: number | null, message: string) {
    super(`${kind} block${line ? `, line ${line}` : ""}: ${message}`);
  }
}

const lines = (source: string) =>
  source
    .split("\n")
    .map((text, i) => ({ text: text.trim(), n: i + 1 }))
    .filter((l) => l.text && !l.text.startsWith("%%"));

// ── architecture ──────────────────────────────────────────────────────────────────────────────

interface ArchitectureBlock {
  product: Product;
  focus: string | null;
  view: Mode | null;
  owner: string | null;
}

export function parseArchitecture(source: string, fallback: Product | null): ArchitectureBlock {
  const fields: Record<string, string> = {};
  for (const { text, n } of lines(source)) {
    const m = text.match(/^(\w+)\s*:\s*(.+)$/);
    if (!m || !["product", "focus", "mode", "owner"].includes(m[1])) throw new DiagramError("architecture", n, `expected product|focus|mode|owner: value, got "${text}"`);
    fields[m[1]] = m[2].trim();
  }
  const product = fields.product ?? fallback;
  if (!product || !isProduct(product)) throw new DiagramError("architecture", null, `unknown product ${product ?? "(none)"}`);
  const view = (fields.mode ?? null) as ArchitectureBlock["view"];
  if (view && !["build", "runtime"].includes(view)) throw new DiagramError("architecture", null, `mode is build or runtime, not ${view}`);
  if (fields.focus) checkModules([fields.focus], "an architecture block", product);
  if (fields.owner && !["all", ...moduleMapData(product).owners].includes(fields.owner)) throw new DiagramError("architecture", null, `unknown owner ${fields.owner}`);
  return { product, focus: fields.focus ?? null, view, owner: fields.owner ?? null };
}

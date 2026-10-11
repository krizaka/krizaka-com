/* The grammar of the schema blocks a doc writes (lib/remark-diagrams.ts turns the fences into components).
   Parsed at build time; a block that does not parse, or that names a module, a state or an enum the generated
   model does not have, fails the build with the line at fault.

   ```architecture                  ```sequence                              ```states
   product: orochia                 participant api: @orochia-api            enum: auction_status        (optional)
   focus: orochia-api               participant db: PostgreSQL               state OPEN: Bidding open    (optional label)
   mode: runtime | build | journey  ## A phase                               start -> OPEN: created
   journey: unlock                  api -> db: a call                        OPEN -> SOLD: ends
   owner: krizaka                   db --> api: an answer                    SOLD -> end: settled
                                    api -> api: inside api
                                    if a condition / else another / end
*/

import { checkModules, moduleMapData, orochiaEnums, type Product, isProduct, type Mode } from "@/lib/architecture-model";

export class DiagramError extends Error {
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

export interface ArchitectureBlock {
  product: Product;
  focus: string | null;
  view: Mode | "journey" | null;
  journey: string | null;
  owner: string | null;
}

export function parseArchitecture(source: string, fallback: Product | null): ArchitectureBlock {
  const fields: Record<string, string> = {};
  for (const { text, n } of lines(source)) {
    const m = text.match(/^(\w+)\s*:\s*(.+)$/);
    if (!m || !["product", "focus", "mode", "journey", "owner"].includes(m[1])) throw new DiagramError("architecture", n, `expected product|focus|mode|journey|owner: value, got "${text}"`);
    fields[m[1]] = m[2].trim();
  }
  const product = fields.product ?? fallback;
  if (!product || !isProduct(product)) throw new DiagramError("architecture", null, `unknown product ${product ?? "(none)"}`);
  const view = (fields.mode ?? null) as ArchitectureBlock["view"];
  if (view && !["build", "runtime", "journey"].includes(view)) throw new DiagramError("architecture", null, `mode is build, runtime or journey, not ${view}`);
  if (fields.focus) checkModules([fields.focus], "an architecture block", product);
  if (fields.owner && !["all", ...moduleMapData(product).owners].includes(fields.owner)) throw new DiagramError("architecture", null, `unknown owner ${fields.owner}`);
  return { product, focus: fields.focus ?? null, view, journey: fields.journey ?? null, owner: fields.owner ?? null };
}

// ── sequence ──────────────────────────────────────────────────────────────────────────────────

export interface SequenceParticipant {
  key: string;
  label: string;
  /** The module of the generated model this participant is (@id), coloured by its role. */
  module: string | null;
  role: string | null;
}
export type SequenceItem =
  | { type: "section"; title: string }
  | { type: "step"; n: number; from: string; to: string; text: string; reply: boolean; branch: { kind: "if" | "else"; condition: string } | null };

export interface SequenceBlock {
  participants: SequenceParticipant[];
  items: SequenceItem[];
}

export function parseSequence(source: string, product: Product | null): SequenceBlock {
  const participants: SequenceParticipant[] = [];
  const items: SequenceItem[] = [];
  let branch: { kind: "if" | "else"; condition: string } | null = null;
  let n = 0;
  const known = (key: string, line: number) => {
    if (!participants.some((p) => p.key === key)) throw new DiagramError("sequence", line, `unknown participant ${key} — declare it with "participant ${key}: …"`);
  };
  for (const { text, n: line } of lines(source)) {
    let m: RegExpMatchArray | null;
    if ((m = text.match(/^participant\s+([\w-]+)\s*:\s*(.+)$/))) {
      const value = m[2].trim();
      const id = value.startsWith("@") ? value.slice(1) : null;
      if (id && !product) throw new DiagramError("sequence", line, `@${id}: a module reference needs a product section`);
      const role = id ? moduleMapData(product!).modules.find((x) => x.id === id)?.role ?? null : null;
      if (id && !role) throw new DiagramError("sequence", line, `@${id} is not a module of the ${product} model`);
      participants.push({ key: m[1], label: id ?? value, module: id, role });
    } else if ((m = text.match(/^##\s+(.+)$/))) {
      items.push({ type: "section", title: m[1].trim() });
    } else if ((m = text.match(/^if\s+(.+)$/))) {
      branch = { kind: "if", condition: m[1].trim() };
    } else if ((m = text.match(/^else(?:\s+(.+))?$/))) {
      if (!branch) throw new DiagramError("sequence", line, "else without if");
      branch = { kind: "else", condition: (m[1] ?? "").trim() };
    } else if (text === "end") {
      if (!branch) throw new DiagramError("sequence", line, "end without if");
      branch = null;
    } else if ((m = text.match(/^([\w-]+)\s*(-->|->)\s*([\w-]+)\s*:\s*(.+)$/))) {
      known(m[1], line);
      known(m[3], line);
      items.push({ type: "step", n: ++n, from: m[1], to: m[3], text: m[4].trim(), reply: m[2] === "-->", branch });
    } else {
      throw new DiagramError("sequence", line, `cannot read "${text}"`);
    }
  }
  if (branch) throw new DiagramError("sequence", null, "an if is never closed with end");
  if (!n) throw new DiagramError("sequence", null, "no step");
  return { participants, items };
}

// ── states ────────────────────────────────────────────────────────────────────────────────────

export interface StateBlock {
  enumName: string | null;
  states: { id: string; label: string | null; initial: boolean; final: boolean }[];
  transitions: { from: string; to: string; label: string }[];
}

export function parseStates(source: string, product: Product | null): StateBlock {
  let enumName: string | null = null;
  const labels = new Map<string, string>();
  const transitions: StateBlock["transitions"] = [];
  for (const { text, n } of lines(source)) {
    let m: RegExpMatchArray | null;
    if ((m = text.match(/^enum\s*:\s*(\w+)$/))) enumName = m[1];
    else if ((m = text.match(/^state\s+([\w-]+)\s*:\s*(.+)$/))) labels.set(m[1], m[2].trim());
    else if ((m = text.match(/^([\w-]+)\s*->\s*([\w-]+)\s*:\s*(.+)$/))) transitions.push({ from: m[1], to: m[2], label: m[3].trim() });
    else throw new DiagramError("states", n, `cannot read "${text}"`);
  }
  if (!transitions.some((t) => t.from === "start")) throw new DiagramError("states", null, "no transition from start");
  // States in the order a reader meets them: breadth-first from start.
  const order: string[] = [];
  const queue = ["start"];
  while (queue.length) {
    const at = queue.shift()!;
    for (const t of transitions.filter((x) => x.from === at)) {
      if (t.to !== "end" && !order.includes(t.to)) {
        order.push(t.to);
        queue.push(t.to);
      }
    }
  }
  const unreachable = [...new Set(transitions.flatMap((t) => [t.from, t.to]))].filter((id) => id !== "start" && id !== "end" && !order.includes(id));
  if (unreachable.length) throw new DiagramError("states", null, `unreachable from start: ${unreachable.join(", ")}`);
  for (const id of labels.keys()) if (!order.includes(id)) throw new DiagramError("states", null, `state ${id} has a label but no transition`);
  if (enumName) {
    if (product !== "orochia") throw new DiagramError("states", null, `enum: ${enumName} — enums are known for orochia only`);
    const values = orochiaEnums()[enumName];
    if (!values) throw new DiagramError("states", null, `enum ${enumName} is not in the Orochia schema`);
    const stray = order.filter((id) => !values.includes(id));
    if (stray.length) throw new DiagramError("states", null, `${stray.join(", ")} not in enum ${enumName} (${values.join(", ")})`);
  }
  return {
    enumName,
    states: order.map((id) => ({
      id,
      label: labels.get(id) ?? null,
      initial: transitions.some((t) => t.from === "start" && t.to === id),
      final: !transitions.some((t) => t.from === id && t.to !== id && t.to !== "end"),
    })),
    transitions,
  };
}

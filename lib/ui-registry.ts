/* The @krizaka/ui registry, read at build time: everything /docs/ui says about a component — what it is, when to use
   it, its examples and their code, its props, its accessibility — comes from the published package, which builds it
   from the component's own code (meta.ts, registry/examples, the props' JSDoc). Never copied into this repository.
   Shape: @krizaka/ui/registry/<name>.json (packages/ui/scripts/build-registry.mjs in krizaka-ui). */

import { readFileSync } from "node:fs";
import path from "node:path";

export interface RegistryProp {
  name: string;
  type: string;
  default: string | null;
  description: string;
  required: boolean;
}

export interface RegistryComponent {
  component: string;
  description: string;
  props: RegistryProp[];
}

export type Platform = "web" | "native" | "both";
export type Status = "stable" | "beta";
export type Category = "actions" | "forms" | "navigation" | "overlays" | "feedback" | "data-display" | "layout" | "foundations";
export const CATEGORIES: Category[] = ["actions", "forms", "navigation", "overlays", "feedback", "data-display", "layout", "foundations"];

export interface RegistryExample {
  name: string;
  title: string;
  description: string;
  /** `examples/button/primary.tsx`, `examples/button/native/primary.tsx`. */
  path: string;
  /** What renders it: `@krizaka/ui/registry/examples/button/primary`. */
  module: string;
  code: string;
  /** React Native: the screenshots of its story, `examples/button/native/primary.dark.png` (and `.light.png`). */
  screenshots?: { dark: string; light: string };
}

export interface RegistryPlatform {
  entry: string;
  import: string;
  props: RegistryComponent[];
  examples: RegistryExample[];
}

export interface RegistryItem {
  name: string;
  type: "primitive" | "native";
  title: string;
  summary: string;
  description: string;
  status: Status;
  category: Category;
  platforms: Platform;
  whenToUse: string[];
  whenNotToUse: { when: string; use?: string }[];
  bestPractices: string[];
  accessibility: { keyboard: { keys: string; action: string }[]; notes: string[] };
  related: string[];
  web: RegistryPlatform | null;
  native: (RegistryPlatform & { differences: string[] }) | null;
  dependencies: string[];
  registryDependencies: string[];
}

export interface RegistryIndexItem {
  name: string;
  type: RegistryItem["type"];
  title: string;
  summary: string;
  status: Status;
  category: Category;
  platforms: Platform;
  examples: { web: number; native: number };
}

export interface RegistryIndex {
  name: string;
  version: string;
  items: RegistryIndexItem[];
}

const REGISTRY_DIR = path.join(process.cwd(), "node_modules", "@krizaka", "ui", "registry");

const cache = new Map<string, unknown>();
function readJson<T>(file: string): T {
  if (!cache.has(file)) cache.set(file, JSON.parse(readFileSync(path.join(REGISTRY_DIR, file), "utf8")));
  return cache.get(file) as T;
}

export function getRegistryIndex(): RegistryIndex {
  return readJson<RegistryIndex>("index.json");
}

export function getRegistryItem(name: string): RegistryItem {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid registry item name: ${name}`);
  return readJson<RegistryItem>(`${name}.json`);
}

/** Every documented component, in the catalogue's order: by category, then by title. */
export function getRegistryItems(): RegistryItem[] {
  return getRegistryIndex()
    .items.map((entry) => getRegistryItem(entry.name))
    .sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.title.localeCompare(b.title));
}

/** An example as a reader copies it: its source file, as written (a `"use client"` in it is meant for Next.js). */
export const exampleSource = (example: RegistryExample): string => example.code.trimEnd();

/** The key of an example in the generated import map (lib/ui-examples.ts): `button/primary`, `button/native/primary`. */
export const exampleKey = (example: RegistryExample) => example.module.replace("@krizaka/ui/registry/examples/", "");

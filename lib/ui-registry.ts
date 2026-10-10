/* The @krizaka/ui registry, read at build time: what /docs/ui renders (props, demo source) comes from the published
   package — never copied into this repository. Shape: @krizaka/ui/registry/<name>.json (packages/ui/scripts/build-registry.mjs). */

import { readFile } from "node:fs/promises";
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

export interface RegistryItem {
  name: string;
  type: string;
  description: string;
  files: { path: string; content: string }[];
  dependencies: string[];
  registryDependencies: string[];
  demo?: { path: string; content: string };
  props: RegistryComponent[];
}

export interface RegistryIndex {
  name: string;
  version: string;
  items: Pick<RegistryItem, "name" | "type" | "description" | "dependencies" | "registryDependencies">[];
}

const REGISTRY_DIR = path.join(process.cwd(), "node_modules", "@krizaka", "ui", "registry");

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(path.join(REGISTRY_DIR, file), "utf8")) as T;
}

export function getRegistryIndex(): Promise<RegistryIndex> {
  return readJson<RegistryIndex>("index.json");
}

export function getRegistryItem(name: string): Promise<RegistryItem> {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid registry item name: ${name}`);
  return readJson<RegistryItem>(`${name}.json`);
}

/** The demo as a reader copies it: no "use client" banner (the demos are client modules in the package). */
export function demoSource(item: RegistryItem): string {
  return (item.demo?.content ?? "").replace(/^"use client";\s*\n/, "").trimEnd();
}

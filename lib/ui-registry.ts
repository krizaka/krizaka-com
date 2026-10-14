/* The registries of Krizaka UI, read at build time: everything /docs/ui says about a component of @krizaka/ui (and
   @krizaka/charts) comes from the published package, which builds it from the component's own code (meta.ts,
   registry/examples, the props' JSDoc). Never copied into this repository.
   Shape: <package>/registry/<name>.json (packages/ui/scripts/build-registry.mjs in krizaka-ui). */

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
export type Status = "stable" | "beta" | "deprecated";
export type Category = "actions" | "forms" | "navigation" | "overlays" | "feedback" | "data-display" | "media" | "charts" | "blocks" | "layouts" | "templates" | "layout" | "foundations";
export const CATEGORIES: Category[] = ["actions", "forms", "navigation", "overlays", "feedback", "data-display", "media", "charts", "blocks", "layouts", "templates", "layout", "foundations"];

/** Why a reader needs a template: the seven intents the templates are grouped by (krizaka-ui `templatePurposes`). */
export type TemplatePurpose = "convince" | "explain" | "show" | "act" | "operate" | "converse" | "recover";

/** A template of the registry, flat: the index lists them all, in the order of the intents. */
export interface RegistryTemplate {
  component: string;
  platform: "web" | "native";
  name: string;
  title: string;
  description: string;
  purpose: TemplatePurpose;
  why: string;
}

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
  /** A template: a whole screen composed from the platform (a layout's example), listed on /docs/ui/templates. */
  template?: boolean;
  /** A template: the intent that groups it (convince, explain, show, act, operate, converse, recover). */
  purpose?: TemplatePurpose;
  /** A template: the user goal its layout serves. */
  why?: string;
}

export interface RegistryPlatform {
  entry: string;
  import: string;
  props: RegistryComponent[];
  examples: RegistryExample[];
}

export interface RegistryItem {
  name: string;
  type: "primitive" | "native" | "composite" | "chart";
  /** The package that ships it, when not @krizaka/ui (`@krizaka/charts`). */
  package?: string;
  /** A chart: drawn in SVG by the package, or by Apache ECharts loaded on demand. */
  engine?: "svg" | "echarts";
  /** Where its documentation is written, from the repository root (`packages/charts/src/meta/line-chart.ts`). */
  source?: string;
  /** How to install it, when it is not @krizaka/ui's line. */
  install?: { web?: string; native?: string };
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
  /** A deprecated component: since when, what replaces it (absent when nothing does), when it goes, why. */
  deprecated?: { since: string; use?: string; removedIn: string; reason?: string } | null;
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
  /** @krizaka/ui: the groups of templates (title, "you come here when…") and the templates in their order. */
  templatePurposes?: Record<TemplatePurpose, { title: string; useWhen: string }>;
  templates?: RegistryTemplate[];
}

/** The packages whose registries make Krizaka UI (/docs/ui): the primitives, then the charts — one catalogue. */
export const UI_PACKAGES = ["@krizaka/ui", "@krizaka/charts"] as const;

const packageDir = (pkg: string) => path.join(process.cwd(), "node_modules", ...pkg.split("/"), "registry");
const cache = new Map<string, unknown>();
function readPackageJson<T>(pkg: string, file: string): T {
  const key = `${pkg}/${file}`;
  if (!cache.has(key)) cache.set(key, JSON.parse(readFileSync(path.join(packageDir(pkg), file), "utf8")));
  return cache.get(key) as T;
}
/** The package that documents a name: the first of UI_PACKAGES that has it. */
function packageOf(name: string): string {
  return UI_PACKAGES.find((pkg) => readPackageJson<RegistryIndex>(pkg, "index.json").items.some((i) => i.name === name)) ?? UI_PACKAGES[0];
}

/** The registry index of Krizaka UI (@krizaka/ui's — its version names the release). */
export function getRegistryIndex(): RegistryIndex {
  return readPackageJson<RegistryIndex>("@krizaka/ui", "index.json");
}

/** The registry index of one package (`@krizaka/charts`). */
export function getPackageIndex(pkg: string): RegistryIndex {
  return readPackageJson<RegistryIndex>(pkg, "index.json");
}

export function getRegistryItem(name: string): RegistryItem {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid registry item name: ${name}`);
  return readPackageJson<RegistryItem>(packageOf(name), `${name}.json`);
}

/** Every documented component, in the catalogue's order: by category, then by title (deprecated ones last). */
export function getRegistryItems(): RegistryItem[] {
  const retired = (item: RegistryItem) => Number(item.status === "deprecated");
  return UI_PACKAGES.flatMap((pkg) => getPackageIndex(pkg).items)
    .map((entry) => getRegistryItem(entry.name))
    .sort(
      (a, b) =>
        retired(a) - retired(b) || CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.title.localeCompare(b.title),
    );
}

/** The URL of a documented component. */
export const componentHref = (locale: string, name: string) => `/${locale}/docs/ui/${name}`;

/** An example as a reader copies it: its source file, as written (a `"use client"` in it is meant for Next.js). */
export const exampleSource = (example: RegistryExample): string => example.code.trimEnd();

/** The key of an example in the generated import map (lib/ui-examples.ts): `button/primary`, `button/native/primary`
    for @krizaka/ui, `charts/line-chart/creator-earnings` for @krizaka/charts. */
export const exampleKey = (example: RegistryExample) =>
  example.module
    .replace("@krizaka/ui/registry/examples/", "")
    .replace("@krizaka/charts/registry/examples/", "charts/");

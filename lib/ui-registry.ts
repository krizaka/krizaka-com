/* The registries of the Krizaka design systems, read at build time: everything /docs/ui says about a component of
   @krizaka/ui — and /docs/<product>/ui about a component of a product kit (@krizaka/orazaka-design-system,
   @krizaka/orochia-design-system) — comes from the published package, which builds it from the component's own code
   (meta.ts, registry/examples, the props' JSDoc). Never copied into this repository.
   Shape: <package>/registry/<name>.json (packages/ui/scripts/build-registry.mjs in krizaka-ui, scripts/registry.mjs
   in each kit — the same format; a kit adds `why`, `builtOn`, `deprecated`, and registry/foundations.json). */

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
  /** A template: a whole screen composed from the platform (a layout's example), listed on /docs/ui/screens. */
  template?: boolean;
}

export interface RegistryPlatform {
  entry: string;
  import: string;
  props: RegistryComponent[];
  examples: RegistryExample[];
}

/** A design system documented by its registry: @krizaka/ui, or a product's kit. */
export type Kit = "ui" | "orazaka" | "orochia";
export type ProductKit = Exclude<Kit, "ui">;
export const PRODUCT_KITS: ProductKit[] = ["orazaka", "orochia"];

export const KIT_PACKAGES: Record<Kit, string> = {
  ui: "@krizaka/ui",
  orazaka: "@krizaka/orazaka-design-system",
  orochia: "@krizaka/orochia-design-system",
};

/** Where the documentation of a kit's components is written (its repository, the folder of its `<name>.meta.ts`). */
export const KIT_SOURCES: Record<ProductKit, string> = {
  orazaka: "https://github.com/krizaka/orazaka-ui-kit/blob/main/orazaka-design-system/src/components",
  orochia: "https://github.com/krizaka/orochia-design-system/blob/main/components",
};

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
  /** A kit's component: why it exists above Krizaka UI. */
  why?: string;
  /** A kit's component: the @krizaka/ui components it is built on (`ui/badge`). */
  builtOn?: string[];
  /** A kit's deprecated component: since when, what replaces it (`ui/card` or a kit component), when it goes. */
  deprecated?: { since: string; use: string; removedIn: string } | null;
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
  /** A kit: the product, the platform it extends, how to install it, what it re-exports from @krizaka/ui. */
  product?: ProductKit;
  extends?: { name: string; range: string };
  install?: { command: string; css: string; note?: string };
  reexports?: { name: string; from: string }[];
}

/** One role of a theme, resolved: its value, its hex when opaque, the layer that sets it. */
export interface FoundationRole {
  role: string;
  value: string;
  hex: string | null;
  source: "platform" | "brand" | "kit" | "base";
  note: string | null;
}

export interface FoundationContrast {
  fg: string;
  bg: string;
  ratio: number;
  min: number;
}

/** The foundations of a kit (registry/foundations.json): its theme resolved from its tokens, and its product rules. */
export interface KitFoundations {
  product: ProductKit;
  theme: string;
  summary: string;
  layers: { id: string; source: string }[];
  modes: Record<"dark" | "light", { name: string; roles: FoundationRole[]; contrasts: FoundationContrast[] }>;
  scope: Record<"dark" | "light", Record<string, string>>;
  namedThemes: {
    id: string;
    name: string;
    use: string;
    scheme: "dark" | "light";
    roles: FoundationRole[];
    contrasts: FoundationContrast[];
    scope: Record<string, string>;
  }[];
  typeScale?: { name: string; value: string }[];
  productTokens: { name: string; value: string; description: string | null }[];
  typography: { role: string; family: string; token: string; use: string }[];
  icons: { name: string; from: string; use: string }[];
  rules: { title: string; text: string; source: { label: string; url: string } }[];
  native: { summary: string; code: string };
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
/** The package that documents a name: a kit's own, or — for Krizaka UI — the first of UI_PACKAGES that has it. */
function packageOf(name: string, kit: Kit): string {
  if (kit !== "ui") return KIT_PACKAGES[kit];
  return UI_PACKAGES.find((pkg) => readPackageJson<RegistryIndex>(pkg, "index.json").items.some((i) => i.name === name)) ?? KIT_PACKAGES.ui;
}
function readJson<T>(kit: Kit, file: string): T {
  return readPackageJson<T>(KIT_PACKAGES[kit], file);
}

/** The registry index of a design system (Krizaka UI: @krizaka/ui's — its version names the release). */
export function getRegistryIndex(kit: Kit = "ui"): RegistryIndex {
  return readJson<RegistryIndex>(kit, "index.json");
}

/** The registry index of one package (`@krizaka/charts`). */
export function getPackageIndex(pkg: string): RegistryIndex {
  return readPackageJson<RegistryIndex>(pkg, "index.json");
}

export function getRegistryItem(name: string, kit: Kit = "ui"): RegistryItem {
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`Invalid registry item name: ${name}`);
  return readPackageJson<RegistryItem>(packageOf(name, kit), `${name}.json`);
}

export function getKitFoundations(kit: ProductKit): KitFoundations {
  return readJson<KitFoundations>(kit, "foundations.json");
}

/** Every documented component, in the catalogue's order: by category, then by title (a kit's deprecated ones last). */
export function getRegistryItems(kit: Kit = "ui"): RegistryItem[] {
  const retired = (item: RegistryItem) => Number(item.status === "deprecated");
  const entries = kit === "ui" ? UI_PACKAGES.flatMap((pkg) => getPackageIndex(pkg).items) : getRegistryIndex(kit).items;
  return entries
    .map((entry) => getRegistryItem(entry.name, kit))
    .sort(
      (a, b) =>
        retired(a) - retired(b) || CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) || a.title.localeCompare(b.title),
    );
}

/**
 * A component a kit's page names: `ui/<name>` is a @krizaka/ui component (/docs/ui/<name>), anything else one of the
 * kit (/docs/<product>/ui/<name>).
 */
export function resolveReference(ref: string, kit: Kit): { kit: Kit; name: string } {
  return ref.startsWith("ui/") ? { kit: "ui", name: ref.slice(3) } : { kit, name: ref };
}

/** The URL of a documented component. */
export const componentHref = (locale: string, kit: Kit, name: string) =>
  kit === "ui" ? `/${locale}/docs/ui/${name}` : `/${locale}/docs/${kit}/ui/${name}`;

/** An example as a reader copies it: its source file, as written (a `"use client"` in it is meant for Next.js). */
export const exampleSource = (example: RegistryExample): string => example.code.trimEnd();

/** The key of an example in the generated import map (lib/ui-examples.ts): `button/primary`, `button/native/primary`
    for @krizaka/ui, `charts/line-chart/creator-earnings` for @krizaka/charts, `orochia/status-badge/auction-open` for a kit. */
export const exampleKey = (example: RegistryExample) =>
  example.module
    .replace("@krizaka/ui/registry/examples/", "")
    .replace("@krizaka/charts/registry/examples/", "charts/")
    .replace(/^@krizaka\/(orazaka|orochia)-design-system\/registry\/examples\//, "$1/");

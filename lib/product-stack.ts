/* What each product runs on — the proof table of /open-source ("One open stack builds all four products").

   Nothing in a cell is typed: it is read from the products' own manifests (lib/product-manifests.json, written by
   scripts/gen-product-manifests.mjs from the package.json and pom.xml of every repository of the product). The only
   thing declared here is what is *decided but not shipped* (`PLANNED`, each one tracked by an issue) — and
   tests/product-stack.test.mjs fails when a planned kit is in fact already in a manifest, when a product of
   lib/products.ts has no row, or when a cell claims a package its repositories do not depend on.

   Pure module (no import): the test runs it as is. */

/** The kits a product can run on — the platform's blocks, then the engine. Texts: site.story.kits.<id>. */
export const KITS = ["ui", "foundations", "realtime", "java", "engine"] as const;
export type KitId = (typeof KITS)[number];

/** The packages and artifacts each kit stands for: their versions are read from the registries at build. */
export const KIT_PACKAGES: Record<Exclude<KitId, "engine">, readonly string[]> = {
  ui: ["@krizaka/ui"],
  foundations: ["@krizaka/tokens", "@krizaka/icons", "@krizaka/intl"],
  realtime: ["@krizaka/realtime", "@krizaka/push"],
  java: ["com.krizaka:krizaka-platform-kit"],
};

/** The realtime transport a product ships with. Texts: site.story.ours.transport.<id>. */
export type Transport = "sse" | "ssePush";

/** The three parts of the foundations column, and the npm packages that prove each one. `@krizaka/tailwind` is the
    tokens' Tailwind preset: it depends on `@krizaka/tokens` (its own package.json), so a product on the preset runs on them. */
export const FOUNDATION_PARTS = {
  tokens: ["@krizaka/tokens", "@krizaka/tailwind"],
  icons: ["@krizaka/icons"],
  intl: ["@krizaka/intl"],
} as const;
export type FoundationPart = keyof typeof FOUNDATION_PARTS;

/** The engine: the product the others are powered by (the cell says so instead of "Yes"). */
export const ENGINE = "orazaka";

/** Decided, tracked, not shipped: shown as "Planned", never as "Yes". Each line names its issue.
    - Orochia: Explore and recommendations powered by Orazaka (krizaka/orochia#120).
    - Yasakia: the brain, `packages/ai` with an `orazaka` adapter (PY3 of its roadmap; nothing in the repository yet).
    - Yororis: under construction — realtime and the engine are its design, not shipped. */
export const PLANNED: Record<string, readonly KitId[]> = {
  orochia: ["engine"],
  yasakia: ["engine"],
  yororis: ["realtime", "engine"],
    // Yomizaka: every analysis is an Orazaka run by design; "Yes" once a run is recorded on dev (lib/demo-run.ts of krizaka/yomizaka).
  yomizaka: ["engine"],
};

/** What the manifests of one product say (lib/product-manifests.json). */
export interface ProductManifest {
  sources: string[];
  /** The `@krizaka/*` packages its package.json files depend on. */
  npm: string[];
  /** The `krizaka-*` Maven artifacts its pom.xml files depend on — the Java platform kit. */
  maven: string[];
  /** Files that prove what a manifest cannot show (Orazaka's own SSE hook). */
  evidence: string[];
  /** A real Orazaka run of this product on dev (its run id, read from the product's recorded run): it runs on the engine. */
  engineRun?: string;
}
export type ProductManifests = Record<string, ProductManifest>;

export type CellState = "yes" | "partial" | "planned" | "no" | "engine";
export interface StackCell {
  kit: KitId;
  state: CellState;
  /** realtime, when it runs: how the product stays live. */
  transport?: Transport;
  /** foundations: the parts it really uses (all three = "yes"). */
  parts?: FoundationPart[];
}

const has = (m: ProductManifest | undefined, names: readonly string[]) => names.some((n) => m?.npm.includes(n));

/** The foundations parts a product uses. */
export const foundationParts = (m: ProductManifest | undefined): FoundationPart[] =>
  (Object.keys(FOUNDATION_PARTS) as FoundationPart[]).filter((p) => has(m, FOUNDATION_PARTS[p]));

/** Does the manifest prove this kit? (`planned` is not looked at.) */
export function provenKit(kit: KitId, m: ProductManifest | undefined): boolean {
  switch (kit) {
    case "ui":
      return has(m, KIT_PACKAGES.ui);
    case "foundations":
      return foundationParts(m).length > 0;
    case "realtime":
      return has(m, ["@krizaka/realtime"]) || Boolean(m?.evidence.some((e) => /SSE/.test(e)));
    case "java":
      return (m?.maven.length ?? 0) > 0;
    case "engine":
      return Boolean(m?.engineRun);
  }
}

export function stackCell(id: string, kit: KitId, m: ProductManifest | undefined): StackCell {
  if (kit === "engine" && id === ENGINE) return { kit, state: "engine" };
  if (PLANNED[id]?.includes(kit)) return { kit, state: "planned" };
  if (!provenKit(kit, m)) return { kit, state: "no" };
  if (kit === "foundations") {
    const parts = foundationParts(m);
    return { kit, state: parts.length === 3 ? "yes" : "partial", parts };
  }
  if (kit === "realtime") return { kit, state: "yes", transport: has(m, ["@krizaka/push"]) ? "ssePush" : "sse" };
  return { kit, state: "yes" };
}

/** One row per product id, in the order given (lib/products.ts). */
export const stackRows = (ids: readonly string[], manifests: ProductManifests) =>
  ids.map((id) => ({ id, cells: KITS.map((kit) => stackCell(id, kit, manifests[id])) }));

/** The kits a product runs on (state yes or partial), engine included only when it is the engine. */
export const kitsOf = (id: string, manifests: ProductManifests): KitId[] =>
  KITS.filter((kit) => ["yes", "partial"].includes(stackCell(id, kit, manifests[id]).state));

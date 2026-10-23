/* « La nomenclature » on /open-source: one reference map of the Krizaka system — every module of the family, grouped by
   layer (products → Orazaka → building blocks → shared services, then the platform's sites and tooling). Pure rules over
   data read at build: the organisation's repositories (lib/org-stats.json), the registries' snapshot
   (lib/registry-versions.json: npm, Maven, the POMs' parents), the products' manifests (lib/product-manifests.json)
   and the engine's uses (lib/engine-uses.ts). No module, version or link typed here; a public repository that the map
   does not carry fails the build (assertNomenclature). Tested by tests/nomenclature.test.mjs (no import alias). */

import { kindOfRepository, productOfRepository, type GithubRepository } from "./repository-catalogue.ts";
import { mavenFamily, packageRows, type PackageRow, type RegistrySnapshot } from "./package-catalogue.ts";
import type { Manifest } from "./how-it-fits.ts";

export const NOMENCLATURE_LAYERS = ["products", "engine", "blocks", "services", "platform"] as const;
export type NomenclatureLayer = (typeof NOMENCLATURE_LAYERS)[number];

/** What a module is: a product (or its app), the engine, a Java building block, a TypeScript package, a worker (a
    service that runs), a site, or tooling. */
export const NOMENCLATURE_KINDS = ["product", "engine", "java", "package", "web", "worker", "site", "tooling"] as const;
export type NomenclatureKind = (typeof NOMENCLATURE_KINDS)[number];

export interface Publication {
  registry: PackageRow["registry"];
  name: string;
  version: string;
  url: string;
}

export interface ModuleRow {
  /** The repository's name, or `maven:<module>` for a published module that has no repository of its own. */
  id: string;
  name: string;
  layer: NomenclatureLayer;
  kind: NomenclatureKind;
  /** The product's id, or `krizaka` for the platform: the focus hides the rows of the products outside it. */
  productId: string;
  line: string;
  repoUrl?: string;
  publications: Publication[];
  /** Product ids that use it: through their manifests (packages) or the engine's uses (the engine). */
  usedBy: string[];
}

export interface NomenclatureInput {
  repositories: readonly GithubRepository[];
  snapshot: RegistrySnapshot;
  manifests: Readonly<Record<string, Manifest>>;
  /** The products' ids, and the engine's. */
  products: readonly string[];
  engineId: string;
  /** The ids of the products that call the engine today (planned ones left out). */
  engineCallers: readonly string[];
  javaDocs: string;
}

const GITHUB = "https://github.com/krizaka/";

/** The repository name a GitHub URL points at (`.git`, trailing slash and sub-paths dropped), or undefined. */
export function repositoryOfUrl(url: string | undefined): string | undefined {
  if (!url?.startsWith(GITHUB)) return undefined;
  return url.slice(GITHUB.length).split("/")[0].replace(/\.git$/, "") || undefined;
}

const has = (topics: readonly string[], ...any: string[]) => any.some((t) => topics.includes(t));

function classify(
  repo: GithubRepository,
  product: string,
  engineId: string,
  publications: readonly Publication[],
  isService: boolean,
): { layer: NomenclatureLayer; kind: NomenclatureKind } {
  const role = kindOfRepository(repo, product);
  if (product === engineId) {
    if (repo.name === engineId) return { layer: "engine", kind: "engine" };
    if (isService || role === "service") return { layer: "engine", kind: "worker" };
    if (publications.some((p) => p.registry === "maven")) return { layer: "engine", kind: "java" };
    if (role === "tooling") return { layer: "engine", kind: "tooling" };
    if (role === "web") return { layer: "engine", kind: "web" };
    return { layer: "engine", kind: "package" };
  }
  if (product !== "krizaka") {
    return { layer: "products", kind: role === "main" ? "product" : role === "service" ? "worker" : role === "library" ? "package" : role === "tooling" ? "tooling" : "product" };
  }
  if (isService || role === "service") return { layer: "services", kind: "worker" };
  if (publications.some((p) => p.registry === "maven")) return { layer: "blocks", kind: "java" };
  if (publications.length > 0) return { layer: "blocks", kind: "package" };
  if (has(repo.topics, "website") || role === "web" || /^krizaka-(com|ui-site)$/.test(repo.name)) return { layer: "platform", kind: "site" };
  return { layer: "platform", kind: "tooling" };
}

/** Every module of the family, in layer order then by name. */
export function nomenclature(input: NomenclatureInput): ModuleRow[] {
  const { repositories, snapshot, manifests, products, engineId, engineCallers } = input;
  const repoNames = repositories.map((r) => r.name);
  const packages = packageRows(snapshot, repoNames, input.javaDocs);
  const publication = (p: PackageRow): Publication => ({ registry: p.registry, name: p.name, version: p.version, url: p.registryUrl });

  // A package belongs to the repository it names; failing that (Maven), to the repository of its module.
  const byRepo = new Map<string, PackageRow[]>();
  const orphans = new Map<string, PackageRow[]>();
  for (const p of packages) {
    const family = p.registry === "maven" ? mavenFamily(p.name, snapshot.mavenMeta) : undefined;
    const target = [repositoryOfUrl(p.repoUrl), family].find((n) => n && repoNames.includes(n));
    const into = target ? byRepo : orphans;
    const key = target ?? family ?? p.name;
    into.set(key, [...(into.get(key) ?? []), p]);
  }

  const usedBy = (names: readonly string[]) =>
    Object.entries(manifests)
      .filter(([, m]) => names.some((n) => m.npm.includes(n) || m.maven.includes(n)))
      .map(([id]) => id)
      .sort();

  const rows: ModuleRow[] = repositories.map((repo) => {
    const own = byRepo.get(repo.name) ?? [];
    const product = productOfRepository(repo.name, products);
    const isService = own.some((p) => p.registry === "maven" && p.name.endsWith("-service")) || (repo.topics.includes("worker") && product === "krizaka");
    const publications = own.map(publication);
    const { layer, kind } = classify(repo, product, engineId, publications, isService);
    return {
      id: repo.name,
      name: repo.name,
      layer,
      kind,
      productId: product,
      line: repo.description,
      repoUrl: repo.url,
      publications,
      usedBy: repo.name === engineId ? [...engineCallers].sort() : usedBy(own.map((p) => p.name)),
    };
  });

  for (const [family, own] of orphans) {
    const service = own.some((p) => p.name.endsWith("-service"));
    rows.push({
      id: `maven:${family}`,
      name: family,
      layer: service ? "services" : "blocks",
      kind: service ? "worker" : own.some((p) => p.registry === "maven") ? "java" : "package",
      productId: "krizaka",
      line: own.find((p) => p.name === family)?.line ?? own[0].line,
      publications: own.map(publication),
      usedBy: usedBy(own.map((p) => p.name)),
    });
  }

  const order = (r: ModuleRow) => NOMENCLATURE_LAYERS.indexOf(r.layer);
  const done = rows.sort((a, b) => order(a) - order(b) || a.name.localeCompare(b.name));
  assertNomenclature(repositories, done);
  return done;
}

/** The build-time guard: a public repository the map does not carry fails the build (a repository created in the org
    is either mapped or the build says which one is missing). */
export function assertNomenclature(repositories: readonly Pick<GithubRepository, "name">[], rows: readonly Pick<ModuleRow, "id">[]): void {
  const mapped = new Set(rows.map((r) => r.id));
  const missing = repositories.map((r) => r.name).filter((n) => !mapped.has(n));
  if (missing.length) throw new Error(`The nomenclature misses ${missing.length} public repositor${missing.length === 1 ? "y" : "ies"}: ${missing.join(", ")}`);
}

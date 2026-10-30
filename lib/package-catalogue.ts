/* Every package Krizaka publishes — npm (@krizaka scope) and Maven Central (com.krizaka) — as one list of rows for
   /open-source's packages table. Pure rules over what the registries said at build (scripts/gen-registry-versions.mjs →
   lib/registry-versions.json) and the organisation's repositories (lib/org-stats.json): no package, version, count or
   link typed here. Tested by tests/package-catalogue.test.mjs (no import alias: Node strips the types and runs it). */

import { releasesUrl } from "./library-links.ts";
import { groupOfPackage, summary, type NpmGroup } from "./npm-catalogue.ts";

export type Registry = "npm" | "maven";

export interface PackageRow {
  /** `npm:@krizaka/ui`, `maven:krizaka-users-api`. */
  id: string;
  name: string;
  registry: Registry;
  /** npm: the group its keywords name (ui · data · realtime · tooling); Maven: the module under krizaka-parent it belongs to. */
  family: NpmGroup | string;
  /** What it is, in one line (the first clause of the registry's description). */
  line: string;
  version: string;
  /** Downloads of the last week (npm only; absent when unknown). */
  weeklyDownloads?: number;
  /** The last 12 weekly sums, oldest first (npm only; absent unless complete). */
  weeklySeries?: number[];
  registryUrl: string;
  repoUrl?: string;
  /** The repository's GitHub Releases page — the only place release notes are told. */
  releasesUrl?: string;
  docsUrl?: string;
}

export interface RegistrySnapshot {
  npm?: Record<string, string>;
  npmMeta?: Record<string, { description?: string; keywords?: string[]; repository?: string; homepage?: string; weeklyDownloads?: number; weeklySeries?: number[] }>;
  maven?: Record<string, string>;
  mavenMeta?: Record<string, { description?: string; parent?: string; scm?: string }>;
}

/** The npm downloads of the last week across every package that reports them; undefined when none does. */
export function weeklyTotal(rows: readonly Pick<PackageRow, "weeklyDownloads">[]): number | undefined {
  const known = rows.filter((r) => Number.isInteger(r.weeklyDownloads));
  return known.length ? known.reduce((sum, r) => sum + (r.weeklyDownloads as number), 0) : undefined;
}

/** The same total straight from the registry snapshot (the home's hero figure): every @krizaka package's last week,
    summed over those that report it; undefined when none does — the figure is then hidden, never shown as 0. */
export function weeklyTotalOfSnapshot(snapshot: RegistrySnapshot): number | undefined {
  return weeklyTotal(Object.keys(snapshot.npm ?? {}).map((name) => ({ weeklyDownloads: snapshot.npmMeta?.[name]?.weeklyDownloads })));
}

const ROOT = "krizaka-parent";

/** The Maven module an artifact belongs to: its ancestor right under krizaka-parent (itself when it is one). */
export function mavenFamily(artifact: string, meta: RegistrySnapshot["mavenMeta"] = {}): string {
  let current = artifact;
  for (let i = 0; i < 8; i++) {
    const parent = meta[current]?.parent;
    if (!parent || parent === ROOT) return current;
    current = parent;
  }
  return current;
}

const GITHUB = "https://github.com/krizaka/";

/** The org repository a package's source URL names (`https://github.com/krizaka/krizaka-ui/tree/main/…` → `krizaka-ui`). */
const repositoryOf = (url: string | undefined): string | undefined =>
  url?.startsWith(GITHUB) ? url.slice(GITHUB.length).split(/[/#]/)[0]!.replace(/\.git$/, "") : undefined;

/** Every published package as a row, npm first, each registry sorted by name. `repositories`: the org's repository
    names (a Maven module's repository is linked only when it exists; an npm package whose source repository is no longer
    public — a paused product's — is left out). `products`: the products' ids — a package built from a product's own
    repository (`orazaka-cli`, `orazaka-ui-kit`) is part of that operated product, not of the open-source list, and is left
    out. `javaDocs`: the Krizaka Java site. */
export function packageRows(snapshot: RegistrySnapshot, repositories: readonly string[], javaDocs: string, products: readonly string[] = []): PackageRow[] {
  const isPublic = (name: string) => {
    const repo = repositoryOf(snapshot.npmMeta?.[name]?.repository);
    if (repo && products.some((p) => repo === p || repo.startsWith(`${p}-`))) return false;
    return !repo || repositories.length === 0 || repositories.includes(repo);
  };
  const npm = Object.entries(snapshot.npm ?? {}).filter(([name]) => isPublic(name)).map(([name, version]): PackageRow => {
    const meta = snapshot.npmMeta?.[name] ?? {};
    return {
      id: `npm:${name}`,
      name,
      registry: "npm",
      family: groupOfPackage(meta.keywords ?? []),
      line: summary(meta.description ?? ""),
      version,
      ...(Number.isInteger(meta.weeklyDownloads) ? { weeklyDownloads: meta.weeklyDownloads } : {}),
      ...(Array.isArray(meta.weeklySeries) && meta.weeklySeries.length === 12 && meta.weeklySeries.every(Number.isInteger) ? { weeklySeries: meta.weeklySeries } : {}),
      registryUrl: `https://www.npmjs.com/package/${name}`,
      ...(meta.repository?.startsWith(GITHUB) ? { repoUrl: meta.repository, releasesUrl: releasesUrl(meta.repository) } : {}),
      ...(meta.homepage ? { docsUrl: meta.homepage } : {}),
    };
  });
  const maven = Object.entries(snapshot.maven ?? {}).map(([artifact, version]): PackageRow => {
    const meta = snapshot.mavenMeta?.[artifact] ?? {};
    const family = mavenFamily(artifact, snapshot.mavenMeta);
    const repo = meta.scm?.startsWith(GITHUB) ? meta.scm : repositories.includes(family) ? `${GITHUB}${family}` : undefined;
    return {
      id: `maven:${artifact}`,
      name: artifact,
      registry: "maven",
      family,
      line: summary(meta.description ?? ""),
      version,
      registryUrl: `https://central.sonatype.com/artifact/com.krizaka/${artifact}`,
      ...(repo ? { repoUrl: repo, releasesUrl: releasesUrl(repo) } : {}),
      docsUrl: javaDocs,
    };
  });
  const byName = (a: PackageRow, b: PackageRow) => a.name.localeCompare(b.name);
  return [...npm.sort(byName), ...maven.sort(byName)];
}

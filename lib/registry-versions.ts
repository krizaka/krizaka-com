/* The published versions of Krizaka's packages, read at build time from lib/registry-versions.json (written by
   scripts/gen-registry-versions.mjs from npm and Maven Central on install, dev and build; git-ignored). One source for
   every version the site states — the badges of /open-source, the Maven list, the module map, the code samples. When
   the registries could not be reached, the file is empty and what cannot be known is not shown (never a number typed
   here). A static JSON import: safe in server and client modules alike. */

import snapshot from "./registry-versions.json";
import type { NpmPackageInfo } from "./npm-catalogue";
import { weeklyTotalOfSnapshot } from "./package-catalogue";

const versions = snapshot as {
  npm?: Record<string, string>;
  npmMeta?: Record<string, { description?: string; keywords?: string[]; repository?: string; weeklyDownloads?: number; weeklySeries?: number[] }>;
  maven?: Record<string, string>;
};

/** The `latest` version of an npm package (`@krizaka/ui`). */
export const npmVersion = (name: string): string | undefined => versions.npm?.[name];

/** The released version of a com.krizaka artifact on Maven Central (`krizaka-bom`). */
export const mavenVersion = (artifactId: string): string | undefined => versions.maven?.[artifactId];

/** A coordinate's version: `@scope/name` on npm, `com.krizaka:artifact` (or a bare artifact id) on Maven Central. */
export function publishedVersion(coordinate: string): string | undefined {
  if (coordinate.startsWith("@")) return npmVersion(coordinate);
  return mavenVersion(coordinate.replace(/^com\.krizaka:/, ""));
}

/** Code samples name versions as `{{v:@krizaka/ui}}` or `{{v:com.krizaka:krizaka-bom}}`: replaced here, at build. */
export function withVersions(code: string): string {
  return code.replace(/\{\{v:([^}]+)\}\}/g, (_, coordinate: string) => publishedVersion(coordinate.trim()) ?? "LATEST");
}

/** How many packages and artifacts Krizaka publishes (npm @krizaka scope + com.krizaka on Maven Central); 0 when the
    registries could not be reached at build. */
export const publishedCount = (): number => Object.keys(versions.npm ?? {}).length + Object.keys(versions.maven ?? {}).length;

/** How many com.krizaka artifacts are on Maven Central; 0 when it could not be reached at build. */
export const mavenArtifactCount = (): number => Object.keys(versions.maven ?? {}).length;

/** Every @krizaka package on npm with its `latest` version, description and keywords, as the registry gave them at
    build; empty when it could not be reached. */
export const npmPackages = (): NpmPackageInfo[] =>
  Object.entries(versions.npm ?? {}).map(([name, version]) => ({
    name,
    version,
    description: versions.npmMeta?.[name]?.description ?? "",
    keywords: versions.npmMeta?.[name]?.keywords ?? [],
  }));

/** The @krizaka packages published from one repository (its GitHub URL, as npm gave it at build): Krizaka TypeScript's count. */
export const npmPackagesFrom = (repoUrl: string): string[] =>
  Object.keys(versions.npm ?? {}).filter((name) => versions.npmMeta?.[name]?.repository === repoUrl).sort();

/** An npm package's downloads as api.npmjs.org gave them at build: last week's, and the last 12 weekly sums (oldest
    first, only when complete). Each is absent when unknown — never a typed number. */
export function npmDownloads(name: string): { weekly?: number; series?: number[] } {
  const meta = versions.npmMeta?.[name];
  return {
    weekly: Number.isInteger(meta?.weeklyDownloads) ? meta?.weeklyDownloads : undefined,
    series: Array.isArray(meta?.weeklySeries) && meta.weeklySeries.length >= 2 ? meta.weeklySeries : undefined,
  };
}

/** npm downloads of last week across every @krizaka package (api.npmjs.org at build, as /open-source shows them);
    undefined when the registry could not be reached. */
export const npmWeeklyDownloads = (): number | undefined => weeklyTotalOfSnapshot(versions);

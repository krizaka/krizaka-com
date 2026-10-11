/* The published versions of Krizaka's packages, read at build time from lib/registry-versions.json (written by
   scripts/gen-registry-versions.mjs from npm and Maven Central on install, dev and build; git-ignored). One source for
   every version the site states — the badges of /open-source, the Maven list, the module map, the code samples. When
   the registries could not be reached, the file is empty and what cannot be known is not shown (never a number typed
   here). A static JSON import: safe in server and client modules alike. */

import snapshot from "./registry-versions.json";

const versions = snapshot as { npm?: Record<string, string>; maven?: Record<string, string> };

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

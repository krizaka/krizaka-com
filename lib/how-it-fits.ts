/* "How it fits" on /open-source: the open-source stack in two layers, read from data — never drawn by hand.
   1. the building blocks: the @krizaka npm packages and the Krizaka Java artifacts of the platform kit;
   2. the shared services they call (the Maven modules that ship a `-service`, reached through their `-api` / `-client`).
   The products are not a layer here (2026-10-26): they are operated by Krizaka, not open source. The manifests only say
   which blocks are in use; no product is named in the result. Pure: tested by tests/how-it-fits.test.mjs. */

import { mavenFamily, type RegistrySnapshot } from "./package-catalogue.ts";

export interface Manifest {
  npm: readonly string[];
  maven: readonly string[];
}

export interface Layers {
  blocks: { npm: string[]; java: string[] };
  services: string[];
}

export function howItFits(
  manifests: Readonly<Record<string, Manifest>>,
  maven: RegistrySnapshot["mavenMeta"],
  published: Readonly<Record<string, string>>,
): Layers {
  const all = Object.values(manifests);
  const npm = [...new Set(all.flatMap((m) => m.npm))].sort((a, b) => a.localeCompare(b));
  const artifacts = [...new Set(all.flatMap((m) => m.maven))].sort((a, b) => a.localeCompare(b));
  const families = new Set(artifacts.map((a) => mavenFamily(a, maven)));
  // A shared service: a module that publishes a `<module>-service` artifact.
  const services = [...families].filter((f) => `${f}-service` in published).sort((a, b) => a.localeCompare(b));
  const java = artifacts.filter((a) => !services.includes(mavenFamily(a, maven)));
  return { blocks: { npm, java }, services };
}

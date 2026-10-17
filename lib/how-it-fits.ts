/* "How it fits" on /open-source: the architecture in four layers, read from data — never drawn by hand.
   1. the products (lib/products.ts, the engine aside);
   2. the engine every product's AI runs on (Orazaka), with how many products call it today and how many plan to
      (lib/engine-uses.ts);
   3. the building blocks the products' manifests depend on (lib/product-manifests.json): the @krizaka npm packages and
      the Krizaka Java artifacts of the platform kit;
   4. the shared services they call (the Maven modules that ship a `-service`, reached through their `-api` / `-client`).
   Pure: tested by tests/how-it-fits.test.mjs. */

import { mavenFamily, type RegistrySnapshot } from "./package-catalogue.ts";

export interface Manifest {
  npm: readonly string[];
  maven: readonly string[];
}

export interface Layers {
  products: string[];
  engine: { id: string; calls: number; planned: number };
  blocks: { npm: string[]; java: string[] };
  services: string[];
}

export function howItFits(
  products: readonly { id: string }[],
  engineId: string,
  uses: readonly { id: string; planned?: boolean }[],
  manifests: Readonly<Record<string, Manifest>>,
  maven: RegistrySnapshot["mavenMeta"],
  published: Readonly<Record<string, string>>,
): Layers {
  const all = Object.values(manifests);
  const npm = [...new Set(all.flatMap((m) => m.npm))].sort();
  const artifacts = [...new Set(all.flatMap((m) => m.maven))].sort();
  const families = new Set(artifacts.map((a) => mavenFamily(a, maven)));
  // A shared service: a module that publishes a `<module>-service` artifact.
  const services = [...families].filter((f) => `${f}-service` in published).sort();
  const java = artifacts.filter((a) => !services.includes(mavenFamily(a, maven)));
  return {
    products: products.map((p) => p.id).filter((id) => id !== engineId),
    engine: { id: engineId, calls: uses.filter((u) => !u.planned).length, planned: uses.filter((u) => u.planned).length },
    blocks: { npm, java },
    services,
  };
}

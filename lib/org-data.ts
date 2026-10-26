/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — organisation-level data for the home page and /open-source (the products themselves: lib/products.ts).
   Repository lists are NOT written here: they come from the generated
   architecture files of each product (app/data/*.json).
   ═══════════════════════════════════════════════════════════════════ */

import orazaka from "@/app/data/architecture.json";

export type Loc = "fr" | "en";
export type L = Record<Loc, string>;

export interface OrgRepository {
  name: string;
  url: string;
  description: string;
  product: "krizaka" | "orazaka";
  group: string;
}

const ORAZAKA_GROUP: Record<string, string> = {
  foundation: "foundation",
  ai: "ai",
  worker: "ai",
  app: "apps",
  content: "apps",
};

/** Every public repository of the organisation, from the generated product data. */
export function orgRepositories(): OrgRepository[] {
  // The workspace manifest lists the Krizaka building blocks it is built on (layer "krizaka"): they belong to the
  // organisation, not to Orazaka.
  const oz = ((orazaka as { repositories?: { name: string; url: string; description: string; layer: string }[] }).repositories ?? []).map(
    (r): OrgRepository =>
      r.layer === "krizaka"
        ? { name: r.name, url: r.url, description: r.description, product: "krizaka", group: "domain" }
        : { name: r.name, url: r.url, description: r.description, product: "orazaka", group: ORAZAKA_GROUP[r.layer] ?? "apps" },
  );
  const workspace: OrgRepository = {
    name: "orazaka",
    url: "https://github.com/krizaka/orazaka",
    description:
      "Orazaka platform workspace: governance contract, workspace manifest, local infrastructure, end-to-end tests and architecture docs. Clones and builds every Orazaka repository.",
    product: "orazaka",
    group: "workspace",
  };
  // Organisation-level repositories that belong to no product (they have no generated architecture file).
  const shared: OrgRepository[] = [
    {
      name: "krizaka-ui",
      url: "https://github.com/krizaka/krizaka-ui",
      description: "@krizaka/ui — the Krizaka brand layer shared by every product: animated marks and the motion signature.",
      product: "krizaka",
      group: "domain",
    },
  ];
  return [workspace, ...oz, ...shared];
}

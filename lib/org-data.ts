/* ═══════════════════════════════════════════════════════════════════
   KRIZAKA — organisation-level data for the home page and /open-source (the products themselves: lib/products.ts).
   Repository lists are NOT written here: they come from the generated
   architecture files of each product (app/data/*.json).
   ═══════════════════════════════════════════════════════════════════ */

import sovkora from "@/app/data/architecture.json";

export type Loc = "fr" | "en";
export type L = Record<Loc, string>;

export interface OrgRepository {
  name: string;
  url: string;
  description: string;
  product: "krizaka" | "sovkora";
  group: string;
}

const SOVKORA_GROUP: Record<string, string> = {
  foundation: "foundation",
  ai: "ai",
  worker: "ai",
  app: "apps",
  content: "apps",
};

/** Every public repository of the organisation, from the generated product data. */
export function orgRepositories(): OrgRepository[] {
  // The module list names the Krizaka building blocks Sovkora is built on (layer "krizaka"): they belong to the
  // organisation, not to Sovkora. Sovkora's own modules are folders of krizaka/sovkora (ADR-029: a `/tree/` URL), counted
  // once as that repository below, never as repositories of their own.
  const oz = (
    (sovkora as { repositories?: { name: string; url: string; description: string; layer: string }[] }).repositories ??
    []
  )
    .filter((r) => !r.url.includes("/tree/"))
    .map((r): OrgRepository =>
      r.layer === "krizaka"
        ? { name: r.name, url: r.url, description: r.description, product: "krizaka", group: "domain" }
        : {
            name: r.name,
            url: r.url,
            description: r.description,
            product: "sovkora",
            group: SOVKORA_GROUP[r.layer] ?? "apps",
          },
    );
  const workspace: OrgRepository = {
    name: "sovkora",
    url: "https://github.com/krizaka/sovkora",
    description:
      "Sovkora, one repository: the services, the engine, the web, mobile, Mac and command-line clients, the media worker, the packs, the local infrastructure and the docs.",
    product: "sovkora",
    group: "workspace",
  };
  // Organisation-level repositories that belong to no product (they have no generated architecture file).
  const shared: OrgRepository[] = [
    {
      name: "krizaka-ui",
      url: "https://github.com/krizaka/krizaka-ui",
      description:
        "@krizaka/ui — the Krizaka brand layer shared by every product: animated marks and the motion signature.",
      product: "krizaka",
      group: "domain",
    },
  ];
  return [workspace, ...oz, ...shared];
}

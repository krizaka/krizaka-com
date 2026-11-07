/* The products in conception (founder, 2026-11-03, krizaka-internal#2143): named on the home with their mark, one line and
   the stamp « In design », nothing else — no site, no version, no source, no plate, no bird, no note. Their need and scope
   are being settled, so nothing is built or offered yet: they stay out of PRODUCTS, so out of the nav, the hero's marks,
   the sitemap, llms.txt, the JSON-LD (`owns`), the dev-version read and the dev-preview gate. A product leaves this list
   for PRODUCTS when its repository builds something real.
   `kridoc` is a code name (the ids of @krizaka/org): it never appears in a rendered word; the name comes from
   `displayName`. Words: site.home.products.inDesign.lines.<id>. */

import { brandOf, displayName } from "@krizaka/org";
import type { ProductStatus } from "./products.ts";

export const IN_DESIGN_IDS = ["kridoc"] as const;
export type InDesignId = (typeof IN_DESIGN_IDS)[number];

export interface ProductInDesign {
  /** The code name: the mark and the messages use it. */
  id: InDesignId;
  name: string;
  /** Its live coming-soon site (www.<commercial>.com, from the org brand's `domains.site`): the one link it carries. */
  siteUrl: string;
  status: Extract<ProductStatus, "design">;
}

export const IN_DESIGN: readonly ProductInDesign[] = [
  {
    id: "kridoc",
    name: displayName("kridoc"),
    siteUrl: brandOf("kridoc").domains.site ?? "",
    status: "design",
  },
];

/* THE product card of krizaka.com — one block wherever a product is listed (the home, /products, /story): the
   @krizaka/ui ArgumentCard, worn in the product's brand (`.brand-<id>` gives its accent and its mark). Mark · the
   know-how it proves · "Proved by <name>" · its release state (lib/nav.ts statuses, said honestly) · one line · the
   way in (the product's own site, or its code while it has no site) and, discreet, its source. Data comes from
   lib/products.ts (PRODUCTS) — never a hand list; words from site.products.<…>. A server component. */

import Link from "next/link";
import { ProductLogo } from "@krizaka/ui";
import { ActionBar } from "@krizaka/ui/action-bar";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import type { Fact } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { PRODUCTS, type Product, type ProductId } from "@/lib/products";
import { GitHubMark } from "./brand/GitHubMark";

export function ProductCard({ product: p, locale }: { product: Product; locale: string }) {
  const site = getDictionary(locale).site;
  const h = site.products;
  const facts: Fact[] = [p.status ? { label: site.nav.status[p.status].label, tone: "wip" } : { label: site.home.products.preview, tone: "ok" }];
  return (
    <ArgumentCard
      id={`product-${p.id}`}
      className={"brand-" + p.id}
      icon={<ProductLogo id={p.id} size={40} animated={false} />}
      title={h.knowhow[p.id].name}
      meta={format(h.proofBy, { name: p.name })}
      facts={facts}
      hook={{ label: h.hookLabel, text: h.cards[p.id].line }}
      more={{ href: p.devUrl, label: p.noSite ? h.seeCode : h.visit }}
      linkAs={Link}
      actions={
        p.noSite ? undefined : (
          <ActionBar
            variant="icons"
            size="sm"
            label={h.source}
            actions={[{ href: p.repoUrl, label: format(h.sourceAria, { name: p.name }), icon: <GitHubMark size={17} /> }]}
          />
        )
      }
    />
  );
}

/** Every product of lib/products.ts as the same card; `only` / `exclude` pick a subset (the story's stages). */
export default function ProductGrid({
  locale,
  only,
  exclude,
  reveal = true,
  min = 300,
}: {
  locale: string;
  only?: readonly ProductId[];
  exclude?: readonly ProductId[];
  reveal?: boolean;
  min?: number;
}) {
  const list = PRODUCTS.filter((p) => (!only || only.includes(p.id)) && !exclude?.includes(p.id));
  const picked = only ? only.map((id) => list.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)) : list;
  return (
    <CardGrid as="ul" min={min} columns={3} fit={picked.length === PRODUCTS.length ? "fit" : "fill"} reveal={reveal}>
      {picked.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} />
      ))}
    </CardGrid>
  );
}

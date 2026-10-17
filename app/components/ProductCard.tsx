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
import { LinkCard } from "@krizaka/ui/link-card";
import { type Fact, Facts } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { ENGINE_USES } from "@/lib/engine-uses";
import { PRODUCTS, type Product, type ProductId } from "@/lib/products";
import { ENGINE } from "@/lib/story";
import { GitHubMark } from "./brand/GitHubMark";

export function ProductCard({ product: p, locale }: { product: Product; locale: string }) {
  const site = getDictionary(locale).site;
  const h = site.products;
  const facts: Fact[] = [{ label: site.nav.status[p.status].label, tone: p.status === "devPreview" ? "ok" : "wip" }];
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

/** THE engine card — Orazaka as the foundation of the products: a wide card, and the honest list of what each product
 *  uses it for (lib/engine-uses.ts; "planned" where the call is not wired yet). A server component. */
export function EngineCard({ locale }: { locale: string }) {
  const h = getDictionary(locale).site.products;
  const e = h.engine;
  const engine = PRODUCTS.find((p) => p.id === ENGINE)!;
  const uses: Fact[] = ENGINE_USES.map((u) => {
    const name = PRODUCTS.find((p) => p.id === u.id)!.name;
    const text = e.uses[u.id as keyof typeof e.uses];
    return u.planned ? { label: `${name}: ${text} (${e.planned})`, tone: "wip" } : { label: `${name}: ${text}`, tone: "neutral" };
  });
  return (
    <LinkCard
      href={engine.devUrl}
      linkAs={Link}
      className={"brand-" + engine.id}
      icon={<ProductLogo id={engine.id} size={44} animated={false} />}
      meta={e.meta}
      title={e.title}
      description={e.line}
      extra={
        <div className="engine-uses">
          <p className="engine-uses-label">{e.usesLabel}</p>
          <Facts items={uses} />
        </div>
      }
      cta={h.visit}
      titleAs="h3"
    />
  );
}

/** Every product of lib/products.ts as the same card; `only` / `exclude` pick a subset (the story's stages).
 *  `withEngine`: Orazaka is not one card among the others — it is the foundation (EngineCard), and the other products
 *  are the cards it powers, in a frame joined to it (@krizaka/ui CardGrid `foundation`). */
export default function ProductGrid({
  locale,
  only,
  exclude,
  reveal = true,
  min = 300,
  withEngine = false,
}: {
  locale: string;
  only?: readonly ProductId[];
  exclude?: readonly ProductId[];
  reveal?: boolean;
  min?: number;
  withEngine?: boolean;
}) {
  const skip = withEngine ? [...(exclude ?? []), ENGINE] : exclude;
  const list = PRODUCTS.filter((p) => (!only || only.includes(p.id)) && !skip?.includes(p.id));
  const picked = only ? only.map((id) => list.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)) : list;
  return (
    <CardGrid
      as="ul"
      min={min}
      columns={3}
      fit={picked.length === PRODUCTS.length ? "fit" : "fill"}
      reveal={reveal}
      {...(withEngine
        ? { foundation: <EngineCard locale={locale} />, foundationLabel: getDictionary(locale).site.products.engine.label, className: "brand-" + ENGINE }
        : {})}
    >
      {picked.map((p) => (
        <ProductCard key={p.id} product={p} locale={locale} />
      ))}
    </CardGrid>
  );
}

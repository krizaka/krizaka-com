/* The products, on the home — the only place krizaka.com presents them (/products answers 308 here). Orazaka is the
   foundation: a wide @krizaka/ui GlowCard, its ring turning, its words beside the engine flow (EngineFlowView,
   @krizaka/ui/engine-flow: radial, top to bottom on a phone); the other products are the cards it powers
   (CardGrid `foundation`, "Powered by Orazaka"), each a GlowCard in its own brand light (`.brand-<id>`): the mark large,
   the name, the status said honestly (lib/products.ts, gated by the dev-preview checklists), one line, and one readable
   line of what it uses Orazaka for (lib/engine-uses.ts, "planned" where the call is not wired yet). The whole card is
   one link to the product's own site (or its code while it has none); its source is a discreet second link.
   Each card SHOWS its field first: a live mini-visual made of @krizaka/ui components (visuals/, lazy, decorative,
   still under reduced motion). Data: lib/products.ts, lib/engine-uses.ts, lib/product-visuals.ts — never a hand list. Words: site.products.*, site.home.products.*. */

import { ForwardIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { cn } from "@krizaka/ui/cn";
import { GlowCard } from "@krizaka/ui/glow-card";
import { Section } from "@krizaka/ui/page";
import { ENGINE_USES } from "@/lib/engine-uses";
import { format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { PRODUCTS, type Product } from "@/lib/products";
import { ENGINE } from "@/lib/story";
import { ProductStatus } from "../ProductStatus";
import { GitHubMark } from "../brand/GitHubMark";
import EngineFlowView from "./EngineFlowView";
import ProductVisual from "./visuals/ProductVisual";
import "./visuals/visuals.css";

const external = (p: Product) => ({ href: p.devUrl, target: "_blank", rel: "noopener" });

function EngineCard({ t }: { t: TranslationDictionary }) {
  const engine = PRODUCTS.find((p) => p.id === ENGINE)!;
  const h = t.site.products;
  return (
    <GlowCard alive id={"product-" + engine.id} className={cn("kz-pc kz-pc-engine", "brand-" + engine.id)}>
      <span className="kz-pc-light" aria-hidden />
      <div className="kz-pc-body">
        <p className="kz-pc-meta">
          {h.engine.meta} <ProductStatus status={engine.status} t={t} />
        </p>
        <h3 className="kz-pc-name">
          <a {...external(engine)} className="kz-pc-link">
            {engine.name}
          </a>
        </h3>
        <p className="kz-pc-line">{h.engine.line}</p>
        <p className="kz-pc-foot">
          <span className="kz-pc-cta">
            {h.visit} <ForwardIcon size={14} aria-hidden />
          </span>
          <a href={engine.repoUrl} className="kz-pc-source" aria-label={format(h.sourceAria, { name: engine.name })}>
            <GitHubMark size={16} />
          </a>
        </p>
      </div>
      <EngineFlowView t={t} />
    </GlowCard>
  );
}

function ProductGlowCard({ product: p, t }: { product: Product; t: TranslationDictionary }) {
  const h = t.site.products;
  const use = ENGINE_USES.find((u) => u.id === p.id);
  const useText = use ? h.engine.uses[use.id as keyof typeof h.engine.uses] : undefined;
  return (
    <GlowCard id={"product-" + p.id} className={cn("kz-pc", "brand-" + p.id)}>
      <span className="kz-pc-light" aria-hidden />
      {p.id !== ENGINE && <ProductVisual id={p.id} />}
      <div className="kz-pc-head">
        <span className="kz-pc-mark">
          <ProductLogo id={p.id} size={56} animated={false} />
        </span>
        <ProductStatus status={p.status} t={t} />
      </div>
      <h3 className="kz-pc-name">
        <a {...external(p)} className="kz-pc-link" aria-label={p.noSite ? format(h.seeCodeAria, { name: p.name }) : undefined}>
          {p.name}
        </a>
      </h3>
      <p className="kz-pc-meta">{h.knowhow[p.id].name}</p>
      <p className="kz-pc-line">{h.cards[p.id].line}</p>
      {useText && (
        <p className="kz-pc-uses" data-planned={use?.planned ? "" : undefined}>
          <ProductLogo id={ENGINE} size={16} animated={false} />
          {format(use?.planned ? t.site.home.products.enginePlanned : t.site.home.products.engineUse, { use: useText })}
        </p>
      )}
      <p className="kz-pc-foot">
        <span className="kz-pc-cta">
          {p.noSite ? h.seeCode : h.visit} <ForwardIcon size={14} aria-hidden />
        </span>
        {!p.noSite && (
          <a href={p.repoUrl} className="kz-pc-source" aria-label={format(h.sourceAria, { name: p.name })}>
            <GitHubMark size={16} />
          </a>
        )}
      </p>
    </GlowCard>
  );
}

export default function ProductShowcase({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const s = t.site.home.products;
  const others = PRODUCTS.filter((p) => p.id !== ENGINE);
  return (
    <Section id="products" eyebrow={s.eyebrow} title={s.title} lead={s.lead} reveal>
      <CardGrid
        as="ul"
        min={280}
        columns={3}
        foundation={<EngineCard t={t} />}
        foundationLabel={t.site.products.engine.label}
        className={cn("kz-products", "brand-" + ENGINE)}
      >
        {others.map((p) => (
          <ProductGlowCard key={p.id} product={p} t={t} />
        ))}
      </CardGrid>
    </Section>
  );
}

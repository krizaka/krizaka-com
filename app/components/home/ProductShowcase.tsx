/* The products, on the home — the only place krizaka.com presents them (/products answers 308 here). Redesigned
   2026-10-20 (Oussama: « box in box in box », too many labels, a card wall under the new flow): no frame and no card in
   a card. The engine leads — its words and @krizaka/ui's EngineFlow (EngineFlowView), sticky beside the list on a wide
   screen — and the products it powers are a quiet list, one row each in its own brand light (`.brand-<id>`): a live
   mini-visual edge to edge (visuals/, lazy, decorative, still under reduced motion), the mark beside the name, the status
   said once (lib/products.ts, gated by the dev-preview checklists), one line, and one readable line of what it uses
   Orazaka for (lib/engine-uses.ts, "planned" where the call is not wired yet). The whole row is one link to the product's
   own site (or its code while it has none); its source is a discreet second link. Each row is tied to its node in the
   flow (ProductsLink): in the middle of the screen or pointed at, its node lights, and the reverse.
   Data: lib/products.ts, lib/engine-uses.ts, lib/product-visuals.ts — never a hand list. Words: site.products.*, site.home.products.*. */

import { ForwardIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { Section } from "@krizaka/ui/page";
import { ENGINE_USES } from "@/lib/engine-uses";
import { format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { PRODUCTS, type Product } from "@/lib/products";
import { ENGINE } from "@/lib/story";
import { ProductStatus } from "../ProductStatus";
import { GitHubMark } from "../brand/GitHubMark";
import EngineFlowView from "./EngineFlowView";
import ProductsLink from "./ProductsLink";
import ProductVisual from "./visuals/ProductVisual";
import "./visuals/visuals.css";

const external = (p: Product) => ({ href: p.devUrl, target: "_blank", rel: "noopener" });

function EngineBlock({ t }: { t: TranslationDictionary }) {
  const engine = PRODUCTS.find((p) => p.id === ENGINE)!;
  const h = t.site.products;
  return (
    <div id={"product-" + engine.id} className={cn("kz-prod-engine", "brand-" + engine.id)}>
      <div className="kz-prod-engine-text">
        <div className="kz-prod-head">
          <h3 className="kz-prod-name kz-prod-name-engine">
            <a {...external(engine)} className="kz-prod-plain">
              {engine.name}
            </a>
          </h3>
          <ProductStatus status={engine.status} t={t} />
        </div>
        <p className="kz-prod-line">{h.engine.line}</p>
        <p className="kz-prod-foot">
          <a {...external(engine)} className="kz-prod-cta kz-prod-plain">
            {h.visit} <ForwardIcon size={14} aria-hidden />
          </a>
          <a href={engine.repoUrl} className="kz-prod-source" aria-label={format(h.sourceAria, { name: engine.name })}>
            <GitHubMark size={16} />
          </a>
        </p>
      </div>
      <EngineFlowView t={t} />
    </div>
  );
}

function ProductRow({ product: p, t }: { product: Product; t: TranslationDictionary }) {
  const h = t.site.products;
  const use = ENGINE_USES.find((u) => u.id === p.id);
  const useText = use ? h.engine.uses[use.id as keyof typeof h.engine.uses] : undefined;
  return (
    <li id={"product-" + p.id} className={cn("kz-prod-row", "brand-" + p.id)} data-product={p.id}>
      <ProductVisual id={p.id} />
      <div className="kz-prod-text">
        <div className="kz-prod-head">
          <ProductLogo id={p.id} size={32} animated={false} />
          <h3 className="kz-prod-name">
            <a {...external(p)} className="kz-prod-link" aria-label={p.noSite ? format(h.seeCodeAria, { name: p.name }) : undefined}>
              {p.name}
            </a>
          </h3>
          <ProductStatus status={p.status} t={t} />
        </div>
        <p className="kz-prod-line">{h.cards[p.id].line}</p>
        {useText && (
          <p className="kz-prod-uses" data-planned={use?.planned ? "" : undefined}>
            <ProductLogo id={ENGINE} size={14} animated={false} />
            <span>{format(use?.planned ? t.site.home.products.enginePlanned : t.site.home.products.engineUse, { use: useText })}</span>
          </p>
        )}
        <p className="kz-prod-foot">
          <span className="kz-prod-cta">
            {p.noSite ? h.seeCode : h.visit} <ForwardIcon size={14} aria-hidden />
          </span>
          {!p.noSite && (
            <a href={p.repoUrl} className="kz-prod-source" aria-label={format(h.sourceAria, { name: p.name })}>
              <GitHubMark size={16} />
            </a>
          )}
        </p>
      </div>
    </li>
  );
}

export default function ProductShowcase({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const s = t.site.home.products;
  const others = PRODUCTS.filter((p) => p.id !== ENGINE);
  return (
    <Section id="products" eyebrow={s.eyebrow} title={s.title} lead={s.lead} reveal>
      <ProductsLink className={cn("kz-prod", "brand-" + ENGINE)}>
        <EngineBlock t={t} />
        <ul className="kz-prod-list" aria-label={t.site.products.engine.label}>
          {others.map((p) => (
            <ProductRow key={p.id} product={p} t={t} />
          ))}
        </ul>
      </ProductsLink>
    </Section>
  );
}

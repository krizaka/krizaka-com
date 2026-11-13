/* The products, on the home — the only place krizaka.com presents them (/products answers 308 here). Cahier (krizaka-ui
   ADR-004, #417): the section is a page of the field notebook, on lined paper with its red margin and its number (§ 2).
   Since krizaka-internal#3243 (founder, 2026-11-13: « le but de krizaka.com c'est le site de la compagnie ») the home has no
   carousel and mounts no video element: each product is one ROW, Sovkora (the engine) first, then Verikora, then Folioviv — its
   mark, its name, the stamp of its honest status (lib/products.ts), one neutral line, and its links: « See the site » (its
   commercial www domain), « Source » and « Release notes ». Nothing moves, nothing is a card. The films live on their watch
   pages (/films/<id>), reached from /story and the footer.
   - what each product runs on Sovkora (lib/engine-uses.ts) is one quiet line;
   - the notes at the foot of the section: what each product really does, sourced;
   - after the products, the ones in conception (lib/products-in-design.ts): their row and one mood photo (ShowcaseStill,
     krizaka-internal#2802), captioned as in conception; a still picture, never a screen of an app that does not exist.
   The row is local until @krizaka/ui ships `SpecimenTag size="row"` (krizaka-internal#3240): then it is swapped for it.
   Data: lib/products.ts, lib/engine-uses.ts. Words: site.home.products.*, site.products.*. */

import { ForwardIcon } from "@krizaka/icons";
import { KridocLogo, ProductLogo } from "@krizaka/ui";
import { FootnoteRef, Footnotes } from "@krizaka/ui/footnote";
import { Section } from "@krizaka/ui/page";
import { Stamp, type StampTone } from "@krizaka/ui/specimen-tag";
import { ENGINE_USES } from "@/lib/engine-uses";
import { format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { productOrder, STILL_FIGURE } from "@/lib/home-sections";
import { PRODUCTS, type Product, type ProductStatus } from "@/lib/products";
import { IN_DESIGN, type ProductInDesign } from "@/lib/products-in-design";
import { ENGINE } from "@/lib/story";
import ButtonLink from "../ButtonLink";
import { GitHubMark } from "../brand/GitHubMark";
import ShowcaseStill from "./ShowcaseStill";

/** The stamp of a status: `ok` only for what is out, `wip` in development, `construction` not open yet. */
const STAMP: Record<ProductStatus, StampTone> = {
  devPreview: "ok",
  development: "wip",
  paused: "neutral",
  construction: "construction",
  upcoming: "neutral",
  design: "neutral",
};
/** The numbers of the notes follow the order of the page (1, 2, 3), never a gap; */
const SHOWN = productOrder(PRODUCTS);
const nOf = (p: Product) => SHOWN.findIndex((x) => x.id === p.id) + 1;
const fnRef = (p: Product) => <FootnoteRef n={nOf(p)} prefix="kz-note" />;

/** One action per row, « See the site » (its commercial www domain, a new tab), then two quiet links: the source and the
 *  release notes (the changelog filtered on the product). One link per destination; each accessible name names the product. */
function Foot({ p, t, locale }: Readonly<{ p: Product; t: TranslationDictionary; locale: string }>) {
  const h = t.site.products;
  return (
    <>
      <ButtonLink
        href={p.siteUrl}
        variant="secondary"
        size="sm"
        rel="noopener"
        ariaLabel={format(h.visitSiteAria, { name: p.name })}
      >
        {h.visitSite} <ForwardIcon size={13} aria-hidden />
      </ButtonLink>
      <a href={p.repoUrl} aria-label={format(h.sourceAria, { name: p.name })}>
        <GitHubMark size={14} /> {h.source}
      </a>
      <a href={`/${locale}/changelog?produit=${p.id}`} aria-label={format(h.releaseNotesAria, { name: p.name })}>
        {h.releaseNotes}
      </a>
    </>
  );
}

/** One product: its mark, its name, its status in words, one neutral line, what it runs on Sovkora, then its links. */
function ProductRow({
  product: p,
  t,
  locale,
}: Readonly<{ product: Product; t: TranslationDictionary; locale: string }>) {
  const engine = p.id === ENGINE;
  const use = ENGINE_USES.find((u) => u.id === p.id);
  const useText = use ? t.site.products.engine.uses[use.id as keyof typeof t.site.products.engine.uses] : undefined;
  return (
    <li
      id={"product-" + p.id}
      className={"kz-row brand-" + p.id}
      data-product={p.id}
      data-engine={engine ? "" : undefined}
    >
      <div className="kz-row-head">
        <ProductLogo id={p.id} size={30} animated={false} />
        <h3 className="kz-row-name">{p.name}</h3>
        <Stamp tone={STAMP[p.status]} size="sm">
          {t.site.nav.status[p.status].label}
        </Stamp>
      </div>
      <p className="kz-row-line">
        {engine ? t.site.home.engine.line : t.site.products.cards[p.id].line}
        {fnRef(p)}
      </p>
      {useText && (
        <p className="kz-row-uses" data-planned={use?.planned ? "" : undefined}>
          <a href={`#product-${ENGINE}`}>
            {format(use?.planned ? t.site.home.products.enginePlanned : t.site.home.products.engineUse, {
              use: useText,
            })}
          </a>
        </p>
      )}
      <div className="kz-row-links">
        <Foot p={p} t={t} locale={locale} />
      </div>
    </li>
  );
}

/** The marks of the products in conception: Kridoc has a mark and no palette (@krizaka/ui ProductLogo leaves it out). */
const DESIGN_MARK = { kridoc: KridocLogo } as const;

/** A product in conception: its row and its still (a mood photo). It links its live coming-soon site, nothing else. */
function DesignRow({
  product: p,
  fig,
  t,
  locale,
}: Readonly<{ product: ProductInDesign; fig: number; t: TranslationDictionary; locale: string }>) {
  const Mark = DESIGN_MARK[p.id];
  const h = t.site.products;
  return (
    <li id={"product-" + p.id} className="kz-row kz-row-design" data-product={p.id}>
      <div className="kz-row-head">
        <Mark size={48} animated={false} />
        <h3 className="kz-row-name">{p.name}</h3>
        <Stamp tone={STAMP[p.status]} size="sm">
          {t.site.nav.status[p.status].label}
        </Stamp>
      </div>
      <p className="kz-row-line">{t.site.home.products.inDesign.lines[p.id]}</p>
      <div className="kz-row-links">
        <a href={p.siteUrl} target="_blank" rel="noopener" aria-label={format(h.visitSiteAria, { name: p.name })}>
          {h.visitSite} <ForwardIcon size={13} aria-hidden />
        </a>
      </div>
      <div className="kz-row-plate">
        <ShowcaseStill product={p.id} fig={fig} locale={locale} />
      </div>
    </li>
  );
}

/** The products (§ 2): one row each, Sovkora · Verikora · Folioviv, then the ones in conception. No carousel, no video. */
export default function ProductShowcase({ locale }: Readonly<{ locale: string }>) {
  const t = getDictionary(locale);
  const s = t.site.home.products;
  return (
    <div id="products" className="kz-products">
      <Section id="products-guide" number={s.number} title={s.title} lead={s.lead} paper="lines" margin reveal>
        <ol className="kz-rows" aria-label={s.title}>
          {SHOWN.map((p) => (
            <ProductRow key={p.id} product={p} t={t} locale={locale} />
          ))}
        </ol>
        <ol className="kz-rows kz-rows-design" aria-label={s.inDesign.label}>
          {IN_DESIGN.map((p, i) => (
            <DesignRow key={p.id} product={p} fig={STILL_FIGURE + i} t={t} locale={locale} />
          ))}
        </ol>
        <Footnotes
          className="kz-prod-notes"
          prefix="kz-note"
          label={s.notesLabel}
          backLabel={s.backLabel}
          notes={SHOWN.map((p) => `${p.name}. ${s.notes[p.id]}`)}
        />
      </Section>
    </div>
  );
}

/* The products, on the home — the only place krizaka.com presents them (/products answers 308 here). Cahier (krizaka-ui
   ADR-004, #417): the section is a page of the field notebook, on lined paper with its red margin and its number (§ 2).
   Since 2026-11-05 (founder, krizaka-internal#2450) the products stand in one row, Verikora · Sovkora · Folioviv, the
   engine in the centre (lib/home-sections.ts PRODUCT_ORDER), and each entry pairs its specimen tag with a carousel of what
   was made for it (Showcase, lib/home-showcase.ts: the reels' shots widened to 16:9, the clips Sovkora generated, the
   brand film; a 4:5 rendition on phones). The tag and the carousel swap sides from one entry to the next, so Sovkora's
   carousel is on the right (entrySide).
   - a carousel: numbered figure (« Fig. 3b », after the hero's Fig. 1: lib/home-sections.ts sectionFigure), which advances
     on its own with a visible pause, still under reduced motion, its text version on the server;
   - a specimen tag: its catalogue number, its name (plain text), its mark, its site (the commercial www domain) and its
     « not open yet » (no version: a coming-soon page runs no app), one action « See the page (opening soon) » (the waiting page, new tab) and
     two quiet links, « Source » and « Release notes », the stamp of its honest status (lib/products.ts), its line, its bird,
     what it runs on Sovkora (lib/engine-uses.ts) — and for the engine, what it gives and the products it powers, folded;
   - under its line, one discreet « you'll love » line about a feature that runs (lib/product-highlights.ts, with its source);
   - the notes at the foot of the section: what each product really does, sourced;
   - after the products, the ones in conception (lib/products-in-design.ts): their tag and a sample document in demo
     data, « Demo soon »; no version, no source, no bird, no note, no date, no sign-up, since nothing is built.
   Data: lib/products.ts, lib/engine-uses.ts, lib/product-highlights.ts, lib/story.ts (PRODUCT_BIRD) — never a hand list. Words: site.home.products.*,
   site.home.engine.*, site.products.*, site.story.world.cues. */

import { ForwardIcon } from "@krizaka/icons";
import { KridocLogo, ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { Badge } from "@krizaka/ui/badge";
import { Caption, FootnoteRef, Footnotes } from "@krizaka/ui/footnote";
import { Mascot } from "@krizaka/ui/mascots";
import { Section } from "@krizaka/ui/page";
import { SpecimenTag, type StampTone } from "@krizaka/ui/specimen-tag";
import { ENGINE_USES } from "@/lib/engine-uses";
import { format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { entrySide, productOrder, sectionFigure } from "@/lib/home-sections";
import { showcaseOf } from "@/lib/home-showcase";
import { PRODUCT_HIGHLIGHTS } from "@/lib/product-highlights";
import { PRODUCTS, type Product, type ProductStatus } from "@/lib/products";
import { IN_DESIGN, type ProductInDesign } from "@/lib/products-in-design";
import { ENGINE, PRODUCT_BIRD, type StoryBird } from "@/lib/story";
import ButtonLink from "../ButtonLink";
import { GitHubMark } from "../brand/GitHubMark";
import Showcase from "./Showcase";
import "./visuals/visuals.css";

/** The stamp of a status: `ok` only for what is out, `wip` in development, `construction` not open yet. */
const STAMP: Record<ProductStatus, StampTone> = {
  devPreview: "ok",
  development: "wip",
  paused: "neutral",
  construction: "construction",
  upcoming: "neutral",
  design: "neutral",
};
const FILM_BIRDS = ["falcon", "owl", "duck", "flamingo", "pigeon"] as const;

const host = (url: string) => new URL(url).host;
/** The catalogue number of a product: its place in lib/products.ts (the engine is KZ-01). */
const code = (p: Product) => `KZ-${String(PRODUCTS.indexOf(p) + 1).padStart(2, "0")}`;

/** The numbers of the notes follow the order of the page (1, 2, 3), never a gap; the figures follow the hero's Fig. 1 (2, 3, 4). */
const SHOWN = productOrder(PRODUCTS);
const nOf = (p: Product) => SHOWN.findIndex((x) => x.id === p.id) + 1;
const fnRef = (p: Product) => <FootnoteRef n={nOf(p)} prefix="kz-note" />;

/** The bird of a product and what it says: the film's promise for the five birds of the film, its name for the family. */
function Bird({ bird, t }: Readonly<{ bird: StoryBird; t: TranslationDictionary }>) {
  const film = (FILM_BIRDS as readonly string[]).includes(bird);
  const words = film
    ? t.site.story.world.cues[bird as (typeof FILM_BIRDS)[number]]
    : t.site.home.products.birds[bird as keyof TranslationDictionary["site"]["home"]["products"]["birds"]];
  return (
    <p className="kz-entry-bird">
      <Mascot bird={bird} mood="welcome" tone="own" size={48} animated={false} aria-hidden />
      <span>{words}</span>
    </p>
  );
}

/** The site of a product: its commercial www domain, and that it is not open yet (a coming-soon page runs no app, so the card
 *  shows no version: AGENTS §2). Never typed, never read from a dev host. */
function siteFields(p: Product, s: TranslationDictionary["site"]["home"]["products"]) {
  return [{ label: s.fields.site, value: format(s.siteValue, { host: host(p.siteUrl) }) }];
}

/** One action per card, « See the site » (its commercial www domain, a new tab), then two quiet links: the source and the
 *  release notes (the changelog filtered on the product). One link per destination; each accessible name names the product. */
function Foot({ p, t, locale }: Readonly<{ p: Product; t: TranslationDictionary; locale: string }>) {
  const h = t.site.products;
  return (
    <>
      <ButtonLink
        href={p.siteUrl}
        variant="primary"
        size="sm"
        rel="noopener"
        className="kz-tag-action"
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

/** What both kinds of entry (the engine, a product) put on their specimen tag: code, name, mark, status, dev fields, footer. */
function tagProps(p: Product, t: TranslationDictionary, locale: string) {
  return {
    code: code(p),
    title: <span className="kz-entry-name">{p.name}</span>,
    mark: <ProductLogo id={p.id} size={30} animated={false} />,
    status: { label: t.site.nav.status[p.status].label, tone: STAMP[p.status] },
    fields: siteFields(p, t.site.home.products),
    footer: <Foot p={p} t={t} locale={locale} />,
  };
}

/** What the engine gives and the products it powers, folded in its tag. Only what runs is said (results, analytics; run
 *  events and webhooks are sovkora#189). */
function EngineGives({ t }: Readonly<{ t: TranslationDictionary }>) {
  const e = t.site.home.engine;
  const eng = t.site.products.engine;
  const powered = SHOWN.filter((x) => x.id !== ENGINE);
  const back = [...new Set(ENGINE_USES.flatMap((u) => u.back))].map((k) => eng.back[k]).join(", ");
  return (
    <details className="kz-entry-gives">
      <summary>{e.givesLabel}</summary>
      <ul>
        {(["models", "pipeline", "analytics"] as const).map((k) => (
          <li key={k}>
            <b>{e.gives[k].name}</b> <span>{e.gives[k].line}</span>
          </li>
        ))}
      </ul>
      <p>{format(eng.gets, { list: back })}</p>
      <p className="kz-entry-powers">
        {e.powers}{" "}
        {powered.map((x) => {
          const use = ENGINE_USES.find((u) => u.id === x.id);
          return (
            <a key={x.id} href={`#product-${x.id}`} data-planned={use?.planned ? "" : undefined}>
              {x.name}
              {use?.planned && <em> ({eng.planned})</em>}
            </a>
          );
        })}
      </p>
    </details>
  );
}

function ProductEntry({
  product: p,
  t,
  locale,
}: Readonly<{ product: Product; t: TranslationDictionary; locale: string }>) {
  const engine = p.id === ENGINE;
  const use = ENGINE_USES.find((u) => u.id === p.id);
  const useText = use ? t.site.products.engine.uses[use.id as keyof typeof t.site.products.engine.uses] : undefined;
  const carousel = showcaseOf(p.name);
  return (
    <li
      id={"product-" + p.id}
      className={cn("kz-entry", engine && "kz-entry-engine", "brand-" + p.id)}
      data-product={p.id}
      data-side={entrySide(PRODUCTS, p.id)}
    >
      {carousel && (
        <div className="kz-entry-plate">
          <Showcase carousel={carousel} fig={sectionFigure(nOf(p))} locale={locale} />
        </div>
      )}
      <SpecimenTag className="kz-entry-tag" {...tagProps(p, t, locale)}>
        <p>
          {engine ? t.site.home.engine.line : t.site.products.cards[p.id].line}
          {fnRef(p)}
        </p>
        <p className="kz-entry-crush" data-feature={PRODUCT_HIGHLIGHTS[p.id].highlight}>
          {t.site.home.products.highlights[p.id]}
        </p>
        {engine && <EngineGives t={t} />}
        {useText && (
          <p className="kz-entry-uses" data-planned={use?.planned ? "" : undefined}>
            <a href={`#product-${ENGINE}`}>
              {format(use?.planned ? t.site.home.products.enginePlanned : t.site.home.products.engineUse, {
                use: useText,
              })}
            </a>
          </p>
        )}
        <Bird bird={PRODUCT_BIRD[p.id]} t={t} />
      </SpecimenTag>
    </li>
  );
}

/** The marks of the products in conception: Kridoc has a mark and no palette (@krizaka/ui ProductLogo leaves it out). */
const DESIGN_MARK = { kridoc: KridocLogo } as const;

/** The plate of a product in conception: a sample document in demo data, said as demo, and the chip « Demo soon ». Drawn from
 *  tokens and @krizaka/ui's Badge and mark — no invented app UI, no date, no sign-up. */
function DesignPlate({
  product: p,
  n,
  t,
}: Readonly<{ product: ProductInDesign; n: number; t: TranslationDictionary }>) {
  const v = t.site.home.products.inDesign.plate;
  const Mark = DESIGN_MARK[p.id];
  return (
    <figure className="kz-entry-plate">
      <div className="pv kz-doc-plate" aria-hidden>
        <div className="pv-app">
          <p className="pv-app-bar">
            <Mark size={18} animated={false} />
            <span className="pv-app-name">{p.name}</span>
            <Badge size="sm" tone="accent">
              {v.demoSoon}
            </Badge>
          </p>
          <div className="kz-doc-sheet">
            <p className="kz-doc-title">{v.docTitle}</p>
            <p className="kz-doc-meta">{v.docMeta}</p>
            <span className="kz-doc-line" />
            <span className="kz-doc-line" />
            <span className="kz-doc-line kz-doc-short" />
            <span className="kz-doc-line" />
            <span className="kz-doc-line kz-doc-short" />
          </div>
        </div>
      </div>
      <Caption figure={`${t.site.home.products.figureLabel} ${n}`}>{v.figure}</Caption>
    </figure>
  );
}

/** A product in conception: its plate (a sample document, « Demo soon ») and its tag, numbered after the products, the tag on
 *  the right (the rhythm of the entries before it). It links its live coming-soon site, nothing else. */
function DesignEntry({
  product: p,
  n,
  t,
}: Readonly<{ product: ProductInDesign; n: number; t: TranslationDictionary }>) {
  const Mark = DESIGN_MARK[p.id];
  const h = t.site.products;
  return (
    <li id={"product-" + p.id} className="kz-entry kz-entry-design" data-product={p.id} data-side="plate-left">
      <DesignPlate product={p} n={sectionFigure(SHOWN.length + 1)} t={t} />
      <SpecimenTag
        className="kz-entry-tag"
        code={`KZ-${String(n).padStart(2, "0")}`}
        title={
          <a href={p.siteUrl} target="_blank" rel="noopener" className="kz-entry-name">
            {p.name}
          </a>
        }
        mark={<Mark size={48} animated={false} />}
        status={{ label: t.site.nav.status[p.status].label, tone: STAMP[p.status] }}
        footer={
          <a href={p.siteUrl} target="_blank" rel="noopener" aria-label={format(h.visitSiteAria, { name: p.name })}>
            {h.visitSite} <ForwardIcon size={13} aria-hidden />
          </a>
        }
      >
        <p>{t.site.home.products.inDesign.lines[p.id]}</p>
      </SpecimenTag>
    </li>
  );
}

/** The products (§ 2): one row, Verikora · Sovkora · Folioviv, each with its carousel, then the ones in conception. */
export default function ProductShowcase({ locale }: Readonly<{ locale: string }>) {
  const t = getDictionary(locale);
  const s = t.site.home.products;
  return (
    <div id="products" className="kz-products">
      <Section id="products-guide" number={s.number} title={s.title} lead={s.lead} paper="lines" margin reveal>
        <ol className="kz-prod-row" aria-label={s.rowLabel}>
          {SHOWN.map((p) => (
            <li key={p.id} className={"brand-" + p.id} data-engine={p.id === ENGINE ? "" : undefined}>
              <a href={`#product-${p.id}`}>
                <ProductLogo id={p.id} size={28} animated={false} />
                <span>{p.name}</span>
                <small>{s.roles[p.id]}</small>
              </a>
            </li>
          ))}
        </ol>
        <ol className="kz-prod-list" aria-label={s.title}>
          {SHOWN.map((p) => (
            <ProductEntry key={p.id} product={p} t={t} locale={locale} />
          ))}
        </ol>
        <ol className="kz-prod-list kz-prod-design" aria-label={s.inDesign.label}>
          {IN_DESIGN.map((p, i) => (
            <DesignEntry key={p.id} product={p} n={PRODUCTS.length + i + 1} t={t} />
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

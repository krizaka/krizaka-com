/* The products, on the home — the only place krizaka.com presents them (/products answers 308 here). Cahier (krizaka-ui
   ADR-004, #417): the section is a page of the field notebook, on lined paper with its red margin and its number (§ 2).
   Since krizaka-internal#2445 (2026-11-05) the home speaks to one reader, the property manager: the section opens on how
   Verikora checks a file, in three real steps (an ordered list, words site.home.products.steps), then the entries.
   Each product is an entry of the field guide, in its own brand light (`.brand-<id>`), its tag and plate swapping sides
   from one entry to the next (lib/home-sections.ts entrySide, krizaka-internal#683):
   - a plate: one product moment, input then result, drawn like the app (visuals/, lazy, decorative, demo data said as
     demo, still under reduced motion), and its numbered caption (`fig. n`, after the hero's: lib/home-sections.ts
     sectionFigure);
   - a specimen tag: its catalogue number, its name (plain text), its mark, its site (the commercial www domain) and its latest
     published release (read at build from the changelog data, lib/latest-release.ts), one action « See the site » (new tab) and
     two quiet links, « Source » and « Release notes » (the changelog filtered on the product),
     the stamp of its honest status (lib/products.ts, gated by the dev-preview checklists), its line, its bird, what it runs
     on the engine (lib/engine-uses.ts, « planned » where the call is not wired yet) and a note number;
   - the notes at the foot of the section: what each product really does, sourced;
   - after the products, the ones in conception (lib/products-in-design.ts): an entry like the others, the tag on the right —
     number, mark, name and « See the site » (its live coming-soon site), the stamp « In design », one line — beside a plate
     that shows a sample document in demo data and the chip « Demo soon »; no version, no source, no bird, no note, no date,
     no sign-up, since nothing is built.
   The engine is no entry here any more: it is one line further down (EngineSection, § 4), with no demo of its own (a
   « summarise this contract » request showed what any chatbot does). Data: lib/products.ts, lib/engine-uses.ts, lib/story.ts
   (PRODUCT_BIRD) — never a hand list. Words: site.home.products.*, site.products.*, site.story.world.cues. */

import { ForwardIcon } from "@krizaka/icons";
import { KridocLogo, ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { Badge } from "@krizaka/ui/badge";
import { Caption, FootnoteRef, Footnotes } from "@krizaka/ui/footnote";
import { Mascot } from "@krizaka/ui/mascots";
import { Section } from "@krizaka/ui/page";
import { SpecimenTag, type StampTone } from "@krizaka/ui/specimen-tag";
import { RELEASES } from "@/lib/changelog-data";
import { ENGINE_USES } from "@/lib/engine-uses";
import { format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { entrySide, heroMarkOrder, sectionFigure } from "@/lib/home-sections";
import { PRODUCTS, type Product, type ProductStatus } from "@/lib/products";
import { IN_DESIGN, type ProductInDesign } from "@/lib/products-in-design";
import { latestRelease } from "@/lib/latest-release";
import { ENGINE, PRODUCT_BIRD, type StoryBird } from "@/lib/story";
import ButtonLink from "../ButtonLink";
import { GitHubMark } from "../brand/GitHubMark";
import ProductsLink from "./ProductsLink";
import ProductVisual from "./visuals/ProductVisual";
import "./visuals/visuals.css";

/** The stamp of a status: `ok` only for what is out, `wip` in development, `construction` not open yet. */
const STAMP: Record<ProductStatus, StampTone> = {
  devPreview: "ok",
  development: "wip",
  construction: "construction",
  upcoming: "neutral",
  design: "neutral",
};
const FILM_BIRDS = ["falcon", "owl", "duck", "flamingo", "pigeon"] as const;
/** How Verikora checks a file, in the order it happens (words: site.home.products.steps.<id>). */
const CHECK_STEPS = ["drop", "read", "report"] as const;

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
/** The catalogue number of a product: its place in lib/products.ts (the engine is KZ-01). */
const code = (p: Product) => `KZ-${String(PRODUCTS.indexOf(p) + 1).padStart(2, "0")}`;

/** The numbers of the notes follow the order of the page (1, 2, 3), never a gap; the figures follow the hero's Fig. 1 (2, 3, 4). */
const SHOWN = heroMarkOrder(PRODUCTS).filter((p) => p.id !== ENGINE);
const nOf = (p: Product) => SHOWN.findIndex((x) => x.id === p.id) + 1;
const fnRef = (p: Product) => <FootnoteRef n={nOf(p)} prefix="kz-note" />;
const figNo = (label: string, p: Product) => `${label} ${sectionFigure(nOf(p))}`;

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

/** The site of a product and its latest published release, read at build (lib/latest-release.ts): the card's two facts. The
 *  release is left out when the data holds none — never typed, never read from a dev host. */
function siteFields(p: Product, s: TranslationDictionary["site"]["home"]["products"]) {
  const latest = latestRelease(p.id, RELEASES);
  return [
    { label: s.fields.site, value: host(p.siteUrl) },
    ...(latest
      ? [{ label: s.fields.latest, value: format(s.latestValue, { version: latest.version, date: latest.date }) }]
      : []),
  ];
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

/** What a product puts on its specimen tag: code, name, mark, status, dev fields, footer. */
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

function ProductEntry({
  product: p,
  t,
  locale,
}: Readonly<{ product: Product; t: TranslationDictionary; locale: string }>) {
  const s = t.site.home.products;
  const use = ENGINE_USES.find((u) => u.id === p.id);
  const useText = use ? t.site.products.engine.uses[use.id as keyof typeof t.site.products.engine.uses] : undefined;
  return (
    <li
      id={"product-" + p.id}
      className={cn("kz-entry", "brand-" + p.id)}
      data-product={p.id}
      data-side={entrySide(PRODUCTS, p.id)}
    >
      <figure className="kz-entry-plate">
        <ProductVisual id={p.id} name={p.name} />
        <Caption figure={figNo(s.figureLabel, p)}>{s.figures[p.id]}</Caption>
      </figure>
      <SpecimenTag className="kz-entry-tag" {...tagProps(p, t, locale)}>
        <p>
          {t.site.products.cards[p.id].line}
          {fnRef(p)}
        </p>
        {useText && (
          <p className="kz-entry-uses" data-planned={use?.planned ? "" : undefined}>
            <a href="#engine">
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

/** The products in conception go on swapping sides after the last product (lib/home-sections.ts entrySide). */
const DESIGN_SIDE = SHOWN.length % 2 === 0 ? "card-left" : "plate-left";

/** The marks of the products in conception: Kridoc has a mark and no palette (@krizaka/ui ProductLogo leaves it out). */
const DESIGN_MARK = { kachizaka: KridocLogo } as const;

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

/** A product in conception: its plate (a sample document, « Demo soon ») and its tag, numbered after the products, on the
 *  side the rhythm of the entries before it gives (DESIGN_SIDE). It links its live coming-soon site, nothing else. */
function DesignEntry({
  product: p,
  n,
  t,
}: Readonly<{ product: ProductInDesign; n: number; t: TranslationDictionary }>) {
  const Mark = DESIGN_MARK[p.id];
  const h = t.site.products;
  return (
    <li id={"product-" + p.id} className="kz-entry kz-entry-design" data-product={p.id} data-side={DESIGN_SIDE}>
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

/** The engine in one line (§ 4, krizaka-internal#2445): what it means for a property manager — the documents stay in
 *  Canada, every check is traced — and « Powered by Sovkora », one quiet action to its own site. No demo here: the engine's
 *  power is shown on its site, as one traced run. */
export function EngineSection({ locale }: Readonly<{ locale: string }>) {
  const t = getDictionary(locale);
  const s = t.site.home.engine;
  const engine = PRODUCTS.find((x) => x.id === ENGINE)!;
  return (
    <Section
      id="engine"
      number={s.number}
      title={s.title}
      lead={s.lead}
      reveal
      divider
      margin
      actions={
        <ButtonLink href={engine.siteUrl} variant="secondary" size="md" rel="noopener">
          {s.site} <ForwardIcon size={13} aria-hidden />
        </ButtonLink>
      }
    />
  );
}

/** How Verikora checks a file (§ 2): the three steps, then one entry per product, then the ones in conception. */
export default function ProductShowcase({ locale }: Readonly<{ locale: string }>) {
  const t = getDictionary(locale);
  const s = t.site.home.products;
  return (
    <div id="products" className="kz-products">
      <Section id="products-guide" number={s.number} title={s.title} lead={s.lead} paper="lines" margin reveal>
        <ol className="kz-notebook-list kz-check-steps" aria-label={s.stepsLabel}>
          {CHECK_STEPS.map((id) => (
            <li key={id}>
              <h3>{s.steps[id].title}</h3>
              <p>{s.steps[id].body}</p>
            </li>
          ))}
        </ol>
        <ProductsLink className="kz-prod-solo">
          <ol className="kz-prod-list" aria-label={s.title}>
            {SHOWN.map((p) => (
              <ProductEntry key={p.id} product={p} t={t} locale={locale} />
            ))}
          </ol>
        </ProductsLink>
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

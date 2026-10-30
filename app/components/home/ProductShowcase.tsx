/* The products, on the home — the only place krizaka.com presents them (/products answers 308 here). Cahier (krizaka-ui
   ADR-004, #417; Oussama 2026-10-20: « our showcase: refined, less AI, very complete and designed »): the section is a page
   of the field notebook, on lined paper with its red margin and its number (§ 2). The engine leads — its specimen tag,
   its flow (@krizaka/ui's EngineFlow, EngineFlowView) sticky beside the entries on a wide screen, the figure's caption.
   Each product is an entry of the field guide, in its own brand light (`.brand-<id>`):
   - a plate: a live visual of what it does, made of @krizaka/ui pieces (visuals/, lazy, decorative, still under reduced
     motion), and its numbered caption (`fig. n`);
   - a specimen tag: its catalogue number, its name (the link to its dev site), its mark, its dev address and the version it
     runs (read at build, lib/dev-versions.ts),
     the stamp of its honest status (lib/products.ts, gated by the dev-preview checklists), its line, its bird (the film's
     promise for the five birds of the film, the name for the family), what it runs on Orazaka (lib/engine-uses.ts,
     « planned » where the call is not wired yet) and a note number;
   - the notes at the foot of the section: what each product really does, sourced.
   Each entry is tied to its node in the flow (ProductsLink): in the middle of the screen or pointed at, its node lights,
   and the reverse. Data: lib/products.ts, lib/engine-uses.ts, lib/story.ts (PRODUCT_BIRD) — never a hand list. Words:
   site.home.products.*, site.products.*, site.story.world.cues. */

import { ForwardIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { Caption, FootnoteRef, Footnotes } from "@krizaka/ui/footnote";
import { Mascot } from "@krizaka/ui/mascots";
import { Section } from "@krizaka/ui/page";
import { SpecimenTag, type StampTone } from "@krizaka/ui/specimen-tag";
import { devVersion } from "@/lib/dev-versions";
import { ENGINE_USES } from "@/lib/engine-uses";
import { format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { heroMarkOrder } from "@/lib/home-sections";
import { VALLEY } from "@/lib/home-ambient";
import { PRODUCTS, type Product, type ProductStatus } from "@/lib/products";
import { ENGINE, PRODUCT_BIRD } from "@/lib/story";
import { GitHubMark } from "../brand/GitHubMark";
import EngineFlowView from "./EngineFlowView";
import ProductsFlock from "./ProductsFlock";
import ProductsLink from "./ProductsLink";
import ProductVisual from "./visuals/ProductVisual";
import "./visuals/visuals.css";

/** The stamp of a status: `ok` only for what is out, `wip` in development, `construction` not open yet. */
const STAMP: Record<ProductStatus, StampTone> = {
  devPreview: "ok",
  development: "wip",
  construction: "construction",
  upcoming: "neutral",
};
const FILM_BIRDS = ["falcon", "owl", "duck", "flamingo", "pigeon"] as const;

const external = (p: Product) => ({ href: p.siteUrl, target: "_blank", rel: "noopener" });
const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
/** The catalogue number of a product: its place in lib/products.ts (the engine is KZ-01). */
const code = (p: Product) => `KZ-${String(PRODUCTS.indexOf(p) + 1).padStart(2, "0")}`;

/** The numbers of the figures and the notes: the order of the page (1, 2, 3) — never a gap in the notes. */
const SHOWN = heroMarkOrder(PRODUCTS);
const nOf = (p: Product) => SHOWN.findIndex((x) => x.id === p.id) + 1;
const fnRef = (p: Product) => <FootnoteRef n={nOf(p)} prefix="kz-note" />;
const figNo = (label: string, p: Product) => `${label} ${nOf(p)}`;

/** The bird of a product and what it says: the film's promise for the five birds of the film, its name for the family. */
function Bird({ p, t }: { p: Product; t: TranslationDictionary }) {
  const bird = PRODUCT_BIRD[p.id];
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

/** The site of a product and the version it runs, read at build (lib/dev-versions.ts): the card's two facts while the product
 *  is in development. The version is left out when the site could not be read — never typed. */
function devFields(p: Product, s: TranslationDictionary["site"]["home"]["products"]) {
  const version = devVersion(p.id);
  return [
    { label: s.fields.site, value: host(p.siteUrl) },
    ...(version ? [{ label: s.fields.version, value: version }] : []),
  ];
}

function Foot({ p, t }: { p: Product; t: TranslationDictionary }) {
  const h = t.site.products;
  return (
    <>
      <a {...external(p)} aria-label={format(h.visitSiteAria, { name: p.name })}>
        {h.visitSite} <ForwardIcon size={13} aria-hidden />
      </a>
      <a href={p.repoUrl} aria-label={format(h.sourceAria, { name: p.name })}>
        <GitHubMark size={14} /> {h.source}
      </a>
    </>
  );
}

/** Orazaka, the provider: a wide foundation plate (not a product tag) in its orange, what it gives, its flow, and the products
 *  it powers pinned under it, each one a link to its entry. Only what runs is said (results, analytics; run events and
 *  webhooks are orazaka#189). */
function EngineFoundation({ t }: { t: TranslationDictionary }) {
  const p = PRODUCTS.find((x) => x.id === ENGINE)!;
  const s = t.site.home.products;
  const e = t.site.home.engine;
  const eng = t.site.products.engine;
  const powered = heroMarkOrder(PRODUCTS).filter((x) => x.id !== ENGINE);
  const back = [...new Set(ENGINE_USES.flatMap((u) => u.back))].map((k) => eng.back[k]).join(", ");
  return (
    <div id={"product-" + p.id} className={cn("kz-foundation", "brand-" + p.id)} data-kind="engine">
      <header className="kz-foundation-head">
        <ProductLogo id={p.id} size={44} animated={false} />
        <div>
          <p className="kz-foundation-role">{s.fields.engineRole}</p>
          <h3>
            <a {...external(p)} className="kz-entry-name">
              {p.name}
            </a>
          </h3>
        </div>
        <span className="kz-foundation-status">{t.site.nav.status[p.status].label}</span>
      </header>
      <p className="kz-foundation-dev">
        {devFields(p, s).map((f) => (
          <span key={f.label}>
            {f.label} <b>{f.value}</b>
          </span>
        ))}
      </p>
      <p className="kz-foundation-line">
        {e.line}
        {fnRef(p)}
      </p>
      <ul className="kz-foundation-gives" aria-label={e.givesLabel}>
        {(["models", "pipeline", "analytics"] as const).map((k) => (
          <li key={k}>
            <b>{e.gives[k].name}</b>
            <span>{e.gives[k].line}</span>
          </li>
        ))}
      </ul>
      <figure className="kz-entry-flow">
        <EngineFlowView t={t} />
        <Caption figure={`${s.figureLabel} 1`}>{s.figures[p.id]}</Caption>
      </figure>
      <p className="kz-foundation-back">{format(eng.gets, { list: back })}</p>
      <div className="kz-foundation-powers">
        <p>{e.powers}</p>
        <ul>
          {powered.map((x) => {
            const use = ENGINE_USES.find((u) => u.id === x.id);
            return (
              <li key={x.id} className={"brand-" + x.id} data-planned={use?.planned ? "" : undefined}>
                <a href={`#product-${x.id}`}>
                  <ProductLogo id={x.id} size={24} animated={false} />
                  <span>{x.name}</span>
                  {use?.planned && <em>{eng.planned}</em>}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="kz-foundation-links">
        <Foot p={p} t={t} />
      </div>
    </div>
  );
}

function ProductEntry({ product: p, t }: { product: Product; t: TranslationDictionary }) {
  const s = t.site.home.products;
  const use = ENGINE_USES.find((u) => u.id === p.id);
  const useText = use ? t.site.products.engine.uses[use.id as keyof typeof t.site.products.engine.uses] : undefined;
  return (
    <li id={"product-" + p.id} className={cn("kz-entry", "brand-" + p.id)} data-product={p.id}>
      <figure className="kz-entry-plate">
        <ProductVisual id={p.id} />
        <Caption figure={figNo(s.figureLabel, p)}>{s.figures[p.id]}</Caption>
      </figure>
      <SpecimenTag
        className="kz-entry-tag"
        code={code(p)}
        title={
          <a {...external(p)} className="kz-entry-name">
            {p.name}
          </a>
        }
        mark={<ProductLogo id={p.id} size={30} animated={false} />}
        status={{ label: t.site.nav.status[p.status].label, tone: STAMP[p.status] }}
        fields={devFields(p, s)}
        footer={<Foot p={p} t={t} />}
      >
        <p>
          {t.site.products.cards[p.id].line}
          {fnRef(p)}
        </p>
        {useText && (
          <p className="kz-entry-uses" data-planned={use?.planned ? "" : undefined}>
            <a href="#product-orazaka">
              {format(use?.planned ? t.site.home.products.enginePlanned : t.site.home.products.engineUse, {
                use: useText,
              })}
            </a>
          </p>
        )}
        <Bird p={p} t={t} />
      </SpecimenTag>
    </li>
  );
}

/** « Orazaka, our first build »: the engine, its specimen tag beside its flow. The first chapter after the hero (§ 2). */
export function EngineSection({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const s = t.site.home.engine;
  return (
    <div id="engine" className="kz-products">
      <Section id="engine-guide" number={s.number} title={s.title} lead={s.lead} paper="lines" margin reveal>
        <EngineFoundation t={t} />
      </Section>
    </div>
  );
}

/** The products built on the engine and the open stack (§ 4): the flock, then one entry each. */
export default function ProductShowcase({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const s = t.site.home.products;
  const others = heroMarkOrder(PRODUCTS).filter((p) => p.id !== ENGINE);
  return (
    <div id="products" className="kz-products">
      {/* The flock opens the section: each bird is a product (ProductsFlock), its ground running into the section below. */}
      <ProductsFlock set={VALLEY} />
      <Section id="products-guide" number={s.number} title={s.title} lead={s.lead} paper="lines" margin reveal>
        <ProductsLink className="kz-prod-solo">
          <ol className="kz-prod-list" aria-label={s.title}>
            {others.map((p) => (
              <ProductEntry key={p.id} product={p} t={t} />
            ))}
          </ol>
        </ProductsLink>
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

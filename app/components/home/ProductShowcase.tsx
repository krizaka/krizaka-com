/* The products, on the home — the only place krizaka.com presents them (/products answers 308 here). Cahier (krizaka-ui
   ADR-004, #417; Oussama 2026-10-20: « our showcase: refined, less AI, very complete and designed »): the section is a page
   of the field notebook, on lined paper with its red margin and its number (§ 2). The engine leads — its specimen tag,
   its flow (@krizaka/ui's EngineFlow, EngineFlowView) sticky beside the entries on a wide screen, the figure's caption.
   Each product is an entry of the field guide, in its own brand light (`.brand-<id>`):
   - a plate: a live visual of what it does, made of @krizaka/ui pieces (visuals/, lazy, decorative, still under reduced
     motion), and its numbered caption (`fig. n`);
   - a specimen tag: its catalogue number, its name (the link to its own site, or its code while it has none), its mark,
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
import { ENGINE_USES } from "@/lib/engine-uses";
import { format, getDictionary, type TranslationDictionary } from "@/lib/i18n";
import { PRODUCTS, type Product, type ProductStatus } from "@/lib/products";
import { video } from "@/lib/cdn";
import { ENGINE, PRODUCT_BIRD } from "@/lib/story";
import { GitHubMark } from "../brand/GitHubMark";
import type { AmbientSet } from "./AmbientLoop";
import EngineFlowView from "./EngineFlowView";
import ProductsFlock from "./ProductsFlock";
import ProductsLink from "./ProductsLink";
import ProductVisual from "./visuals/ProductVisual";
import "./visuals/visuals.css";

/** The valley, looping, without its birds (the live flock stands on it; krizaka-ui tools/brand-films « home-valley »): wide and 4:5, dark and light. */
const valley = (cut: string, theme: string) => video(`brand-films/ambient/home-valley-${cut}-${theme}`);
const cuts = (cut: string) => ({ dark: valley(cut, "dark"), ["light"]: valley(cut, "light") });
const VALLEY: AmbientSet = { wide: cuts("16x9"), tall: cuts("4x5") };

/** The stamp of a status: `ok` only for what is out, `wip` in development, `construction` not open yet. */
const STAMP: Record<ProductStatus, StampTone> = { devPreview: "ok", development: "wip", construction: "construction", upcoming: "neutral" };
const FILM_BIRDS = ["falcon", "owl", "duck", "flamingo", "pigeon"] as const;

const external = (p: Product) => ({ href: p.siteUrl, target: "_blank", rel: "noopener" });
const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
/** The catalogue number of a product: its place in lib/products.ts (the engine is KZ-01). */
const code = (p: Product) => `KZ-${String(PRODUCTS.indexOf(p) + 1).padStart(2, "0")}`;

/** The bird of a product and what it says: the film's promise for the five birds of the film, its name for the family. */
function Bird({ p, t }: { p: Product; t: TranslationDictionary }) {
  const bird = PRODUCT_BIRD[p.id];
  const film = (FILM_BIRDS as readonly string[]).includes(bird);
  const words = film ? t.site.story.world.cues[bird as (typeof FILM_BIRDS)[number]] : t.site.home.products.birds[bird as keyof TranslationDictionary["site"]["home"]["products"]["birds"]];
  return (
    <p className="kz-entry-bird">
      <Mascot bird={bird} mood="welcome" tone="own" size={48} animated={false} aria-hidden />
      <span>{words}</span>
    </p>
  );
}

function Foot({ p, t }: { p: Product; t: TranslationDictionary }) {
  const h = t.site.products;
  return (
    <>
      <a {...external(p)} aria-label={format(h.visitAria, { name: p.name })}>
        {h.visit} <ForwardIcon size={13} aria-hidden />
      </a>
      <a href={p.repoUrl} aria-label={format(h.sourceAria, { name: p.name })}>
        <GitHubMark size={14} /> {h.source}
      </a>
    </>
  );
}

function EngineBlock({ t }: { t: TranslationDictionary }) {
  const p = PRODUCTS.find((x) => x.id === ENGINE)!;
  const s = t.site.home.products;
  const back = t.site.products.engine.back;
  const n = PRODUCTS.indexOf(p) + 1;
  return (
    <div id={"product-" + p.id} className={cn("kz-prod-engine", "brand-" + p.id)}>
      <SpecimenTag
        code={`${code(p)} · ${s.fields.engineRole}`}
        title={
          <a {...external(p)} className="kz-entry-name">
            {p.name}
          </a>
        }
        mark={<ProductLogo id={p.id} size={30} animated={false} />}
        status={{ label: t.site.nav.status[p.status].label, tone: STAMP[p.status] }}
        fields={[{ label: s.fields.back, value: `${back.results}, ${back.analytics}` }]}
        footer={<Foot p={p} t={t} />}
      >
        <p>
          {t.site.products.engine.line}
          <FootnoteRef n={n} prefix="kz-note" />
        </p>
        <Bird p={p} t={t} />
      </SpecimenTag>
      <figure className="kz-entry-flow">
        <EngineFlowView t={t} />
        <Caption figure={`${s.figureLabel} 1`}>{s.figures[p.id]}</Caption>
      </figure>
    </div>
  );
}

function ProductEntry({ product: p, t }: { product: Product; t: TranslationDictionary }) {
  const s = t.site.home.products;
  const use = ENGINE_USES.find((u) => u.id === p.id);
  const useText = use ? t.site.products.engine.uses[use.id as keyof typeof t.site.products.engine.uses] : undefined;
  const n = PRODUCTS.indexOf(p) + 1;
  return (
    <li id={"product-" + p.id} className={cn("kz-entry", "brand-" + p.id)} data-product={p.id}>
      <figure className="kz-entry-plate">
        <ProductVisual id={p.id} />
        <Caption figure={`${s.figureLabel} ${n}`}>{s.figures[p.id]}</Caption>
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
        fields={[{ label: s.fields.site, value: host(p.siteUrl) }]}
        footer={<Foot p={p} t={t} />}
      >
        <p>
          {t.site.products.cards[p.id].line}
          <FootnoteRef n={n} prefix="kz-note" />
        </p>
        {useText && (
          <p className="kz-entry-uses" data-planned={use?.planned ? "" : undefined}>
            {format(use?.planned ? t.site.home.products.enginePlanned : t.site.home.products.engineUse, { use: useText })}
          </p>
        )}
        <Bird p={p} t={t} />
      </SpecimenTag>
    </li>
  );
}

export default function ProductShowcase({ locale }: { locale: string }) {
  const t = getDictionary(locale);
  const s = t.site.home.products;
  const others = PRODUCTS.filter((p) => p.id !== ENGINE);
  return (
    <div id="products" className="kz-products">
      {/* The flock opens the section: each bird is a product (ProductsFlock), its ground running into the section below. */}
      <ProductsFlock set={VALLEY} />
      <Section id="products-guide" number={s.number} title={s.title} lead={s.lead} paper="lines" margin reveal>
        <ProductsLink className={cn("kz-prod", "brand-" + ENGINE)}>
          <EngineBlock t={t} />
          <ol className="kz-prod-list" aria-label={t.site.products.engine.label}>
            {others.map((p) => (
              <ProductEntry key={p.id} product={p} t={t} />
            ))}
          </ol>
        </ProductsLink>
        <Footnotes className="kz-prod-notes" prefix="kz-note" label={s.notesLabel} backLabel={s.backLabel} notes={PRODUCTS.map((p) => `${p.name}. ${s.notes[p.id]}`)} />
      </Section>
    </div>
  );
}

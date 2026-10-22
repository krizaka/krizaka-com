/* Home hero — the first page of the field notebook (Cahier, krizaka-ui ADR-004, #417): asymmetric, never centred. On the
   left, the date line of the notes, who Krizaka is, one promise, one action (and the film, quietly), the products' marks
   and the figures that back them; on the right, Plate I — the five birds of the film, each with its promise as the film
   says it (BirdPlate, the cues of site.story.world). The section is numbered in the margin (§ 1). A server component: the title, the lead and the actions are the first paint (LCP) — never revealed,
   never part of the intro. The flock's scene is no longer here: it opens the products section (ProductsFlock), the flock being
   the products.

   Under the actions, the products put forward: a quiet row of their seven marks (from @krizaka/ui), each one a link to
   its card in #products, the ones not offered yet dimmed.

   Once per session, HeroIntro plays the cinematic intro over the poster (home.css): the mark draws itself, the scene
   rises in with its birds, a light sweeps the backdrop, the figures climb (NumberTicker) — then the loop fades in.
   Skippable, still under reduced motion and Save-Data. Every figure is read at build and dropped when unknown. */

import { ForwardIcon } from "@krizaka/icons";
import { KrizakaLogo, ProductLogo } from "@krizaka/ui";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { BirdPlate } from "@krizaka/ui/bird-plate";
import { Page } from "@krizaka/ui/page";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { format, getDictionary } from "@/lib/i18n";
import { figureColumns } from "@/lib/figure-grid";
import type { CSSProperties } from "react";
import { video } from "@/lib/cdn";
import { FILM_BASE, RELAY_BASE } from "@/lib/film-captions";
import { heroMarkOrder } from "@/lib/home-sections";
import { focusProps } from "@/lib/focus";
import { PRODUCTS, type ProductStatus } from "@/lib/products";
import ButtonLink from "@/app/components/ButtonLink";
import FilmLightbox from "./FilmLightbox";
import HeroIntro from "./HeroIntro";
import "./home.css";

export interface HomeFigures {
  repositories: number;
  npm: number;
  /** npm downloads of last week (api.npmjs.org at build); absent when unknown. */
  downloads?: number;
  maven: number;
}

const film = video(RELAY_BASE);
/** A product nothing is offered of yet wears its mark dimmed in the hero's row (the status is the data's). */
const DIM: readonly ProductStatus[] = ["construction", "upcoming"];
const codeFilm = video(FILM_BASE);

export default function HomeHero({ locale, figures }: { locale: string; figures: HomeFigures }) {
  const dict = getDictionary(locale);
  const t = dict.site.home.hero;
  const cues = dict.site.story.world.cues;
  const counted = [
    { id: "repositories", value: figures.repositories, label: t.proofs.repositories },
    { id: "npm", value: figures.npm, label: t.proofs.npm },
    { id: "downloads", value: figures.downloads ?? 0, label: t.proofs.downloads },
    { id: "maven", value: figures.maven, label: t.proofs.maven },
  ].filter((p) => p.value > 0);
  // Full rows on a phone and wide (lib/figure-grid.ts): 4 figures → 2 × 2, then one row; never a lone cell.
  const grid = figureColumns(counted.length);
  const cols = { "--kz-fig-cols": grid.wide, "--kz-fig-cols-narrow": grid.narrow } as CSSProperties;

  return (
    <SectionBackdrop as="section" id="hero" className="kz-home-hero" aria-labelledby="hero-title">
      <HeroIntro />
      <div data-backdrop-layer aria-hidden className="kz-intro-sweep" />

      <Page className="kz-home-hero-inner" margin>
        <div className="kz-home-hero-grid">
        <div className="kz-home-hero-words">
        <p className="kz-home-eyebrow">
          <span className="kz-home-number">{t.number}</span>
          <span className="kz-intro-mark kz-intro-deco" aria-hidden>
            <KrizakaLogo size={28} />
          </span>
          {t.eyebrow}
        </p>
        <h1 id="hero-title" className="kz-home-title">
          {t.title}
        </h1>
        <p className="kz-home-lead">{t.lead}</p>

        <div className="kz-home-actions">
          <ButtonLink href="#engine" variant="primary" size="lg">
            {t.primary} <ForwardIcon size={16} strokeWidth={2.25} />
          </ButtonLink>
          <FilmLightbox film={{ mp4: film.mp4, poster: film.poster, vtt: "relay.vtt" }} fallback={{ mp4: codeFilm.mp4, poster: codeFilm.poster, vtt: "film.vtt" }} />
        </div>

        {/* The products, put forward: a quiet row of their marks, each to its card in #products. Inline SVG, no media (LCP). */}
        <ul className="kz-home-marks" aria-label={t.marksLabel}>
          {heroMarkOrder(PRODUCTS).map((p) => (
            <li key={p.id} className={"brand-" + p.id} data-dim={DIM.includes(p.status) ? "" : undefined} {...focusProps(p.id)}>
              <a href={`#product-${p.id}`}>
                <ProductLogo id={p.id} size={30} animated={false} />
                <span>{p.name}</span>
              </a>
            </li>
          ))}
        </ul>

        <dl className="kz-home-proofs" aria-label={t.proofsLabel} style={cols}>
          {counted.map((p) => (
            <div key={p.id}>
              <dt>{p.label}</dt>
              <dd>
                <NumberTicker value={p.value} locale={locale} align="start" />
              </dd>
            </div>
          ))}
        </dl>
        <p className="kz-home-license">{format(t.proofs.license, { license: "Apache-2.0" })}</p>
        </div>
        <BirdPlate
          className="kz-home-plate"
          title={t.plate.title}
          subtitle={t.plate.subtitle}
          figures={[
            { bird: "falcon", label: t.plate.falcon, promise: cues.falcon },
            { bird: "owl", label: t.plate.owl, promise: cues.owl },
            { bird: "duck", label: t.plate.duck, promise: cues.duck },
            { bird: "flamingo", label: t.plate.flamingo, promise: cues.flamingo },
            { bird: "pigeon", label: t.plate.pigeon, promise: cues.pigeon },
          ]}
        />
        </div>
      </Page>

    </SectionBackdrop>
  );
}

/* Home hero — the first page of the field notebook (Cahier, krizaka-ui ADR-004, #417): asymmetric, never centred. On the
   left, the date line of the notes, who Krizaka is, one promise, one action (and the film, quietly), the products' marks
   and the figures that back them; on the right, « Fig. 1 — Montrer son travail »: the realisations (lib/hero-slides.ts: the film, poster first) in a thin frame, its caption,
   then the figures' text version: a server-rendered <details> that says what each slide shows, the film's shot list on its
   watch page (no polaroid, no tape; the five birds' legend left on 2026-11-04: the birds and their promises live on /story).
   The section is numbered in the margin (§ 1). A server component: the title, the lead and the actions are the first
   paint (LCP) — never revealed, never part of the intro.

   Under the actions, the products put forward: a quiet row of their seven marks (from @krizaka/ui), each one a link to
   its card in #products, the ones not offered yet dimmed.

   Once per session, HeroIntro plays the cinematic intro (home.css): the mark draws itself, a light sweeps the backdrop, the
   figures climb (NumberTicker). Skippable, still under reduced motion and Save-Data. Every figure is read at build and dropped when unknown. */

import { ForwardIcon } from "@krizaka/icons";
import Link from "next/link";
import { KrizakaLogo, ProductLogo } from "@krizaka/ui";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { Page } from "@krizaka/ui/page";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { format, getDictionary } from "@/lib/i18n";
import { figureColumns } from "@/lib/figure-grid";
import type { CSSProperties } from "react";
import { brandFilm, heroSlides } from "@/lib/story-film";
import { HERO_FIGURE, heroMarkOrder } from "@/lib/home-sections";
import { BRAND_FILM } from "@/lib/brand-film";
import { SlideKind } from "@/lib/hero-slides";
import { PRODUCTS, type ProductStatus } from "@/lib/products";
import ButtonLink from "@/app/components/ButtonLink";
import { floorFigure } from "@/lib/figure-floor";
import FilmLightbox from "./FilmLightbox";
import HeroIntro from "./HeroIntro";
import HeroFigure from "./HeroFigure";
import "./home.css";

export interface HomeFigures {
  repositories: number;
  npm: number;
  /** npm downloads of last week (api.npmjs.org at build); absent when unknown. */
  downloads?: number;
}

const film = brandFilm();
const resolved = heroSlides();
const slides = resolved.map(({ id, fig, mp4, poster, loop }) => ({
  id,
  fig,
  mp4,
  poster,
  loop: loop && { webm: loop.webm, mp4: loop.mp4 },
}));
/** A product nothing is offered of yet wears its mark dimmed in the hero's row (the status is the data's). */
const DIM: readonly ProductStatus[] = ["construction", "upcoming"];

/** The text version of Fig. 1, rendered on the server: each slide's number and caption, what it shows step by step, and for
 *  the film the list of its shots on its watch page. A single slide is « Fig. 1 »; from two on, each is « Fig. 1a », « 1b »… */
function FigureText({ locale }: Readonly<{ locale: string }>) {
  const t = getDictionary(locale).site.home.hero;
  const words = (id: string) => t.slides[id as keyof typeof t.slides];
  const fig = (s: (typeof resolved)[number]) => (resolved.length === 1 ? String(HERO_FIGURE) : s.fig);
  return (
    <details className="kz-fig-text">
      <summary>{t.figText.summary}</summary>
      <ol>
        {resolved.map((s) => (
          <li key={s.id}>
            <b>{format(t.carousel.figure, { fig: fig(s), caption: words(s.id).caption })}</b>
            <ol>
              {words(s.id).steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {s.kind === SlideKind.Film && (
              <Link href={`/${locale}/films/${BRAND_FILM.id}#film-shots`}>{t.figText.filmShots}</Link>
            )}
          </li>
        ))}
      </ol>
    </details>
  );
}

export default function HomeHero({ locale, figures }: { locale: string; figures: HomeFigures }) {
  const dict = getDictionary(locale);
  const t = dict.site.home.hero;
  // Two kinds of figures, said apart (founder, 2026-11-01): what we publish, and what gets used. Each reads « more than N ».
  const groups = [
    {
      id: "published",
      label: t.proofs.groups.published,
      items: [
        { id: "repositories", value: floorFigure(figures.repositories), label: t.proofs.repositories },
        { id: "npm", value: floorFigure(figures.npm), label: t.proofs.npm },
      ],
    },
    {
      id: "used",
      label: t.proofs.groups.used,
      items: [{ id: "downloads", value: floorFigure(figures.downloads ?? 0), label: t.proofs.downloads }],
    },
  ]
    .map((g) => ({ ...g, items: g.items.filter((p) => p.value > 0) }))
    .filter((g) => g.items.length > 0);

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
              <FilmLightbox film={{ mp4: film.mp4, poster: film.poster, tall: film.tall }} />
            </div>
          </div>
          <div className="kz-home-hero-proof">
            {/* The products, put forward: a quiet row of their marks, each to its card in #products. Inline SVG, no media (LCP). */}
            <ul className="kz-home-marks" aria-label={t.marksLabel}>
              {heroMarkOrder(PRODUCTS).map((p) => (
                <li key={p.id} className={"brand-" + p.id} data-dim={DIM.includes(p.status) ? "" : undefined}>
                  <a href={`#product-${p.id}`}>
                    <ProductLogo id={p.id} size={30} animated={false} />
                    <span>{p.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="kz-home-proof-groups" aria-label={t.proofsLabel}>
              {groups.map((g) => (
                <section key={g.id} className="kz-home-proof-group" data-group={g.id}>
                  <p className="kz-home-proof-label">{g.label}</p>
                  <dl
                    className="kz-home-proofs"
                    style={
                      {
                        "--kz-fig-cols": figureColumns(g.items.length).wide,
                        "--kz-fig-cols-narrow": figureColumns(g.items.length).narrow,
                      } as CSSProperties
                    }
                  >
                    {g.items.map((p) => (
                      <div key={p.id}>
                        <dt>{p.label}</dt>
                        <dd>
                          <span className="kz-home-more">{t.proofs.more} </span>
                          <NumberTicker value={p.value} locale={locale} align="start" />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
            <p className="kz-home-license">{format(t.proofs.license, { license: "Apache-2.0" })}</p>
          </div>
          <figure className="kz-fig" aria-label={t.fig.figLabel}>
            <HeroFigure slides={slides} />
            {/* One slide: the figure's own caption. From two on, each slide carries its own (« Fig. 1a — … »). */}
            {slides.length === 1 && <figcaption className="kz-fig-caption">{t.fig.caption}</figcaption>}
            <FigureText locale={locale} />
          </figure>
        </div>
      </Page>
    </SectionBackdrop>
  );
}

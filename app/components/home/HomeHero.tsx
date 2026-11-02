/* Home hero — the first page of the field notebook (Cahier, krizaka-ui ADR-004, #417): asymmetric, never centred. On the
   left, the date line of the notes, who Krizaka is, one promise, one action (and the film, quietly), the products' marks
   and the figures that back them; on the right, « Fig. 1 — Montrer son travail »: a silent loop of the film in a thin frame, the
   five birds standing under it, each with a short tag of what it does (no polaroid, no tape).
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
import { Mascot } from "@krizaka/ui/mascots";
import { Page } from "@krizaka/ui/page";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { format, getDictionary } from "@/lib/i18n";
import { figureColumns } from "@/lib/figure-grid";
import type { CSSProperties } from "react";
import { brandFilm } from "@/lib/story-film";
import { heroMarkOrder } from "@/lib/home-sections";
import { PRODUCTS, type ProductStatus } from "@/lib/products";
import ButtonLink from "@/app/components/ButtonLink";
import { floorFigure } from "@/lib/figure-floor";
import FilmLightbox from "./FilmLightbox";
import HeroIntro from "./HeroIntro";
import FilmFrame from "./FilmFrame";
import "./home.css";

export interface HomeFigures {
  repositories: number;
  npm: number;
  /** npm downloads of last week (api.npmjs.org at build); absent when unknown. */
  downloads?: number;
}

const film = brandFilm();
/** The five birds, left to right as the film introduces them; each one a promise (messages site.home.hero.fig.birds). */
const BIRDS = ["falcon", "owl", "duck", "flamingo", "pigeon"] as const;
/** A product nothing is offered of yet wears its mark dimmed in the hero's row (the status is the data's). */
const DIM: readonly ProductStatus[] = ["construction", "upcoming"];

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
            <FilmFrame
              loop={film.loop}
              film={{ mp4: film.mp4, poster: film.poster, tall: film.tall }}
              length={t.filmLength}
            />
            <ul className="kz-fig-birds" aria-label={t.fig.birdsLabel}>
              {BIRDS.map((bird) => (
                <li key={bird}>
                  <Link href="/story#who" className="kz-fig-bird">
                    <Mascot bird={bird} mood="welcome" tone="own" size={44} animated={false} life={false} />
                    <span className="kz-fig-tag">
                      <b>{t.fig.birds[bird].does}</b>
                      {t.fig.birds[bird].about.split(" · ").map((part) => (
                        <span key={part}>{part}</span>
                      ))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <figcaption className="kz-fig-caption">{t.fig.caption}</figcaption>
          </figure>
        </div>
      </Page>
    </SectionBackdrop>
  );
}

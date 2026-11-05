/* Home hero — the first page of the field notebook (Cahier, krizaka-ui ADR-004, #417): asymmetric, never centred. It
   speaks to one reader, the Montréal property manager (krizaka-internal#2445): who we are and where, what the product does,
   one primary action (write to us about your files, on HOME_PRODUCT's topic of the contact form) and one secondary (see a
   checked file: the figure). On the right, half the width, « Fig. 1 »: two named tabs (lib/hero-slides.ts: the checked pay
   stub first, the film second), each figure with its caption and its own text version, a server-rendered <details> that
   says what it shows, the film's shot list on its watch page. The film has no button of its own in the hero any more.
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
import { heroSlides } from "@/lib/story-film";
import { HOME_PRODUCT, heroMarkOrder } from "@/lib/home-sections";
import { BRAND_FILM } from "@/lib/brand-film";
import { SlideKind } from "@/lib/hero-slides";
import { PRODUCTS, type ProductStatus } from "@/lib/products";
import ButtonLink from "@/app/components/ButtonLink";
import { floorFigure } from "@/lib/figure-floor";
import { contactHref } from "@/lib/contact";
import HeroIntro from "./HeroIntro";
import HeroFigure from "./HeroFigure";
import "./home.css";

export interface HomeFigures {
  repositories: number;
  npm: number;
  /** npm downloads of last week (api.npmjs.org at build); absent when unknown. */
  downloads?: number;
}

const resolved = heroSlides();
/** A product nothing is offered of yet wears its mark dimmed in the hero's row (the status is the data's). */
const DIM: readonly ProductStatus[] = ["construction", "upcoming"];

/** The text version of one figure of Fig. 1, rendered on the server and shown right under it (krizaka-internal#2445): what
 *  it shows step by step, and for the film the list of its shots on its watch page. */
function FigureText({ locale, slide }: Readonly<{ locale: string; slide: (typeof resolved)[number] }>) {
  const t = getDictionary(locale).site.home.hero;
  const words = t.slides[slide.id as keyof typeof t.slides];
  return (
    <details className="kz-fig-text">
      <summary>{t.fig.textVersion}</summary>
      <ol>
        {words.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {slide.kind === SlideKind.Film && (
        <Link href={`/${locale}/films/${BRAND_FILM.id}#film-shots`}>{t.figText.filmShots}</Link>
      )}
    </details>
  );
}

export default function HomeHero({ locale, figures }: { locale: string; figures: HomeFigures }) {
  const dict = getDictionary(locale);
  const t = dict.site.home.hero;
  const slides = resolved.map(({ id, fig, kind, mp4, poster, loop }) => ({
    id,
    fig,
    mp4,
    poster,
    loop: loop && { webm: loop.webm, mp4: loop.mp4 },
    length: kind === SlideKind.Film ? t.filmLength : undefined,
  }));
  const texts = Object.fromEntries(resolved.map((s) => [s.id, <FigureText key={s.id} locale={locale} slide={s} />]));
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
              <ButtonLink href={`/${locale}${contactHref("home", HOME_PRODUCT)}`} variant="primary" size="lg">
                {t.primary} <ForwardIcon size={16} strokeWidth={2.25} />
              </ButtonLink>
              <ButtonLink href="#fig-1" variant="secondary" size="lg">
                {t.secondary}
              </ButtonLink>
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
          <div id="fig-1" className="kz-fig" role="group" aria-label={t.fig.figLabel}>
            <HeroFigure slides={slides} texts={texts} />
          </div>
        </div>
      </Page>
    </SectionBackdrop>
  );
}

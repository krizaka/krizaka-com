/* Home hero — the first page of the field notebook (Cahier, krizaka-ui ADR-004, #417): asymmetric, never centred. It
   speaks to one reader, the Montréal property manager (krizaka-internal#2445): who we are and where, what the product does,
   one primary action (write to us about your files, on HOME_PRODUCT's topic of the contact form) and one secondary (see a
   checked file: the figure). On the right, half the width, « Fig. 1 »: two named tabs (lib/hero-slides.ts: the checked pay
   stub first, the film second), each figure with its caption and its own text version, a server-rendered <details> that
   says what it shows, the film's shot list on its watch page. The film has no button of its own in the hero any more.
   The section is numbered in the margin (§ 1). A server component: the title, the lead and the actions are the first
   paint (LCP) — never revealed, never part of the intro.

   Under the actions, the products put forward: a quiet row of their marks (from @krizaka/ui), Verikora first, each one a
   link to its card in #products, the ones not offered yet dimmed. Krizaka's figures (repositories, packages, downloads) and
   the licence left the hero for /docs (krizaka-internal#2445): they speak to developers, not to this reader.

   Once per session, HeroIntro plays the cinematic intro (home.css): the mark draws itself, a light sweeps the backdrop.
   Skippable, still under reduced motion and Save-Data. */

import { ForwardIcon } from "@krizaka/icons";
import Link from "next/link";
import { KrizakaLogo, ProductLogo } from "@krizaka/ui";
import { Page } from "@krizaka/ui/page";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { getDictionary } from "@/lib/i18n";
import { heroSlides } from "@/lib/story-film";
import { HOME_PRODUCT, heroMarkOrder } from "@/lib/home-sections";
import { BRAND_FILM } from "@/lib/brand-film";
import { SlideKind } from "@/lib/hero-slides";
import { PRODUCTS, type ProductStatus } from "@/lib/products";
import { ENGINE } from "@/lib/story";
import ButtonLink from "@/app/components/ButtonLink";
import { contactHref } from "@/lib/contact";
import HeroIntro from "./HeroIntro";
import HeroFigure from "./HeroFigure";
import "./home.css";

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

export default function HomeHero({ locale }: { locale: string }) {
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
                  <a href={p.id === ENGINE ? "#engine" : `#product-${p.id}`}>
                    <ProductLogo id={p.id} size={30} animated={false} />
                    <span>{p.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <figure id="fig-1" className="kz-fig" aria-label={t.fig.figLabel}>
            <HeroFigure slides={slides} texts={texts} />
          </figure>
        </div>
      </Page>
    </SectionBackdrop>
  );
}

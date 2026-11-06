/* Home hero — the first page of the field notebook (Cahier, krizaka-ui ADR-004, #417): asymmetric, never centred. It
   speaks to one reader, the Montréal property manager (krizaka-internal#2445): who we are and where, what the product does,
   and one action (founder, 2026-11-05, krizaka-internal#2450): write to us about your files, on HOME_PRODUCT's topic of
   the contact form. On the right, half the width, « Fig. 1 »: the hero's carousel (Showcase, lib/home-showcase.ts), which
   advances on its own with a visible pause, still under reduced motion, its text version on the server. The products are
   reached one way, the bar's « Products » (lib/nav.ts): no row of marks here any more. The section is numbered in the
   margin (§ 1). A server component: the title, the lead and the action are the first paint (LCP) — never revealed, never
   part of the intro.

   Once per session, HeroIntro plays the cinematic intro (home.css): the mark draws itself, a light sweeps the backdrop, the
   figures climb (NumberTicker). Skippable, still under reduced motion and Save-Data. Every figure is read at build and dropped when unknown. */

import { ForwardIcon } from "@krizaka/icons";
import { KrizakaLogo } from "@krizaka/ui";
import { HERO_FIGURE, HOME_PRODUCT } from "@/lib/home-sections";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { Page } from "@krizaka/ui/page";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { format, getDictionary } from "@/lib/i18n";
import { figureColumns } from "@/lib/figure-grid";
import type { CSSProperties } from "react";
import ButtonLink from "@/app/components/ButtonLink";
import { floorFigure } from "@/lib/figure-floor";
import { contactHref } from "@/lib/contact";
import HeroIntro from "./HeroIntro";
import Showcase from "./Showcase";
import "./home.css";

export interface HomeFigures {
  repositories: number;
  npm: number;
  /** npm downloads of last week (api.npmjs.org at build); absent when unknown. */
  downloads?: number;
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
              <ButtonLink
                href={`/${locale}${contactHref("home", undefined, HOME_PRODUCT)}`}
                variant="primary"
                size="lg"
              >
                {t.primary} <ForwardIcon size={16} strokeWidth={2.25} />
              </ButtonLink>
            </div>
          </div>
          <div className="kz-home-hero-proof">
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
          <div id="fig-1" className="kz-fig">
            <Showcase carousel="hero" fig={HERO_FIGURE} locale={locale} />
          </div>
        </div>
      </Page>
    </SectionBackdrop>
  );
}

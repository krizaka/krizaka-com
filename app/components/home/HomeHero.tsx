/* Home hero — centred: the Krizaka mark, who Krizaka is, one promise, one action (and the film, quietly), the figures
   that back them. A server component: the title, the lead and the actions are the first paint (LCP) — never revealed,
   never part of the intro. Under the figures, IN THE FLOW (the birds never cover a figure), the scene: the flock's
   ambient loop (krizaka-ui tools/brand-films « home-ambient », AmbientLoop — the poster first, the loop only on screen,
   the poster alone under reduced motion or Save-Data), faded into the page.

   Once per session, HeroIntro plays the cinematic intro over the poster (home.css): the mark draws itself, the scene
   rises in with its birds, a light sweeps the backdrop, the figures climb (NumberTicker) — then the loop fades in.
   Skippable, still under reduced motion and Save-Data. Every figure is read at build and dropped when unknown. */

import { ForwardIcon } from "@krizaka/icons";
import { KrizakaLogo } from "@krizaka/ui";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { Page } from "@krizaka/ui/page";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { getDictionary } from "@/lib/i18n";
import { video } from "@/lib/cdn";
import { FILM_BASE, TOUR_BASE } from "@/lib/film-captions";
import ButtonLink from "@/app/components/ButtonLink";
import AmbientLoop, { type AmbientSet } from "./AmbientLoop";
import FilmLightbox from "./FilmLightbox";
import HeroIntro from "./HeroIntro";
import "./home.css";

export interface HomeFigures {
  repositories: number;
  npm: number;
  maven: number;
}

/** The flock on the valley, looping (krizaka-ui tools/brand-films « home-ambient »): wide and 4:5, dark and light. */
const ambient = (cut: string, theme: string) => video(`brand-films/ambient/home-ambient-${cut}-${theme}`);
const themes = (cut: string) => ({ dark: ambient(cut, "dark"), ["light"]: ambient(cut, "light") });
const AMBIENT: AmbientSet = { wide: themes("16x9"), tall: themes("4x5") };
const film = video(TOUR_BASE);
const codeFilm = video(FILM_BASE);

export default function HomeHero({ locale, figures }: { locale: string; figures: HomeFigures }) {
  const t = getDictionary(locale).site.home.hero;
  const counted = [
    { id: "repositories", value: figures.repositories, label: t.proofs.repositories },
    { id: "npm", value: figures.npm, label: t.proofs.npm },
    { id: "maven", value: figures.maven, label: t.proofs.maven },
  ].filter((p) => p.value > 0);

  return (
    <SectionBackdrop as="section" id="hero" className="kz-home-hero" grid aria-labelledby="hero-title">
      <HeroIntro />
      <div data-backdrop-layer aria-hidden className="kz-intro-sweep" />

      <Page className="kz-home-hero-inner">
        <span className="kz-intro-mark kz-intro-deco" aria-hidden>
          <KrizakaLogo size={88} />
        </span>
        <p className="kz-home-eyebrow">{t.eyebrow}</p>
        <h1 id="hero-title" className="kz-home-title">
          {t.title}
        </h1>
        <p className="kz-home-lead">{t.lead}</p>

        <div className="kz-home-actions">
          <ButtonLink href="#products" variant="primary" size="lg" shimmer magnetic>
            {t.primary} <ForwardIcon size={16} strokeWidth={2.25} />
          </ButtonLink>
          <FilmLightbox film={{ mp4: film.mp4, poster: film.poster, vtt: "tour.vtt" }} fallback={{ mp4: codeFilm.mp4, poster: codeFilm.poster, vtt: "film.vtt" }} />
        </div>

        <dl className="kz-home-proofs" aria-label={t.proofsLabel}>
          {counted.map((p) => (
            <div key={p.id}>
              <dt>{p.label}</dt>
              <dd>
                <NumberTicker value={p.value} locale={locale} align="start" />
              </dd>
            </div>
          ))}
          <div>
            <dt>{t.proofs.license}</dt>
            <dd>Apache-2.0</dd>
          </div>
        </dl>
      </Page>

      <div className="kz-home-scene kz-intro-deco" aria-hidden>
        <AmbientLoop set={AMBIENT} />
        <div className="kz-home-scene-fade" />
      </div>
    </SectionBackdrop>
  );
}

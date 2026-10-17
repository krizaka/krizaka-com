/* Home hero — who Krizaka is, one promise, two actions and the figures that back them. A server component: the title,
   the lead and the actions are the first paint (LCP) — nothing here is revealed or animated in. Behind them, only the
   Krizaka backdrop (SectionBackdrop: the gradient and its perspective floor) and the flock's ambient loop on the horizon
   (the signature landscape filmed with its birds — the poster first, the loop only on screen; a still under reduced
   motion or Save-Data), faded at both edges — decorative, still under prefers-reduced-motion. No product colour here: the products are equals,
   further down. Every figure is read at build (lib/org-stats.ts, lib/registry-versions.ts) and dropped when unknown. */

import { ForwardIcon } from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { Page } from "@krizaka/ui/page";
import { getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import { video } from "@/lib/cdn";
import { FILM_BASE } from "@/lib/film-captions";
import AmbientLoop, { type AmbientSet } from "./AmbientLoop";
import FilmLightbox from "./FilmLightbox";
import ButtonLink from "@/app/components/ButtonLink";
import { GitHubMark } from "../brand/GitHubMark";
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
const film = video(FILM_BASE);

export default function HomeHero({ locale, figures }: { locale: string; figures: HomeFigures }) {
  const t = getDictionary(locale).site.home.hero;
  const number = new Intl.NumberFormat(locale);
  const proofs = [
    { id: "repositories", value: figures.repositories > 0 ? number.format(figures.repositories) : "", label: t.proofs.repositories },
    { id: "npm", value: figures.npm > 0 ? number.format(figures.npm) : "", label: t.proofs.npm },
    { id: "maven", value: figures.maven > 0 ? number.format(figures.maven) : "", label: t.proofs.maven },
    { id: "license", value: "Apache-2.0", label: t.proofs.license },
  ].filter((p) => p.value);

  return (
    <SectionBackdrop as="section" id="hero" className="kz-home-hero" grid aria-labelledby="hero-title">
      <div data-backdrop-layer aria-hidden className="kz-home-hero-horizon">
        <AmbientLoop set={AMBIENT} />
      </div>
      <div data-backdrop-layer aria-hidden className="kz-home-hero-fade" />

      <Page className="kz-home-hero-inner">
        <p className="kz-home-eyebrow">{t.eyebrow}</p>
        <h1 id="hero-title" className="kz-home-title">
          {t.title}
        </h1>
        <p className="kz-home-lead">{t.lead}</p>

        <div className="kz-home-actions">
          <ButtonLink href="/products" variant="primary" size="lg" shimmer magnetic>
            {t.primary} <ForwardIcon size={16} strokeWidth={2.25} />
          </ButtonLink>
          <ButtonLink href="/contact" size="lg">
            {t.contact}
          </ButtonLink>
          <ButtonLink href={GITHUB_ORG_URL} variant="ghost" size="lg">
            <GitHubMark size={15} /> GitHub
          </ButtonLink>
          <FilmLightbox mp4={film.mp4} poster={film.poster} />
        </div>

        <dl className="kz-home-proofs" aria-label={t.proofsLabel}>
          {proofs.map((p) => (
            <div key={p.id}>
              <dt>{p.label}</dt>
              <dd>{p.value}</dd>
            </div>
          ))}
        </dl>
      </Page>
    </SectionBackdrop>
  );
}

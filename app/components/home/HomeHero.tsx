/* Home hero — who Krizaka is, one promise, two actions and the figures that back them. A server component: the title,
   the lead and the actions are the first paint (LCP) — nothing here is revealed or animated in. Behind them, only the
   Krizaka backdrop (SectionBackdrop: the gradient and its perspective floor) and the signature landscape on the horizon,
   faded at both edges — decorative, still under prefers-reduced-motion. No product colour here: the products are equals,
   further down. Every figure is read at build (lib/org-stats.ts, lib/registry-versions.ts) and dropped when unknown. */

import { ForwardIcon } from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { Landscape } from "@krizaka/ui/landscape";
import { Page } from "@krizaka/ui/page";
import { getDictionary } from "@/lib/i18n";
import { GITHUB_ORG_URL } from "@/lib/site";
import ButtonLink from "@/app/components/ButtonLink";
import { GitHubMark } from "../brand/GitHubMark";
import "./home.css";

export interface HomeFigures {
  repositories: number;
  npm: number;
  maven: number;
}

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
        <Landscape fade={false} />
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

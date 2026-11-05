import type { ReactNode } from "react";
import type { Metadata } from "next";
import { PackIcon, PlayIcon, ServerIcon, StudioIcon, StoryIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { Facts, Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { localizedMetadata } from "@/lib/seo";
import { contactHref } from "@/lib/contact";
import { format, getDictionary } from "@/lib/i18n";
import { publicRepositoryCount } from "@/lib/org-stats";
import { floorFigure } from "@/lib/figure-floor";
import { npmPackages, npmWeeklyDownloads } from "@/lib/registry-versions";
import { SERVICES_PAGE_ORDER, SERVICES_PROOF, type ServicesProofId } from "@/lib/services-page";
import { buildServiceJsonLd, type Locale } from "@/lib/structured-data";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import { JsonLd } from "@/app/components/JsonLd";
import { OfferList } from "@/app/components/lists/OfferList";
import { WorkLedger } from "@/app/components/lists/WorkLedger";
import "./services.css";

/* /services — « Nos services » (longform): Krizaka Entreprise, the one offer for companies. No price of any kind, no « sur devis »
   (founder, 2026-11-03: « les gens ont besoin de nous, on les laisse venir ») — restrained, few words: what we do and the proof,
   then « Parlez-nous de votre projet ». The hero says it with one action; the three parts are a numbered list (founder,
   2026-11-05, krizaka-internal#2450: « a list, not three squares »), each with what it covers; the proof is public and
   measured (registries and GitHub, read at build) and its artefacts are a ledger of links (WorkLedger), not boxes; the questions are folded; one closing call. Words: site.services;
   structure: lib/services-page.ts. */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/services",
    en: {
      title: "Our services — Krizaka Entreprise: custom modules, sovereign AI, maintenance",
      description:
        "One offer for companies: custom modules built on Krizaka's open building blocks, the adoption of a sovereign AI (Sovkora, on your servers or in Canada), and maintenance.",
    },
    fr: {
      title: "Nos services — Krizaka Entreprise : modules sur mesure, IA souveraine, maintenance",
      description:
        "Une offre pour les entreprises : des modules sur mesure bâtis sur les briques ouvertes de Krizaka, l'adoption d'une IA souveraine (Sovkora, chez vous ou au Canada) et la maintenance.",
    },
  });
}

/* One meaningful icon each: the design system (studio), the motion lab (play), the Java and TypeScript building
   blocks (server, package), the engine wears its own mark, the blog (story). */
const PROOF_ICON: Record<ServicesProofId, ReactNode> = {
  ui: <StudioIcon size={22} />,
  motion: <PlayIcon size={22} />,
  java: <ServerIcon size={22} />,
  ts: <PackIcon size={22} />,
  orazaka: <ProductLogo id="orazaka" size={22} animated={false} />,
  blog: <StoryIcon size={22} />,
};

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const s = getDictionary(locale).site.services;
  const enterprise = contactHref("services", "enterprise");
  const figureGroups = [
    {
      id: "published",
      label: s.proof.groups.published,
      items: [
        { id: "npm", value: floorFigure(npmPackages().length), label: s.proof.figures.npm },
        { id: "repositories", value: floorFigure(publicRepositoryCount()), label: s.proof.figures.repositories },
      ],
    },
    {
      id: "used",
      label: s.proof.groups.used,
      items: [{ id: "downloads", value: floorFigure(npmWeeklyDownloads() ?? 0), label: s.proof.figures.downloads }],
    },
  ]
    .map((g) => ({ ...g, items: g.items.filter((f) => f.value > 0) }))
    .filter((g) => g.items.length > 0);
  const fmt = new Intl.NumberFormat(locale);
  return (
    <main className="kz-site-main">
      <JsonLd
        data={buildServiceJsonLd(locale as Locale, {
          name: s.eyebrow,
          description: s.lead,
          covers: SERVICES_PAGE_ORDER.offers.map((id) => s.offers[id].name),
        })}
      />
      <SiteBar />

      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} align="center" className="svc-page">
        <div className="svc-hero-extra">
          <div className="svc-hero-actions">
            <ButtonLink href={enterprise} variant="primary" size="lg">
              {s.cta}
            </ButtonLink>
          </div>
          <Facts items={[{ label: s.facts.repo }, { label: s.facts.place }]} />
        </div>
      </PageHero>

      <Section id="offers" aria-label={s.offersLabel}>
        {/* The section's h2, for the outline only: the cards' h3 must not follow the hero's h1 directly (axe heading-order). */}
        <h2 className="sr-only">{s.offersLabel}</h2>
        <OfferList
          label={s.offersLabel}
          pointsLabel={s.coverLabel}
          items={SERVICES_PAGE_ORDER.offers.map((id) => ({
            id,
            name: s.offers[id].name,
            meta: s.offers[id].unit,
            hook: s.offers[id].hook,
            points: s.offers[id].features,
          }))}
        />
      </Section>

      <Section id="proof" eyebrow={s.proof.eyebrow} title={s.proof.title} lead={s.proof.lead} divider reveal>
        {/* The figures as one line of facts: the home's hero already shows them as climbing tiles — a second band of
            counters is the template look the Cahier refuses (krizaka-cahier-design, 2026-10-30). */}
        <div className="svc-proof-figures" aria-label={s.proof.figuresLabel}>
          {figureGroups.map((g) => (
            <div key={g.id} className="svc-proof-group" data-group={g.id}>
              <h3 className="kz-home-proof-label">{g.label}</h3>
              <Facts items={g.items.map((f) => ({ label: `${s.proof.more} ${fmt.format(f.value)} ${f.label}` }))} />
            </div>
          ))}
        </div>
        <WorkLedger
          label={s.proof.eyebrow}
          cta={s.proof.cta}
          items={SERVICES_PROOF.map(({ id, href }) => ({
            id,
            href,
            icon: PROOF_ICON[id],
            title: s.proofCards[id].title,
            line: s.proofCards[id].line,
          }))}
        />
      </Section>

      <Section id="faq" title={s.faq.title} headingSize="sm" spacing="sm" divider>
        <div className="kz-tpl-faq">
          {SERVICES_PAGE_ORDER.faq.map((id) => (
            <details key={id}>
              <summary>{s.faq.items[id].q}</summary>
              <div>{format(s.faq.items[id].a, { license: "Apache-2.0" })}</div>
            </details>
          ))}
        </div>
      </Section>

      <Section id="contact" divider aria-labelledby="services-contact">
        <CtaPanel id="services-contact" title={s.contactTitle} body={s.contactBody} reveal>
          <ButtonLink href={enterprise} variant="primary" size="lg">
            {s.cta}
          </ButtonLink>
        </CtaPanel>
      </Section>
    </main>
  );
}

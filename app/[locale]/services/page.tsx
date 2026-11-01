import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AutomationIcon, LockIcon, PackIcon, PlayIcon, ServerIcon, StudioIcon, StoryIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts, Section } from "@krizaka/ui/page";
import { PricingPage } from "@krizaka/ui/pricing-page";
import { localizedMetadata } from "@/lib/seo";
import { contactHref } from "@/lib/contact";
import { format, getDictionary } from "@/lib/i18n";
import { publicRepositoryCount } from "@/lib/org-stats";
import { npmPackages, npmWeeklyDownloads } from "@/lib/registry-versions";
import { SERVICES_PAGE_ORDER, SERVICES_PROOF, type ServicesProofId } from "@/lib/services-page";
import { buildServiceJsonLd, type Locale } from "@/lib/structured-data";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import { JsonLd } from "@/app/components/JsonLd";
import "./services.css";

/* /services — « Nos services » on the pricing template (founder, 2026-10-30: « ça ne fait pas pro »): Krizaka Entreprise,
   the one offer for companies, on quote. The hero says it with one action; the three parts are the template's plans —
   « On quote » in place of a price, what you get, one way in each; how an engagement goes (scoping → quote → delivery →
   maintenance) as numbered cards; the proof is public and measured (registries and GitHub, read at build) and links to
   the artefacts; the questions are folded (the template's FAQ); one closing call. Every action is the contact form with
   « Entreprise » preselected. Words: site.services; structure: lib/services-page.ts. */

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
        "One offer for companies, on quote: custom modules built on Krizaka's open building blocks, the adoption of a sovereign AI (Sovkora, on your servers or in Canada), and maintenance.",
    },
    fr: {
      title: "Nos services — Krizaka Entreprise : modules sur mesure, IA souveraine, maintenance",
      description:
        "Une offre pour les entreprises, sur devis : des modules sur mesure bâtis sur les briques ouvertes de Krizaka, l'adoption d'une IA souveraine (Sovkora, chez vous ou au Canada) et la maintenance.",
    },
  });
}

const OFFER_ICON = { modules: PackIcon, ai: LockIcon, maintenance: AutomationIcon } as const;
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
  const figures = [
    { id: "npm", value: npmPackages().length, label: s.proof.figures.npm },
    { id: "downloads", value: npmWeeklyDownloads() ?? 0, label: s.proof.figures.downloads },
    { id: "repositories", value: publicRepositoryCount(), label: s.proof.figures.repositories },
  ].filter((f) => f.value > 0);
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

      <PricingPage
        className="svc-page"
        eyebrow={s.eyebrow}
        title={s.title}
        lead={s.lead}
        toolbar={
          <div className="svc-hero-extra">
            <div className="svc-hero-actions">
              <ButtonLink href={enterprise} variant="primary" size="lg">
                {s.cta}
              </ButtonLink>
            </div>
            <Facts items={[{ label: s.facts.quote }, { label: s.facts.repo }, { label: s.facts.place }]} />
          </div>
        }
        plansLabel={s.offersLabel}
        plans={SERVICES_PAGE_ORDER.offers.map((id) => {
          const o = s.offers[id];
          const Icon = OFFER_ICON[id];
          return {
            id,
            name: (
              <span className="svc-offer-name">
                <Icon size={20} aria-hidden /> {o.name}
              </span>
            ),
            price: s.price,
            unit: o.unit,
            features: o.features,
            action: (
              <ButtonLink href={enterprise} variant="secondary" size="md">
                {s.offerCta}
              </ButtonLink>
            ),
          };
        })}
        faq={{
          title: s.faq.title,
          items: SERVICES_PAGE_ORDER.faq.map((id) => ({
            question: s.faq.items[id].q,
            answer: format(s.faq.items[id].a, { license: "Apache-2.0" }),
          })),
        }}
      />

      <Section id="proof" eyebrow={s.proof.eyebrow} title={s.proof.title} lead={s.proof.lead} divider reveal>
        {/* The figures as one line of facts: the home's hero already shows them as climbing tiles — a second band of
            counters is the template look the Cahier refuses (krizaka-cahier-design, 2026-10-30). */}
        <div className="svc-proof-figures" aria-label={s.proof.figuresLabel}>
          <Facts items={figures.map((f) => ({ label: `${fmt.format(f.value)} ${f.label}` }))} />
        </div>
        <CardGrid as="ul" min={300} columns={3} className="svc-proof-cards" aria-label={s.proof.eyebrow}>
          {SERVICES_PROOF.map(({ id, href }) => (
            <LinkCard
              key={id}
              href={href}
              title={s.proofCards[id].title}
              description={s.proofCards[id].line}
              icon={PROOF_ICON[id]}
              cta={s.proof.cta}
            />
          ))}
        </CardGrid>
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

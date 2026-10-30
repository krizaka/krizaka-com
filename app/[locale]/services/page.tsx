import type { Metadata } from "next";
import Link from "next/link";
import { AutomationIcon, ChatIcon, LockIcon, PackIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { LinkCard } from "@krizaka/ui/link-card";
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { localizedMetadata } from "@/lib/seo";
import { contactHref } from "@/lib/contact";
import { getDictionary } from "@/lib/i18n";
import { SERVICES_PAGE_ORDER, SERVICES_PROOF } from "@/lib/services-page";
import { buildServiceJsonLd, type Locale } from "@/lib/structured-data";
import { reveal } from "@/lib/motion";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import { JsonLd } from "@/app/components/JsonLd";
import "@/app/components/home/home.css"; // the notebook list (.kz-notebook-list) is the home's

/* /services — « Nos services » (longform template): Krizaka Entreprise, the one offer for companies (2026-10-27): custom
   modules, the adoption of a sovereign AI, maintenance. On quote, no price. Every claim is backed by something public
   (the proof links); the one action is the contact form with the topic « Entreprise » preselected. Words: site.services. */

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/services",
    en: {
      title: "Our services — Krizaka Entreprise: custom modules, sovereign AI, maintenance",
      description: "One offer for companies, on quote: custom modules built on Krizaka's open building blocks, the adoption of a sovereign AI (Orazaka, on your servers or in Canada), and maintenance.",
    },
    fr: {
      title: "Nos services — Krizaka Entreprise : modules sur mesure, IA souveraine, maintenance",
      description: "Une offre pour les entreprises, sur devis : des modules sur mesure bâtis sur les briques ouvertes de Krizaka, l'adoption d'une IA souveraine (Orazaka, chez vous ou au Canada) et la maintenance.",
    },
  });
}

const COVER_ICON = { modules: PackIcon, ai: LockIcon, maintenance: AutomationIcon } as const;

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const s = getDictionary(locale).site.services;
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <JsonLd data={buildServiceJsonLd(locale as Locale, { name: s.title, description: s.lead, covers: SERVICES_PAGE_ORDER.covers.map((id) => s.covers[id].title) })} />
      <SiteBar />

      <PageHero eyebrow={s.eyebrow} title={s.title} lead={s.lead} align="center" linkAs={Link}>
        <ButtonLink href={contactHref("services", "enterprise")} variant="primary" size="lg">
          {s.cta}
        </ButtonLink>
        <p>{s.quote}</p>
      </PageHero>

      <Section id="covers" eyebrow={s.coversLabel} title={s.coversTitle} paper="lines" reveal>
        <ul className="kz-notebook-list" aria-label={s.coversLabel}>
          {SERVICES_PAGE_ORDER.covers.map((id, i) => {
            const Icon = COVER_ICON[id];
            return (
              <li key={id} {...reveal(i)}>
                <Icon size={22} aria-hidden />
                <h3>{s.covers[id].title}</h3>
                <p>{s.covers[id].body}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section id="how" eyebrow={s.howLabel} title={s.howTitle} lead={s.howLead} paper="lines" divider reveal>
        <ol className="kz-notebook-list">
          {SERVICES_PAGE_ORDER.steps.map((id, i) => (
            <li key={id} {...reveal(i)}>
              <h3>{s.steps[id].title}</h3>
              <p>{s.steps[id].body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="proof" eyebrow={s.proofLabel} title={s.proofTitle} lead={s.proofLead} divider reveal>
        <CardGrid as="ul" min={240} columns={4} aria-label={s.proofLabel}>
          {SERVICES_PROOF.map(({ id, href }) => (
            <LinkCard key={id} href={href} title={s.proof[id].title} description={s.proof[id].line} icon={<ChatIcon size={20} aria-hidden />} cta={s.proofCta} />
          ))}
        </CardGrid>
      </Section>

      <Section id="contact" divider aria-labelledby="services-contact">
        <CtaPanel id="services-contact" title={s.contactTitle} body={s.contactBody} reveal>
          <ButtonLink href={contactHref("services", "enterprise")} variant="primary" size="lg">
            {s.cta}
          </ButtonLink>
        </CtaPanel>
      </Section>
    </main>
  );
}

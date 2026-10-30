import type { Metadata } from "next";
import { AutomationIcon, ChatIcon, CheckIcon, EditIcon, LockIcon, PackIcon, ShieldIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts, Section } from "@krizaka/ui/page";
import { PricingPage } from "@krizaka/ui/pricing-page";
import { localizedMetadata } from "@/lib/seo";
import { contactHref } from "@/lib/contact";
import { format, getDictionary } from "@/lib/i18n";
import { publicRepositoryCount } from "@/lib/org-stats";
import { mavenArtifactCount, npmPackages, npmWeeklyDownloads } from "@/lib/registry-versions";
import { SERVICES_PAGE_ORDER, SERVICES_PROOF, stepNumber } from "@/lib/services-page";
import { buildServiceJsonLd, type Locale } from "@/lib/structured-data";
import SiteBar from "@/app/components/SiteBar";
import ButtonLink from "@/app/components/ButtonLink";
import FigureTiles from "@/app/components/FigureTiles";
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
        "One offer for companies, on quote: custom modules built on Krizaka's open building blocks, the adoption of a sovereign AI (Orazaka, on your servers or in Canada), and maintenance.",
    },
    fr: {
      title: "Nos services — Krizaka Entreprise : modules sur mesure, IA souveraine, maintenance",
      description:
        "Une offre pour les entreprises, sur devis : des modules sur mesure bâtis sur les briques ouvertes de Krizaka, l'adoption d'une IA souveraine (Orazaka, chez vous ou au Canada) et la maintenance.",
    },
  });
}

const OFFER_ICON = { modules: PackIcon, ai: LockIcon, maintenance: AutomationIcon } as const;
const STEP_ICON = { discovery: ChatIcon, proposal: EditIcon, build: CheckIcon, maintain: ShieldIcon } as const;
const PROOF_MARK = { ui: "krizaka", java: "krizaka", orazaka: "orazaka", blog: "krizaka" } as const;

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const s = getDictionary(locale).site.services;
  const enterprise = contactHref("services", "enterprise");
  const figures = [
    { id: "npm", value: npmPackages().length, label: s.proof.figures.npm },
    { id: "maven", value: mavenArtifactCount(), label: s.proof.figures.maven },
    { id: "downloads", value: npmWeeklyDownloads() ?? 0, label: s.proof.figures.downloads },
    { id: "repositories", value: publicRepositoryCount(), label: s.proof.figures.repositories },
  ].filter((f) => f.value > 0);
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
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
              <ButtonLink href="#how" variant="secondary" size="lg">
                {s.howLink}
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
        credits={{
          title: s.how.title,
          children: (
            <div id="how" className="svc-how">
              <p className="svc-how-lead">{s.how.lead}</p>
              <CardGrid min={220} columns={4} aria-label={s.how.eyebrow}>
                {SERVICES_PAGE_ORDER.steps.map((id, i) => {
                  const Icon = STEP_ICON[id];
                  return (
                    <ArgumentCard
                      key={id}
                      id={`step-${id}`}
                      level={3}
                      icon={<Icon size={20} aria-hidden />}
                      title={s.steps[id].title}
                      meta={`${s.how.step} ${stepNumber(i)}`}
                      hook={{ label: s.how.stepLabel, text: s.steps[id].body }}
                    />
                  );
                })}
              </CardGrid>
            </div>
          ),
        }}
        faq={{
          title: s.faq.title,
          items: SERVICES_PAGE_ORDER.faq.map((id) => ({
            question: s.faq.items[id].q,
            answer: format(s.faq.items[id].a, { license: "Apache-2.0" }),
          })),
        }}
      />

      <Section id="proof" eyebrow={s.proof.eyebrow} title={s.proof.title} lead={s.proof.lead} divider reveal>
        <div className="svc-proof-figures">
          <FigureTiles figures={figures} label={s.proof.figuresLabel} locale={locale} columns />
        </div>
        <CardGrid as="ul" min={240} columns={4} aria-label={s.proof.eyebrow}>
          {SERVICES_PROOF.map(({ id, href }) => (
            <LinkCard
              key={id}
              href={href}
              title={s.proofCards[id].title}
              description={s.proofCards[id].line}
              icon={<ProductLogo id={PROOF_MARK[id]} size={22} animated={false} />}
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

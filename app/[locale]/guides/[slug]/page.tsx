import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { LinkCard } from "@krizaka/ui/link-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { Page, Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import { KnowledgeIcon } from "@krizaka/icons";
import ButtonLink from "@/app/components/ButtonLink";
import { JsonLd } from "@/app/components/JsonLd";
import TopNavBar from "@/app/components/TopNavBar";
import { contactHref } from "@/lib/contact";
import { GUIDES, GUIDE_PRODUCT_URL, guideBySlug } from "@/lib/guides";
import { getDictionary } from "@/lib/i18n";
import { LOCALES } from "@/lib/locales";
import { reveal } from "@/lib/motion";
import { buildAlternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildGuideJsonLd, type Locale } from "@/lib/structured-data";
import "@/app/components/product-faq.css";

/* /guides/<slug> (longform) — a page that answers one question people search, from the page blocks of @krizaka/ui:
   hero, numbered sections, the short answers (native disclosures + the matching FAQPage JSON-LD), a call to action and
   the other guide. Every word is a message (site.guides); the markup describes only what is on the page. */

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => GUIDES.map((g) => ({ locale, slug: g.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};
  const p = getDictionary(locale).site.guides.pages[guide.slug];
  return {
    title: { absolute: p.metaTitle },
    description: p.metaDescription,
    alternates: buildAlternates(locale, `/guides/${guide.slug}`),
  };
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();
  const g = getDictionary(locale).site.guides;
  const p = g.pages[guide.slug];
  const other = guideBySlug(p.related)!;
  const otherPage = g.pages[other.slug];
  const url = `${SITE_URL}/${locale}/guides/${guide.slug}`;

  return (
    <main data-hue={guide.hue} style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />
      <JsonLd data={buildGuideJsonLd({ locale: locale as Locale, title: p.title, description: p.metaDescription, url })} />
      <JsonLd data={buildFaqJsonLd(p.faq.map(({ q, a }) => ({ question: q, answer: a })))} />
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Krizaka", url: `${SITE_URL}/${locale}` }, { name: p.footerLabel, url }])} />

      <PageHero back={{ href: "/", label: g.back }} linkAs={Link} eyebrow={p.eyebrow} title={p.title} lead={p.lead} />

      <Page>
        {p.sections.map((s, i) => (
          <Section key={s.id} id={s.id} title={s.title} headingSize="sm" spacing="sm" divider={i > 0}>
            {/* The first section is on a phone's first screen: painted at once, no reveal (LCP). */}
            <div className="rd-stack" {...(i > 0 ? reveal(0) : {})}>
              {s.body.map((text) => (
                <p key={text} className="rd-prose">{text}</p>
              ))}
              {s.points.length > 0 && (
                <ul className="kz-list rd-large">
                  {s.points.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </div>
          </Section>
        ))}

        <Section id="faq" eyebrow={g.faqEyebrow} title={g.faqTitle} headingSize="sm" divider>
          <div className="kz-faq">
            {p.faq.map(({ q, a }) => (
              <details key={q} className="kz-faq__item">
                <summary className="kz-faq__q">{q}</summary>
                <p className="kz-faq__a">{a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section spacing="sm" divider aria-labelledby="guide-cta">
          <CtaPanel id="guide-cta" title={p.cta.title} body={p.cta.body} reveal>
            <ButtonLink href={contactHref(`guide-${guide.slug}`, guide.topic)} variant="primary" size="lg">
              {p.cta.action}
            </ButtonLink>
            <ButtonLink href={GUIDE_PRODUCT_URL[guide.product]} size="lg">
              {p.cta.secondary}
            </ButtonLink>
          </CtaPanel>
        </Section>

        <Section id="related" title={g.relatedTitle} headingSize="sm" spacing="sm" divider className="rd-last">
          <CardGrid as="ul" min={260} columns={2}>
            <LinkCard
              data-hue={other.hue}
              href={`/guides/${other.slug}`}
              linkAs={Link}
              icon={<KnowledgeIcon size={20} />}
              title={otherPage.footerLabel}
              titleAs="span"
              description={otherPage.metaDescription}
            />
          </CardGrid>
        </Section>
      </Page>
    </main>
  );
}

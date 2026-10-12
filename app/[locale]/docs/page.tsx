import type { Metadata } from "next";
import Link from "next/link";
import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import { asLocale, getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const copy = (lang: "en" | "fr") => getDictionary(lang).docs.meta;
  return localizedMetadata(locale, { path: "/docs", en: copy("en"), fr: copy("fr") });
}

const GROUPS = [
  { id: "platform", sections: ["ui", "java"] },
  { id: "products", sections: ["orazaka", "orochia"] },
] as const;

/* Straight to what developers and operators ask for first: the CLI, the packs, what an administrator controls. */
const SHORTCUTS = [
  { id: "cli", href: "/docs/orazaka/cli", logo: "orazaka" },
  { id: "packs", href: "/docs/orazaka/packs", logo: "orazaka" },
  { id: "orazakaAdmin", href: "/docs/orazaka/admin", logo: "orazaka" },
  { id: "orochiaAdmin", href: "/docs/orochia/admin_console", logo: "orochia" },
] as const;

const logoOf = (section: string): "orazaka" | "orochia" | "krizaka" => (section === "orazaka" || section === "orochia" ? section : "krizaka");

/* The documentation hub, on the blocks of @krizaka/ui: the hero, then one section per group — shortcuts, the platform's
   building blocks, each product's docs — each a grid of LinkCards (the whole card one link, the product's mark). */
export default async function DocsHub({ params }: Props) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale).docs;
  const groups = [
    {
      id: "shortcuts",
      title: t.hub.shortcuts.title,
      cards: SHORTCUTS.map(({ id, href, logo }) => ({ key: id, href: `/${locale}${href}`, logo, ...t.hub.shortcuts.items[id] })),
    },
    ...GROUPS.map((group) => ({
      id: group.id,
      title: t.hub[group.id],
      cards: group.sections.map((section) => ({
        key: section,
        href: `/${locale}/docs/${section}`,
        logo: logoOf(section),
        title: t.sections[section].title,
        text: t.sections[section].description,
      })),
    })),
  ];
  return (
    <>
      <TopNavBar />
      <main>
        <PageHero eyebrow={t.hub.kicker} title={t.hub.title} lead={t.hub.lead} backdrop="plain" />
        {groups.map((group) => (
          <Section key={group.id} id={`docs-${group.id}`} title={group.title} headingSize="sm" spacing="sm">
            <CardGrid min={280} reveal={false}>
              {group.cards.map((card) => (
                <LinkCard
                  key={card.key}
                  href={card.href}
                  linkAs={Link}
                  icon={<ProductLogo id={card.logo} size={24} animated={false} />}
                  title={card.title}
                  description={card.text}
                  cta={t.hub.open}
                />
              ))}
            </CardGrid>
          </Section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}

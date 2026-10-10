import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductLogo } from "@krizaka/ui";
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

/* The documentation hub: the platform's building blocks, then each product's docs. */
export default async function DocsHub({ params }: Props) {
  const locale = asLocale((await params).locale);
  const t = getDictionary(locale).docs;
  return (
    <>
      <TopNavBar />
      <main className="kz-docs-hub">
        <header className="kz-docs-hub-header">
          <p className="kz-docs-hub-kicker">{t.hub.kicker}</p>
          <h1>{t.hub.title}</h1>
          <p>{t.hub.lead}</p>
        </header>
        {GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={`docs-${group.id}`} className="kz-docs-hub-group">
            <h2 id={`docs-${group.id}`}>{t.hub[group.id]}</h2>
            <div className="kz-docs-hub-grid">
              {group.sections.map((section) => (
                <Link key={section} href={`/${locale}/docs/${section}`} className="kz-docs-hub-card">
                  <ProductLogo id={section === "orazaka" || section === "orochia" ? section : "krizaka"} size={28} animated={false} />
                  <span className="kz-docs-hub-card-title">{t.sections[section].title}</span>
                  <span className="kz-docs-hub-card-text">{t.sections[section].description}</span>
                  <span className="kz-docs-hub-card-cta">
                    {t.hub.open} <ArrowRight size={14} aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}

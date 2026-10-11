import Link from "next/link";
import { Page } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import TopNavBar from "./TopNavBar";
import SiteFooter from "./SiteFooter";
import { getDictionary } from "@/lib/i18n";

/** A legal page (privacy, terms): the site's hero and a narrow reading column (@krizaka/ui blocks); its sections come
    from messages → site.legal.<page>. */
export default function LegalPage({ locale, page }: { locale: string; page: "privacy" | "terms" }) {
  const legal = getDictionary(locale).site.legal;
  const doc = legal[page];
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100dvh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />
      <PageHero back={{ href: "/", label: legal.back }} linkAs={Link} title={doc.title} lead={legal.updated} backdrop="plain" size="narrow" />
      <Page as="article" size="narrow" className="lg">
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
      </Page>
      <SiteFooter />
      <style>{`
        .lg { padding-bottom: 80px; }
        .lg section { padding: 22px 0; border-top: 1px solid var(--kz-border-subtle); }
        .lg h2 { margin: 0 0 10px; font-size: 17px; font-weight: 700; }
        .lg p { margin: 0 0 10px; font-size: 15px; line-height: 1.75; color: var(--kz-text-secondary); }
      `}</style>
    </main>
  );
}

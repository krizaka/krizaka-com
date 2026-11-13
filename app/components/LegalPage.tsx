import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage as LegalTemplate } from "@krizaka/ui/legal-page";
import SiteBar from "./SiteBar";
import { format, getDictionary } from "@/lib/i18n";
import { buildAlternates, shareMetadata } from "@/lib/seo";
import { COMPANY } from "@/lib/site";

/* The texts name the company from `COMPANY` (lib/site.ts: its legal name and NEQ, as the REQ publishes them). They describe what
   the code and the infrastructure really do today (no analytics, contact form only); a lawyer reviews them before they are final. */
type LegalKind = "privacy" | "terms";

/** The route props of a legal page. */
export interface LegalPageProps {
  params: Promise<{ locale: string }>;
}

/** The metadata of a legal page: its title, description, alternates and its own share card, from site.legal.<page>. */
export async function legalMetadata({ params }: LegalPageProps, page: LegalKind): Promise<Metadata> {
  const { locale } = await params;
  const doc = getDictionary(locale).site.legal[page];
  return {
    title: doc.metaTitle,
    description: doc.metaDescription,
    alternates: buildAlternates(locale, `/${page}`),
    ...shareMetadata(locale, `/${page}`, { title: doc.title, description: doc.metaDescription }),
  };
}

/** A legal page (privacy, terms) on the Legal template of @krizaka/ui: its sections come from messages → site.legal.<page>. */
export default function LegalPage({ locale, page }: { locale: string; page: LegalKind }) {
  const legal = getDictionary(locale).site.legal;
  const doc = legal[page];
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100dvh", color: "var(--kz-text-primary)" }}>
      <SiteBar />
      <LegalTemplate
        back={{ href: "/", label: legal.back }}
        linkAs={Link}
        title={doc.title}
        // A page that changed alone carries its own date (site.legal.privacy.updated); the others share site.legal.updated.
        updated={"updated" in doc && typeof doc.updated === "string" ? doc.updated : legal.updated}
        tocLabel={legal.toc}
        sections={doc.sections.map((section, i) => ({
          // A section may name its anchor (`/privacy#accounts`, linked from blog.krizaka.com); the others are numbered.
          id: "id" in section && typeof section.id === "string" ? section.id : `section-${i + 1}`,
          title: section.title,
          children: section.paragraphs.map((p) => <p key={p}>{format(p, COMPANY)}</p>),
        }))}
      />
    </main>
  );
}

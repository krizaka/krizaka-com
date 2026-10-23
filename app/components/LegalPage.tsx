import Link from "next/link";
import { LegalPage as LegalTemplate } from "@krizaka/ui/legal-page";
import TopNavBar from "./TopNavBar";
import { format, getDictionary } from "@/lib/i18n";
import { COMPANY } from "@/lib/site";

/* The texts name the company from `COMPANY` (lib/site.ts: its legal name and NEQ, as the REQ publishes them). They describe what
   the code and the infrastructure really do today (no analytics, contact form only); a lawyer reviews them before they are final. */
/** A legal page (privacy, terms) on the Legal template of @krizaka/ui: its sections come from messages → site.legal.<page>. */
export default function LegalPage({ locale, page }: { locale: string; page: "privacy" | "terms" }) {
  const legal = getDictionary(locale).site.legal;
  const doc = legal[page];
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100dvh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />
      <LegalTemplate
        back={{ href: "/", label: legal.back }}
        linkAs={Link}
        title={doc.title}
        updated={legal.updated}
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

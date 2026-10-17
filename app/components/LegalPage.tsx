import Link from "next/link";
import { LegalPage as LegalTemplate } from "@krizaka/ui/legal-page";
import TopNavBar from "./TopNavBar";
import { getDictionary } from "@/lib/i18n";

/* TODO(legal): the texts name "Technologies Krizaka Inc." (company-info.md: incorporated 2026-10-08). Add the NEQ once the REQ
   certificate arrives — never an invented number. Review both pages with the lawyer Oussama is consulting before they are
   treated as final; they describe what the code and the infrastructure really do today (no analytics, contact form only). */
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
          id: `section-${i + 1}`,
          title: section.title,
          children: section.paragraphs.map((p) => <p key={p}>{p}</p>),
        }))}
      />
    </main>
  );
}

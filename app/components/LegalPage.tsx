import Link from "next/link";
import TopNavBar from "./TopNavBar";
import SiteFooter from "./SiteFooter";
import { getDictionary } from "@/lib/i18n";

/** A legal page (privacy, terms): its sections come from messages → site.legal.<page>. */
export default function LegalPage({ locale, page }: { locale: string; page: "privacy" | "terms" }) {
  const legal = getDictionary(locale).site.legal;
  const doc = legal[page];
  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100dvh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />
      <article className="lg">
        <Link href="/" className="lg-back">{legal.back}</Link>
        <h1>{doc.title}</h1>
        <p className="lg-updated">{legal.updated}</p>
        {doc.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
      </article>
      <SiteFooter />
      <style>{`
        .lg { max-width: 680px; margin: 0 auto; padding: clamp(120px, 14vw, 160px) 20px 80px; }
        .lg-back { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--kz-accent); text-decoration: none; }
        .lg h1 { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(2rem, 5vw, 2.6rem); font-weight: 800; letter-spacing: -.03em; margin: 16px 0 6px; }
        .lg-updated { margin: 0 0 40px; font-size: 13px; color: var(--kz-text-muted); }
        .lg section { padding: 22px 0; border-top: 1px solid var(--kz-border-subtle); }
        .lg h2 { margin: 0 0 10px; font-size: 17px; font-weight: 700; }
        .lg p { margin: 0 0 10px; font-size: 15px; line-height: 1.75; color: var(--kz-text-secondary); }
      `}</style>
    </main>
  );
}

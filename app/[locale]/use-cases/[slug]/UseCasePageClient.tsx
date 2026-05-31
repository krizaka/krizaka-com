"use client";

import Link from "next/link";
import { ArrowRight, Check, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "../../../components/I18nProvider";
import TopNavBar from "../../../components/TopNavBar";
import SiteFooter from "../../../components/SiteFooter";
import { USE_CASES, getUseCaseBySlug, getLocalizedField } from "@/lib/use-cases-data";

/* ─── Sibling Nav ─── */

function SiblingNav({ currentSlug, locale }: { currentSlug: string; locale: "fr" | "en" }) {
  const idx = USE_CASES.findIndex((uc) => uc.slug === currentSlug);
  const prev = idx > 0 ? USE_CASES[idx - 1] : null;
  const next = idx < USE_CASES.length - 1 ? USE_CASES[idx + 1] : null;

  return (
    <div
      className="uc-sibling-nav"
      style={{
        display: "grid",
        gridTemplateColumns: prev && next ? "1fr 1fr" : "1fr",
        gap: "10px",
        marginTop: "48px",
      }}
    >
      {prev && (
        <Link
          href={`/use-cases/${prev.slug}`}
          className="uc-sibling-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderRadius: "14px",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-subtle)",
            textDecoration: "none",
            transition: "border-color 150ms ease",
          }}
        >
          <ChevronLeft size={16} style={{ color: "var(--kz-text-muted)", flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--kz-text-muted)", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
              {locale === "fr" ? "Précédent" : "Previous"}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--kz-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {getLocalizedField(prev.title, locale)}
            </div>
          </div>
        </Link>
      )}
      {next && (
        <Link
          href={`/use-cases/${next.slug}`}
          className="uc-sibling-link"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 20px",
            borderRadius: "14px",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-subtle)",
            textDecoration: "none",
            justifyContent: "flex-end",
            textAlign: "right",
            transition: "border-color 150ms ease",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--kz-text-muted)", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
              {locale === "fr" ? "Suivant" : "Next"}
            </div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--kz-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {getLocalizedField(next.title, locale)}
            </div>
          </div>
          <ChevronRight size={16} style={{ color: "var(--kz-text-muted)", flexShrink: 0 }} />
        </Link>
      )}
    </div>
  );
}

/* ─── Use Case Mini-Nav (all cases) ─── */

function UseCaseMiniNav({ currentSlug, locale }: { currentSlug: string; locale: "fr" | "en" }) {
  return (
    <div
      className="uc-mini-nav"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        marginBottom: "28px",
      }}
    >
      <Link
        href="/use-cases"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--kz-text-muted)",
          background: "var(--kz-surface-2)",
          textDecoration: "none",
          fontFamily: "var(--font-display), system-ui, sans-serif",
          transition: "color 150ms ease",
        }}
      >
        {locale === "fr" ? "Tous" : "All"}
      </Link>
      {USE_CASES.map((uc) => {
        const isActive = uc.slug === currentSlug;
        return (
          <Link
            key={uc.slug}
            href={`/use-cases/${uc.slug}`}
            className={isActive ? "" : "uc-pill-link"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: isActive ? 600 : 450,
              color: isActive ? "var(--kz-accent)" : "var(--kz-text-muted)",
              background: isActive ? "var(--kz-accent-soft)" : "transparent",
              border: isActive ? "1px solid hsla(217, 92%, 60%, 0.15)" : "1px solid transparent",
              textDecoration: "none",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              transition: "color 150ms ease, background 150ms ease",
              whiteSpace: "nowrap",
            }}
          >
            {getLocalizedField(uc.industry, locale)}
          </Link>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   USE CASE PAGE — Client
   ═══════════════════════════════════════════════════════════════════ */

export default function UseCasePageClient({ slug }: { slug: string }) {
  const { t, locale } = useI18n();
  const uc = getUseCaseBySlug(slug);

  if (!uc) return null;

  return (
    <main className="min-h-screen">
      <TopNavBar />

      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "120px 24px 0",
        }}
      >
        {/* ─── Mini-nav pills ─── */}
        <UseCaseMiniNav currentSlug={slug} locale={locale} />

        {/* ─── Industry badge ─── */}
        <div
          style={{
            display: "inline-flex",
            padding: "4px 10px",
            borderRadius: "6px",
            background: "var(--kz-accent-soft)",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--kz-accent)",
            marginBottom: "16px",
          }}
        >
          {getLocalizedField(uc.industry, locale)}
        </div>

        {/* ─── Title ─── */}
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.75rem, 4.5vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            color: "var(--kz-text-primary)",
            lineHeight: 1.15,
            marginBottom: "16px",
          }}
        >
          {getLocalizedField(uc.title, locale)}
        </h1>

        {/* ─── Description ─── */}
        <p
          style={{
            fontSize: "16px",
            color: "var(--kz-text-secondary)",
            lineHeight: 1.65,
            marginBottom: "48px",
          }}
        >
          {getLocalizedField(uc.metaDescription, locale)}
        </p>

        {/* ─── Problem ─── */}
        <section style={{ marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--kz-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}
          >
            {t.useCasePage.problem}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--kz-text-secondary)", lineHeight: 1.7 }}>
            {getLocalizedField(uc.problem, locale)}
          </p>
        </section>

        {/* ─── Solution ─── */}
        <section style={{ marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--kz-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}
          >
            {t.useCasePage.solution}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--kz-text-secondary)", lineHeight: 1.7 }}>
            {getLocalizedField(uc.solution, locale)}
          </p>
        </section>

        {/* ─── Key Features ─── */}
        <section style={{ marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--kz-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "16px",
            }}
          >
            {t.useCasePage.keyFeatures}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {uc.features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  background: "var(--kz-surface-1)",
                  border: "1px solid var(--kz-border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "7px",
                    background: "var(--kz-accent-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={14} strokeWidth={2} style={{ color: "var(--kz-accent)" }} />
                </div>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--kz-text-primary)" }}>
                  {getLocalizedField(feature, locale)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Related docs ─── */}
        <section style={{ marginBottom: "16px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "16px",
              fontWeight: 650,
              color: "var(--kz-text-primary)",
              marginBottom: "12px",
            }}
          >
            {t.useCasePage.relatedDocs}
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {uc.relatedDocs.map((doc) => (
              <Link
                key={doc.href}
                href={doc.href}
                className="related-doc-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: "var(--kz-surface-1)",
                  border: "1px solid var(--kz-border-subtle)",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "var(--kz-text-secondary)",
                  textDecoration: "none",
                  transition: "border-color 150ms ease, color 150ms ease",
                }}
              >
                <BookOpen size={12} strokeWidth={1.5} style={{ color: "var(--kz-accent)" }} />
                {doc.title}
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Prev / Next navigation ─── */}
        <SiblingNav currentSlug={slug} locale={locale} />
      </div>

      {/* ─── CTA ─── */}
      <section
        style={{
          padding: "48px 24px 80px",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            padding: "40px 32px",
            borderRadius: "20px",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-subtle)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--kz-text-primary)",
              marginBottom: "8px",
            }}
          >
            {t.useCasePage.ctaTitle}
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--kz-text-muted)",
              marginBottom: "24px",
              lineHeight: 1.6,
            }}
          >
            {t.useCasePage.ctaDesc}
          </p>
          <Link
            href="/products/orasaka"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: 600,
              background: "var(--kz-accent)",
              color: "var(--kz-on-accent)",
              textDecoration: "none",
              fontFamily: "var(--font-display), system-ui, sans-serif",
            }}
          >
            {t.useCasePage.ctaButton}
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .related-doc-link:hover {
          border-color: var(--kz-border-default) !important;
          color: var(--kz-text-primary) !important;
        }
        .uc-sibling-link:hover {
          border-color: var(--kz-border-default) !important;
        }
        .uc-pill-link:hover {
          color: var(--kz-text-primary) !important;
          background: var(--kz-surface-2) !important;
        }
        @media (max-width: 640px) {
          .uc-sibling-nav {
            grid-template-columns: 1fr !important;
          }
          .uc-mini-nav {
            overflow-x: auto;
            flex-wrap: nowrap !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .uc-mini-nav::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

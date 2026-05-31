"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Megaphone,
  TrendingUp,
  Scale,
  Headphones,
  Building2,
  Heart,
} from "lucide-react";
import { useI18n } from "../../../../components/I18nProvider";
import TopNavBar from "../../../../components/TopNavBar";
import SiteFooter from "../../../../components/SiteFooter";
import { USE_CASES, getLocalizedField } from "@/lib/use-cases-data";

const ICONS = [Megaphone, TrendingUp, Scale, Headphones, Building2, Heart];

export default function UseCasesIndexClient() {
  const { t, locale } = useI18n();

  return (
    <main className="min-h-screen">
      <TopNavBar />

      {/* Hero */}
      <section
        style={{
          padding: "140px 24px 60px",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "var(--kz-text-muted)",
            textDecoration: "none",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Krizaka
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            color: "var(--kz-text-primary)",
            marginBottom: "16px",
          }}
        >
          {t.useCases.sectionTitle}
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--kz-text-secondary)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {t.useCases.sectionDesc}
        </p>
      </section>

      {/* Grid */}
      <section
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <div
          className="ucidx-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "14px",
          }}
        >
          {USE_CASES.map((uc, idx) => {
            const Icon = ICONS[idx];
            return (
              <Link
                key={uc.slug}
                href={`/products/orazaka/usecases/${uc.slug}`}
                className="ucidx-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "32px 28px 28px",
                  borderRadius: "18px",
                  background: "var(--kz-surface-1)",
                  border: "1px solid var(--kz-border-subtle)",
                  textDecoration: "none",
                  transition: "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "11px",
                      background: "var(--kz-accent-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} strokeWidth={1.5} style={{ color: "var(--kz-accent)" }} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--kz-accent)",
                    }}
                  >
                    {getLocalizedField(uc.industry, locale)}
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "18px",
                    fontWeight: 650,
                    color: "var(--kz-text-primary)",
                    letterSpacing: "-0.02em",
                    marginBottom: "10px",
                    lineHeight: 1.3,
                  }}
                >
                  {getLocalizedField(uc.title, locale)}
                </h2>

                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--kz-text-muted)",
                    lineHeight: 1.6,
                    flex: 1,
                    marginBottom: "16px",
                  }}
                >
                  {getLocalizedField(uc.metaDescription, locale)}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--kz-accent)",
                  }}
                >
                  {t.useCases.learnMore}
                  <ArrowRight size={13} strokeWidth={2} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <SiteFooter />

      <style>{`
        .ucidx-card:hover {
          border-color: var(--kz-border-default) !important;
          box-shadow: var(--kz-shadow-md) !important;
          transform: translateY(-2px) !important;
        }
        @media (max-width: 720px) {
          .ucidx-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

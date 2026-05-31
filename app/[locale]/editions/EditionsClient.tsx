"use client";

import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useI18n } from "../../components/I18nProvider";
import PageShell from "../../components/PageShell";
import WaitlistInline from "../../components/WaitlistInline";
import SovereigntyPerimeter from "../../components/illustrations/SovereigntyPerimeter";
import {
  EDITIONS,
  type Edition,
  type EditionId,
  type LocalizedText,
} from "@/lib/editions-data";

const COPY = {
  fr: {
    eyebrow: "Éditions",
    title: "Deux façons de faire tourner Orasaka.",
    subtitle:
      "Community est le produit héros : open source, auto-hébergé, gratuit pour toujours. Cloud arrive — white-label et Packages en un clic. Aucun prix caché, aucune revente de données.",
    perimeter: "Données souveraines — chez toi, ou demain en mode géré.",
  },
  en: {
    eyebrow: "Editions",
    title: "Two ways to run Orasaka.",
    subtitle:
      "Community is the hero product: open source, self-hosted, free forever. Cloud is coming — white-label and one-click Packages. No hidden pricing, no data reselling.",
    perimeter: "Sovereign data — on your servers, soon managed.",
  },
} as const;

/** Geometric, anti-cliché edition glyphs (no robots/brains). */
function Glyph({ id }: { id: EditionId }) {
  const common = {
    width: 30,
    height: 30,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "var(--kz-accent)",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (id === "community")
    return (
      <svg {...common} aria-hidden>
        <rect x="5" y="9" width="22" height="16" rx="3" />
        <path d="M5 14h22" />
        <circle cx="16" cy="19" r="2.2" />
      </svg>
    );
  return (
    <svg {...common} aria-hidden>
      <path d="M16 4l9 4v7c0 6-4 9-9 11-5-2-9-5-9-11V8l9-4z" />
      <path d="M16 11v8M13 15l3-1 3 1" />
    </svg>
  );
}

function AvailabilityBadge({ edition, label }: { edition: Edition; label: string }) {
  const isAvailable = edition.availability === "available";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold"
      style={{
        background: isAvailable ? "var(--kz-accent-soft)" : "var(--kz-surface-2)",
        color: isAvailable ? "var(--kz-accent)" : "var(--kz-text-muted)",
        border: "1px solid var(--kz-border-subtle)",
      }}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "status-dot-pulse" : ""}`}
        style={{
          background: isAvailable ? "var(--kz-accent)" : "var(--kz-text-muted)",
          display: "inline-block",
        }}
      />
      {label}
    </span>
  );
}

export default function EditionsClient() {
  const { locale } = useI18n();
  const L = (x: LocalizedText) => x[locale];
  const c = COPY[locale];

  return (
    <PageShell max="5xl">
      <header
        style={{
          marginBottom: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "32px",
        }}
        className="editions-header"
      >
        <div style={{ maxWidth: "680px" }}>
          <p
            style={{
              marginBottom: "16px",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--kz-accent)",
            }}
          >
            {c.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3rem)",
              fontWeight: 850,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              color: "var(--kz-text-primary)",
              margin: 0,
            }}
          >
            {c.title}
          </h1>
          <p
            style={{
              marginTop: "24px",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "var(--kz-text-secondary)",
              margin: "24px 0 0",
            }}
          >
            {c.subtitle}
          </p>
        </div>
        <div className="editions-header-visual" style={{ display: "flex", justifyContent: "center" }}>
          <SovereigntyPerimeter width={260} height={200} />
        </div>
      </header>

      {/* Edition Cards Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
        className="editions-grid"
      >
        {EDITIONS.map((e: Edition) => (
          <article
            key={e.id}
            className="edition-card"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              padding: "36px 32px 32px",
              borderRadius: "var(--kz-radius-xl)",
              borderColor: e.featured ? "var(--kz-accent)" : "var(--kz-border-subtle)",
              borderWidth: "1px",
              borderStyle: "solid",
              background: e.featured
                ? "radial-gradient(130% 90% at 50% 0%, var(--kz-accent-soft), transparent 55%), var(--kz-surface-1)"
                : "var(--kz-surface-1)",
              boxShadow: e.featured ? "var(--kz-shadow-lg)" : "var(--kz-shadow-sm)",
              transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
            }}
          >
            {/* Top row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    width: "44px",
                    height: "44px",
                    borderRadius: "var(--kz-radius-md)",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--kz-border-subtle)",
                    background: "var(--kz-surface-2)",
                  }}
                >
                  <Glyph id={e.id} />
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "20px",
                    fontWeight: 800,
                    color: "var(--kz-text-primary)",
                    margin: 0,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {L(e.name)}
                </h2>
              </div>
              <AvailabilityBadge edition={e} label={L(e.status)} />
            </div>

            {/* Core tagline & summary */}
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontSize: "14.5px",
                  fontWeight: 650,
                  color: "var(--kz-text-primary)",
                  margin: "0 0 6px",
                }}
              >
                {L(e.tagline)}
              </p>
              <p style={{ fontSize: "13.5px", color: "var(--kz-text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {L(e.whoFor)}
              </p>
            </div>

            {/* Separator */}
            <hr style={{ border: "none", height: 1, background: "var(--kz-border-subtle)", margin: "0 0 24px" }} />

            {/* Features checklist */}
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: 0,
                margin: "0 0 32px",
                listStyle: "none",
              }}
            >
              {e.features.map((f, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    fontSize: "13.5px",
                    lineHeight: 1.5,
                    color: "var(--kz-text-secondary)",
                  }}
                >
                  <Check
                    size={16}
                    strokeWidth={2.5}
                    style={{ color: "var(--kz-accent)", flexShrink: 0, marginTop: "2px" }}
                  />
                  <span>{L(f)}</span>
                </li>
              ))}
            </ul>

            {/* Compliance/Sovereignty note banner inside card */}
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "14px",
                borderRadius: "var(--kz-radius-md)",
                background: "var(--kz-surface-2)",
                border: "1px solid var(--kz-border-subtle)",
                fontSize: "12px",
                lineHeight: 1.5,
                color: "var(--kz-text-secondary)",
                marginBottom: "24px",
              }}
            >
              <ShieldCheck size={16} style={{ color: "var(--kz-accent)", flexShrink: 0, marginTop: "1px" }} />
              <span>{L(e.sovereignty)}</span>
            </div>

            {/* Button */}
            <div>
              {e.ctaWaitlist ? (
                <a
                  href={e.ctaHref}
                  style={{
                    display: "inline-flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 28px",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    background: "var(--kz-accent)",
                    color: "var(--kz-on-accent)",
                    textDecoration: "none",
                    transition: "background-color 150ms ease",
                  }}
                  className="edition-card-btn"
                >
                  {L(e.cta)} <ArrowRight size={15} />
                </a>
              ) : (
                <Link
                  href={e.ctaHref}
                  style={{
                    display: "inline-flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 28px",
                    borderRadius: "9999px",
                    fontSize: "14px",
                    fontWeight: 600,
                    background: "var(--kz-accent)",
                    color: "var(--kz-on-accent)",
                    textDecoration: "none",
                    transition: "background-color 150ms ease",
                  }}
                  className="edition-card-btn"
                >
                  {L(e.cta)} <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* Sovereignty Bottom callout banner + waitlist form */}
      <section
        style={{
          marginTop: "80px",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          alignItems: "center",
          gap: "32px",
          maxWidth: "900px",
          margin: "80px auto 0",
        }}
        className="editions-bottom-section"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "28px",
            borderRadius: "var(--kz-radius-xl)",
            border: "1px solid var(--kz-border-subtle)",
            background: "var(--kz-surface-1)",
            boxShadow: "var(--kz-shadow-sm)",
          }}
        >
          <ShieldCheck size={28} strokeWidth={1.5} style={{ color: "var(--kz-accent)", flexShrink: 0 }} />
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: 1.5,
              color: "var(--kz-text-primary)",
              margin: 0,
            }}
          >
            {c.perimeter}
          </p>
        </div>
        <WaitlistInline defaultEdition="cloud" />
      </section>

      <style>{`
        .edition-card:hover {
          border-color: var(--kz-accent) !important;
          transform: translateY(-4px);
          box-shadow: var(--kz-shadow-lg) !important;
        }
        .edition-card:hover .edition-card-btn {
          background-color: var(--kz-accent-hover) !important;
        }
        @keyframes active-pulsing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.3); opacity: 0.5; }
        }
        .status-dot-pulse {
          animation: active-pulsing 2s ease-in-out infinite;
        }
        @media (max-width: 820px) {
          .editions-header {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .editions-header-visual {
            display: none !important;
          }
          .editions-grid {
            grid-template-columns: 1fr !important;
          }
          .editions-bottom-section {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </PageShell>
  );
}

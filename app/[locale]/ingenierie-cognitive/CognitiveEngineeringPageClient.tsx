"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, X, Check } from "lucide-react";
import TopNavBar from "../../components/TopNavBar";
import SiteFooter from "../../components/SiteFooter";
import { useI18n } from "../../components/I18nProvider";
import InterceptorMesh from "../../components/demos/InterceptorMesh";

/* ─── Pipeline Stage Card ─── */

function StageCard({
  order,
  name,
  desc,
}: {
  order: string;
  name: string;
  desc: string;
}) {
  return (
    <div
      className="cog-stage-card"
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "48px 1fr",
        alignItems: "center",
        gap: "16px",
        padding: "20px 24px",
        borderRadius: "var(--kz-radius-lg)",
        background: "var(--kz-surface-1)",
        border: "1px solid var(--kz-border-subtle)",
        boxShadow: "var(--kz-shadow-sm)",
        transition: "all 250ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Timeline dot that aligns with the track */}
      <div
        className="cog-stage-node"
        style={{
          position: "absolute",
          left: "-37px",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "var(--kz-surface-0)",
          border: "2.5px solid var(--kz-accent)",
          boxShadow: "0 0 8px var(--kz-accent)",
          transition: "all 200ms ease",
          zIndex: 2,
        }}
      />

      <span
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "12px",
          fontWeight: 800,
          color: "var(--kz-accent)",
          background: "var(--kz-accent-soft)",
          padding: "4px 8px",
          borderRadius: "var(--kz-radius-sm)",
          letterSpacing: "0.02em",
          textAlign: "center",
        }}
      >
        {order}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "14.5px",
            fontWeight: 650,
            color: "var(--kz-text-primary)",
            letterSpacing: "-0.01em",
            marginBottom: "3px",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--kz-text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}

/* ─── Principle Card ─── */

function PrincipleCard({
  title,
  desc,
  index,
}: {
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <article
      style={{
        padding: "28px 24px",
        borderRadius: "16px",
        background: "var(--kz-surface-1)",
        border: "1px solid var(--kz-border-subtle)",
        transition: "border-color 200ms ease, transform 200ms ease",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "10px",
          fontWeight: 700,
          color: "var(--kz-accent)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "12px",
          display: "block",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3
        style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--kz-text-primary)",
          letterSpacing: "-0.02em",
          marginBottom: "10px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "13.5px",
          color: "var(--kz-text-secondary)",
          lineHeight: 1.65,
        }}
      >
        {desc}
      </p>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COGNITIVE ENGINEERING — Full Landing Page (Client)
   ═══════════════════════════════════════════════════════════════════ */

export default function CognitiveEngineeringPageClient() {
  const { locale, t } = useI18n();
  const p = t.cognitiveEngineeringPage;
  const stages = t.cognitiveEngineering.stages;
  const principles = t.cognitiveEngineering.principles;

  return (
    <main className="min-h-screen">
      <TopNavBar />

      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "120px 24px 80px",
        }}
      >
        {/* ─── Back link ─── */}
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--kz-text-muted)",
            textDecoration: "none",
            marginBottom: "32px",
            fontFamily: "var(--font-display), system-ui, sans-serif",
          }}
        >
          <ArrowLeft size={13} strokeWidth={2} />
          {p.backHome}
        </Link>

        {/* ─── Page title ─── */}
        <h1
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            lineHeight: 1.15,
            marginBottom: "16px",
          }}
        >
          {p.introTitle}
        </h1>

        {/* ─── Intro text ─── */}
        <div
          style={{
            fontSize: "15px",
            color: "var(--kz-text-secondary)",
            lineHeight: 1.75,
            marginBottom: "56px",
            maxWidth: "640px",
            whiteSpace: "pre-line",
          }}
        >
          {p.introText}
        </div>

        {/* ═══ Pipeline Mesh — interactive hex visualization ═══ */}
        <section style={{ marginBottom: "64px" }}>
          <InterceptorMesh compact={true} />
        </section>

        {/* ═══ Pipeline Section ═══ */}
        <section style={{ marginBottom: "64px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 750,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              marginBottom: "8px",
            }}
          >
            {p.pipelineTitle}
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--kz-text-muted)",
              lineHeight: 1.6,
              marginBottom: "24px",
              maxWidth: "560px",
            }}
          >
            {p.pipelineDesc}
          </p>

          {/* Interceptors callout banner */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: "var(--kz-radius-lg)",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              marginBottom: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--kz-accent)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {locale === "fr" ? "COMPOSITION DU MOTEUR COGNITIF" : "COGNITIVE ENGINE ARCHITECTURE"}
            </span>
            <p
              style={{
                fontSize: "13.5px",
                lineHeight: 1.6,
                color: "var(--kz-text-secondary)",
                margin: 0,
              }}
            >
              {locale === "fr"
                ? "Orasaka expose une bibliothèque totale de 15 intercepteurs de pipeline (raisonnement multi-agents, garde-fous, exécution de sandbox MCP, validations humaines). Le pipeline de requêtes standard s'appuie sur une chaîne séquentielle de 9 intercepteurs par défaut pour structurer l'inférence."
                : "Orasaka exposes a complete library of 15 pipeline interceptors (multi-agent reasoning, guardrails, MCP sandbox execution, human validation loops). The standard query pipeline relies on a sequential chain of 9 default interceptors to structure inference."}
            </p>
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingLeft: "36px",
            }}
          >
            {/* Glowing neon vertical track line */}
            <div
              style={{
                position: "absolute",
                left: "11px",
                top: "12px",
                bottom: "12px",
                width: "2px",
                background: "linear-gradient(to bottom, var(--kz-accent), var(--kz-accent-soft) 80%, transparent)",
                opacity: 0.5,
              }}
            />
            {stages.map((stage, idx) => (
              <StageCard
                key={idx}
                order={stage.order}
                name={stage.name}
                desc={stage.desc}
              />
            ))}
          </div>
        </section>

        {/* ═══ Principles Section ═══ */}
        <section style={{ marginBottom: "64px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 750,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              marginBottom: "8px",
            }}
          >
            {p.principlesTitle}
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--kz-text-muted)",
              lineHeight: 1.6,
              marginBottom: "24px",
            }}
          >
            {p.principlesDesc}
          </p>

          <div
            className="cog-principles-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {principles.map((principle, idx) => (
              <PrincipleCard
                key={idx}
                title={principle.title}
                desc={principle.desc}
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* ═══ Comparison Table ═══ */}
        <section style={{ marginBottom: "64px" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 750,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              marginBottom: "24px",
            }}
          >
            {p.diffTitle}
          </h2>

          <div
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--kz-border-subtle)",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                background: "var(--kz-surface-2)",
                padding: "12px 22px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "var(--kz-text-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Cloud Chatbot
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "var(--kz-accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Orasaka
              </span>
            </div>

            {/* Rows */}
            {p.diffItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  padding: "14px 22px",
                  background: "var(--kz-surface-1)",
                  borderTop: "1px solid var(--kz-border-subtle)",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    color: "var(--kz-text-muted)",
                  }}
                >
                  <X
                    size={14}
                    strokeWidth={2}
                    style={{
                      color: "var(--kz-status-error)",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  {item.cloud}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    color: "var(--kz-text-primary)",
                    fontWeight: 500,
                  }}
                >
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    style={{
                      color: "var(--kz-status-success)",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  {item.orasaka}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section
          style={{
            textAlign: "center",
            padding: "48px 24px",
            borderRadius: "20px",
            background: "var(--kz-surface-1)",
            border: "1px solid var(--kz-border-subtle)",
            marginBottom: "40px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
              fontWeight: 750,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              marginBottom: "10px",
            }}
          >
            {p.ctaTitle}
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "var(--kz-text-muted)",
              marginBottom: "24px",
              maxWidth: "400px",
              margin: "0 auto 24px",
            }}
          >
            {p.ctaDesc}
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
            {p.ctaButton}
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </section>
      </div>

      <SiteFooter />

      <style>{`
        .cog-stage-card:hover {
          border-color: var(--kz-accent) !important;
          transform: translateX(6px);
          background: var(--kz-surface-2) !important;
          box-shadow: var(--kz-shadow-md) !important;
        }
        .cog-stage-card:hover .cog-stage-node {
          background: var(--kz-accent) !important;
          transform: translate(-50%, -50%) scale(1.3) !important;
          box-shadow: 0 0 12px var(--kz-accent) !important;
        }
        @media (max-width: 640px) {
          .cog-principles-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

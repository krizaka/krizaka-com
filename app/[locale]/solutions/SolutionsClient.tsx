"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  FileSearch,
  Library,
  LifeBuoy,
  ShieldCheck,
  Workflow,
  Check,
  ShieldAlert,
  Coins,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "../../components/I18nProvider";
import PageShell from "../../components/PageShell";
import KrizakaLogo from "../../components/KrizakaLogo";
import { SOLUTIONS, type LocalizedText, type Solution } from "@/lib/solutions-data";

const ICONS: Record<Solution["id"], LucideIcon> = {
  "document-intelligence": FileSearch,
  "support-automation": LifeBuoy,
  "knowledge-rag": Library,
  "media-generation": Clapperboard,
  "autonomous-agents": Workflow,
};

const COPY = {
  fr: {
    eyebrow: "Solutions",
    title: "Des packages prêts à déployer, par domaine.",
    subtitle:
      "Chaque package résout un problème précis avec une capacité d'Orasaka — et tourne sur ton infrastructure. Le résultat, pas la plomberie.",
    capability: "Capacité",
    forWhom: "Pour qui",
    explore: "Voir les éditions",
    talk: "Commencer",
    ctaTitle: "Un package pour ton domaine ?",
    ctaDesc: "Déploie-le toi-même, en mode géré, ou en accompagnement Enterprise.",
  },
  en: {
    eyebrow: "Solutions",
    title: "Ready-to-deploy packages, by domain.",
    subtitle:
      "Each package solves one concrete problem with an Orasaka capability — and runs on your infrastructure. The outcome, not the plumbing.",
    capability: "Capability",
    forWhom: "For",
    explore: "See editions",
    talk: "Get started",
    ctaTitle: "A package for your domain?",
    ctaDesc: "Deploy it yourself, managed, or with Enterprise support.",
  },
} as const;

export default function SolutionsClient() {
  const { locale } = useI18n();
  const L = (x: LocalizedText) => x[locale];
  const c = COPY[locale];

  return (
    <PageShell max="7xl">
      <header
        style={{
          marginBottom: "64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "32px",
        }}
        className="solutions-header"
      >
        <div className="solutions-header-engine" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ animation: "logo-spin 25s linear infinite", transformOrigin: "center" }}>
            <KrizakaLogo size={150} />
          </div>
        </div>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <p
            style={{
              marginBottom: "16px",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--kz-accent)",
              margin: 0,
            }}
          >
            {c.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3rem)",
              fontWeight: 850,
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
              color: "var(--kz-text-primary)",
              margin: "12px 0 0",
            }}
          >
            {c.title}
          </h1>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "var(--kz-text-secondary)",
              margin: "16px 0 0",
            }}
          >
            {c.subtitle}
          </p>
        </div>
      </header>

      {/* Featured Law 25 Sovereign Compliance Section — Glass-blended into the background */}
      <section
        style={{
          background: "linear-gradient(135deg, color-mix(in srgb, var(--kz-surface-1) 40%, transparent) 0%, color-mix(in srgb, var(--kz-accent-soft) 20%, transparent) 100%)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid var(--kz-border-strong)",
          borderRadius: "var(--kz-radius-xl)",
          padding: "36px",
          marginBottom: "48px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
        className="compliance-featured-banner"
      >
        <div style={{ position: "absolute", top: 0, right: 0, width: "180px", height: "180px", backgroundImage: "radial-gradient(circle, var(--kz-accent-soft) 0%, transparent 70%)", opacity: 0.2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-20px", left: "20%", width: "300px", height: "100px", background: "var(--kz-accent)", filter: "blur(50px)", opacity: 0.05, pointerEvents: "none" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "var(--kz-radius-sm)",
                background: "rgba(239, 68, 68, 0.08)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#f87171",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              <ShieldAlert size={12} />
              {locale === "fr" ? "ARGUMENT MAJEUR : CONFORMITÉ LOI 25" : "MAJOR ARGUMENT: LAW 25 COMPLIANCE"}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                fontWeight: 850,
                color: "var(--kz-text-primary)",
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.15,
              }}
            >
              {locale === "fr"
                ? "Le traitement local d'Orasaka résout le fardeau juridique de la Loi 25"
                : "Orasaka's Local Inference Solves the Legal Burden of Quebec's Law 25"}
            </h2>
            <p style={{ fontSize: "14.5px", color: "var(--kz-text-secondary)", marginTop: "8px", maxWidth: "800px", lineHeight: 1.6 }}>
              {locale === "fr"
                ? "Au Québec, le déploiement d'outils d'IA cloud tiers (OpenAI, Anthropic) ou l'hébergement hors province est un enfer réglementaire. Orasaka s'exécute entièrement chez vous, éliminant les risques de non-conformité par sa nature souveraine."
                : "In Quebec, deploying cloud-based AI tools (OpenAI, Anthropic) or hosting data out-of-province triggers strict regulatory workflows. Orasaka executes fully on your own infrastructure, bypassing these legal hurdles by design."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "24px",
              marginTop: "8px",
            }}
            className="compliance-featured-grid"
          >
            <div
              style={{
                background: "rgba(239, 68, 68, 0.02)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(239, 68, 68, 0.12)",
                borderRadius: "var(--kz-radius-lg)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "inline-flex", width: "32px", height: "32px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.08)", color: "#ef4444", alignItems: "center", justifyContent: "center" }}>
                  <Coins size={16} />
                </span>
                <h3 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "15px", fontWeight: 750, color: "var(--kz-text-primary)", margin: 0 }}>
                  {locale === "fr" ? "Le Risque Juridique & Financier" : "The Legal & Financial Risk"}
                </h3>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", padding: 0, margin: 0, listStyle: "none" }}>
                <li style={{ display: "flex", gap: "8px", fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.5 }}>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>•</span>
                  <span>
                    <strong>{locale === "fr" ? "Amendes massives :" : "Massive fines:"}</strong>{" "}
                    {locale === "fr"
                      ? "La Commission d'accès à l'information (CAI) peut imposer des pénalités pénales allant jusqu'à 25 000 000 $ CAD ou 4 % de votre chiffre d'affaires mondial en cas de non-conformité."
                      : "The CAI can impose penal sanctions up to $25,000,000 CAD or 4% of global turnover for privacy violations."}
                  </span>
                </li>
                <li style={{ display: "flex", gap: "8px", fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.5 }}>
                  <span style={{ color: "#ef4444", fontWeight: 700 }}>•</span>
                  <span>
                    <strong>{locale === "fr" ? "Évaluation (EFVP) obligatoire :" : "Mandatory PIA Assessment:"}</strong>{" "}
                    {locale === "fr"
                      ? "La Loi 25 exige légalement une Évaluation des Facteurs relatifs à la Vie Privée (EFVP) systématique avant de transférer un renseignement personnel hors du Québec (ex: hébergement cloud US ou envoi de requêtes aux serveurs d'OpenAI/Anthropic)."
                      : "Law 25 legally requires a systematic Privacy Impact Assessment (PIA/EFVP) before transferring personal information outside Quebec (e.g. US cloud hosting or sending prompt requests to OpenAI/Anthropic APIs)."}
                  </span>
                </li>
              </ul>
            </div>

            <div
              style={{
                background: "rgba(16, 185, 129, 0.02)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(16, 185, 129, 0.12)",
                borderRadius: "var(--kz-radius-lg)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "inline-flex", width: "32px", height: "32px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.08)", color: "#10b981", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={16} />
                </span>
                <h3 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "15px", fontWeight: 750, color: "var(--kz-text-primary)", margin: 0 }}>
                  {locale === "fr" ? "Le Bouclier Souverain d'Orasaka" : "Orasaka's Sovereign Shield"}
                </h3>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "12px", padding: 0, margin: 0, listStyle: "none" }}>
                <li style={{ display: "flex", gap: "8px", fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.5 }}>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>•</span>
                  <span>
                    <strong>{locale === "fr" ? "Exécution 100% Locale :" : "100% Local Inference:"}</strong>{" "}
                    {locale === "fr"
                      ? "Vos modèles (Llama, Mistral), bases de données vectorielles (pgvector) et sandboxes d'exécution tournent entièrement sur votre infrastructure physique au Québec ou cloud souverain canadien."
                      : "Your inference models (Llama, Mistral), vector databases (pgvector), and execution sandboxes run entirely on your own local hardware or Canadian sovereign cloud."}
                  </span>
                </li>
                <li style={{ display: "flex", gap: "8px", fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.5 }}>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>•</span>
                  <span>
                    <strong>{locale === "fr" ? "Bypass réglementaire :" : "Bypassing Transfer Restrictions:"}</strong>{" "}
                    {locale === "fr"
                      ? "Puisque aucune donnée personnelle ne transite sur le réseau externe et ne quitte votre réseau physique, les exigences de transfert de la Loi 25 ne s'appliquent pas. Vous évitez les EFVP complexes."
                      : "Since no personal data ever transits externally or leaves your physical network, Law 25's cross-border transfer restrictions are not triggered, rendering complex audits unnecessary."}
                  </span>
                </li>
                <li style={{ display: "flex", gap: "8px", fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.5 }}>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>•</span>
                  <span>
                    <strong>{locale === "fr" ? "Pipeline d'Audit Intégré :" : "Built-in Audit Pipeline:"}</strong>{" "}
                    {locale === "fr"
                      ? "L'intercepteur d'audit journalise et signe cryptographiquement chaque décision prise par les agents d'IA, offrant une traçabilité totale prête pour les inspections réglementaires."
                      : "The audit log interceptor automatically traces and cryptographically signs every agent decision, creating a tamper-proof audit trail for regulatory audits."}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Solution Cards — Restructured as an asymmetric Bento Grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          width: "100%",
          margin: "0 auto 80px",
        }}
        className="solutions-bento-grid"
      >
        {SOLUTIONS.map((s, idx) => {
          const Icon = ICONS[s.id];
          const isFirst = idx === 0; // The first item will span 2 columns

          return (
            <article
              key={s.id}
              className={`solution-card ${isFirst ? "solution-card-wide" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "32px",
                borderRadius: "var(--kz-radius-xl)",
                background: "color-mix(in srgb, var(--kz-surface-1) 35%, transparent)",
                backdropFilter: "blur(12px) saturate(140%)",
                WebkitBackdropFilter: "blur(12px) saturate(140%)",
                border: "1px solid var(--kz-border-default)",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.15)",
                transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Header: Icon + Title & Meta info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  marginBottom: "24px",
                  minHeight: "60px",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--kz-radius-md)",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--kz-border-subtle)",
                    background: "var(--kz-surface-2)",
                    color: "var(--kz-accent)",
                    flexShrink: 0,
                    boxShadow: "0 0 10px var(--kz-accent-soft)",
                    transition: "all 200ms ease",
                  }}
                  className="solution-card-icon"
                >
                  <Icon size={22} strokeWidth={1.6} />
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "19px",
                      fontWeight: 800,
                      color: "var(--kz-text-primary)",
                      letterSpacing: "-0.025em",
                      margin: 0,
                    }}
                  >
                    {L(s.name)}
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "10px",
                      color: "var(--kz-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      margin: 0,
                    }}
                  >
                    {c.forWhom}: {L(s.whoFor)}
                  </p>
                </div>
              </div>

              {/* Specs Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: "44px",
                  padding: "8px 12px",
                  borderRadius: "var(--kz-radius-sm)",
                  background: "var(--kz-surface-2)",
                  border: "1px solid var(--kz-border-subtle)",
                  fontSize: "12px",
                  lineHeight: 1.45,
                  color: "var(--kz-text-secondary)",
                  marginBottom: "20px",
                }}
              >
                <span>
                  <strong>{c.capability}:</strong> {L(s.capability)}
                </span>
              </div>

              {/* Problem Statement */}
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "var(--kz-text-secondary)",
                  marginBottom: "20px",
                  margin: "0 0 20px",
                }}
              >
                {L(s.problem)}
              </p>

              {/* Resolved Outcome */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "var(--kz-radius-md)",
                  background: "hsla(160, 84%, 39%, 0.04)",
                  border: "1px solid hsla(160, 84%, 39%, 0.12)",
                  marginBottom: "24px",
                }}
              >
                <Check size={16} style={{ color: "var(--kz-status-success)", flexShrink: 0, marginTop: "2px" }} />
                <p
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    lineHeight: 1.5,
                    color: "var(--kz-text-primary)",
                    margin: 0,
                  }}
                >
                  {L(s.outcome)}
                </p>
              </div>

              {/* Sovereignty Guard */}
              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  fontSize: "12px",
                  lineHeight: 1.5,
                  color: "var(--kz-text-muted)",
                }}
              >
                <ShieldCheck size={14} style={{ color: "var(--kz-accent)", flexShrink: 0, marginTop: "1px" }} />
                <span>{L(s.sovereignty)}</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Closing CTA band */}
      <section
        style={{
          marginTop: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "28px",
          padding: "56px 40px",
          borderRadius: "var(--kz-radius-xl)",
          border: "1px solid var(--kz-border-subtle)",
          background: "radial-gradient(120% 130% at 50% -10%, var(--kz-accent-soft) 0%, transparent 50%)",
          position: "relative",
        }}
        className="solutions-cta"
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", position: "relative", zIndex: 2 }}>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              fontWeight: 850,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, var(--kz-text-primary) 30%, var(--kz-accent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}
          >
            {c.ctaTitle}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--kz-text-secondary)", maxWidth: "500px", lineHeight: 1.6, margin: 0 }}>
            {c.ctaDesc}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", position: "relative", zIndex: 2 }}>
          <Link
            href="/editions"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 32px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: 600,
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-strong)",
              color: "var(--kz-text-primary)",
              textDecoration: "none",
              transition: "all 200ms ease",
            }}
            className="solutions-btn-sec"
          >
            {c.explore}
          </Link>
          <Link
            href="/products/orasaka/getting-started/101"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              borderRadius: "9999px",
              fontSize: "14px",
              fontWeight: 600,
              background: "var(--kz-accent)",
              color: "var(--kz-on-accent)",
              textDecoration: "none",
              boxShadow: "0 4px 14px hsla(217, 92%, 60%, 0.25)",
              transition: "all 200ms ease",
            }}
            className="solutions-btn-pri"
          >
            {c.talk}
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      <style>{`
        @media (min-width: 860px) {
          .compliance-featured-grid {
            grid-template-columns: 1fr 1.2fr !important;
          }
        }
        
        @media (min-width: 960px) {
          .solution-card-wide {
            grid-column: span 2;
          }
        }

        .solution-card:hover {
          border-color: var(--kz-accent) !important;
          background-color: color-mix(in srgb, var(--kz-surface-1) 50%, transparent) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 30px var(--kz-accent-soft) !important;
        }
        .solution-card:hover .solution-card-icon {
          background-color: var(--kz-accent-soft) !important;
          border-color: var(--kz-accent) !important;
          box-shadow: 0 0 15px var(--kz-accent);
          transform: scale(1.05) rotate(4deg);
        }
        .solutions-btn-sec:hover {
          border-color: var(--kz-accent) !important;
          background-color: var(--kz-surface-3) !important;
          transform: translateY(-2px);
        }
        .solutions-btn-pri:hover {
          background-color: var(--kz-accent-hover) !important;
          box-shadow: 0 6px 20px hsla(217, 92%, 60%, 0.4) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 959px) {
          .solutions-bento-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 680px) {
          .solutions-header {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .solutions-header-engine {
            margin-bottom: -10px;
          }
          .solutions-bento-grid {
            grid-template-columns: 1fr !important;
          }
          .solutions-cta {
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </PageShell>
  );
}

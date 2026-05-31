"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Building2,
  BookOpen,
  Lock,
  FileSearch,
  LifeBuoy,
  Clapperboard,
} from "lucide-react";
import { useI18n } from "./I18nProvider";
import SovereigntyPerimeter from "./illustrations/SovereigntyPerimeter";
import OrasakaLogo from "./OrasakaLogo";
import { GITHUB_REPO_URL } from "@/lib/site";
import { motion } from "framer-motion";

/* GitHub Icon SVG */
function GitHubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const PACKAGES = [
  {
    id: "law-25",
    icon: ShieldCheck,
    label: { fr: "Conformité Loi 25", en: "Law 25 Compliance" },
    tag: "[LLM_LOCAL_QC]",
    desc: { fr: "Zéro transfert hors province. 100% sur site.", en: "Zero out-of-province transfer. 100% on-premise." },
    color: "#f87171",
  },
  {
    id: "document-intelligence",
    icon: FileSearch,
    label: { fr: "Intelligence Documentaire", en: "Document Intelligence" },
    tag: "[RAG_MULTIDOC]",
    desc: { fr: "Extraction et synthèse de PDFs locaux avec sources.", en: "Extraction & synthesis of local PDFs with citations." },
    color: "#3b82f6",
  },
  {
    id: "support-automation",
    icon: LifeBuoy,
    label: { fr: "Automatisation Support", en: "Support Automation" },
    tag: "[TRIAGE_AGENT]",
    desc: { fr: "Triage et escalade intelligente sans cloud public.", en: "Intelligent triage & escalation without public cloud." },
    color: "#10b981",
  },
  {
    id: "media-generation",
    icon: Clapperboard,
    label: { fr: "Génération de Médias", en: "Media Generation" },
    tag: "[ON_PREM_GEN]",
    desc: { fr: "Création d'images et scripts sur GPU interne.", en: "Image and script creation on internal GPUs." },
    color: "#a855f7",
  },
];

const COPY = {
  fr: {
    orgEyebrow: "L'organisation",
    orgTitle: "IA souveraine pour entreprises et développeurs.",
    orgLead: "Krizaka conçoit des systèmes d'IA que vous possédez vraiment : ils tournent sur votre infrastructure, vos données n'en sortent jamais. De l'ingénierie cognitive taillée pour votre métier — pas une solution générique de plus.",
    points: [
      { icon: ShieldCheck, title: "Souverain par conception", desc: "Vos données restent chez vous. Conforme Loi 25 et aligné RGPD, sans effort." },
      { icon: Cpu, title: "Ingénierie cognitive", desc: "Des pipelines d'IA réglés pour votre contexte, vos documents, vos règles." },
      { icon: Building2, title: "À l'échelle d'une PME", desc: "Déployable et abordable pour une petite équipe — pas seulement pour les grands comptes." },
    ],
    productEyebrow: "Notre premier produit",
    productTitle: "Orasaka — le moteur d'orchestration",
    productTagline: "Le moteur d'orchestration IA souverain. Open source.",
    productSpecs: "Java 21 · Spring AI · 15 intercepteurs · multimodal. Une infrastructure cognitive que tu héberges toi-même — conçue au Québec.",
    productPrivacy: "Tes données ne quittent jamais ton réseau.",
    ctaExplore: "Découvrir Orasaka",
    ctaDocs: "Documentation",
    ctaGithub: "Star sur GitHub",
  },
  en: {
    orgEyebrow: "The organization",
    orgTitle: "Sovereign AI for enterprises and developers.",
    orgLead: "Krizaka builds AI systems you genuinely own: they run on your infrastructure and your data never leaves it. Cognitive engineering shaped to your business — not one more generic tool.",
    points: [
      { icon: ShieldCheck, title: "Sovereign by design", desc: "Your data stays with you. Law 25 compliant and GDPR-grade, by construction." },
      { icon: Cpu, title: "Cognitive engineering", desc: "AI pipelines tuned to your context, your documents, your rules." },
      { icon: Building2, title: "Right-sized for SMBs", desc: "Deployable and affordable for a small team — not just for the enterprise." },
    ],
    productEyebrow: "Our first product",
    productTitle: "Orasaka — the orchestration engine",
    productTagline: "The sovereign AI orchestration engine. Open source.",
    productSpecs: "Java 21 · Spring AI · 15 interceptors · multimodal. A cognitive infrastructure you self-host — built in Québec.",
    productPrivacy: "Your data never leaves your network.",
    ctaExplore: "Explore Orasaka",
    ctaDocs: "Documentation",
    ctaGithub: "Star on GitHub",
  },
} as const;

export default function HeroSection() {
  const { locale } = useI18n();
  const c = COPY[locale];

  const [hoveredPkg, setHoveredPkg] = useState<number | null>(null);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        padding: "140px 24px 80px",
        maxWidth: "1120px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* High-tech corner telemetry labels */}
      <div 
        style={{
          position: "absolute",
          top: "56px",
          left: "24px",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "8.5px",
          color: "var(--kz-text-muted)",
          letterSpacing: "0.18em",
          pointerEvents: "none",
          zIndex: 1,
        }}
        className="hidden md:block opacity-65"
      >
        SYS_STATUS: ACTIVE // COGNITIVE_CONDUIT_STABLE
      </div>
      <div 
        style={{
          position: "absolute",
          top: "56px",
          right: "24px",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "8.5px",
          color: "var(--kz-text-muted)",
          letterSpacing: "0.18em",
          pointerEvents: "none",
          zIndex: 1,
        }}
        className="hidden md:block opacity-65"
      >
        LOC: 45.5017° N, 73.5673° W [QC]
      </div>

      {/* ─── Ambient glow ─── */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(900px, 95vw)",
          height: "400px",
          background: "radial-gradient(ellipse at center, hsla(217, 92%, 50%, 0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* ─── Two-column Header Block ─── */}
      <motion.div
        className="intro-header-grid"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          alignItems: "center",
          gap: "48px",
          marginBottom: "56px",
        }}
      >
        <div style={{ maxWidth: "680px" }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--kz-accent)",
              marginBottom: "14px",
            }}
          >
            {c.orgEyebrow}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2.2rem, 5.5vw, 3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: "var(--kz-text-primary)",
              marginBottom: "20px",
            }}
          >
            {c.orgTitle}
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "var(--kz-text-secondary)",
              margin: 0,
            }}
          >
            {c.orgLead}
          </p>

          {/* Interactive, Discreet Packages selector right under intro text */}
          <div
            className="home-packages-ribbon"
            style={{
              marginTop: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: hoveredPkg !== null ? PACKAGES[hoveredPkg].color : "var(--kz-accent)",
                  boxShadow: hoveredPkg !== null ? `0 0 8px ${PACKAGES[hoveredPkg].color}` : "0 0 8px var(--kz-accent)",
                  transition: "all 200ms ease",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "var(--kz-text-muted)",
                  textTransform: "uppercase",
                }}
              >
                {locale === "fr" ? "CHÂSSIS COGNITIFS ENTREPRISES" : "ENTERPRISE COGNITIVE CHASSIS"}
              </span>
            </div>

            {/* Pills Row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {PACKAGES.map((pkg, idx) => {
                const PkgIcon = pkg.icon;
                const isHovered = hoveredPkg === idx;
                return (
                  <Link
                    key={pkg.id}
                    href="/solutions"
                    onMouseEnter={() => setHoveredPkg(idx)}
                    onMouseLeave={() => setHoveredPkg(null)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "var(--kz-radius-sm)",
                      background: isHovered
                        ? `color-mix(in srgb, ${pkg.color} 8%, var(--kz-surface-2))`
                        : "var(--kz-surface-1)",
                      border: `1px solid ${isHovered ? pkg.color : "var(--kz-border-subtle)"}`,
                      boxShadow: isHovered ? `0 0 16px ${pkg.color}15` : "none",
                      color: isHovered ? "var(--kz-text-primary)" : "var(--kz-text-secondary)",
                      textDecoration: "none",
                      fontSize: "12px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <PkgIcon size={14} style={{ color: isHovered ? pkg.color : "var(--kz-text-secondary)", transition: "color 200ms ease" }} />
                    <span>{pkg.label[locale]}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "8.5px",
                        color: isHovered ? pkg.color : "var(--kz-text-muted)",
                        marginLeft: "4px",
                        opacity: 0.8,
                      }}
                    >
                      {pkg.tag}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* HUD details ticker line */}
            <div
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "11px",
                color: hoveredPkg !== null ? "var(--kz-text-secondary)" : "var(--kz-text-muted)",
                minHeight: "18px",
                transition: "color 200ms ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: hoveredPkg !== null ? PACKAGES[hoveredPkg].color : "var(--kz-accent)", opacity: 0.8 }}>&gt;_</span>
              <span style={{ transition: "all 200ms ease" }}>
                {hoveredPkg !== null
                  ? PACKAGES[hoveredPkg].desc[locale]
                  : locale === "fr"
                  ? "Survolez un châssis pour inspecter les garanties de souveraineté."
                  : "Hover a chassis to inspect sovereignty specifications."}
              </span>
            </div>
          </div>
        </div>
        
        <div
          className="intro-illustration"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SovereigntyPerimeter width={340} height={260} />
        </div>
      </motion.div>

      {/* ─── Bento point cards ─── */}
      <div
        className="intro-points-grid"
        style={{
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          marginBottom: "72px",
        }}
      >
        {c.points.map((p, idx) => {
          const Icon = p.icon;
          return (
            <motion.article
              key={idx}
              className="intro-point-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "24px",
                borderRadius: "var(--kz-radius-lg)",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                transition: "border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--kz-border-subtle)",
                  background: "var(--kz-surface-2)",
                  color: "var(--kz-accent)",
                }}
              >
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--kz-text-primary)",
                  letterSpacing: "-0.01em",
                  margin: 0,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: "13.5px",
                  lineHeight: 1.6,
                  color: "var(--kz-text-secondary)",
                  margin: 0,
                }}
              >
                {p.desc}
              </p>
            </motion.article>
          );
        })}
      </div>

      {/* ─── Unified Orasaka Product Banner ─── */}
      <motion.div
        className="product-hero-banner-new"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 240px",
          alignItems: "center",
          gap: "48px",
          padding: "48px 0",
          borderTop: "1px solid var(--kz-border-subtle)",
          borderBottom: "1px solid var(--kz-border-subtle)",
          background: "transparent",
          position: "relative",
        }}
      >
        {/* Decorative corner accents for a premium touch */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "12px", height: "12px", borderTop: "2px solid var(--kz-accent)", borderLeft: "2px solid var(--kz-accent)", opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "12px", height: "12px", borderBottom: "2px solid var(--kz-accent)", borderRight: "2px solid var(--kz-accent)", opacity: 0.6 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--kz-accent)",
            }}
          >
            {c.productEyebrow}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {c.productTitle}
          </h2>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--kz-text-primary)",
              opacity: 0.9,
              margin: 0,
            }}
          >
            {c.productTagline}
          </p>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.65,
              color: "var(--kz-text-secondary)",
              margin: 0,
              maxWidth: "600px",
            }}
          >
            {c.productSpecs}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13.5px",
              color: "var(--kz-accent)",
              fontWeight: 600,
            }}
          >
            <Lock size={14} />
            {c.productPrivacy}
          </div>

          {/* CTA Button Row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <Link
              href="/products/orasaka"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: 600,
                background: "var(--kz-accent)",
                color: "var(--kz-on-accent)",
                textDecoration: "none",
                transition: "background-color 150ms ease, transform 150ms ease",
              }}
              className="btn-premium-primary"
            >
              {c.ctaExplore}
              <ArrowRight size={14} strokeWidth={2} />
            </Link>

            <Link
              href="/products/orasaka/getting-started/101"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: 500,
                background: "var(--kz-surface-2)",
                border: "1px solid var(--kz-border-subtle)",
                color: "var(--kz-text-secondary)",
                textDecoration: "none",
                transition: "border-color 150ms ease, color 150ms ease",
              }}
            >
              <BookOpen size={14} />
              {c.ctaDocs}
            </Link>

            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: 500,
                background: "var(--kz-surface-2)",
                border: "1px solid var(--kz-border-subtle)",
                color: "var(--kz-text-secondary)",
                textDecoration: "none",
                transition: "border-color 150ms ease, color 150ms ease",
              }}
            >
              <GitHubIcon size={14} />
              {c.ctaGithub}
            </a>
          </div>
        </div>

        {/* Floating animated Orasaka product logo on the right */}
        <div
          className="product-logo-container-new premium-floating-logo"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "220px",
            height: "220px",
            margin: "0 auto",
          }}
        >
          {/* Ethereal blue ambient backdrop matching the processor chip */}
          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 72%)",
              opacity: 0.16,
              filter: "blur(32px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          {/* Thin glowing blue containment ring */}
          <div
            style={{
              position: "absolute",
              width: "230px",
              height: "230px",
              borderRadius: "50%",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <OrasakaLogo size={220} />
          </div>
        </div>
      </motion.div>

      <style>{`
        #hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.85;
          mask-image: radial-gradient(circle at 50% 30%, black 50%, transparent 95%);
          -webkit-mask-image: radial-gradient(circle at 50% 30%, black 50%, transparent 95%);
          pointer-events: none;
          z-index: 0;
        }
        .intro-point-card:hover {
          border-color: var(--kz-accent) !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 35px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.08));
        }
        @keyframes float-tilt {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-8px) rotate(2deg) scale(1.03);
          }
        }
        .premium-floating-logo {
          animation: float-tilt 6s ease-in-out infinite;
        }
        .btn-premium-primary {
          background: linear-gradient(135deg, var(--kz-accent) 0%, var(--kz-accent-hover) 100%) !important;
          box-shadow: 0 4px 14px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.2)) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .btn-premium-primary:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 8px 28px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.45)) !important;
        }
        /* Premium, discreet background woven into the product banner */
        .product-hero-banner-new::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(440px 180px at 86% 50%, rgba(59, 130, 246, 0.05), transparent 72%),
            radial-gradient(circle at 1px 1px, var(--kz-border-subtle) 1px, transparent 0);
          background-size: auto, 22px 22px;
          -webkit-mask-image: radial-gradient(75% 110% at 82% 50%, #000 0%, transparent 78%);
          mask-image: radial-gradient(75% 110% at 82% 50%, #000 0%, transparent 78%);
          opacity: 0.55;
          pointer-events: none;
          z-index: 0;
        }
        .product-hero-banner-new > * {
          position: relative;
          z-index: 1;
        }
        @media (max-width: 820px) {
          .intro-header-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .product-hero-banner-new {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 32px 0 !important;
          }
          .product-logo-container-new {
            width: 180px !important;
            height: 180px !important;
          }
        }
      `}</style>
    </section>
  );
}

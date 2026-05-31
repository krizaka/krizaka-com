"use client";

import Link from "next/link";
import { ArrowRight, Boxes, Layers, Cpu } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { PACKAGES, type Package, type LocalizedText } from "@/lib/packages-data";
import { motion } from "framer-motion";
import CarrierPigeonBot from "./illustrations/CarrierPigeonBot";
import { FalconAvatar, MascotStyles } from "./illustrations/MascotAvatars";

const MotionLink = motion.create(Link);

function PackageCard({ pkg, idx }: { pkg: Package; idx: number }) {
  const { t, locale } = useI18n();
  const L = (x: LocalizedText) => x[locale];

  const getInterceptorColor = (name: string) => {
    if (name.includes("Context") || name.includes("Refiner")) return "#0ea5e9"; // Sky Blue (Context)
    if (name.includes("Rag") || name.includes("Mcp")) return "#a855f7"; // Violet (Knowledge)
    if (name.includes("Audit") || name.includes("Guardrails") || name.includes("Router")) return "#f59e0b"; // Amber (Governance)
    if (name.includes("Memory") || name.includes("Media")) return "#10b981"; // Emerald (Processing)
    return "#3b82f6"; // Indigo (Core)
  };

  const renderMascot = (id: string) => {
    switch (id) {
      case "prospection":
        return <FalconAvatar />;
      default:
        return null;
    }
  };

  return (
    <motion.article
      className="pkg-card"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "32px 28px",
        borderRadius: "20px",
        background: "var(--kz-surface-1)",
        border: "1px solid var(--kz-border-subtle)",
        transition: "border-color 250ms ease, box-shadow 250ms ease, transform 250ms ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative accent card glow */}
      <div
        className="card-hover-glow"
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, var(--kz-accent-soft) 0%, transparent 70%)",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 300ms ease",
          zIndex: 0,
        }}
      />

      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "16px", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--kz-surface-2)", border: "1px solid var(--kz-border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Boxes size={18} strokeWidth={1.8} style={{ color: "var(--kz-accent)" }} />
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--kz-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              {L(pkg.name)}
            </h3>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono, monospace)", color: "var(--kz-text-muted)", letterSpacing: "0.02em" }}>
              Orazaka Package
            </span>
          </div>
        </div>

        {/* Animated Mascot Bird Avatar */}
        <div style={{ flexShrink: 0, marginTop: "-12px", marginRight: "-12px" }} className="card-mascot-avatar">
          {renderMascot(pkg.id)}
        </div>
      </div>

      {/* Problem / Solution Copy */}
      <p style={{ fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6, marginBottom: "24px", minHeight: "44px", zIndex: 1 }}>
        {L(pkg.problem)}
      </p>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--kz-border-subtle)", marginBottom: "20px", width: "100%", zIndex: 1 }} />

      {/* Pipeline Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-mono, monospace)", fontSize: "10px", fontWeight: 700, color: "var(--kz-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px", zIndex: 1 }}>
        <Cpu size={12} strokeWidth={2} style={{ color: "var(--kz-accent)" }} />
        <span>Pipeline Interceptors</span>
      </div>

      {/* Interactive Vertical Timeline */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "18px", paddingLeft: "24px", marginBottom: "32px", flex: 1, zIndex: 1 }} className="pipeline-timeline">
        {/* Vertical Track Line */}
        <div style={{ position: "absolute", left: "6px", top: "8px", bottom: "8px", width: "1px", background: "var(--kz-border-strong)", opacity: 0.6 }} />
        
        {/* Animated travelling dot */}
        <div className="pipeline-flow-dot" style={{
          position: "absolute",
          left: "4px",
          top: "0px",
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: "var(--kz-accent)",
          boxShadow: "0 0 8px var(--kz-accent), 0 0 15px var(--kz-accent)",
          pointerEvents: "none",
          opacity: 0,
        }} />

        {pkg.interceptors.map((it) => {
          const color = getInterceptorColor(it.name);
          return (
            <div key={it.name} style={{ position: "relative", display: "flex", flexDirection: "column", gap: "3px" }} className="pipeline-step">
              {/* Node Dot */}
              <div
                className="pipeline-node"
                style={{
                  position: "absolute",
                  left: "-23px",
                  top: "4px",
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "2px solid var(--kz-surface-1)",
                  boxShadow: `0 0 0 1px var(--kz-border-subtle), 0 0 8px ${color}35`,
                  zIndex: 2,
                  transition: "transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease",
                }}
              />
              
              <code style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: 700, color: "var(--kz-text-primary)", letterSpacing: "-0.01em", transition: "color 150ms ease" }} className="interceptor-code">
                {it.name}
              </code>
              <span style={{ fontSize: "12px", color: "var(--kz-text-secondary)", lineHeight: 1.45, transition: "color 150ms ease" }} className="interceptor-role">
                {L(it.role)}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA link */}
      <div style={{ zIndex: 1 }}>
        <MotionLink
          href={`/products/orazaka/usecases/${pkg.useCaseSlug}`}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.15 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "var(--kz-accent)", textDecoration: "none" }}
        >
          {t.packages.viewUseCase} <ArrowRight size={13} strokeWidth={2} />
        </MotionLink>
      </div>
    </motion.article>
  );
}

export default function PackagesSection({ full = false }: { full?: boolean }) {
  const { t } = useI18n();
  const list = full ? PACKAGES : PACKAGES.slice(0, 4);

  return (
    <motion.section
      id="packages"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ padding: "80px 24px 112px", maxWidth: "1120px", margin: "0 auto" }}
    >
      {/* Mascot Header Anchor */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "48px" }}>
        <div style={{ marginBottom: "8px", position: "relative" }} className="mascot-header-wrapper">
          <CarrierPigeonBot size={110} />
        </div>
        
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: 600, color: "var(--kz-accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>
            {t.packages.sectionLabel}
          </span>
          <h2 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--kz-text-primary)", marginBottom: "16px", maxWidth: "680px", lineHeight: 1.15 }}>
            {t.packages.sectionTitle}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--kz-text-secondary)", maxWidth: "620px", lineHeight: 1.6 }}>
            {t.packages.sectionDesc}
          </p>
        </div>
      </div>

      {/* Concept explainer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "flex-start",
          maxWidth: "760px",
          margin: "0 auto 48px",
          padding: "20px 24px",
          borderRadius: "16px",
          background: "var(--kz-surface-1)",
          border: "1px solid var(--kz-border-subtle)",
          boxShadow: "var(--kz-shadow-sm)",
        }}
      >
        <Layers size={18} strokeWidth={1.8} style={{ color: "var(--kz-accent)", flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.65 }}>
          {t.packages.concept}
        </p>
      </motion.div>

      <div className="pkg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {list.map((pkg, idx) => (
          <PackageCard key={pkg.id} pkg={pkg} idx={idx} />
        ))}
      </div>

      {/* Availability note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "40px" }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--kz-text-secondary)" }}>
          <span aria-hidden style={{ width: "6px", height: "6px", borderRadius: "9999px", background: "var(--kz-accent)" }} />
          {t.packages.manualNote}
        </span>
      </motion.div>

      {!full && (
        <div style={{ textAlign: "center", marginTop: "36px" }}>
          <Link href="/products/orazaka/usecases" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "var(--kz-accent)", textDecoration: "none" }}>
            {t.packages.viewAll} <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      )}

      <style>{`
        /* Premium Card Interaction Styles */
        .pkg-card:hover {
          border-color: var(--kz-accent) !important;
          box-shadow: 0 12px 40px var(--kz-accent-soft), var(--kz-shadow-lg) !important;
          transform: translateY(-4px) !important;
        }

        .pkg-card:hover .card-hover-glow {
          opacity: 1 !important;
        }

        /* Highlight timeline nodes on card hover */
        .pkg-card:hover .pipeline-node {
          transform: scale(1.15);
          box-shadow: 0 0 10px currentColor !important;
        }

        .pkg-card:hover .interceptor-code {
          color: var(--kz-text-primary) !important;
        }

        /* Flow Dot Travelling Animation on Card Hover */
        @keyframes timeline-flow {
          0% {
            top: 0px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        .pkg-card:hover .pipeline-flow-dot {
          animation: timeline-flow 1.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }

        /* Fade-in layout adjustments for elements on hover */
        .pkg-card:hover .interceptor-role {
          color: var(--kz-text-primary) !important;
        }

        /* Mascot hover effects */
        .mascot-header-wrapper {
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .mascot-header-wrapper:hover {
          transform: scale(1.05) translateY(-2px);
        }

        /* Reduced Motion Fallbacks */
        @media (prefers-reduced-motion: reduce) {
          .pkg-card, .pipeline-node, .pipeline-flow-dot, .mascot-header-wrapper {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
          .pkg-card:hover {
            transform: none !important;
            box-shadow: none !important;
          }
          .pkg-card:hover .pipeline-flow-dot {
            animation: none !important;
          }
        }
      `}</style>
      <MascotStyles />
    </motion.section>
  );
}

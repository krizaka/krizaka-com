"use client";

import Link from "next/link";
import { ArrowRight, Boxes, Layers } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { PACKAGES, type Package, type LocalizedText } from "@/lib/packages-data";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

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
        padding: "28px 24px",
        borderRadius: "18px",
        background: "var(--kz-surface-1)",
        border: "1px solid var(--kz-border-subtle)",
        transition: "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "var(--kz-accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Boxes size={17} strokeWidth={1.6} style={{ color: "var(--kz-accent)" }} />
        </div>
        <h3 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "16px", fontWeight: 650, color: "var(--kz-text-primary)", letterSpacing: "-0.02em" }}>
          {L(pkg.name)}
        </h3>
      </div>

      <p style={{ fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6, marginBottom: "18px" }}>
        {L(pkg.problem)}
      </p>

      {/* Visual Interceptor Chain Flow */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px", alignItems: "center", margin: "0 0 20px" }}>
        {pkg.interceptors.map((it, i) => {
          const color = getInterceptorColor(it.name);
          return (
            <div key={it.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "10px",
                fontWeight: 700,
                color: color,
                background: `color-mix(in srgb, ${color} 8%, var(--kz-surface-2))`,
                border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
                padding: "3px 8px",
                borderRadius: "6px"
              }}
              title={L(it.role)}>
                {it.name}
              </span>
              {i < pkg.interceptors.length - 1 && (
                <span style={{ color: "var(--kz-text-muted)", fontSize: "10px" }}>→</span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "10px", fontWeight: 600, color: "var(--kz-text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
        {t.packages.composedOf}
      </div>
      <ul style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px", flex: 1 }}>
        {pkg.interceptors.map((it) => (
          <li key={it.name} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <code style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: 600, color: "var(--kz-text-primary)" }}>
              {it.name}
            </code>
            <span style={{ fontSize: "12px", color: "var(--kz-text-muted)", lineHeight: 1.45 }}>
              {L(it.role)}
            </span>
          </li>
        ))}
      </ul>

      <MotionLink
        href={`/use-cases/${pkg.useCaseSlug}`}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.15 }}
        style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12.5px", fontWeight: 600, color: "var(--kz-accent)", textDecoration: "none" }}
      >
        {t.packages.viewUseCase} <ArrowRight size={12} strokeWidth={2} />
      </MotionLink>
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
      style={{ padding: "112px 24px", maxWidth: "1120px", margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: 600, color: "var(--kz-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
          {t.packages.sectionLabel}
        </span>
        <h2 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--kz-text-primary)", marginBottom: "12px", maxWidth: "620px" }}>
          {t.packages.sectionTitle}
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--kz-text-muted)", maxWidth: "620px", lineHeight: 1.6 }}>
          {t.packages.sectionDesc}
        </p>
      </div>

      {/* Concept explainer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          display: "flex",
          gap: "14px",
          alignItems: "flex-start",
          maxWidth: "760px",
          margin: "0 auto 36px",
          padding: "18px 20px",
          borderRadius: "14px",
          background: "var(--kz-surface-1)",
          border: "1px solid var(--kz-border-subtle)",
        }}
      >
        <Layers size={18} strokeWidth={1.6} style={{ color: "var(--kz-accent)", flexShrink: 0, marginTop: "2px" }} />
        <p style={{ fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.65 }}>
          {t.packages.concept}
        </p>
      </motion.div>

      <div className="pkg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
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
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "28px" }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "var(--kz-text-secondary)" }}>
          <span aria-hidden style={{ width: "7px", height: "7px", borderRadius: "9999px", background: "var(--kz-accent)" }} />
          {t.packages.manualNote}
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "var(--kz-text-muted)" }}>
          <span aria-hidden style={{ width: "7px", height: "7px", borderRadius: "9999px", background: "var(--kz-text-muted)" }} />
          {t.packages.cloudNote}
        </span>
      </motion.div>

      {!full && (
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <Link href="/use-cases" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "var(--kz-accent)", textDecoration: "none" }}>
            {t.packages.viewAll} <ArrowRight size={13} strokeWidth={2} />
          </Link>
        </div>
      )}

      <style>{`
        .pkg-card:hover {
          border-color: var(--kz-accent) !important;
          box-shadow: 0 8px 30px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.04)) !important;
          transform: translateY(-3px) !important;
        }
      `}</style>
    </motion.section>
  );
}

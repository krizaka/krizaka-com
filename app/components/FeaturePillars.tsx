"use client";

import Link from "next/link";
import { Shield, Layers, Shuffle, Code2, CheckCircle2 } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { motion } from "framer-motion";

const PILLAR_ICONS = [Shield, Layers, Shuffle, Code2, CheckCircle2];

const PILLAR_LINKS = [
  "/products/orasaka/core-features/auth",
  "/products/orasaka/architecture/core",
  "/products/orasaka/architecture/models",
  "https://github.com/krizaka",
  "/products/orasaka/core-features/master_features",
];

export default function FeaturePillars() {
  const { t } = useI18n();

  return (
    <motion.section
      id="features"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        padding: "112px 24px",
        maxWidth: "1120px",
        margin: "0 auto",
      }}
    >
      {/* ─── Section header ─── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "48px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--kz-accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {t.pillars.sectionLabel}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            maxWidth: "560px",
          }}
        >
          {t.pillars.sectionTitle}
        </h2>
      </div>

      {/* ─── Pillar grid ─── */}
      <div
        className="pillars-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "12px",
        }}
      >
        {t.pillars.items.map((item, idx) => {
          const Icon = PILLAR_ICONS[idx];
          const href = PILLAR_LINKS[idx];
          const isExternal = href.startsWith("http");

          const CardContent = (
            <motion.div
              className="pillar-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
              style={{
                position: "relative",
                padding: "28px 24px 24px",
                borderRadius: "16px",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "var(--kz-accent-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} strokeWidth={1.5} style={{ color: "var(--kz-accent)" }} />
              </div>

              {/* Keyword */}
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: "var(--kz-accent)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                {item.keyword}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "16px",
                  fontWeight: 650,
                  color: "var(--kz-text-primary)",
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "13.5px",
                  color: "var(--kz-text-muted)",
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {item.desc}
              </p>
            </motion.div>
          );

          if (isExternal) {
            return (
              <a
                key={idx}
                id={`pillar-card-${idx}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                {CardContent}
              </a>
            );
          }

          return (
            <Link
              key={idx}
              id={`pillar-card-${idx}`}
              href={href}
              style={{ textDecoration: "none" }}
            >
              {CardContent}
            </Link>
          );
        })}
      </div>

      {/* Responsive */}
      <style>{`
        .pillar-card:hover {
          border-color: var(--kz-accent) !important;
          box-shadow: 0 8px 30px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.04)) !important;
          transform: translateY(-3px) !important;
        }
        @media (max-width: 640px) {
          .pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.section>
  );
}

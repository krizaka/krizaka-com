"use client";

import { ExternalLink, ShieldAlert } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { motion } from "framer-motion";

const COMPLIANCE_LINKS = [
  "https://www.cai.gouv.qc.ca/espace-evolutif-modernisation-lois/",
  "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
  "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
];

const TAG_COLORS = [
  { bg: "rgba(16, 185, 129, 0.08)", fg: "#10b981" },
  { bg: "rgba(59, 130, 246, 0.08)", fg: "var(--kz-accent)" },
  { bg: "rgba(245, 158, 11, 0.08)", fg: "#f59e0b" },
];

export default function ComplianceSection() {
  const { t } = useI18n();

  return (
    <motion.section
      id="compliance"
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
      {/* ─── Section Header ─── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "56px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--kz-accent)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "14px",
          }}
        >
          {t.compliance.sectionLabel}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            lineHeight: 1.1,
            marginBottom: "12px",
            maxWidth: "700px",
          }}
        >
          {t.compliance.sectionTitle}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.3rem, 3.5vw, 1.85rem)",
            fontWeight: 600,
            color: "var(--kz-text-muted)",
            margin: 0,
          }}
        >
          {t.compliance.sectionSub}
        </p>
      </div>

      {/* ─── Compliance grid ─── */}
      <div
        className="compliance-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        {t.compliance.items.map((item, idx) => {
          const color = TAG_COLORS[idx];
          const link = COMPLIANCE_LINKS[idx];

          return (
            <motion.article
              key={idx}
              className="compliance-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              style={{
                padding: "36px 32px 32px",
                borderRadius: "var(--kz-radius-xl)",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                transition: "border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease",
              }}
            >
              {/* Tag Badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignSelf: "flex-start",
                  padding: "5px 12px",
                  borderRadius: "var(--kz-radius-sm)",
                  background: color.bg,
                  color: color.fg,
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {item.tag}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "18px",
                  fontWeight: 750,
                  color: "var(--kz-text-primary)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                  lineHeight: 1.35,
                }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--kz-text-secondary)",
                  lineHeight: 1.65,
                  flex: 1,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>

              {/* External CTA Link */}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--kz-accent)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                className="compliance-link"
              >
                {item.cta}
                <ExternalLink size={13} strokeWidth={2.5} />
              </a>
            </motion.article>
          );
        })}
      </div>

      {/* ─── Open Source / GitHub Audit Banner ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          padding: "20px",
          borderRadius: "var(--kz-radius-lg)",
          background: "var(--kz-surface-1)",
          border: "1px solid var(--kz-border-subtle)",
          maxWidth: "600px",
          margin: "0 auto",
          boxShadow: "var(--kz-shadow-sm)",
        }}
      >
        <ShieldAlert size={18} style={{ color: "var(--kz-accent)", flexShrink: 0 }} />
        <p
          style={{
            fontSize: "13.5px",
            color: "var(--kz-text-secondary)",
            margin: 0,
          }}
        >
          {t.compliance.openSourceNote}{" "}
          <a
            href="https://github.com/krizaka"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--kz-accent)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {t.compliance.auditOnGithub}
          </a>
        </p>
      </motion.div>

      <style>{`
        .compliance-card:hover {
          border-color: var(--kz-accent) !important;
          transform: translateY(-4px);
          box-shadow: 0 10px 30px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.04));
        }
        .compliance-link:hover {
          color: var(--kz-accent-hover) !important;
        }
        @media (max-width: 768px) {
          .compliance-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </motion.section>
  );
}


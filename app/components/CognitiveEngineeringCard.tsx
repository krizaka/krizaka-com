"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cpu } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { OwlSVG } from "./OwlSVG";

/* ─── Cognitive Engineering card ─── */
export function CognitiveEngineeringCard() {
  const { t } = useI18n();
  return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="showcase-card"
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "36px",
          alignItems: "center",
          padding: "32px 40px",
          borderRadius: "20px",
          border: "1px solid var(--kz-border-subtle)",
          background: "color-mix(in srgb, var(--kz-surface-1) 85%, transparent)",
          backdropFilter: "blur(20px)",
          transition: "border-color 300ms ease, box-shadow 300ms ease",
          marginBottom: "56px",
        }}
      >
        {/* Mascot column */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.06 }}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "var(--kz-surface-1)",
              border: "1.5px solid #a78bfa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(167, 139, 250, 0.08), inset 0 0 8px rgba(167, 139, 250, 0.06)",
              cursor: "pointer",
            }}
          >
            <OwlSVG size={68} />
          </motion.div>
        </div>

        {/* Content column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ color: "#a78bfa", display: "flex" }}>
              <Cpu size={16} strokeWidth={2} />
            </span>
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
              {t.engineShowcase.sectionLabel}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--kz-text-primary)",
              marginBottom: "10px",
              letterSpacing: "-0.01em",
            }}
          >
            {t.engineShowcase.cogTitle}
          </h3>

          <p
            style={{
              fontSize: "14px",
              color: "var(--kz-text-secondary)",
              lineHeight: 1.6,
              marginBottom: "24px",
              maxWidth: "520px",
            }}
          >
            {t.engineShowcase.cogDesc}
          </p>

          {/* CTA */}
          <motion.div
            initial="initial"
            whileHover="hover"
            style={{ display: "inline-block" }}
          >
            <Link
              href="/products/orazaka/ingenierie-cognitive"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                position: "relative",
                padding: "6px 0",
                cursor: "pointer",
              }}
            >
              <motion.span
                variants={{
                  initial: { color: "var(--kz-accent)" },
                  hover: { color: "var(--kz-accent-hover)" },
                }}
                transition={{ duration: 0.2 }}
              >
                {t.engineShowcase.cogCta}
              </motion.span>
              <motion.span
                variants={{
                  initial: { x: 0, color: "var(--kz-accent)" },
                  hover: { x: 4, color: "var(--kz-accent-hover)" },
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <ArrowRight size={14} strokeWidth={2.2} />
              </motion.span>
              <motion.span
                variants={{
                  initial: { scaleX: 0 },
                  hover: { scaleX: 1 },
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "1.5px",
                  background: "var(--kz-accent)",
                  transformOrigin: "left",
                }}
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>
  );
}

"use client";

import "./engine-showcase.css";
import { useI18n } from "./I18nProvider";
import { CognitiveEngineeringCard } from "./CognitiveEngineeringCard";
import { motion } from "framer-motion";

export default function EngineShowcaseSection() {
  const { t } = useI18n();

  return (
    <section
      id="technology-showcase"
      style={{
        padding: "80px 24px 120px",
        maxWidth: "960px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* ─── Section header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          textAlign: "left",
          marginBottom: "48px",
        }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--kz-accent)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {t.engineShowcase.sectionLabel}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 4.5vw, 2.3rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            lineHeight: 1.15,
            marginBottom: "16px",
            maxWidth: "600px",
          }}
        >
          {t.engineShowcase.sectionTitle}
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--kz-text-secondary)",
            lineHeight: 1.6,
            margin: "0",
            maxWidth: "560px",
          }}
        >
          {t.engineShowcase.sectionDesc}
        </p>
      </motion.div>

      {/* ─── Cognitive Engineering card ─── */}
      <CognitiveEngineeringCard />

    </section>
  );
}

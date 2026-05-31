"use client";

import { useState } from "react";
import { Plus, HelpCircle } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqSection() {
  const { t } = useI18n();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleItem = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  // Helper to format structured multi-paragraph and bulleted responses
  const formatAnswer = (text: string) => {
    return text.split("\n\n").map((paragraph, pIdx) => {
      if (paragraph.startsWith("- ") || paragraph.startsWith("• ")) {
        const items = paragraph.split("\n").map(li => li.replace(/^[-•]\s*/, ""));
        return (
          <ul key={pIdx} style={{ margin: "8px 0 16px 20px", padding: 0, listStyleType: "disc" }}>
            {items.map((item, iIdx) => (
              <li key={iIdx} style={{ marginBottom: "6px", fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={pIdx} style={{ margin: "0 0 12px 0", fontSize: "14px", color: "var(--kz-text-secondary)", lineHeight: 1.65 }}>
          {paragraph}
        </p>
      );
    });
  };

  return (
    <motion.section
      id="faq"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        padding: "112px 24px",
        maxWidth: "1120px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Background ambient light */}
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          right: "-40px",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--kz-accent-soft) 0%, transparent 70%)",
          opacity: 0.1,
          filter: "blur(50px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="faq-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "56px",
          alignItems: "start",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Column — Brand & Blueprint illustration */}
        <div style={{ position: "sticky", top: "100px" }} className="faq-intro-col">
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--kz-accent)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            {t.faq.sectionLabel}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 2.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              lineHeight: 1.1,
              marginBottom: "18px",
            }}
          >
            {t.faq.sectionTitle}
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--kz-text-secondary)",
              lineHeight: 1.65,
              margin: "0 0 32px 0",
              maxWidth: "460px",
            }}
          >
            {t.faq.sectionDesc}
          </p>

          {/* Premium graphic outline blueprint */}
          <div
            className="faq-blueprint"
            style={{
              border: "1px dashed var(--kz-border-strong)",
              borderRadius: "20px",
              padding: "24px",
              background: "linear-gradient(135deg, var(--kz-surface-1), transparent)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <HelpCircle size={18} style={{ color: "var(--kz-accent)" }} />
              <span style={{ fontSize: "12px", fontFamily: "var(--font-mono, monospace)", fontWeight: 700, color: "var(--kz-text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Krizaka Knowledge Base
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--kz-text-muted)", lineHeight: 1.6, margin: 0 }}>
              Orasaka orchestrates 15 pluggable interceptors locally. If you have inquiries regarding deployment topology, clustering, or security sandboxes, explore our developer documentation.
            </p>
          </div>
        </div>

        {/* Right Column — Framer Motion Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {t.faq.items.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                style={{
                  borderRadius: "16px",
                  background: "var(--kz-surface-1)",
                  border: isOpen ? "1px solid var(--kz-accent)" : "1px solid var(--kz-border-subtle)",
                  boxShadow: isOpen ? "0 8px 30px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.04))" : "none",
                  overflow: "hidden",
                  transition: "border-color 200ms ease, box-shadow 200ms ease",
                }}
              >
                <button
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "20px",
                    width: "100%",
                    padding: "22px 24px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    outline: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      letterSpacing: "-0.015em",
                      color: isOpen ? "var(--kz-accent)" : "var(--kz-text-primary)",
                      transition: "color 200ms ease",
                    }}
                  >
                    {item.q}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: isOpen ? "var(--kz-accent)" : "var(--kz-surface-2)",
                      color: isOpen ? "var(--kz-on-accent)" : "var(--kz-text-muted)",
                      transition: "background-color 200ms ease, color 200ms ease, transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                      transform: isOpen ? "rotate(135deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div
                        style={{
                          padding: "0 24px 24px 24px",
                          borderTop: "1px solid var(--kz-border-subtle)",
                          background: "var(--kz-surface-1)",
                        }}
                      >
                        <div style={{ height: "16px" }} />
                        {formatAnswer(item.a)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .faq-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .faq-intro-col {
            position: relative !important;
            top: 0 !important;
          }
          .faq-blueprint {
            display: none !important;
          }
        }
      `}</style>
    </motion.section>
  );
}

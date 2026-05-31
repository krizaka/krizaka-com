import Link from "next/link";
import {
  Megaphone,
  TrendingUp,
  Scale,
  Headphones,
  Building2,
  Heart,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "./I18nProvider";
import { motion } from "framer-motion";

const ICONS = [Megaphone, TrendingUp, Scale, Headphones, Building2, Heart];

const MotionLink = motion(Link);

export default function UseCasesSection() {
  const { t } = useI18n();

  return (
    <motion.section
      id="use-cases"
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
          {t.useCases.sectionLabel}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            marginBottom: "12px",
            maxWidth: "520px",
          }}
        >
          {t.useCases.sectionTitle}
        </h2>
        <p
          style={{
            fontSize: "14.5px",
            color: "var(--kz-text-muted)",
            maxWidth: "520px",
            lineHeight: 1.6,
          }}
        >
          {t.useCases.sectionDesc}
        </p>
      </div>

      {/* ─── Use case cards ─── */}
      <div
        className="uc-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "12px",
          marginBottom: "40px",
        }}
      >
        {t.useCases.items.slice(0, 3).map((item, idx) => {
          const Icon = ICONS[idx];
          return (
            <MotionLink
              key={item.slug}
              id={`uc-card-${item.slug}`}
              href={`/use-cases/${item.slug}`}
              className="uc-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                padding: "28px 24px 24px",
                borderRadius: "16px",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                textDecoration: "none",
                transition:
                  "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
              }}
            >
              {/* Industry tag */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: "var(--kz-accent-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    style={{ color: "var(--kz-accent)" }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--kz-accent)",
                  }}
                >
                  {item.industry}
                </span>
              </div>

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
                  marginBottom: "16px",
                }}
              >
                {item.desc}
              </p>

              {/* Interactive CSS Mockups */}
              {item.slug === "agences-marketing" && (
                <div style={{
                  margin: "14px 0 22px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "var(--kz-surface-2)",
                  border: "1px solid var(--kz-border-subtle)",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono, monospace)",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--kz-text-muted)", fontSize: "9px" }}>[PIPELINE ACTIVE]</span>
                      <span style={{ color: "var(--kz-accent)", fontWeight: 700 }}>Orasaka GenX</span>
                    </div>
                    <div style={{ padding: "6px 10px", background: "var(--kz-surface-0)", border: "1px solid var(--kz-border-subtle)", borderRadius: "6px", color: "var(--kz-text-secondary)" }}>
                      <span style={{ color: "var(--kz-accent)" }}>IN:</span> &quot;Brief de marque Krizaka.txt&quot;
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "6px", fontSize: "9px", color: "var(--kz-text-muted)" }}>
                      <span>SystemInject</span> • <span>Refiner</span> • <span>MediaGen</span>
                    </div>
                    <div style={{ padding: "8px 10px", background: "var(--kz-surface-1)", border: "1px solid rgba(59, 130, 246, 0.25)", borderRadius: "6px", color: "var(--kz-text-primary)", position: "relative" }}>
                      <span style={{ color: "var(--kz-status-success)", marginRight: "6px" }}>✓</span>
                      <span>Campagne_Sociale.md</span>
                      <span style={{ position: "absolute", right: "8px", top: "8px", fontSize: "9px", color: "var(--kz-accent)", background: "var(--kz-accent-soft)", padding: "1px 5px", borderRadius: "3px" }}>Copy</span>
                    </div>
                  </div>
                </div>
              )}

              {item.slug === "ventes-prospection" && (
                <div style={{
                  margin: "14px 0 22px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "var(--kz-surface-2)",
                  border: "1px solid var(--kz-border-subtle)",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono, monospace)",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--kz-text-primary)", fontWeight: 600 }}>Lead: corporate@krizaka.ca</span>
                      <span style={{ fontSize: "9px", background: "var(--kz-accent-soft)", color: "var(--kz-accent)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>HIGH PRIO</span>
                    </div>
                    <div style={{ height: "1px", background: "var(--kz-border-subtle)" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "var(--kz-text-secondary)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>• Localisation:</span>
                        <span style={{ color: "var(--kz-text-primary)" }}>Québec, CA</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>• Stack:</span>
                        <span style={{ color: "var(--kz-text-primary)" }}>Spring Boot, Next.js</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                      <span style={{ fontSize: "9px", color: "var(--kz-text-muted)" }}>CONFIDENCE:</span>
                      <div style={{ flex: 1, height: "6px", background: "var(--kz-surface-0)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: "94%", height: "100%", background: "linear-gradient(90deg, var(--kz-accent) 0%, var(--kz-status-success) 100%)" }} />
                      </div>
                      <span style={{ fontSize: "10px", color: "var(--kz-status-success)", fontWeight: 700 }}>94%</span>
                    </div>
                  </div>
                </div>
              )}

              {item.slug === "juridique-finance" && (
                <div style={{
                  margin: "14px 0 22px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "var(--kz-surface-2)",
                  border: "1px solid var(--kz-border-subtle)",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono, monospace)",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)"
                }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--kz-text-primary)", fontWeight: 650 }}>contrat_prets_v3.pdf</span>
                      <span style={{ color: "var(--kz-status-success)", background: "rgba(16, 185, 129, 0.08)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>VERIFIED</span>
                    </div>
                    <div style={{ height: "1px", background: "var(--kz-border-subtle)" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", color: "var(--kz-text-secondary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "var(--kz-status-success)" }}>✔</span>
                        <span>Loi 25 (Québec) : CONFORME</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: "var(--kz-status-success)" }}>✔</span>
                        <span>Souveraineté des Données : 100% LOCAL</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px", padding: "4px 8px", background: "var(--kz-surface-0)", borderRadius: "4px" }}>
                      <span style={{ color: "var(--kz-text-muted)", fontSize: "9px" }}>AUDIT TRAIL LOGGED</span>
                      <span style={{ color: "var(--kz-accent)" }}>[Details]</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Link indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "var(--kz-accent)",
                }}
              >
                {t.useCases.learnMore}
                <ArrowRight size={12} strokeWidth={2} />
              </div>
            </MotionLink>
          );
        })}
      </div>

      {/* ─── View All CTA ─── */}
      <div style={{ textAlign: "center" }}>
        <Link
          id="uc-view-all"
          href="/use-cases"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            borderRadius: "9999px",
            fontSize: "13px",
            fontWeight: 600,
            background: "var(--kz-surface-2)",
            border: "1px solid var(--kz-border-subtle)",
            color: "var(--kz-text-primary)",
            textDecoration: "none",
            fontFamily: "var(--font-display), system-ui, sans-serif",
            transition: "border-color 150ms ease, box-shadow 150ms ease",
          }}
        >
          {t.useCases.viewAll}
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>

      <style>{`
        .uc-card:hover {
          border-color: var(--kz-accent) !important;
          box-shadow: 0 8px 30px var(--kz-accent-glow-subtle, rgba(59, 130, 246, 0.04)) !important;
          transform: translateY(-3px) !important;
        }
        @media (max-width: 680px) {
          .uc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.section>
  );
}

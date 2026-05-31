"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { EDITIONS, type Edition, type LocalizedText } from "@/lib/editions-data";

export default function EditionsSection() {
  const { t, locale } = useI18n();
  const L = (x: LocalizedText) => x[locale];

  return (
    <section
      id="editions"
      style={{ padding: "112px 24px", maxWidth: "1120px", margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: 600, color: "var(--kz-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
          {t.editions.sectionLabel}
        </span>
        <h2 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--kz-text-primary)", marginBottom: "12px", maxWidth: "560px" }}>
          {t.editions.sectionTitle}
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--kz-text-muted)", maxWidth: "560px", lineHeight: 1.6 }}>
          {t.editions.sectionDesc}
        </p>
      </div>

      <div className="ed-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        {EDITIONS.map((e: Edition) => {
          const available = e.availability === "available";
          return (
            <article
              key={e.id}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                padding: "28px 26px",
                borderRadius: "18px",
                background: e.featured
                  ? "radial-gradient(130% 90% at 50% 0%, var(--kz-accent-soft), transparent 55%), var(--kz-surface-1)"
                  : "var(--kz-surface-1)",
                border: `1px solid ${e.featured ? "var(--kz-accent)" : "var(--kz-border-subtle)"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <h3 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--kz-text-primary)", letterSpacing: "-0.02em" }}>
                  {L(e.name)}
                </h3>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "9999px", background: available ? "var(--kz-accent-soft)" : "var(--kz-surface-2)", color: available ? "var(--kz-accent)" : "var(--kz-text-muted)", border: "1px solid var(--kz-border-subtle)" }}>
                  <span aria-hidden style={{ width: "6px", height: "6px", borderRadius: "9999px", background: available ? "var(--kz-accent)" : "var(--kz-text-muted)" }} />
                  {available ? t.editions.available : t.editions.waitlist}
                </span>
              </div>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--kz-text-primary)", marginBottom: "18px" }}>
                {L(e.tagline)}
              </p>

              <ul style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px", flex: 1 }}>
                {e.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.5 }}>
                    <Check size={14} strokeWidth={2} style={{ color: "var(--kz-accent)", marginTop: "3px", flexShrink: 0 }} />
                    {L(f)}
                  </li>
                ))}
              </ul>

              {e.ctaWaitlist ? (
                <Link href="/editions#waitlist" style={ctaStyle(true)}>
                  {t.editions.joinWaitlist} <ArrowRight size={14} strokeWidth={2} />
                </Link>
              ) : (
                <Link href={e.ctaHref} style={ctaStyle(true)}>
                  {L(e.cta)} <ArrowRight size={14} strokeWidth={2} />
                </Link>
              )}
            </article>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <Link href="/editions" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600, color: "var(--kz-accent)", textDecoration: "none" }}>
          {t.editions.compareAll} <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}

function ctaStyle(primary: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "11px 18px",
    borderRadius: "9999px",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "none",
    background: primary ? "var(--kz-accent)" : "var(--kz-surface-2)",
    color: primary ? "var(--kz-on-accent)" : "var(--kz-text-primary)",
    fontFamily: "var(--font-display), system-ui, sans-serif",
  };
}

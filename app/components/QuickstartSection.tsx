"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { useI18n } from "./I18nProvider";
import CopyCodeBlock from "./CopyCodeBlock";

const COMMANDS = ["npx orazaka install", "npx orazaka start", "npx orazaka dev"];

export default function QuickstartSection() {
  const { t } = useI18n();

  return (
    <section
      id="quickstart"
      style={{ padding: "80px 24px", maxWidth: "760px", margin: "0 auto", scrollMarginTop: "80px" }}
    >
      <div style={{ textAlign: "center", marginBottom: "28px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "11px", fontWeight: 600, color: "var(--kz-accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}>
          {t.quickstart.sectionLabel}
        </span>
        <h2 style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontSize: "clamp(1.4rem, 3.2vw, 2rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--kz-text-primary)", marginBottom: "10px" }}>
          {t.quickstart.sectionTitle}
        </h2>
        <p style={{ fontSize: "14.5px", color: "var(--kz-text-muted)", maxWidth: "520px", lineHeight: 1.6 }}>
          {t.quickstart.sectionDesc}
        </p>
      </div>

      <CopyCodeBlock language="bash">
        <pre style={{ margin: 0, fontFamily: "var(--font-mono, monospace)", fontSize: "13.5px", lineHeight: 1.9, color: "var(--kz-text-primary)" }}>
          {COMMANDS.map((cmd) => (
            <div key={cmd}>
              <span style={{ color: "var(--kz-text-muted)", userSelect: "none" }}>$ </span>
              {cmd}
            </div>
          ))}
        </pre>
      </CopyCodeBlock>

      <p style={{ fontSize: "12.5px", color: "var(--kz-text-muted)", textAlign: "center", marginTop: "8px" }}>
        {t.quickstart.note}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
        <Link href="/products/orazaka" style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "11px 20px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600, background: "var(--kz-accent)", color: "var(--kz-on-accent)", textDecoration: "none" }}>
          <BookOpen size={14} strokeWidth={1.8} /> {t.quickstart.docsCta} <ArrowRight size={13} strokeWidth={2} />
        </Link>
        <Link href="/#community" style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "11px 20px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600, background: "var(--kz-surface-2)", color: "var(--kz-text-primary)", border: "1px solid var(--kz-border-subtle)", textDecoration: "none" }}>
          <Users size={14} strokeWidth={1.8} /> {t.quickstart.communityCta}
        </Link>
      </div>
    </section>
  );
}

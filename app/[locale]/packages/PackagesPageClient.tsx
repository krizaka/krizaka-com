"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TopNavBar from "../../components/TopNavBar";
import SiteFooter from "../../components/SiteFooter";
import PackagesSection from "../../components/PackagesSection";
import { useI18n } from "../../components/I18nProvider";

export default function PackagesPageClient() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen">
      <TopNavBar />
      <div style={{ height: "40px" }} />
      <PackagesSection full />

      {/* CTA band toward editions / get-started */}
      <section style={{ padding: "0 24px 96px", maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            padding: "40px 28px",
            borderRadius: "20px",
            background: "radial-gradient(130% 90% at 50% 0%, var(--kz-accent-soft), transparent 55%), var(--kz-surface-1)",
            border: "1px solid var(--kz-border-default)",
          }}
        >
          <p style={{ fontSize: "15px", color: "var(--kz-text-secondary)", lineHeight: 1.6, maxWidth: "520px" }}>
            {t.packages.manualNote} {t.packages.cloudNote}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
            <Link href="/products/orasaka/getting-started/101" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "11px 20px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600, background: "var(--kz-accent)", color: "var(--kz-on-accent)", textDecoration: "none" }}>
              {t.useCasePage.ctaButton} <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <Link href="/editions" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "11px 20px", borderRadius: "9999px", fontSize: "13px", fontWeight: 600, background: "var(--kz-surface-2)", color: "var(--kz-text-primary)", border: "1px solid var(--kz-border-subtle)", textDecoration: "none" }}>
              {t.editions.compareAll}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

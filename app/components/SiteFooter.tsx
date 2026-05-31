"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "./I18nProvider";
import KrizakaLogo from "./KrizakaLogo";

/* GitHub SVG — lucide-react doesn't export Github in this version */
function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function SiteFooter() {
  const { t, locale } = useI18n();

  const productLinks = [
    { label: "Orasaka", href: "/products/orasaka" },
    { label: t.footer.documentation, href: "/products/orasaka/getting-started/101" },
    { label: t.footer.architecture, href: "/products/orasaka/architecture/architecture" },
    { label: "CLI", href: "/products/orasaka/api/cli" },
  ];

  const solutionLinks = t.useCases.items.slice(0, 4).map((uc) => ({
    label: uc.industry,
    href: `/use-cases/${uc.slug}`,
  }));

  const legalLinks = [
    { label: t.compliance.items[0]?.tag ?? "Loi 25", href: "/#compliance" },
  ];

  return (
    <footer
      id="site-footer"
      style={{
        borderTop: "1px solid var(--kz-border-subtle)",
        padding: "64px 24px 32px",
      }}
    >
      <div
        className="footer-grid"
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "40px",
          marginBottom: "48px",
        }}
      >
        {/* ─── Brand column ─── */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--kz-text-primary)",
              letterSpacing: "-0.02em",
              marginBottom: "12px",
            }}
          >
            <KrizakaLogo size={28} />
            Krizaka
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--kz-text-muted)",
              lineHeight: 1.6,
              marginBottom: "16px",
              maxWidth: "280px",
            }}
          >
            {locale === "fr"
              ? "IA souveraine pour entreprises et développeurs. Open source."
              : "Sovereign AI for enterprises and developers. Open source."}
          </p>
          <a
            href="https://github.com/krizaka"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--kz-text-secondary)",
              textDecoration: "none",
            }}
          >
            <GitHubIcon size={14} />
            GitHub
            <ArrowUpRight size={10} strokeWidth={2} />
          </a>
        </div>

        {/* ─── Product links ─── */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--kz-text-primary)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            {t.footer.product}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {productLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "13px",
                  color: "var(--kz-text-muted)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ─── Solutions links ─── */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--kz-text-primary)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            {t.footer.solutions}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {solutionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "13px",
                  color: "var(--kz-text-muted)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ─── Legal links ─── */}
        <div>
          <h4
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--kz-text-primary)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            {t.footer.legal}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "13px",
                  color: "var(--kz-text-muted)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom bar ─── */}
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "20px",
          borderTop: "1px solid var(--kz-border-subtle)",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "var(--kz-text-muted)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          © {new Date().getFullYear()} Krizaka. {t.footer.allRights}.
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "var(--kz-text-muted)",
            fontFamily: "var(--font-mono, monospace)",
            letterSpacing: "0.04em",
          }}
        >
        </span>
      </div>
    </footer>
  );
}

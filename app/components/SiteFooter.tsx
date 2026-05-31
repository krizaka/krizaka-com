"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "./I18nProvider";
import KrizakaLogo from "./KrizakaLogo";

/* GitHub Icon SVG */
function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function SiteFooter() {
  const { locale } = useI18n();

  const orazakaLinks = [
    { label: locale === "fr" ? "Présentation" : "Overview", href: "/products/orazaka" },
    { label: locale === "fr" ? "Documentation" : "Docs", href: "/products/orazaka/getting-started/101" },
    { label: locale === "fr" ? "Fonctionnement" : "How it works", href: "/products/orazaka/architecture" },
    { label: "Packages", href: "/products/orazaka/packages" },
    { label: locale === "fr" ? "Démos" : "Demos", href: "/products/orazaka/demos" },
  ];

  const krizakaLinks = [
    { label: "Contact", href: "/contact" },
    { label: locale === "fr" ? "Confidentialité" : "Privacy", href: "/privacy" },
    { label: locale === "fr" ? "Conditions" : "Terms", href: "/terms" },
  ];

  return (
    <footer
      id="site-footer"
      style={{
        padding: "56px 24px 32px",
        background: "var(--kz-surface-0)",
        position: "relative",
      }}
    >
      <div
        className="footer-inner"
        style={{
          maxWidth: "880px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          width: "100%",
        }}
      >
        {/* ─── Subtle separator line ─── */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--kz-border-subtle) 30%, var(--kz-border-subtle) 70%, transparent)",
            marginBottom: "40px",
            width: "100%",
          }}
        />

        {/* ─── Main footer row: brand left, links columns right ─── */}
        <div
          className="footer-main-row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "40px",
            marginBottom: "40px",
            width: "100%",
          }}
        >
          {/* Brand */}
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <KrizakaLogo size={22} />
              <span
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--kz-text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Krizaka
              </span>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--kz-text-muted)",
                lineHeight: 1.5,
                maxWidth: "260px",
                marginBottom: "14px",
              }}
            >
              {locale === "fr"
                ? "Éditeur de solutions d'IA souveraines. Concepteurs d'Orazaka."
                : "Sovereign AI solutions. Creators of Orazaka."}
            </p>
            <a
              href="https://github.com/krizaka"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-gh-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--kz-text-muted)",
                textDecoration: "none",
              }}
            >
              <GitHubIcon size={13} />
              GitHub
              <ArrowUpRight size={9} strokeWidth={2} />
            </a>
          </div>

          {/* Dual-column Links */}
          <div
            className="footer-nav-cols"
            style={{
              display: "flex",
              gap: "56px",
            }}
          >
            {/* Orazaka Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "var(--kz-text-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {locale === "fr" ? "Orazaka (Moteur IA)" : "Orazaka (AI Engine)"}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {orazakaLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="footer-link"
                    style={{
                      fontSize: "12px",
                      color: "var(--kz-text-muted)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Krizaka / Legal Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "var(--kz-text-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {locale === "fr" ? "Krizaka (Organisation)" : "Krizaka (Organization)"}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {krizakaLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="footer-link"
                    style={{
                      fontSize: "12px",
                      color: "var(--kz-text-muted)",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom copyright ─── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "16px",
            borderTop: "1px solid color-mix(in srgb, var(--kz-border-subtle) 50%, transparent)",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              color: "var(--kz-text-muted)",
              fontFamily: "var(--font-mono, monospace)",
              opacity: 0.7,
            }}
          >
            © 2026 Krizaka.
          </span>
        </div>
      </div>

      <style>{`
        .footer-link {
          transition: color 150ms ease;
        }
        .footer-link:hover {
          color: var(--kz-text-secondary) !important;
        }
        .footer-gh-link {
          transition: color 150ms ease;
        }
        .footer-gh-link:hover {
          color: var(--kz-text-secondary) !important;
        }

        @media (max-width: 640px) {
          .footer-main-row {
            flex-direction: column !important;
            gap: 32px !important;
            align-items: flex-start !important;
          }
          .footer-nav-cols {
            gap: 40px !important;
          }
        }
      `}</style>
    </footer>
  );
}

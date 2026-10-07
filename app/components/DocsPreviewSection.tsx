"use client";

import Link from "next/link";
import {
  BookOpen,
  Cpu,
  Terminal,
  Shield,
  Layers,
  Server,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "./I18nProvider";

const DOC_CARDS = [
  {
    icon: BookOpen,
    href: "/products/orazaka/getting-started/101",
  },
  {
    icon: Cpu,
    href: "/products/orazaka/architecture/architecture",
  },
  {
    icon: Layers,
    href: "/products/orazaka/api/api_reference",
  },
  {
    icon: Shield,
    href: "/products/orazaka/core-features/auth",
  },
  {
    icon: Terminal,
    href: "/products/orazaka/api/cli",
  },
  {
    icon: Server,
    href: "/products/orazaka/operations/deploy",
  },
];

export default function DocsPreviewSection() {
  const { t } = useI18n();

  return (
    <section
      id="docs-preview"
      style={{
        padding: "112px 24px",
        maxWidth: "960px",
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
          marginBottom: "40px",
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
          {t.docsPreview.sectionLabel}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            marginBottom: "8px",
          }}
        >
          {t.docsPreview.sectionTitle}
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--kz-text-muted)",
            maxWidth: "480px",
            lineHeight: 1.6,
          }}
        >
          {t.docsPreview.sectionDesc}
        </p>
      </div>

      {/* ─── Doc cards grid ─── */}
      <div
        className="docs-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "10px",
          marginBottom: "32px",
        }}
      >
        {DOC_CARDS.map((doc, i) => {
          const Icon = doc.icon;
          const title = t.pages.docsPreview.docCards[i].title;
          return (
            <Link
              key={doc.href}
              href={doc.href}
              className="doc-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 18px",
                borderRadius: "12px",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                textDecoration: "none",
                transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
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
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "13.5px",
                  fontWeight: 550,
                  color: "var(--kz-text-primary)",
                }}
              >
                {title}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ─── View all CTA ─── */}
      <div style={{ textAlign: "center" }}>
        <Link
          id="docs-view-all"
          href="/products/orazaka"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--kz-accent)",
            textDecoration: "none",
            fontFamily: "var(--font-display), system-ui, sans-serif",
          }}
        >
          {t.docsPreview.viewAllDocs}
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>

      <style>{`
        .doc-card:hover {
          border-color: var(--kz-border-default) !important;
          box-shadow: var(--kz-shadow-sm) !important;
          transform: translateY(-1px) !important;
        }
        @media (max-width: 580px) {
          .docs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

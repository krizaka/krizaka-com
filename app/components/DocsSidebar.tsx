"use client";
/* eslint-disable react-hooks/set-state-in-effect -- closes the mobile drawer in
   response to route changes (external navigation sync). */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Cpu,
  Shield,
  Code2,
  Layers,
  Terminal,
  Settings,
  FileText,
  Palette,
  ScrollText,
  Rocket,
  Menu,
  X,
} from "lucide-react";

const CATEGORY_META: Record<string, { icon: typeof BookOpen; label: string }> = {
  "getting-started": { icon: Rocket, label: "Getting Started" },
  architecture: { icon: Cpu, label: "Architecture" },
  api: { icon: Code2, label: "API" },
  "core-features": { icon: Shield, label: "Core Features" },
  operations: { icon: Settings, label: "Operations" },
  "ui-guidelines": { icon: Palette, label: "UI Guidelines" },
  guidelines: { icon: ScrollText, label: "Guidelines" },
  general: { icon: FileText, label: "General" },
};

function getCategoryMeta(category: string) {
  return CATEGORY_META[category] || {
    icon: Layers,
    label: category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

interface DocMeta {
  slug: string;
  category: string;
  title: string;
  order: number;
}

interface DocsSidebarProps {
  groupedDocs: Record<string, DocMeta[]>;
  sortedCategories: string[];
}

export default function DocsSidebar({ groupedDocs, sortedCategories }: DocsSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navContent = (
    <>
      {/* ── Header ── */}
      <div style={{ padding: "24px 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href="/products/orasaka"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "var(--kz-radius-md)",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.05)",
            }}
            className="logo-pulse"
          >
            <svg width="22" height="22" viewBox="-56 -56 112 112" fill="none">
              <path d="M -24 -41.5 L 0 -55.4 L 24 -41.5 L 24 -24 L 14 -18.2 L 14 -35.7 L 0 -43.8 L -14 -35.7 L -14 -18.2" stroke="var(--kz-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              <path d="M -48 0 L -38 17.3 L -14 31.2 L 0 23.1 L -10 17.3 L -24 9.2 L -24 -9.2" stroke="var(--kz-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
              <path d="M 48 0 L 38 17.3 L 14 31.2 L 0 23.1 L 10 17.3 L 24 9.2 L 24 -9.2" stroke="var(--kz-accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="0" cy="0" r="9" fill="var(--kz-accent)" opacity="0.9" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 750,
                color: "var(--kz-text-primary)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Orasaka
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--kz-text-muted)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                opacity: 0.7,
                marginTop: 2,
              }}
            >
              Intelligence
            </div>
          </div>
        </Link>

        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="docs-sidebar-close"
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "var(--kz-text-muted)",
            cursor: "pointer",
            padding: 4,
          }}
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          padding: "8px 14px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          overflowY: "auto",
        }}
      >
        {/* Overview */}
        <Link
          href="/products/orasaka"
          className={`docs-nav-link ${pathname === "/products/orasaka" ? "active" : ""}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 12px",
            borderRadius: "var(--kz-radius-md)",
            fontSize: 13.5,
            color: pathname === "/products/orasaka" ? "var(--kz-accent)" : "var(--kz-text-secondary)",
            textDecoration: "none",
            fontWeight: pathname === "/products/orasaka" ? 600 : 500,
            background: pathname === "/products/orasaka" ? "rgba(var(--kz-accent-rgb), 0.1)" : "transparent",
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Terminal size={16} strokeWidth={2} />
          <span>Overview</span>
        </Link>

        {/* Categories */}
        {sortedCategories.map((category) => {
          const meta = getCategoryMeta(category);
          const Icon = meta.icon;
          const docs = groupedDocs[category];

          return (
            <div key={category} style={{ marginTop: 18 }}>
              {/* Section label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 12px 10px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--kz-text-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                }}
              >
                <Icon size={12} strokeWidth={2} />
                <span>{meta.label}</span>
              </div>

              {/* Section items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {docs.map((doc) => {
                  const href = `/products/orasaka/${doc.category}/${doc.slug}`;
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={doc.slug}
                      href={href}
                      className={`docs-nav-link ${isActive ? "active" : ""}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "7px 12px 7px 32px",
                        borderRadius: "var(--kz-radius-md)",
                        fontSize: 13,
                        color: isActive ? "var(--kz-text-primary)" : "var(--kz-text-muted)",
                        textDecoration: "none",
                        fontWeight: isActive ? 600 : 450,
                        background: isActive ? "rgba(255, 255, 255, 0.03)" : "transparent",
                        position: "relative",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {isActive && (
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 8,
                            bottom: 8,
                            width: 3,
                            borderRadius: "0 4px 4px 0",
                            background: "var(--kz-accent)",
                            boxShadow: "0 0 10px var(--kz-accent)",
                          }}
                        />
                      )}
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {doc.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div
        style={{
          padding: "12px 16px 16px",
          borderTop: "1px solid var(--kz-border-subtle)",
        }}
      >
        <a
          href="https://github.com/krizaka"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: "var(--kz-radius-sm)",
            fontSize: 12,
            fontWeight: 500,
            color: "var(--kz-text-muted)",
            textDecoration: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        .docs-sidebar-desktop {
          width: 280px;
          border-right: 1px solid var(--kz-border-subtle);
          background: var(--kz-surface-0);
          height: calc(100vh - 80px);
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
        }
        .docs-nav-link:hover {
          color: var(--kz-text-primary) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .docs-nav-link.active:hover {
          background: rgba(var(--kz-accent-rgb), 0.15) !important;
        }
        @media (max-width: 768px) {
          .docs-sidebar-desktop { display: none; }
          .docs-sidebar-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>

      {/* Desktop Sidebar */}
      <aside className="docs-sidebar-desktop">
        {navContent}
      </aside>

      {/* Mobile Toggle & Menu */}
      <div
        className="docs-sidebar-mobile-toggle"
        style={{
          display: "none",
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 100,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--kz-accent)",
          color: "white",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={24} />
      </div>

      {/* Mobile Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 280,
          background: "var(--kz-surface-0)",
          zIndex: 200,
          boxShadow: "20px 0 60px rgba(0,0,0,0.5)",
          display: mobileOpen ? "flex" : "none",
          flexDirection: "column",
          transition: "transform 0.3s ease",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div style={{ padding: "20px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/products/orasaka" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "var(--kz-radius-sm)", background: "var(--kz-surface-2)", border: "1px solid var(--kz-border-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
               {/* Mini logo */}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--kz-text-primary)" }}>Orasaka</div>
          </Link>
          <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "var(--kz-text-muted)" }}><X size={20} /></button>
        </div>
        {navContent}
      </div>
    </>
  );
}

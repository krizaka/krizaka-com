"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ChevronDown,
  BookOpen,
  Cpu,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Layers,
  Play,
} from "lucide-react";
import { useI18n } from "./I18nProvider";
import { useTheme } from "./ThemeProvider";
import KrizakaLogo from "./KrizakaLogo";

/* ─── Orasaka Hexagonal Isotype ─── */

function OrasakaLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-62 -62 124 124"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="nav-amber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="nav-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle cx="0" cy="0" r="52" stroke="hsla(217, 92%, 60%, 0.15)" strokeWidth="1" fill="none" />
      <path d="M -24 -41.5 L 0 -55.4 L 24 -41.5 L 24 -24 L 14 -18.2 L 14 -35.7 L 0 -43.8 L -14 -35.7 L -14 -18.2" stroke="hsla(217, 92%, 60%, 0.4)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M -48 0 L -38 17.3 L -14 31.2 L 0 23.1 L -10 17.3 L -24 9.2 L -24 -9.2" stroke="hsla(217, 92%, 60%, 0.3)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 48 0 L 38 17.3 L 14 31.2 L 0 23.1 L 10 17.3 L 24 9.2 L 24 -9.2" stroke="url(#nav-amber)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="0" cy="0" r="8" fill="url(#nav-amber)" opacity="0.9" />
    </svg>
  );
}

/* ─── Mobile Menu Panel ─── */

function MobilePanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t, locale, toggleLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  /* Close on route change */
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  /* Trap scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 98,
          background: "hsla(0, 0%, 0%, 0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 250ms ease",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <nav
        id="mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(320px, 85vw)",
          zIndex: 99,
          background: "var(--kz-surface-1)",
          borderLeft: "1px solid var(--kz-border-subtle)",
          boxShadow: "-8px 0 32px hsla(0, 0%, 0%, 0.3)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Close button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--kz-border-subtle)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--kz-text-primary)",
            }}
          >
            <KrizakaLogo size={22} />
            Krizaka
          </span>
          <button
            id="mobile-menu-close"
            type="button"
            onClick={onClose}
            aria-label={t.nav.close}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              color: "var(--kz-text-secondary)",
              cursor: "pointer",
            }}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Product card */}
        <div style={{ padding: "16px 20px" }}>
          <Link
            id="mobile-nav-orasaka"
            href="/products/orasaka"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "12px",
              textDecoration: "none",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "var(--kz-surface-0)",
                border: "1px solid hsla(217, 92%, 60%, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <OrasakaLogo size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--kz-text-primary)",
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                }}
              >
                Orasaka
              </div>
              <div style={{ fontSize: "12px", color: "var(--kz-text-muted)" }}>
                {t.nav.orasakaDesc}
              </div>
            </div>
            <ArrowRight size={14} style={{ color: "var(--kz-text-muted)", flexShrink: 0 }} />
          </Link>
        </div>

        {/* Navigation links */}
        <div
          style={{
            flex: 1,
            padding: "0 20px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {[
            { href: "/solutions", label: t.nav.solutions, active: pathname === "/solutions" },
            { href: "/roadmap", label: t.nav.roadmap, active: pathname === "/roadmap" },
            { href: "/editions", label: t.nav.editions, active: pathname === "/editions", icon: <Layers size={16} strokeWidth={1.5} /> },
            { href: "/demos", label: t.nav.demos, active: pathname === "/demos", icon: <Play size={16} strokeWidth={1.5} /> },
            { href: "/products/orasaka", label: t.nav.docs, icon: <BookOpen size={16} strokeWidth={1.5} />, active: pathname.startsWith("/products/orasaka") },
            { href: "/architecture", label: `${t.nav.architecture} 3D`, icon: <Cpu size={16} strokeWidth={1.5} />, active: pathname === "/architecture" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: link.active ? 600 : 500,
                color: link.active ? "var(--kz-accent)" : "var(--kz-text-secondary)",
                background: link.active ? "var(--kz-surface-2)" : "transparent",
                textDecoration: "none",
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--kz-border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Theme toggle */}
          <button
            id="mobile-theme-toggle"
            type="button"
            onClick={toggleTheme}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--kz-text-secondary)",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              cursor: "pointer",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              width: "100%",
              textAlign: "left",
            }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
          </button>

          {/* Language toggle */}
          <button
            id="mobile-lang-toggle"
            type="button"
            onClick={toggleLocale}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--kz-text-secondary)",
              background: "var(--kz-surface-2)",
              border: "1px solid var(--kz-border-subtle)",
              cursor: "pointer",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              width: "100%",
              textAlign: "left",
            }}
          >
            <Globe size={16} />
            {locale === "fr" ? "English" : "Français"}
          </button>

          {/* CTA */}
          <Link
            id="mobile-cta-start"
            href="/products/orasaka/getting-started/101"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px 16px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
              background: "var(--kz-accent)",
              color: "var(--kz-on-accent)",
              textDecoration: "none",
              marginTop: "4px",
            }}
          >
            {t.nav.getStarted}
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </nav>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOP NAV BAR — Desktop + Mobile
   ═══════════════════════════════════════════════════════════════════ */

export default function TopNavBar() {
  const pathname = usePathname();
  const { t, locale, toggleLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSolutionsActive = pathname === "/solutions";
  const isRoadmapActive = pathname === "/roadmap";
  const isEditionsActive = pathname === "/editions";
  const isDemosActive = pathname === "/demos";
  const isArchitectureActive = pathname === "/architecture";
  const isDocsActive = pathname.startsWith("/products/orasaka");
  const isProductsActive = isDocsActive || isEditionsActive || isDemosActive || isArchitectureActive;

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setProductsOpen(false), 250);
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
          paddingTop: "12px",
          paddingLeft: "16px",
          paddingRight: "16px",
          pointerEvents: "none",
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "48px",
            width: "100%",
            maxWidth: "880px",
            paddingLeft: "24px",
            paddingRight: "16px",
            borderRadius: "9999px",
            background: "color-mix(in srgb, var(--kz-surface-1) 75%, transparent)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid var(--kz-border-subtle)",
            pointerEvents: "auto",
            transition: "background 0.3s ease",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: "var(--kz-text-primary)",
              textDecoration: "none",
            }}
          >
            <KrizakaLogo size={26} />
            Krizaka
          </Link>

          {/* ─── Desktop Links ─── */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Products dropdown */}
            <div
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ position: "relative" }}
            >
              <button
                id="nav-products-trigger"
                type="button"
                aria-expanded={productsOpen}
                aria-haspopup="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  lineHeight: 1,
                  color: isProductsActive ? "var(--kz-accent)" : "var(--kz-text-muted)",
                  fontWeight: isProductsActive ? 600 : 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                  transition: "color 200ms ease",
                }}
              >
                {t.nav.products}
                <ChevronDown
                  size={12}
                  strokeWidth={2}
                  style={{
                    transition: "transform 200ms ease",
                    transform: productsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              {isProductsActive && (
                <span style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "55px",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "var(--kz-accent)",
                  boxShadow: "0 0 8px var(--kz-accent)",
                  pointerEvents: "none",
                }} />
              )}

              {/* Dropdown panel — Orasaka product sub-navigation */}
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 14px)",
                  left: "50%",
                  width: "320px",
                  padding: "10px",
                  borderRadius: "18px",
                  background: "color-mix(in srgb, var(--kz-surface-1) 97%, transparent)",
                  backdropFilter: "blur(32px) saturate(200%)",
                  WebkitBackdropFilter: "blur(32px) saturate(200%)",
                  border: "1px solid var(--kz-border-default)",
                  boxShadow: "0 24px 64px hsla(0, 0%, 0%, 0.45), 0 0 24px var(--kz-accent-soft)",
                  opacity: productsOpen ? 1 : 0,
                  pointerEvents: productsOpen ? "auto" : "none",
                  transform: productsOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-8px)",
                  transition: "opacity 250ms cubic-bezier(0.16,1,0.3,1), transform 250ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {/* Cyberpunk HUD corner accents */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "10px", height: "10px", borderTop: "2px solid var(--kz-accent)", borderLeft: "2px solid var(--kz-accent)", borderRadius: "18px 0 0 0" }} />
                <div style={{ position: "absolute", top: 0, right: 0, width: "10px", height: "10px", borderTop: "2px solid var(--kz-accent)", borderRight: "2px solid var(--kz-accent)", borderRadius: "0 18px 0 0" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, width: "10px", height: "10px", borderBottom: "2px solid var(--kz-accent)", borderLeft: "2px solid var(--kz-accent)", borderRadius: "0 0 0 18px" }} />
                <div style={{ position: "absolute", bottom: 0, right: 0, width: "10px", height: "10px", borderBottom: "2px solid var(--kz-accent)", borderRight: "2px solid var(--kz-accent)", borderRadius: "0 0 18px 0" }} />

                {/* Hover bridge */}
                <div style={{ position: "absolute", top: "-16px", left: 0, right: 0, height: "16px" }} />

                {/* Parent Orasaka Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 10px 10px",
                    borderBottom: "1px solid var(--kz-border-subtle)",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, var(--kz-surface-2), var(--kz-surface-1))",
                      border: "1px solid hsla(217, 92%, 60%, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <OrasakaLogo size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--kz-text-primary)", fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                      Orasaka
                    </span>
                    <div style={{ fontSize: "11px", color: "var(--kz-text-muted)" }}>
                      {t.nav.orasakaDesc}
                    </div>
                  </div>
                </div>

                {/* Sub-navigation tree list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  {[
                    { href: "/editions", label: t.nav.editions, desc: locale === "fr" ? "Community & Cloud" : "Community & Cloud", icon: <Layers size={13} strokeWidth={1.8} /> },
                    { href: "/demos", label: t.nav.demos, desc: locale === "fr" ? "Simulations interactives" : "Interactive simulations", icon: <Play size={13} strokeWidth={1.8} /> },
                    { href: "/architecture", label: `${t.nav.architecture} 3D`, desc: locale === "fr" ? "Graphe des dépendances" : "Dependency graph", icon: <Cpu size={13} strokeWidth={1.8} /> },
                    { href: "/products/orasaka", label: t.nav.docs, desc: locale === "fr" ? "Référence API & Guides" : "API Reference & Guides", icon: <BookOpen size={13} strokeWidth={1.8} /> },
                  ].map((sub, idx) => {
                    const isSubActive = pathname === sub.href || (sub.href === "/products/orasaka" && isDocsActive);
                    return (
                      <Link
                        key={idx}
                        href={sub.href}
                        role="menuitem"
                        className="nav-sub-link group/sub"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "8px 10px",
                          borderRadius: "10px",
                          textDecoration: "none",
                          background: isSubActive ? "var(--kz-surface-2)" : "transparent",
                          transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <div className="nav-sub-icon" style={{ color: isSubActive ? "var(--kz-accent)" : "var(--kz-text-secondary)", display: "flex", alignItems: "center", flexShrink: 0, transition: "transform 250ms ease, color 250ms ease" }}>
                          {sub.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "12.5px", fontWeight: 600, color: isSubActive ? "var(--kz-text-primary)" : "var(--kz-text-secondary)", fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                            {sub.label}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--kz-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {sub.desc}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <Link
              href="/solutions"
              className={`nav-top-link ${isSolutionsActive ? 'nav-top-link-active' : ''}`}
              style={{
                position: "relative",
                fontSize: "13px",
                lineHeight: 1,
                color: isSolutionsActive ? "var(--kz-accent)" : "var(--kz-text-muted)",
                fontWeight: isSolutionsActive ? 600 : 500,
                textDecoration: "none",
                transition: "color 150ms ease"
              }}
            >
              {t.nav.solutions}
              {isSolutionsActive && (
                <span style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "var(--kz-accent)",
                  boxShadow: "0 0 8px var(--kz-accent)",
                }} />
              )}
            </Link>
            <Link
              href="/roadmap"
              className={`nav-top-link ${isRoadmapActive ? 'nav-top-link-active' : ''}`}
              style={{
                position: "relative",
                fontSize: "13px",
                lineHeight: 1,
                color: isRoadmapActive ? "var(--kz-accent)" : "var(--kz-text-muted)",
                fontWeight: isRoadmapActive ? 600 : 500,
                textDecoration: "none",
                transition: "color 150ms ease"
              }}
            >
              {t.nav.roadmap}
              {isRoadmapActive && (
                <span style={{
                  position: "absolute",
                  bottom: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "var(--kz-accent)",
                  boxShadow: "0 0 8px var(--kz-accent)",
                }} />
              )}
            </Link>

            <span aria-hidden style={{ width: "1px", height: "16px", background: "var(--kz-border-subtle)" }} />

            {/* Desktop theme toggle */}
            <button
              id="nav-theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "none",
                border: "none",
                color: "var(--kz-text-muted)",
                cursor: "pointer",
                transition: "color 150ms ease",
              }}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Desktop lang toggle */}
            <button
              id="nav-lang-toggle"
              type="button"
              onClick={toggleLocale}
              aria-label={t.nav.language}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--kz-text-muted)",
                background: "none",
                border: "1px solid var(--kz-border-subtle)",
                borderRadius: "6px",
                padding: "4px 8px",
                cursor: "pointer",
                fontFamily: "var(--font-mono, monospace)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "border-color 150ms ease, color 150ms ease",
              }}
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>
          </div>

          {/* ─── Right section ─── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Desktop CTA */}
            <Link
              href="/products/orasaka/getting-started/101"
              className="nav-cta-desktop"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 16px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 600,
                background: "var(--kz-accent)",
                color: "var(--kz-on-accent)",
                textDecoration: "none",
              }}
            >
              <span className="nav-cta-text">{t.nav.getStarted}</span>
              <ArrowRight size={12} strokeWidth={2.5} />
            </Link>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-trigger"
              type="button"
              className="nav-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label={t.nav.menu}
              aria-expanded={mobileOpen}
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "color-mix(in srgb, var(--kz-surface-2) 60%, transparent)",
                border: "1px solid var(--kz-border-subtle)",
                color: "var(--kz-text-primary)",
                cursor: "pointer",
              }}
            >
              <Menu size={18} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile panel */}
      <MobilePanel isOpen={mobileOpen} onClose={closeMobile} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .nav-cta-desktop {
            display: none !important;
          }
          .nav-hamburger {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .nav-hamburger {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .nav-cta-text {
            display: none;
          }
        }
        .nav-top-link:hover {
          color: var(--kz-text-primary) !important;
        }
        .nav-top-link-active {
          color: var(--kz-accent) !important;
        }
        #nav-products-trigger:hover {
          color: var(--kz-text-primary) !important;
        }
        .nav-sub-link:hover .nav-sub-icon {
          transform: scale(1.2) rotate(12deg);
          color: var(--kz-accent) !important;
        }
        .nav-sub-link:hover {
          background-color: var(--kz-surface-2) !important;
        }
      `}</style>
    </>
  );
}

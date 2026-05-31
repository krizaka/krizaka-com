"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Globe,
  Layers,
  Moon,
  Play,
  Sun,
  X,
} from "lucide-react";
import { useI18n } from "./I18nProvider";
import { useTheme } from "./ThemeProvider";
import KrizakaLogo from "./KrizakaLogo";
import OrazakaLogo from "./OrazakaLogo";

/* ─── Mobile Menu Panel ─── */

export function MobilePanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t, locale, toggleLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isDocsActive = pathname.startsWith("/products/orazaka") &&
    !pathname.startsWith("/products/orazaka/packages") &&
    !pathname.startsWith("/products/orazaka/usecases") &&
    !pathname.startsWith("/products/orazaka/architecture") &&
    !pathname.startsWith("/products/orazaka/demos") &&
    !pathname.startsWith("/products/orazaka/ingenierie-cognitive");

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
            id="mobile-nav-orazaka"
            href="/products/orazaka"
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
              <OrazakaLogo size={26} />
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
                Orazaka
              </div>
              <div style={{ fontSize: "12px", color: "var(--kz-text-muted)" }}>
                {t.nav.orazakaDesc}
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
            { href: "/products/orazaka/architecture", label: t.nav.architecture, icon: <Cpu size={16} strokeWidth={1.5} />, active: pathname === "/products/orazaka/architecture" },
            { href: "/products/orazaka/demos", label: t.nav.demos, active: pathname === "/products/orazaka/demos", icon: <Play size={16} strokeWidth={1.5} /> },
            { href: "/products/orazaka", label: t.nav.docs, icon: <BookOpen size={16} strokeWidth={1.5} />, active: isDocsActive },
            { href: "/products/orazaka/packages", label: t.nav.packages, active: pathname === "/products/orazaka/packages", icon: <Layers size={16} strokeWidth={1.5} /> },
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
        </div>
      </nav>
    </>
  );
}

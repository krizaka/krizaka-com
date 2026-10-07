"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ChevronDown, Globe, Moon, Sun, X } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { useTheme } from "./ThemeProvider";
import KrizakaLogo from "./KrizakaLogo";
import ProductLogo from "./ProductLogo";
import { NAV_ICONS } from "./ProductsMenu";
import { NAV_COMPANY, NAV_PRODUCTS, isNavActive, localeless } from "@/lib/nav";

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
  const path = localeless(pathname);
  const loc = locale === "fr" ? "fr" : "en";

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
          // Closed: hidden after the slide-out, so neither its shadow nor its links leak on screen / to Tab.
          visibility: isOpen ? "visible" : "hidden",
          transition: isOpen
            ? "transform 300ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 300ms",
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

        {/* Products — same five entries per product as the desktop mega-menu (lib/nav.ts) */}
        <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {NAV_PRODUCTS.map((p) => (
            <details key={p.id} className="kz-mp-product" open={path.startsWith(p.href) || (!path.startsWith("/products/") && p.id === "orazaka")}>
              <summary>
                <span className="kz-mp-logo">
                  <ProductLogo id={p.id} size={26} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="kz-mp-name">{p.name}</span>
                  <span className="kz-mp-tagline">{p.tagline[loc]}</span>
                </span>
                <ChevronDown size={16} className="kz-mp-chevron" aria-hidden />
              </summary>
              <div className="kz-mp-links">
                {p.links.map((l) => {
                  const Icon = NAV_ICONS[l.icon];
                  return (
                    <Link key={l.href} href={l.href} onClick={onClose} className={`kz-mp-link${isNavActive(l, path) ? " is-active" : ""}`}>
                      <Icon size={16} strokeWidth={1.6} aria-hidden /> {l.label[loc]}
                    </Link>
                  );
                })}
              </div>
            </details>
          ))}

          <div className="kz-mp-links" style={{ marginTop: "4px", paddingTop: "10px", borderTop: "1px solid var(--kz-border-subtle)" }}>
            {NAV_COMPANY.map((l) => {
              const Icon = NAV_ICONS[l.icon];
              return (
                <Link key={l.href} href={l.href} onClick={onClose} className={`kz-mp-link${isNavActive(l, path) ? " is-active" : ""}`}>
                  <Icon size={16} strokeWidth={1.6} aria-hidden /> {l.label[loc]}
                </Link>
              );
            })}
          </div>
        </div>

        <style>{`
          .kz-mp-product { border-radius: 14px; border: 1px solid var(--kz-border-subtle); background: var(--kz-surface-2); overflow: hidden; }
          .kz-mp-product summary { display: flex; align-items: center; gap: 12px; padding: 12px 14px; cursor: pointer; list-style: none; }
          .kz-mp-product summary::-webkit-details-marker { display: none; }
          .kz-mp-logo { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 10px;
            background: var(--kz-surface-0); border: 1px solid var(--kz-border-subtle); flex-shrink: 0; }
          .kz-mp-name { display: block; font-family: var(--font-display), system-ui, sans-serif; font-size: 14px; font-weight: 700; color: var(--kz-text-primary); }
          .kz-mp-tagline { display: block; font-size: 12px; color: var(--kz-text-muted); }
          .kz-mp-chevron { color: var(--kz-text-muted); transition: transform 200ms ease; flex-shrink: 0; }
          .kz-mp-product[open] .kz-mp-chevron { transform: rotate(180deg); }
          .kz-mp-product .kz-mp-links { padding: 0 8px 8px; }
          .kz-mp-links { display: flex; flex-direction: column; gap: 2px; }
          .kz-mp-link { display: flex; align-items: center; gap: 10px; padding: 10px 10px; border-radius: 8px; font-size: 14px; font-weight: 500;
            color: var(--kz-text-secondary); text-decoration: none; font-family: var(--font-display), system-ui, sans-serif; }
          .kz-mp-link svg { color: var(--kz-text-muted); }
          .kz-mp-link.is-active { color: var(--kz-accent); font-weight: 600; background: var(--kz-surface-1); }
          .kz-mp-link.is-active svg { color: var(--kz-accent); }
        `}</style>

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

"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { Menu, Sun, Moon, Search } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { useTheme } from "./ThemeProvider";
import KrizakaLogo from "./KrizakaLogo";
import { GITHUB_REPO_URL } from "@/lib/site";
import { MobilePanel } from "./MobilePanel";
import { SearchCommand } from "./SearchCommand";
import { ProductsMenu } from "./ProductsMenu";

export default function TopNavBar() {
  const { t, locale, toggleLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  /* Condense the floating glass pill once the hero scrolls away: denser
     backdrop, stronger hairline, soft lift. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            gap: "0px",
            height: "52px",
            width: "100%",
            maxWidth: "960px",
            paddingLeft: "24px",
            paddingRight: "16px",
            borderRadius: "9999px",
            background: `color-mix(in srgb, var(--kz-surface-1) ${scrolled ? 92 : 75}%, transparent)`,
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: `1px solid ${scrolled ? "var(--kz-border-default)" : "var(--kz-border-subtle)"}`,
            boxShadow: scrolled ? "var(--kz-shadow-lg)" : "none",
            pointerEvents: "auto",
            transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          {/* Logo Section */}
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
              flexShrink: 0,
            }}
          >
            <KrizakaLogo size={26} />
            Krizaka
          </Link>

          {/* ─── Desktop Dropdown — Produits (flush after logo) ─── */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", position: "relative", marginLeft: "20px" }}>
            <ProductsMenu />
          </div>

          {/* ─── Right Controls ─── */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
            {/* Search Pill (Desktop) */}
            <div className="nav-desktop-search">
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 10px",
                  borderRadius: "9999px",
                  background: "var(--kz-surface-2)",
                  border: "1px solid var(--kz-border-subtle)",
                  color: "var(--kz-text-muted)",
                  cursor: "pointer",
                  fontSize: "12.5px",
                  transition: "all 150ms ease",
                  fontFamily: "inherit",
                }}
                className="nav-search-btn"
              >
                <Search size={12} style={{ color: "var(--kz-text-muted)" }} />
                <span className="search-placeholder-text">
                  {locale === "fr" ? "Rechercher..." : "Search..."}
                </span>
                <kbd
                  style={{
                    fontSize: "9px",
                    padding: "1px 4px",
                    borderRadius: "4px",
                    background: "var(--kz-surface-3)",
                    border: "1px solid var(--kz-border-default)",
                    color: "var(--kz-text-muted)",
                    fontFamily: "var(--font-mono, monospace)",
                    marginLeft: "2px",
                  }}
                >
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Search Button (Mobile - only icon) */}
            <button
              className="nav-mobile-search"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "none",
                border: "none",
                color: "var(--kz-text-muted)",
                cursor: "pointer",
              }}
            >
              <Search size={15} />
            </button>

            <span className="nav-controls-divider" style={{ width: "1px", height: "16px", background: "var(--kz-border-subtle)" }} />

            {/* Desktop GitHub Link */}
            <a
              id="nav-github-link"
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                color: "var(--kz-text-muted)",
                transition: "color 150ms ease",
              }}
            >
              <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            {/* Desktop Theme toggle */}
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

            {/* Desktop Lang toggle */}
            <button
              id="nav-lang-toggle"
              type="button"
              onClick={toggleLocale}
              aria-label={locale === "fr" ? "Switch to English" : "Changer en Français"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--kz-text-muted)",
                background: "none",
                border: "1px solid var(--kz-border-subtle)",
                borderRadius: "6px",
                width: "28px",
                height: "20px",
                cursor: "pointer",
                fontFamily: "var(--font-mono, monospace)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "border-color 150ms ease, color 150ms ease",
              }}
            >
              {locale === "fr" ? "EN" : "FR"}
            </button>

            {/* Mobile Hamburger */}
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
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "color-mix(in srgb, var(--kz-surface-2) 60%, transparent)",
                border: "1px solid var(--kz-border-subtle)",
                color: "var(--kz-text-primary)",
                cursor: "pointer",
              }}
            >
              <Menu size={16} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile panel */}
      <MobilePanel isOpen={mobileOpen} onClose={closeMobile} />

      {/* Command-palette search (⌘K) */}
      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          #nav-github-link {
            display: none !important;
          }
          #nav-theme-toggle {
            display: none !important;
          }
          #nav-lang-toggle {
            display: none !important;
          }
          .nav-hamburger {
            display: flex !important;
          }
          .nav-desktop-search {
            display: none !important;
          }
          .nav-mobile-search {
            display: flex !important;
          }
          .nav-controls-divider {
            display: none !important;
          }
        }
        @media (min-width: 769px) {
          .nav-hamburger {
            display: none !important;
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
        #nav-github-link:hover {
          color: var(--kz-text-primary) !important;
        }
        .nav-sub-link:hover .nav-sub-icon {
          transform: scale(1.2) rotate(12deg);
          color: var(--kz-accent) !important;
        }
        .nav-sub-link:hover {
          background-color: var(--kz-surface-2) !important;
        }
        .nav-search-btn:hover {
          background-color: var(--kz-surface-3) !important;
          border-color: var(--kz-border-default) !important;
          color: var(--kz-text-primary) !important;
        }
        @keyframes navSearchFadeIn {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}

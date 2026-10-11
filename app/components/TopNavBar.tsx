"use client";

/* The site bar (lib/nav.ts): the mark · Products (the one menu) · Open source · Our story on the left; Search ⌘K ·
   Docs · GitHub · theme · language · Contact us on the right. Docs is a plain link to the hub, away from Products, so
   no panel covers another; under /docs the left group becomes the documentation breadcrumb. The floating bar condenses
   once the page scrolls (lower, denser, lifted). Below 769 px: the mark, the search and the menu button (MobilePanel). */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { MenuIcon, MoonIcon, SearchIcon, SunIcon } from "@krizaka/icons";
import { useI18n } from "./I18nProvider";
import { useSiteTheme } from "./SiteTheme";
import { GITHUB_ORG_URL } from "@/lib/site";
import { NAV_DOCS_HUB, isDocsSection, localeless } from "@/lib/nav";
import { MobilePanel } from "./MobilePanel";
import { SearchCommand } from "./SearchCommand";
import { ProductsMenu } from "./ProductsMenu";
import { useContactHref } from "./useContactHref";
import { GitHubMark } from "./brand/GitHubMark";
import { KrizakaLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";

export default function TopNavBar() {
  const { t, toggleLocale } = useI18n();
  const m = t.site.menu;
  const contactHref = useContactHref();
  const { theme, toggleTheme } = useSiteTheme();
  const path = localeless(usePathname());
  const docs = isDocsSection(path);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="kz-bar-wrap">
        <nav aria-label="Main navigation" className={cn("kz-bar", scrolled && "is-scrolled")}>
          <Link href="/" className="kz-bar-logo">
            <KrizakaLogo size={26} />
            Krizaka
          </Link>

          <div className="kz-bar-left">
            <ProductsMenu docs={docs} />
          </div>

          <div className="kz-bar-right">
            <button type="button" className="kz-bar-search" onClick={() => setSearchOpen(true)} aria-label={m.searchAria} aria-keyshortcuts="Meta+K Control+K">
              <SearchIcon size={14} />
              <span className="kz-bar-search-text">{m.search}</span>
              <kbd>⌘K</kbd>
            </button>

            {!docs && (
              <Link href={NAV_DOCS_HUB} className="kz-bar-docs">
                {m.docs}
              </Link>
            )}

            <span className="kz-bar-divider" aria-hidden />

            <a id="nav-github-link" href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer" aria-label={m.githubAria} className="kz-bar-icon">
              <GitHubMark size={15} />
            </a>

            <button id="nav-theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === "dark" ? t.nav.lightMode : t.nav.darkMode} className="kz-bar-icon">
              {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </button>

            <button id="nav-lang-toggle" type="button" onClick={toggleLocale} aria-label={m.switchLanguage} className="kz-bar-lang">
              {m.languageShort}
            </button>

            <Link href={contactHref} id="nav-contact-cta" className="btn-sheen">
              {m.contactCta}
            </Link>

            <button
              id="mobile-menu-trigger"
              type="button"
              className="kz-bar-burger"
              onClick={() => setMobileOpen(true)}
              aria-label={t.nav.menu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-panel"
            >
              <MenuIcon size={18} />
            </button>
          </div>
        </nav>
      </header>

      <MobilePanel isOpen={mobileOpen} onClose={closeMobile} />
      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />

      <style>{`
        .kz-bar-wrap { position:fixed; top:0; left:0; right:0; z-index:50; display:flex; justify-content:center; padding:12px 16px 0; pointer-events:none; }
        .kz-bar { display:flex; align-items:center; width:100%; max-width:1080px; height:52px; padding:0 12px 0 20px; border-radius:9999px; pointer-events:auto;
          background:color-mix(in srgb, var(--kz-surface-1) 75%, transparent); border:1px solid var(--kz-border-subtle); box-shadow:none;
          backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%);
          transition:height 260ms cubic-bezier(.16,1,.3,1), max-width 260ms cubic-bezier(.16,1,.3,1), background 300ms ease, border-color 300ms ease, box-shadow 300ms ease; }
        .kz-bar.is-scrolled { height:46px; max-width:1040px; background:color-mix(in srgb, var(--kz-surface-1) 92%, transparent);
          border-color:var(--kz-border-default); box-shadow:var(--kz-shadow-lg); }
        .kz-bar-logo { display:inline-flex; align-items:center; gap:8px; flex-shrink:0; padding:4px; margin-left:-4px; border-radius:9999px;
          font-family:var(--font-display), system-ui, sans-serif; font-size:15px; font-weight:700; letter-spacing:-0.02em; line-height:1;
          color:var(--kz-text-primary); text-decoration:none; }
        .kz-bar-logo:focus-visible { outline:2px solid var(--kz-ring); outline-offset:2px; }
        .kz-bar-left { display:flex; align-items:center; min-width:0; margin-left:18px; }
        .kz-bar-right { display:flex; align-items:center; gap:6px; margin-left:auto; }
        .kz-bar-search { display:inline-flex; align-items:center; gap:7px; height:32px; padding:0 8px 0 11px; border-radius:9999px; cursor:pointer;
          font:inherit; font-size:12.5px; color:var(--kz-text-secondary); background:var(--kz-surface-2); border:1px solid var(--kz-border-subtle);
          transition:background-color 150ms ease, border-color 150ms ease, color 150ms ease; }
        .kz-bar-search:hover { background:var(--kz-surface-3); border-color:var(--kz-border-default); color:var(--kz-text-primary); }
        .kz-bar-search kbd { font-family:var(--font-mono, monospace); font-size:10px; padding:2px 5px; border-radius:5px; color:var(--kz-text-secondary);
          background:var(--kz-surface-3); border:1px solid var(--kz-border-default); }
        .kz-bar-docs { display:inline-flex; align-items:center; height:32px; line-height:1; padding:0 12px; border-radius:9999px; font-size:13px; font-weight:500;
          color:var(--kz-text-secondary); text-decoration:none; white-space:nowrap; transition:color 150ms ease, background-color 150ms ease; }
        .kz-bar-docs:hover { color:var(--kz-text-primary); background:var(--kz-surface-2); }
        .kz-bar-divider { width:1px; height:16px; margin:0 2px; background:var(--kz-border-subtle); }
        .kz-bar-icon { display:inline-flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:9999px; padding:0;
          border:0; background:none; color:var(--kz-text-secondary); cursor:pointer; transition:color 150ms ease, background-color 150ms ease; }
        .kz-bar-icon:hover { color:var(--kz-text-primary); background:var(--kz-surface-2); }
        .kz-bar-lang { display:inline-flex; align-items:center; justify-content:center; width:32px; height:24px; border-radius:7px; cursor:pointer;
          font-family:var(--font-mono, monospace); font-size:11px; font-weight:600; letter-spacing:.04em; text-transform:uppercase;
          color:var(--kz-text-secondary); background:none; border:1px solid var(--kz-border-subtle); transition:border-color 150ms ease, color 150ms ease; }
        .kz-bar-lang:hover { color:var(--kz-text-primary); border-color:var(--kz-border-default); }
        #nav-contact-cta { display:inline-flex; align-items:center; height:32px; margin-left:4px; padding:0 14px; border-radius:9999px; font-size:12.5px;
          font-weight:700; text-decoration:none; white-space:nowrap; background:var(--kz-accent); color:var(--kz-on-accent); }
        .kz-bar-search:focus-visible, .kz-bar-docs:focus-visible, .kz-bar-icon:focus-visible, .kz-bar-lang:focus-visible, #nav-contact-cta:focus-visible,
        .kz-bar-burger:focus-visible { outline:2px solid var(--kz-ring); outline-offset:2px; }
        .kz-bar-burger { display:none; align-items:center; justify-content:center; width:36px; height:36px; border-radius:9999px; cursor:pointer;
          color:var(--kz-text-primary); background:color-mix(in srgb, var(--kz-surface-2) 60%, transparent); border:1px solid var(--kz-border-subtle); }
        @media (max-width: 1100px) { .kz-bar-search-text, .kz-bar-search kbd { display:none; } .kz-bar-search { width:32px; padding:0; justify-content:center; } }
        @media (max-width: 960px) { #nav-github-link, .kz-bar-divider { display:none; } .kz-bar-left { margin-left:10px; } }
        @media (max-width: 768px) {
          .kz-bar { padding:0 8px 0 16px; }
          .kz-bar-left, .kz-bar-docs, #nav-theme-toggle, .kz-bar-lang, #nav-contact-cta { display:none; }
          .kz-bar-search { width:36px; height:36px; background:none; border-color:transparent; }
          .kz-bar-burger { display:inline-flex; }
        }
        @media (prefers-reduced-motion: reduce) { .kz-bar { transition:background 300ms ease, border-color 300ms ease, box-shadow 300ms ease; } }
      `}</style>
    </>
  );
}

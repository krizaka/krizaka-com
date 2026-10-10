"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ChevronDownIcon, GlobeIcon, KnowledgeIcon, MoonIcon, SunIcon } from "@krizaka/icons";
import { useI18n } from "./I18nProvider";
import { useSiteTheme } from "./SiteTheme";
import { Dialog } from "@krizaka/ui/dialog";
import { NAV_COMPANY, NAV_DOCS, NAV_DOCS_HUB, NAV_PRODUCTS, companyLinkText, docsLinkText, isDocsActive, isDocsSection, isNavActive, localeless, productLinkText } from "@/lib/nav";
import { KrizakaLogo, ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";

/* ─── Mobile Menu Panel ─── */

export function MobilePanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t, toggleLocale } = useI18n();
  const { theme, toggleTheme } = useSiteTheme();
  const pathname = usePathname();
  const path = localeless(pathname);

  /* Close on route change */
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  /* The @krizaka/ui dialog, as a side panel: focus trap, Escape, scroll lock, focus back to the menu button. */
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content
        id="mobile-menu-panel"
        placement="right"
        closeLabel={t.nav.close}
        aria-describedby={undefined}
        className="max-w-[min(320px,85vw)] overflow-y-auto"
      >
        <Dialog.Header className="border-b border-border-subtle px-5 py-4">
          <Dialog.Title className="inline-flex items-center gap-2 font-display text-[15px]">
            <KrizakaLogo size={22} />
            Krizaka
          </Dialog.Title>
        </Dialog.Header>

        <nav aria-label={t.nav.menu} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Products — one accordion per product, the same entries as the desktop panel, in plain text (lib/nav.ts). The dialog mounts
            its content only while open: the links of a closed panel are never prefetched (performance). */}
        <div style={{ flex: 1, padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {NAV_PRODUCTS.map((p) => (
            <details key={p.id} className={cn("kz-mp-product", "brand-" + p.id)} open={path.startsWith(p.href)}>
              <summary>
                <span className="kz-mp-logo">
                  <ProductLogo id={p.id} size={26} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="kz-mp-name">{p.name}</span>
                  <span className="kz-mp-tagline">{t.site.nav[p.id].tagline}</span>
                </span>
                <ChevronDownIcon size={16} className="kz-mp-chevron" />
              </summary>
              <div className="kz-mp-links">
                {p.links.map((l) => (
                  <Link key={l.href} href={l.href} onClick={onClose} className={cn("kz-mp-link", isNavActive(l, path) && "is-active")}>
                    {productLinkText(t, p.id, l)}
                  </Link>
                ))}
              </div>
            </details>
          ))}

          {/* Docs: every documentation, the products' and the platform's (lib/nav.ts NAV_DOCS) */}
          <details className="kz-mp-product" open={isDocsSection(path)}>
            <summary>
              <span className="kz-mp-logo">
                <KnowledgeIcon size={20} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="kz-mp-name">{t.site.menu.docs}</span>
                <span className="kz-mp-tagline">{t.site.nav.docs.all.desc}</span>
              </span>
              <ChevronDownIcon size={16} className="kz-mp-chevron" />
            </summary>
            <div className="kz-mp-links">
              {NAV_DOCS.map((d) => (
                <Link key={d.id} href={d.href} onClick={onClose} className={cn("kz-mp-link", isDocsActive(d, path) && "is-active")}>
                  <ProductLogo id={d.id === "orazaka" || d.id === "orochia" ? d.id : "krizaka"} size={18} animated={false} /> {docsLinkText(t, d).label}
                </Link>
              ))}
              <Link href={NAV_DOCS_HUB} onClick={onClose} className={cn("kz-mp-link", path === NAV_DOCS_HUB && "is-active")}>
                <KnowledgeIcon size={18} /> {t.site.nav.docs.all.label}
              </Link>
            </div>
          </details>

          <div className="kz-mp-links" style={{ marginTop: "4px", paddingTop: "10px", borderTop: "1px solid var(--kz-border-subtle)" }}>
            {/* The desktop bar's other entries (story, open source, contact) live here on mobile. */}
            {NAV_COMPANY.map((l) => (
              <Link key={l.href} href={l.href} onClick={onClose} className={cn("kz-mp-link", isNavActive(l, path) && "is-active")}>
                {companyLinkText(t, l).label}
              </Link>
            ))}
          </div>
        </div>
        <style>{`
          .kz-mp-product { border-radius: 14px; border: 1px solid var(--kz-border-subtle); background: var(--kz-surface-2); overflow: hidden; }
          .kz-mp-product summary { display: flex; align-items: center; gap: 12px; padding: 12px 14px; cursor: pointer; list-style: none; }
          .kz-mp-product summary::-webkit-details-marker { display: none; }
          .kz-mp-logo { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 10px;
            background: var(--kz-surface-0); border: 1px solid var(--kz-border-subtle); flex-shrink: 0; }
          .kz-mp-name { display: block; font-family: var(--font-display), system-ui, sans-serif; font-size: 14px; font-weight: 700; color: var(--kz-text-primary); }
          .kz-mp-tagline { display: block; font-size: 12px; color: var(--kz-text-secondary); }
          .kz-mp-chevron { color: var(--kz-text-muted); transition: transform 200ms ease; flex-shrink: 0; }
          .kz-mp-product[open] .kz-mp-chevron { transform: rotate(180deg); }
          .kz-mp-product .kz-mp-links { padding: 0 8px 8px 58px; }
          .kz-mp-product summary:focus-visible, .kz-mp-link:focus-visible { outline: 2px solid var(--kz-ring); outline-offset: -2px; border-radius: 10px; }
          .kz-mp-links { display: flex; flex-direction: column; gap: 2px; }
          .kz-mp-link { display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 10px; border-radius: 8px; font-size: 14px; font-weight: 500;
            color: var(--kz-text-secondary); text-decoration: none; font-family: var(--font-display), system-ui, sans-serif; }
          .kz-mp-link svg { color: var(--kz-text-muted); }
          .kz-mp-link.is-active { color: var(--kz-accent-text); font-weight: 600; background: var(--kz-surface-1); }
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
            {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
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
            <GlobeIcon size={16} />
            {t.site.menu.otherLanguage}
          </button>
        </div>
        </nav>
      </Dialog.Content>
    </Dialog.Root>
  );
}

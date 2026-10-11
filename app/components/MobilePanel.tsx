"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ChevronDownIcon, GlobeIcon, KnowledgeIcon, MoonIcon, StudioIcon, SunIcon } from "@krizaka/icons";
import { useI18n } from "./I18nProvider";
import { useSiteTheme } from "./SiteTheme";
import { Dialog } from "@krizaka/ui/dialog";
import { NAV_BAR_LINKS, NAV_COMPANY, NAV_DOCS, NAV_DOCS_HUB, NAV_PRODUCTS, companyLinkText, docsLinkLogo, docsLinkText, isDocsActive, isNavActive, localeless, productLinkDesc, productLinkText } from "@/lib/nav";
import { NAV_ICONS, productLinkIcon } from "./ProductsMenu";
import { useContactHref } from "./useContactHref";
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
  const contact = useContactHref();
  const all = NAV_COMPANY.find((l) => l.icon === "products")!;

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
        {/* One panel, every destination once (lib/nav.ts): Products (an accordion per product, its entries readable — icon,
            label, short line), Docs, then Open source and Our story; Contact, theme and language at the bottom. The dialog
            mounts its content only while open: the links of a closed panel are never prefetched (performance). */}
        <div className="kz-mp">
          <section aria-labelledby="kz-mp-products">
            <h2 id="kz-mp-products" className="kz-mp-heading">{t.site.menu.products}</h2>
            <div className="kz-mp-stack">
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
                  <ul className="kz-mp-entries">
                    {p.links.map((l) => {
                      const Icon = productLinkIcon(p.id, l.icon);
                      const active = isNavActive(l, path);
                      return (
                        <li key={l.href}>
                          <Link href={l.href} onClick={onClose} className={cn("kz-mp-entry", active && "is-active")} aria-current={active ? "page" : undefined}>
                            <span className="kz-mp-entry-icon">
                              <Icon size={18} nodeColor="var(--kz-accent)" />
                            </span>
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span className="kz-mp-entry-label">{productLinkText(t, p.id, l)}</span>
                              <span className="kz-mp-entry-desc">{productLinkDesc(t, p.id, l)}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}
              <Link href={all.href} onClick={onClose} className={cn("kz-mp-link", isNavActive(all, path) && "is-active")}>
                <StudioIcon size={18} /> {companyLinkText(t, all).label}
              </Link>
            </div>
          </section>

          <section aria-labelledby="kz-mp-docs">
            <h2 id="kz-mp-docs" className="kz-mp-heading">{t.site.menu.docs}</h2>
            <div className="kz-mp-stack">
              {NAV_DOCS.map((d) => (
                <Link key={d.id} href={d.href} onClick={onClose} className={cn("kz-mp-link", isDocsActive(d, path) && "is-active")}>
                  <ProductLogo id={docsLinkLogo(d)} size={18} animated={false} /> {docsLinkText(t, d).label}
                </Link>
              ))}
              <Link href={NAV_DOCS_HUB} onClick={onClose} className={cn("kz-mp-link", path === NAV_DOCS_HUB && "is-active")}>
                <KnowledgeIcon size={18} /> {t.site.nav.docs.all.label}
              </Link>
            </div>
          </section>

          <section aria-label="Krizaka" className="kz-mp-stack kz-mp-company">
            {NAV_BAR_LINKS.map((l) => {
              const Icon = NAV_ICONS[l.icon];
              return (
                <Link key={l.href} href={l.href} onClick={onClose} className={cn("kz-mp-link", isNavActive(l, path) && "is-active")}>
                  <Icon size={18} /> {companyLinkText(t, l).label}
                </Link>
              );
            })}
          </section>
        </div>
        <style>{`
          .kz-mp { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 20px; }
          .kz-mp-heading { margin: 0 4px 8px; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
            color: var(--kz-text-secondary); }
          .kz-mp-stack { display: flex; flex-direction: column; gap: 4px; }
          .kz-mp-company { padding-top: 14px; border-top: 1px solid var(--kz-border-subtle); }
          .kz-mp-product { border-radius: 14px; border: 1px solid var(--kz-border-subtle); background: var(--kz-surface-2); overflow: hidden; margin-bottom: 4px; }
          .kz-mp-product summary { display: flex; align-items: center; gap: 12px; min-height: 60px; padding: 10px 14px; cursor: pointer; list-style: none; }
          .kz-mp-product summary::-webkit-details-marker { display: none; }
          .kz-mp-logo { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 10px;
            background: var(--kz-surface-0); border: 1px solid var(--kz-border-subtle); flex-shrink: 0; }
          .kz-mp-name { display: block; font-family: var(--font-display), system-ui, sans-serif; font-size: 15px; font-weight: 700; color: var(--kz-text-primary); }
          .kz-mp-product[open] .kz-mp-name { color: var(--kz-accent-text); }
          .kz-mp-tagline { display: block; font-size: 12.5px; color: var(--kz-text-secondary); }
          .kz-mp-chevron { color: var(--kz-text-muted); transition: transform 200ms ease; flex-shrink: 0; }
          .kz-mp-product[open] .kz-mp-chevron { transform: rotate(180deg); }
          .kz-mp-entries { list-style: none; margin: 0; padding: 0 6px 8px; display: flex; flex-direction: column; gap: 2px; }
          .kz-mp-entry { display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 8px 10px; border-radius: 10px; text-decoration: none; }
          .kz-mp-entry.is-active { background: var(--kz-surface-1); }
          .kz-mp-entry-icon { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
            color: var(--kz-text-primary); background: color-mix(in srgb, var(--kz-accent) 12%, var(--kz-surface-0));
            border: 1px solid color-mix(in srgb, var(--kz-accent) 28%, var(--kz-border-subtle)); }
          .kz-mp-entry-label { display: block; font-family: var(--font-display), system-ui, sans-serif; font-size: 15px; font-weight: 600; color: var(--kz-text-primary); }
          .kz-mp-entry.is-active .kz-mp-entry-label { color: var(--kz-accent-text); }
          .kz-mp-entry-desc { display: block; margin-top: 2px; font-size: 13px; line-height: 1.35; color: var(--kz-text-secondary); }
          .kz-mp-link { display: flex; align-items: center; gap: 12px; min-height: 48px; padding: 0 12px; border-radius: 10px; font-size: 15px; font-weight: 500;
            color: var(--kz-text-primary); text-decoration: none; font-family: var(--font-display), system-ui, sans-serif; }
          .kz-mp-link svg { color: var(--kz-text-secondary); flex-shrink: 0; }
          .kz-mp-link.is-active { color: var(--kz-accent-text); font-weight: 600; background: var(--kz-surface-2); }
          .kz-mp-link.is-active svg { color: var(--kz-accent); }
          .kz-mp-product summary:focus-visible, .kz-mp-link:focus-visible, .kz-mp-entry:focus-visible { outline: 2px solid var(--kz-ring); outline-offset: -2px; border-radius: 10px; }
          @media (prefers-reduced-motion: reduce) { .kz-mp-chevron { transition: none; } }
        `}</style>

        {/* Contact, then the preferences (theme, language) side by side */}
        <div className="kz-mp-foot">
          <Link href={contact} onClick={onClose} className="kz-mp-cta btn-sheen">
            {t.site.menu.contactCta}
          </Link>
          <div className="kz-mp-prefs" role="group" aria-label={t.site.menu.preferences}>
            <button id="mobile-theme-toggle" type="button" onClick={toggleTheme} className="kz-mp-pref">
              {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
              {theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
            </button>
            <button id="mobile-lang-toggle" type="button" onClick={toggleLocale} className="kz-mp-pref" lang={t.site.menu.languageShort.toLowerCase()}>
              <GlobeIcon size={16} />
              {t.site.menu.otherLanguage}
            </button>
          </div>
          <style>{`
            .kz-mp-foot { padding: 16px; border-top: 1px solid var(--kz-border-subtle); display: flex; flex-direction: column; gap: 10px; }
            .kz-mp-cta { display: flex; align-items: center; justify-content: center; min-height: 48px; border-radius: 9999px; font-size: 15px; font-weight: 700;
              text-decoration: none; background: var(--kz-accent); color: var(--kz-on-accent); }
            .kz-mp-prefs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .kz-mp-pref { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 10px; border-radius: 10px;
              font: inherit; font-size: 13px; font-weight: 500; color: var(--kz-text-primary); background: var(--kz-surface-2);
              border: 1px solid var(--kz-border-subtle); cursor: pointer; }
            .kz-mp-cta:focus-visible, .kz-mp-pref:focus-visible { outline: 2px solid var(--kz-ring); outline-offset: 2px; }
          `}</style>
        </div>
        </nav>
      </Dialog.Content>
    </Dialog.Root>
  );
}

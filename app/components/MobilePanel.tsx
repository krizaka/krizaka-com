"use client";

/* The mobile panel (below md), inside @krizaka/ui's NavBar.Mobile (a disclosure under the bar: Escape and a link close
   it, the focus returns to the toggle). One panel, every destination once (lib/nav.ts): Products — an accordion per
   product whose entries read clearly (icon, label, a short line, 56 px targets) — and All products; Docs; Open source
   and Our story; then Contact us, theme and language. */

import Link from "next/link";
import { ChevronDownIcon, GlobeIcon, KnowledgeIcon, MoonIcon, StudioIcon, SunIcon } from "@krizaka/icons";
import { NavBar } from "@krizaka/ui/nav-bar";
import { Button } from "@krizaka/ui/button";
import { ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { useI18n } from "./I18nProvider";
import { ProductStatus } from "./ProductStatus";
import { useSiteTheme } from "./SiteTheme";
import { useContactHref } from "./useContactHref";
import { NAV_ICONS, productLinkIcon } from "./ProductsMenu";
import {
  NAV_BAR_LINKS,
  NAV_COMPANY,
  NAV_DOCS,
  NAV_DOCS_HUB,
  NAV_PRODUCTS,
  companyLinkText,
  docsLinkLogo,
  docsLinkText,
  docsSectionOf,
  isNavActive,
  productLinkDesc,
  productLinkText,
} from "@/lib/nav";

const heading = "mx-1 mb-2 mt-0 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-secondary";
const row = "gap-3 [&>svg]:shrink-0 [&>svg]:text-fg-secondary aria-[current=page]:bg-surface-2 aria-[current=page]:font-semibold";

export function MobilePanel({ path }: { path: string }) {
  const { t, toggleLocale } = useI18n();
  const { theme, toggleTheme } = useSiteTheme();
  const contact = useContactHref();
  const all = NAV_COMPANY.find((l) => l.icon === "products")!;

  return (
    <NavBar.Mobile openLabel={t.nav.menu} closeLabel={t.nav.close} className="max-h-[calc(100dvh-6rem)] gap-5 overflow-y-auto overscroll-contain p-3">
      <section aria-labelledby="kz-mp-products">
        <h2 id="kz-mp-products" className={heading}>
          {t.site.menu.products}
        </h2>
        <div className="flex flex-col gap-1.5">
          {NAV_PRODUCTS.map((p) => (
            <details key={p.id} className={cn("brand-" + p.id, "group/product overflow-hidden rounded-2xl border border-border-subtle bg-surface-2")} open={path.startsWith(p.href)}>
              <summary className="flex min-h-15 cursor-pointer list-none items-center gap-3 rounded-2xl px-3.5 py-2.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                <span className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[10px] border border-border-subtle bg-surface-0">
                  <ProductLogo id={p.id} size={26} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 whitespace-nowrap font-display text-[15px] font-bold text-fg group-open/product:text-fg-accent">
                    {p.name}
                    {p.status && <ProductStatus status={p.status} t={t} />}
                  </span>
                  <span className="block text-[12.5px] text-fg-secondary">{t.site.nav[p.id].tagline}</span>
                </span>
                <ChevronDownIcon size={16} className="shrink-0 text-fg-muted transition-transform duration-200 group-open/product:rotate-180 motion-reduce:transition-none" />
              </summary>
              <ul className="m-0 flex list-none flex-col gap-0.5 px-1.5 pb-2">
                {p.links.map((l) => {
                  const Icon = productLinkIcon(p.id, l.icon);
                  const active = isNavActive(l, path);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        className="flex min-h-14 items-center gap-3 rounded-xl px-2.5 py-2 no-underline hover:bg-surface-1 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring aria-[current=page]:bg-surface-1"
                      >
                        <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-[9px] border border-border-default bg-surface-1 text-fg-accent">
                          <Icon size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block font-display text-[15px] font-semibold", active ? "text-fg-accent" : "text-fg")}>{productLinkText(t, p.id, l)}</span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-fg-secondary">{productLinkDesc(t, p.id, l)}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          ))}
          <NavBar.MobileLink asChild active={isNavActive(all, path)} className={row}>
            <Link href={all.href}>
              <span className="flex items-center gap-3">
                <StudioIcon size={18} /> {companyLinkText(t, all).label}
              </span>
            </Link>
          </NavBar.MobileLink>
        </div>
      </section>

      <section aria-labelledby="kz-mp-docs">
        <h2 id="kz-mp-docs" className={heading}>
          {t.site.menu.docs}
        </h2>
        <div className="flex flex-col gap-0.5">
          {NAV_DOCS.map((d) => (
            <NavBar.MobileLink key={d.id} asChild active={docsSectionOf(path)?.id === d.id} className={row}>
              <Link href={d.href}>
                <span className="flex items-center gap-3">
                  <ProductLogo id={docsLinkLogo(d)} size={18} animated={false} /> {docsLinkText(t, d).label}
                </span>
              </Link>
            </NavBar.MobileLink>
          ))}
          <NavBar.MobileLink asChild active={path === NAV_DOCS_HUB} className={row}>
            <Link href={NAV_DOCS_HUB}>
              <span className="flex items-center gap-3">
                <KnowledgeIcon size={18} /> {t.site.nav.docs.all.label}
              </span>
            </Link>
          </NavBar.MobileLink>
        </div>
      </section>

      <section aria-label="Krizaka" className="flex flex-col gap-0.5 border-t border-border-subtle pt-3">
        {NAV_BAR_LINKS.map((l) => {
          const Icon = NAV_ICONS[l.icon];
          return (
            <NavBar.MobileLink key={l.href} asChild active={isNavActive(l, path)} className={row}>
              <Link href={l.href}>
                <span className="flex items-center gap-3">
                  <Icon size={18} /> {companyLinkText(t, l).label}
                </span>
              </Link>
            </NavBar.MobileLink>
          );
        })}
      </section>

      <div className="flex flex-col gap-2.5 border-t border-border-subtle pt-3">
        <Button asChild variant="primary" shape="cut" size="lg" className="w-full">
          <Link href={contact}>{t.site.menu.contactCta}</Link>
        </Button>
        <div role="group" aria-label={t.site.menu.preferences} className="grid grid-cols-2 gap-2">
          <Button type="button" variant="secondary" onClick={toggleTheme} className="min-h-11">
            {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            {theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
          </Button>
          <Button type="button" variant="secondary" onClick={toggleLocale} className="min-h-11" lang={t.site.menu.languageShort.toLowerCase()}>
            <GlobeIcon size={16} />
            {t.site.menu.otherLanguage}
          </Button>
        </div>
      </div>
    </NavBar.Mobile>
  );
}

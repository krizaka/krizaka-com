"use client";

/* The mobile panel (below md), inside @krizaka/ui's NavBar.Mobile (a disclosure under the bar: Escape and a link close
   it, the focus returns to the toggle). One panel, every destination once (lib/nav.ts): this site's sections
   (Products, Open source, Our story), Contact us, theme and language — then the Krizaka family at the bottom (NAV-SYS):
   the products, the open-source stack and GitHub, each on its own site. */

import type { ComponentType } from "react";
import Link from "next/link";
import { BookmarkIcon, GlobeIcon, MoonIcon, PackIcon, StudioIcon, SunIcon, type IconProps } from "@krizaka/icons";
import { NavBar } from "@krizaka/ui/nav-bar";
import { Button } from "@krizaka/ui/button";
import { useI18n } from "./I18nProvider";
import { useSiteTheme } from "./SiteTheme";
import { useContactHref } from "./useContactHref";
import { FamilyIcon, familyShortLine } from "./FamilySwitcher";
import { NAV_BAR_LINKS, NAV_FAMILY, companyLinkText, isNavActive, type FamilyEntry } from "@/lib/nav";

const ICONS: Record<string, ComponentType<IconProps>> = { products: StudioIcon, repos: PackIcon, story: BookmarkIcon };
const heading = "mx-1 mb-2 mt-0 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-secondary";
const row = "gap-3 [&>svg]:shrink-0 [&>svg]:text-fg-secondary aria-[current=page]:bg-surface-2 aria-[current=page]:font-semibold";

export function MobilePanel({ path }: { path: string }) {
  const { t, toggleLocale } = useI18n();
  const { theme, toggleTheme } = useSiteTheme();
  const contact = useContactHref();
  const f = t.site.nav.family;

  const family = (entry: FamilyEntry) => (
    <NavBar.MobileLink key={entry.id} href={entry.href} target="_blank" rel="noopener noreferrer" className={row}>
      <span className="flex min-w-0 items-center gap-3">
        <FamilyIcon entry={entry} size={18} />
        <span className="flex min-w-0 flex-col">
          <span>{entry.name}</span>
          <span className="text-xs font-normal text-fg-secondary">{familyShortLine(t, entry)}</span>
        </span>
      </span>
    </NavBar.MobileLink>
  );

  return (
    <NavBar.Mobile openLabel={t.nav.menu} closeLabel={t.nav.close} className="max-h-[calc(100dvh-6rem)] gap-5 overflow-y-auto overscroll-contain p-3">
      <section aria-label="Krizaka" className="flex flex-col gap-0.5">
        {NAV_BAR_LINKS.map((l) => {
          const Icon = ICONS[l.icon] ?? StudioIcon;
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

      <section aria-labelledby="kz-mp-family" className="border-t border-border-subtle pt-3">
        <h2 id="kz-mp-family" className={heading}>
          {f.label}
        </h2>
        <p className={heading}>{f.productsTitle}</p>
        <div className="mb-3 flex flex-col gap-0.5">{NAV_FAMILY.products.map(family)}</div>
        <p className={heading}>{f.stackTitle}</p>
        <div className="flex flex-col gap-0.5">
          {NAV_FAMILY.stack.map(family)}
          {family(NAV_FAMILY.github)}
        </div>
      </section>
    </NavBar.Mobile>
  );
}

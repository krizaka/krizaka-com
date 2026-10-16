"use client";

/* The mobile panel (below md), inside @krizaka/ui's NavBar.Mobile (a disclosure under the bar: Escape and a link close
   it, the focus returns to the toggle). One panel, every destination once (lib/nav.ts): this site's sections
   (Products, Open source, Our story), Contact us, theme and language. No family switcher here: it
   belongs to ui.krizaka.com and java.krizaka.com. */

import type { ComponentType } from "react";
import Link from "next/link";
import { BookmarkIcon, GlobeIcon, MessageIcon, MoonIcon, PackIcon, StudioIcon, SunIcon, type IconProps } from "@krizaka/icons";
import { NavBar } from "@krizaka/ui/nav-bar";
import { Button } from "@krizaka/ui/button";
import { useI18n } from "./I18nProvider";
import { useSiteTheme } from "./SiteTheme";
import { useContactHref } from "./useContactHref";
import { BLOG_URL } from "@/lib/site";
import { NAV_BAR_LINKS, companyLinkText, isNavActive } from "@/lib/nav";

const ICONS: Record<string, ComponentType<IconProps>> = { products: StudioIcon, repos: PackIcon, story: BookmarkIcon };
const row = "gap-3 [&>svg]:shrink-0 [&>svg]:text-fg-secondary aria-[current=page]:bg-surface-2 aria-[current=page]:font-semibold";

export function MobilePanel({ path }: { path: string }) {
  const { t, locale, toggleLocale } = useI18n();
  const { theme, toggleTheme } = useSiteTheme();
  const contact = useContactHref();

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
        <NavBar.MobileLink asChild className={row}>
          <a href={BLOG_URL}>
            <span className="flex items-center gap-3">
              <MessageIcon size={18} /> {t.site.menu.blog}
            </span>
          </a>
        </NavBar.MobileLink>
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

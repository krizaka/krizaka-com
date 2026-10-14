"use client";

/* The site bar (NAV-SYS), built on @krizaka/ui's NavBar (floating, tightening on scroll, one light gliding between the
   items and resting on the current page) and fed by lib/nav.ts. Three zones:
   - left, who we are: the Krizaka mark (home), then NavBar.Family (@krizaka/ui/sites: every site of the family);
   - centre, this site: Products · Open source · Our story;
   - right, tools: Repo · theme · language · Contact us.
   No search and no "Docs": the site has five pages, and the documentation lives on ui.krizaka.com and java.krizaka.com.
   While /docs still renders here, its pages keep their breadcrumb and the search over them (DocsCrumb, SearchCommand).
   Below md: the mark, the family switcher and the mobile panel's toggle. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MoonIcon, SearchIcon, SunIcon } from "@krizaka/icons";
import { NavBar } from "@krizaka/ui/nav-bar";
import { familyLabels } from "@krizaka/ui/sites";
import { Button } from "@krizaka/ui/button";
import { Kbd } from "@krizaka/ui/kbd";
import { KrizakaLogo } from "@krizaka/ui";
import { useI18n } from "./I18nProvider";
import { useSiteTheme } from "./SiteTheme";
import { SITE_REPO_URL } from "@/lib/site";
import { NAV_BAR_LINKS, companyLinkText, isDocsSection, isNavActive, localeless } from "@/lib/nav";
import { MobilePanel } from "./MobilePanel";
import { SearchCommand } from "./SearchCommand";
import { DocsCrumb } from "./DocsCrumb";
import { useContactHref } from "./useContactHref";

export default function TopNavBar() {
  const { t, locale, toggleLocale } = useI18n();
  const m = t.site.menu;
  const contactHref = useContactHref();
  const { theme, toggleTheme } = useSiteTheme();
  const path = localeless(usePathname());
  const docs = isDocsSection(path);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="kz-site-bar-wrap pointer-events-none fixed inset-x-0 top-3 z-50">
        <NavBar.Root label={m.mainAria} className="kz-site-bar pointer-events-auto" data-frame={path.startsWith("/docs/") ? "docs" : undefined}>
          <NavBar.Brand asChild>
            <Link href="/" aria-label={m.homeAria}>
              <KrizakaLogo size={26} />
            </Link>
          </NavBar.Brand>
          <NavBar.Family current="krizaka" labels={familyLabels[locale]} />

          <NavBar.Items>
            {!docs &&
              NAV_BAR_LINKS.map((l) => (
                <NavBar.Link key={l.href} asChild active={isNavActive(l, path)}>
                  <Link href={l.href}>{companyLinkText(t, l).label}</Link>
                </NavBar.Link>
              ))}
          </NavBar.Items>
          {docs && <DocsCrumb pathname={path} />}

          <NavBar.Actions className="gap-1">
            {docs && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                shape="pill"
                onClick={() => setSearchOpen(true)}
                aria-label={m.searchAria}
                aria-keyshortcuts="Meta+K Control+K"
                className="w-9 px-0 font-normal text-fg-secondary lg:w-auto lg:pl-3 lg:pr-1.5"
              >
                <SearchIcon size={14} />
                <span className="hidden lg:inline">{m.search}</span>
                <Kbd className="hidden lg:inline-flex">⌘K</Kbd>
              </Button>
            )}

            <NavBar.Repo href={SITE_REPO_URL} label={m.githubAria} className="hidden lg:inline-flex" />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              shape="pill"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t.nav.lightMode : t.nav.darkMode}
              className="hidden h-9 w-9 md:inline-flex"
            >
              {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleLocale}
              aria-label={m.switchLanguage}
              className="hidden h-7 w-9 px-0 font-mono text-[11px] font-semibold tracking-wide md:inline-flex"
            >
              {m.languageShort}
            </Button>

            <Button asChild variant="primary" size="sm" shape="cut" className="ml-1 hidden font-bold md:inline-flex">
              <Link href={contactHref}>{m.contactCta}</Link>
            </Button>

            <MobilePanel path={path} />
          </NavBar.Actions>
        </NavBar.Root>
      </div>

      {docs && <SearchCommand open={searchOpen} setOpen={setSearchOpen} />}
    </>
  );
}

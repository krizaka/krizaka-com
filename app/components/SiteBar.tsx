"use client";

/* The site bar (NAV-SYS), built on @krizaka/ui's NavBar (floating, tightening on scroll, one light gliding between the
   items and resting on the current page) and fed by lib/nav.ts. Three zones:
   - left, who we are: the Krizaka mark and the word "Krizaka" — the home, where the products are presented (two views
     only, 2026-10-17); no family switcher on the company's own site (ui.krizaka.com and java.krizaka.com carry it);
   - centre, this site: Open source (the story is in the footer);
   - right, tools: Blog (blog.krizaka.com) · Repo · theme · language · Contact us, the one primary action.
   No search and no "Docs": the documentation lives on ui.krizaka.com and java.krizaka.com.
   While /docs still renders here, its pages keep their breadcrumb and the search over them (DocsCrumb, SearchCommand).
   Below md: the mark and the mobile panel's toggle. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MoonIcon, SearchIcon, SunIcon } from "@krizaka/icons";
import { NavBar } from "@krizaka/ui/nav-bar";
import { Button } from "@krizaka/ui/button";
import { Kbd } from "@krizaka/ui/kbd";
import { KrizakaLogo } from "@krizaka/ui";
import { useI18n } from "./I18nProvider";
import { useLanguageSwitch } from "./LanguageSwitch";
import { useSiteTheme } from "./SiteTheme";
import { BLOG_URL, SITE_REPO_URL } from "@/lib/site";
import { NAV_BAR_LINKS, companyLinkText, isDocsSection, isNavActive, localeless } from "@/lib/nav";
import { MobilePanel } from "./MobilePanel";
import { SearchCommand } from "./SearchCommand";
import { DocsCrumb } from "./DocsCrumb";
import { useContactHref } from "./useContactHref";

export default function SiteBar() {
  const { t } = useI18n();
  const language = useLanguageSwitch();
  const m = t.site.menu;
  const contactHref = useContactHref();
  const { theme, toggleTheme } = useSiteTheme();
  const path = localeless(usePathname());
  const docs = isDocsSection(path);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="kz-site-bar-wrap pointer-events-none fixed inset-x-0 top-3 z-50">
        <NavBar.Root
          label={m.mainAria}
          className="kz-site-bar pointer-events-auto"
          data-frame={path.startsWith("/docs/") ? "docs" : undefined}
        >
          <NavBar.Brand asChild>
            <Link href="/" aria-label={m.homeAria} className="kz-site-brand">
              <KrizakaLogo size={26} />
              <span className="kz-site-brand-word">Krizaka</span>
            </Link>
          </NavBar.Brand>

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

            <Button asChild variant="ghost" size="sm" shape="pill" className="hidden font-semibold md:inline-flex">
              <a href={BLOG_URL}>{m.blog}</a>
            </Button>

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

            <span className="hidden md:inline-flex">
              <NavBar.Language {...language} />
            </span>

            <Button asChild variant="primary" size="sm" className="ml-1 hidden font-bold md:inline-flex">
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

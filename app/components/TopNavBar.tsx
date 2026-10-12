"use client";

/* The site bar, built on @krizaka/ui's NavBar (floating, tightening on scroll, one light gliding between the items and
   resting on the current page, Radix menus) and fed by lib/nav.ts. Left: the mark · Products (the one menu, two
   columns) · Open source · Our story. Right: Search ⌘K · Docs (a plain link to the hub — never a second menu, so no
   panel covers another) · GitHub · theme · language · Contact us. Under /docs the left group becomes the documentation
   breadcrumb. Below md: the mark, the search and the mobile panel's toggle. */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MoonIcon, SearchIcon, SunIcon } from "@krizaka/icons";
import { NavBar } from "@krizaka/ui/nav-bar";
import { Button } from "@krizaka/ui/button";
import { Kbd } from "@krizaka/ui/kbd";
import { KrizakaLogo } from "@krizaka/ui";
import { useI18n } from "./I18nProvider";
import { useSiteTheme } from "./SiteTheme";
import { GITHUB_ORG_URL } from "@/lib/site";
import { NAV_BAR_LINKS, NAV_DOCS_HUB, companyLinkText, isDocsSection, isNavActive, localeless } from "@/lib/nav";
import { MobilePanel } from "./MobilePanel";
import { SearchCommand } from "./SearchCommand";
import { DocsCrumb, ProductsPanel } from "./ProductsMenu";
import { useContactHref } from "./useContactHref";
import { GitHubMark } from "./brand/GitHubMark";

export default function TopNavBar() {
  const { t, toggleLocale } = useI18n();
  const m = t.site.menu;
  const contactHref = useContactHref();
  const { theme, toggleTheme } = useSiteTheme();
  const path = localeless(usePathname());
  const docs = isDocsSection(path);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="kz-site-bar-wrap pointer-events-none fixed inset-x-0 top-3 z-50">
        <NavBar.Root label={t.site.menu.mainAria} className="kz-site-bar pointer-events-auto" data-frame={path.startsWith("/docs/") ? "docs" : undefined}>
          <NavBar.Brand asChild>
            <Link href="/">
              <KrizakaLogo size={26} />
              Krizaka
            </Link>
          </NavBar.Brand>

          {docs ? (
            <DocsCrumb pathname={path} />
          ) : (
            <NavBar.Items>
              <NavBar.Menu value="products" label={m.products} active={path.startsWith("/products")}>
                <ProductsPanel pathname={path} />
              </NavBar.Menu>
              {NAV_BAR_LINKS.map((l) => (
                <NavBar.Link key={l.href} asChild active={isNavActive(l, path)}>
                  <Link href={l.href}>{companyLinkText(t, l).label}</Link>
                </NavBar.Link>
              ))}
            </NavBar.Items>
          )}

          <NavBar.Actions className="gap-1">
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

            {!docs && (
              <Button asChild variant="ghost" size="sm" shape="pill" className="hidden text-sm font-medium md:inline-flex">
                <Link href={NAV_DOCS_HUB}>{m.docs}</Link>
              </Button>
            )}

            <span aria-hidden className="mx-1 hidden h-4 w-px bg-border-subtle lg:block" />

            <Button asChild variant="ghost" size="icon" shape="pill" className="hidden h-9 w-9 lg:inline-flex">
              <a href={GITHUB_ORG_URL} target="_blank" rel="noopener noreferrer" aria-label={m.githubAria}>
                <GitHubMark size={15} />
              </a>
            </Button>

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

      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />
    </>
  );
}

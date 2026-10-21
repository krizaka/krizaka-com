"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteFooter as FamilyFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";
import { useI18n } from "./I18nProvider";
import { BLOG_URL } from "@/lib/site";
import { PRODUCTS_ANCHOR } from "@/lib/nav";
import { useContactHref } from "./useContactHref";
import { PLATFORM, changelogHref } from "@/lib/changelog-data";
import { format } from "@/lib/i18n";

/* The footer (NAV-SYS) is @krizaka/ui's SiteFooter: this site's own column (its pages), the Krizaka family in columns
   (fed by @krizaka/ui/sites, the same on every site), the signature, Montréal. The legal links end the signature line. */
export default function SiteFooter() {
  const { t, locale } = useI18n();
  const f = t.site.footer;
  const contactHref = useContactHref();
  const pathname = usePathname();
  // Locale-prefixed addresses: an unprefixed href answers a 307 from proxy.ts, and Next.js skips its scroll-to-top for a
  // navigation that went through a redirect (the visitor arrived mid-page, 2026-10-21). The prefix goes straight to the page.
  const to = (path: string) => `/${locale}${path === "/" ? "" : path.startsWith("/#") ? path.slice(1) : path}`;
  const here = (path: string) => (pathname === to(path.split(/[?#]/)[0]!) ? ("page" as const) : undefined);

  return (
    <FamilyFooter
      current="krizaka"
      variant="site"
      labels={familyLabels[locale]}
      aria-label={t.site.menu.footerAria}
      legal={
        <>
          {PLATFORM.site && (
            <FamilyFooter.Link asChild>
              <Link href={to(changelogHref())} prefetch={false} aria-current={here(changelogHref())}>
                {format(f.version, { version: PLATFORM.site, ui: PLATFORM.ui })}
              </Link>
            </FamilyFooter.Link>
          )}
          <FamilyFooter.Link asChild>
            <Link href={to("/privacy")} prefetch={false} aria-current={here("/privacy")}>{f.privacy}</Link>
          </FamilyFooter.Link>
          <FamilyFooter.Link asChild>
            <Link href={to("/terms")} prefetch={false} aria-current={here("/terms")}>{f.terms}</Link>
          </FamilyFooter.Link>
        </>
      }
    >
      <FamilyFooter.Column title={f.siteColumn}>
        <FamilyFooter.Link asChild>
          <Link href={to(PRODUCTS_ANCHOR)} prefetch={false}>{f.allProducts}</Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href={to("/open-source")} prefetch={false} aria-current={here("/open-source")}>{f.openSource}</Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href={to("/story")} prefetch={false} aria-current={here("/story")}>{f.story}</Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href={to("/changelog")} prefetch={false} aria-current={here("/changelog")}>{f.changelog}</Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <a href={BLOG_URL}>{f.blog}</a>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href={to(contactHref)} aria-current={here("/contact")}>{f.contact}</Link>
        </FamilyFooter.Link>
      </FamilyFooter.Column>
    </FamilyFooter>
  );
}

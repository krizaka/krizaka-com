"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteFooter as FamilyFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";
import { useI18n } from "./I18nProvider";
import { PRODUCTS_ANCHOR } from "@/lib/nav";
import { PRODUCT_IDS } from "@/lib/product-hosts";
import { PLATFORM } from "@/lib/changelog-data";
import { format } from "@/lib/i18n";
import { COMPANY } from "@/lib/site";

/* The footer (NAV-SYS) is @krizaka/ui's SiteFooter, one calm band (krizaka-ui#434): this site's own column — only what
   the family's columns do not hold (the products, open source, the changelog) — beside the family's (Products · Open
   source · Krizaka: our story, the blog, contact, from @krizaka/ui/sites), then one line: the signature, Montréal and the
   legal links. Nothing twice. */
export default function SiteFooter() {
  const { t, locale } = useI18n();
  const f = t.site.footer;
  const pathname = usePathname();
  // Locale-prefixed addresses: an unprefixed href answers a 307 from proxy.ts, and Next.js skips its scroll-to-top for a
  // navigation that went through a redirect (the visitor arrived mid-page, 2026-10-21). The prefix goes straight to the page.
  const to = (path: string) => `/${locale}${path === "/" ? "" : path.startsWith("/#") ? path.slice(1) : path}`;
  const here = (path: string) => (pathname === to(path.split(/[?#]/)[0]!) ? ("page" as const) : undefined);

  return (
    <FamilyFooter
      current="krizaka"
      products={PRODUCT_IDS}
      path={pathname}
      variant="site"
      // The signature names the company as it is registered (Technologies Krizaka, lib/site.ts COMPANY), not « Krizaka »:
      // the words are this site's, the component only places them (krizaka-ui: the host provides them).
      labels={{
        ...familyLabels[locale],
        signature: { ...familyLabels[locale].signature, company: format(f.signature, COMPANY) },
      }}
      aria-label={t.site.menu.footerAria}
      legal={
        <>
          {/* Who publishes the site, as the law asks: the legal name and the NEQ (lib/site.ts COMPANY), never an address. */}
          <span className="kz-footer-company">{format(f.company, COMPANY)}</span>
          {/* krizaka.com's own version only (release-please, package.json), on its GitHub release: the versions of the
              packages it runs on belong to a deployment, not to the page (2026-10-24). */}
          {PLATFORM.site && (
            <FamilyFooter.Link asChild>
              <a href={PLATFORM.release}>{format(f.version, { version: PLATFORM.site })}</a>
            </FamilyFooter.Link>
          )}
          <FamilyFooter.Link asChild>
            <Link href={to("/privacy")} prefetch={false} aria-current={here("/privacy")}>
              {f.privacy}
            </Link>
          </FamilyFooter.Link>
          <FamilyFooter.Link asChild>
            <Link href={to("/terms")} prefetch={false} aria-current={here("/terms")}>
              {f.terms}
            </Link>
          </FamilyFooter.Link>
        </>
      }
    >
      <FamilyFooter.Column title={f.siteColumn}>
        <FamilyFooter.Link asChild>
          <Link href={to(PRODUCTS_ANCHOR)} prefetch={false}>
            {f.allProducts}
          </Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href={to("/open-source")} prefetch={false} aria-current={here("/open-source")}>
            {f.openSource}
          </Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href={to("/services")} prefetch={false} aria-current={here("/services")}>
            {f.services}
          </Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href={to("/changelog")} prefetch={false} aria-current={here("/changelog")}>
            {f.changelog}
          </Link>
        </FamilyFooter.Link>
      </FamilyFooter.Column>
    </FamilyFooter>
  );
}

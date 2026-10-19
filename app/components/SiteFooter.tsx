"use client";

import Link from "next/link";
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

  return (
    <FamilyFooter
      current="krizaka"
      labels={familyLabels[locale]}
      aria-label={t.site.menu.footerAria}
      legal={
        <>
          {PLATFORM.site && (
            <FamilyFooter.Link asChild>
              <Link href={changelogHref()} prefetch={false}>
                {format(f.version, { version: PLATFORM.site, ui: PLATFORM.ui })}
              </Link>
            </FamilyFooter.Link>
          )}
          <FamilyFooter.Link asChild>
            <Link href="/privacy" prefetch={false}>{f.privacy}</Link>
          </FamilyFooter.Link>
          <FamilyFooter.Link asChild>
            <Link href="/terms" prefetch={false}>{f.terms}</Link>
          </FamilyFooter.Link>
        </>
      }
    >
      <FamilyFooter.Column title="Krizaka">
        <FamilyFooter.Link asChild>
          <Link href={PRODUCTS_ANCHOR} prefetch={false}>{f.allProducts}</Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href="/open-source" prefetch={false}>{f.openSource}</Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href="/story" prefetch={false}>{f.story}</Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href="/changelog" prefetch={false}>{f.changelog}</Link>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <a href={BLOG_URL}>{f.blog}</a>
        </FamilyFooter.Link>
        <FamilyFooter.Link asChild>
          <Link href={contactHref}>{f.contact}</Link>
        </FamilyFooter.Link>
      </FamilyFooter.Column>
    </FamilyFooter>
  );
}

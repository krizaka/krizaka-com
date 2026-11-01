"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { resolveFooterSettings, SiteFooter as FamilyFooter } from "@krizaka/ui/site-footer";
import { familyLabels } from "@krizaka/ui/sites";
import { useI18n } from "./I18nProvider";
import { PLATFORM } from "@/lib/changelog-data";
import { footerSettings, localized, messageAt } from "@/lib/footer";

/* The footer (NAV-SYS) is @krizaka/ui's SiteFooter drawn from `config` (founder, 2026-11-01: « formaté comme l'admin le
   configure »): lib/footer.ts holds it in the exact settings shape the apps store, this component only resolves its words
   and locale. Three columns — products, open source, Krizaka — then one legal line that names the company once, with
   krizaka.com's own version (release-please, on its GitHub release), never the packages'. */
export default function SiteFooter() {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const settings = {
    ...footerSettings,
    columns: footerSettings.columns.map((c) => ({
      ...c,
      links: c.links.map((l) => ({ ...l, href: localized(l.href, locale) })),
    })),
    legal: {
      ...footerSettings.legal,
      versionHref: PLATFORM.release,
      links: footerSettings.legal.links.map((l) => ({ ...l, href: localized(l.href, locale) })),
    },
  };
  const config = resolveFooterSettings(settings, (key) => messageAt({ site: t.site }, key));

  return (
    <FamilyFooter
      current="krizaka"
      path={pathname}
      variant="site"
      tone="cahier"
      labels={familyLabels[locale]}
      version={PLATFORM.site || undefined}
      config={config}
      linkAs={QuietLink}
    />
  );
}

/** The router's link without prefetch: a footer of a dozen links would otherwise prefetch them all on every page. */
function QuietLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch={false} {...props} />;
}

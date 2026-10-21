"use client";

/* Under /docs: the bar names where the reader is (Docs / <set>) instead of repeating the site links — the sets are
   switched from the documentation's own sidebar. */

import Link from "next/link";
import { ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { useI18n } from "./I18nProvider";
import { NAV_DOCS_HUB, docsLinkText, docsSectionOf } from "@/lib/nav";

export function DocsCrumb({ pathname }: { pathname: string }) {
  const { t } = useI18n();
  const section = docsSectionOf(pathname);
  const crumb =
    "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-sm px-3 text-sm font-medium text-fg-secondary no-underline transition-colors " +
    "hover:bg-surface-2 hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <nav aria-label={t.site.menu.breadcrumb} className="hidden min-w-0 md:block">
      <ol className="m-0 flex list-none items-center gap-1 p-0">
        <li>
          <Link href={NAV_DOCS_HUB} aria-current={section ? undefined : "page"} className={cn(crumb, !section && "font-semibold text-fg")}>
            {t.site.menu.docs}
          </Link>
        </li>
        {section && (
          <li className="flex items-center gap-1">
            <span aria-hidden className="text-fg-muted">
              /
            </span>
            <Link href={section.href} aria-current={pathname === section.href ? "page" : undefined} className={cn(crumb, "font-semibold text-fg")}>
              <ProductLogo id="krizaka" size={16} animated={false} />
              {docsLinkText(t, section).label}
            </Link>
          </li>
        )}
      </ol>
    </nav>
  );
}

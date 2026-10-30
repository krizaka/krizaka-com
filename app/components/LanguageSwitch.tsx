"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { languagesFor } from "@krizaka/ui/language-switch";
import { LOCALE_COOKIE, LOCALES } from "@/lib/locales";
import { useI18n } from "./I18nProvider";

/** A language link (the router's `Link`) that first remembers the choice in the family's cookie, so unprefixed addresses open in this language next time. */
function RememberedLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        onClick?.(e);
        document.cookie = `${LOCALE_COOKIE}=${props.hrefLang}; path=/; max-age=31536000; samesite=lax`;
      }}
    />
  );
}

/** The props of the family's language switch (`NavBar.Language`) for this site: the page in each language, by its own name. */
export function useLanguageSwitch() {
  const { t, locale } = useI18n();
  const pathname = usePathname() || "/";
  return {
    label: t.site.menu.language,
    current: locale,
    languages: languagesFor(pathname, LOCALES),
    linkAs: RememberedLink,
  };
}

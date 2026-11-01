/* The footer as an admin would configure it (founder, 2026-11-01: « formaté comme l'admin le configure »). krizaka.com
   has no admin and no database: this module is the admin's stand-in, in the exact shape the apps store in their
   settings (`FooterSettings` of @krizaka/ui/site-footer, saved through @krizaka/settings). Words are message keys
   (`site.footer.*`) or proper nouns; addresses come from the data modules, never typed twice. Internal hrefs are
   unprefixed: the renderer adds the locale. Three columns — the products, open source, the company — then one legal
   line that names the company once (`legalName · NEQ · city`), the version and the legal links. */
import type { FooterSettings } from "@krizaka/ui/site-footer";

import { PRODUCTS } from "./products.ts";
import { BLOG_URL, COMPANY, GITHUB_ORG_URL } from "./site.ts";
import { STACK } from "./stack.ts";

export const footerSettings = {
  labelKey: "site.footer.label",
  columns: [
    {
      id: "products",
      titleKey: "site.footer.products",
      // Every product is in development: said once, on the heading (krizaka-ui#931).
      ...(PRODUCTS.every((p) => p.status === "development") ? { status: "development" as const } : {}),
      links: PRODUCTS.map((p) => ({ label: p.name, href: p.siteUrl, external: true })),
    },
    {
      id: "open-source",
      titleKey: "site.footer.openSourceColumn",
      links: [
        { labelKey: "site.footer.allOpenSource", href: "/open-source" },
        ...STACK.map((part) => ({ label: part.name, href: part.url, external: true })),
        { label: "GitHub", href: GITHUB_ORG_URL, external: true },
      ],
    },
    {
      id: "company",
      titleKey: "site.footer.companyColumn",
      links: [
        { labelKey: "site.footer.services", href: "/services" },
        { labelKey: "site.footer.story", href: "/story" },
        { labelKey: "site.footer.changelog", href: "/changelog" },
        { labelKey: "site.footer.blog", href: BLOG_URL, external: true },
        { labelKey: "site.footer.contact", href: "/contact" },
      ],
    },
  ],
  legal: {
    legalName: COMPANY.legalName,
    neq: COMPANY.neq,
    city: "Montréal (Québec)",
    showVersion: true,
    links: [
      { labelKey: "site.footer.privacy", href: "/privacy" },
      { labelKey: "site.footer.terms", href: "/terms" },
    ],
  },
  // No social link yet: @krizaka/org publishes none (krizaka-internal#365); the ids go here when it does.
  social: [],
} satisfies FooterSettings;

/** A message key (`site.footer.story`) read in a dictionary; a missing key fails loudly (the build), never prints a key. */
export function messageAt(dictionary: unknown, key: string): string {
  const value = key
    .split(".")
    .reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], dictionary);
  if (typeof value !== "string") throw new Error(`footer: no message at ${key}`);
  return value;
}

/** An internal href with the locale in front (`/story` → `/fr/story`); an absolute address unchanged. */
export function localized(href: string, locale: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

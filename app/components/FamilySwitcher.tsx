"use client";

/* The family switcher — left of the bar, right after the mark (NAV-SYS): every Krizaka site in one panel, so this
   site's bar never links to another site. Products (each with its status) · Open source (Krizaka UI, Krizaka Java) ·
   Krizaka and GitHub. Built on NavBar.Menu (Radix navigation menu: Enter/Space/↓ open it, Escape closes it and returns
   the focus) and fed by lib/nav.ts (NAV_FAMILY). When @krizaka/ui ships NavBar.Family (data: @krizaka/ui/sites), this
   file is replaced by it — TopNavBar renders it in the same place. Words: site.nav.family. */

import { NavBar } from "@krizaka/ui/nav-bar";
import { ProductLogo } from "@krizaka/ui";
import { useI18n } from "./I18nProvider";
import { GitHubMark } from "./brand/GitHubMark";
import { NAV_FAMILY, type FamilyEntry } from "@/lib/nav";
import type { TranslationDictionary } from "@/lib/i18n";

/** The short line under an entry in the switcher (a product's status first, when it is not released yet). */
export function familyShortLine(t: TranslationDictionary, entry: FamilyEntry): string {
  const f = t.site.nav.family;
  switch (entry.kind) {
    case "product": {
      const line = f.products[entry.id];
      return entry.status ? `${t.site.nav.status[entry.status].long} · ${line}` : line;
    }
    case "stack":
      return f.stack[entry.id];
    case "company":
      return f.krizaka;
    case "github":
      return f.github;
  }
}

export function FamilyIcon({ entry, size = 20 }: { entry: FamilyEntry; size?: number }) {
  if (entry.kind === "github") return <GitHubMark size={size - 4} />;
  return <ProductLogo id={entry.kind === "product" ? entry.id : "krizaka"} size={size} animated={false} />;
}

const heading = "px-3 pb-1 pt-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-secondary";

export function FamilySwitcher() {
  const { t } = useI18n();
  const f = t.site.nav.family;
  const item = (entry: FamilyEntry) => (
    <NavBar.MenuLink key={entry.id} asChild title={entry.name} description={familyShortLine(t, entry)} icon={<FamilyIcon entry={entry} />} active={entry.kind === "company"}>
      <a href={entry.href} {...(entry.kind === "company" ? {} : { target: "_blank", rel: "noopener noreferrer" })} />
    </NavBar.MenuLink>
  );
  return (
    <NavBar.Menu label="Krizaka" columns={2}>
      <div>
        <p className={heading}>{f.productsTitle}</p>
        {NAV_FAMILY.products.map(item)}
      </div>
      <div>
        <p className={heading}>{f.stackTitle}</p>
        {NAV_FAMILY.stack.map(item)}
        <p className={heading}>{f.companyTitle}</p>
        {item(NAV_FAMILY.company)}
        {item(NAV_FAMILY.github)}
      </div>
    </NavBar.Menu>
  );
}

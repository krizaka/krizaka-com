/* The family's names for the footer: @krizaka/ui's SiteFooter reads them from `org.family`, which carries the code names of
   the products; the footer says the commercial names (krizaka-internal#2103), read from @krizaka/org like everywhere else. */

import { brands, displayName, org } from "@krizaka/org";

const CODE_NAMES = new Set(brands.map((b) => b.codeName));

export const FOOTER_ORG = {
  ...org,
  family: org.family.map((e) =>
    CODE_NAMES.has(e.id) ? { ...e, name: displayName(e.id), short: displayName(e.id) } : e,
  ),
};

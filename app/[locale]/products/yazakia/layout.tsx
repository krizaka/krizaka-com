import type { ReactNode } from "react";
import { JsonLd } from "@/app/components/JsonLd";
import { asLocale } from "@/lib/i18n";
import { buildYazakiaJsonLd } from "@/lib/structured-data";

/* Every /products/yazakia page wears the Yazakia brand (BRAND.md): the scoped `.brand-yazakia` class (emerald →
   turquoise, @krizaka/tokens) re-points the accent roles for the whole subtree, in both themes. `contents`: no box.
   Its JSON-LD: a software application with its repository and an "Upcoming" status — no offer, no download, no store
   link (nothing is released). */
export default async function YazakiaBrandLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  return (
    <div className="brand-yazakia contents">
      <JsonLd data={buildYazakiaJsonLd(locale)} />
      {children}
    </div>
  );
}

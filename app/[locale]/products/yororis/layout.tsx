import type { ReactNode } from "react";
import { JsonLd } from "@/app/components/JsonLd";
import { asLocale } from "@/lib/i18n";
import { buildYororisJsonLd } from "@/lib/structured-data";

/* Every /products/yororis page wears the Yororis brand (BRAND.md): the scoped `.brand-yororis` class (sand → sage,
   @krizaka/tokens) re-points the accent roles for the whole subtree, in both themes. `contents`: no box.
   Its JSON-LD declares a LifestyleApplication under construction — never a medical or health one (the category is a
   declaration of purpose), with no offer and no download. */
export default async function YororisBrandLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const locale = asLocale((await params).locale);
  return (
    <div className="brand-yororis contents">
      <JsonLd data={buildYororisJsonLd(locale)} />
      {children}
    </div>
  );
}

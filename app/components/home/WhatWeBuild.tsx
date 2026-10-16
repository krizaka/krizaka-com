/* "What we know how to do" — one card per know-how, each proved by a product (lib/products.ts): the same ProductCard
   as /products and /story (app/components/ProductCard.tsx — @krizaka/ui ArgumentCard in the product's brand). */

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { Section } from "@krizaka/ui/page";
import { getDictionary } from "@/lib/i18n";
import ProductGrid from "../ProductCard";

export default function WhatWeBuild({ locale }: { locale: string }) {
  const h = getDictionary(locale).site.home.products;
  return (
    <Section
      id="products"
      eyebrow={h.eyebrow}
      title={h.title}
      lead={h.lead}
      reveal
      actions={
        <Link href="/products" prefetch={false} className="kz-link-strong">
          {h.all} <ForwardIcon size={15} />
        </Link>
      }
    >
      <ProductGrid locale={locale} withEngine />
    </Section>
  );
}

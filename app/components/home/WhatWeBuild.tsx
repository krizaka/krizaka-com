/* "What we know how to do" — one block per know-how, each proved by a product (lib/products.ts): the know-how, the
   product that proves it (mark, name, status), one provable sentence (site.products.knowhow.<id>) and the way to the
   product's own site. Same card, same weight for each: none is featured. The cards are @krizaka/ui LinkCards (the
   whole card one link). */

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Facts, Section } from "@krizaka/ui/page";
import { format, getDictionary } from "@/lib/i18n";
import { PRODUCTS } from "@/lib/products";
import { hostOf } from "@/lib/stack";

export default function WhatWeBuild({ locale }: { locale: string }) {
  const site = getDictionary(locale).site;
  const h = site.home.products;
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
      <CardGrid as="ul" min={260} columns={4}>
        {PRODUCTS.map((p) => (
          <LinkCard
            key={p.id}
            href={p.devUrl}
            layout="stack"
            className={"brand-" + p.id}
            title={site.products.knowhow[p.id].name}
            description={site.products.knowhow[p.id].proof}
            icon={<ProductLogo id={p.id} size={40} animated={false} />}
            meta={format(site.products.proofBy, { name: p.name })}
            cta={format(h.visit, { host: hostOf(p.devUrl) })}
            extra={
              <Facts
                items={[p.status ? { label: site.nav.status[p.status].long, tone: "wip" } : { label: h.preview, tone: "ok" }]}
              />
            }
          />
        ))}
      </CardGrid>
    </Section>
  );
}

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { getKitFoundations, getRegistryIndex, PRODUCT_KITS } from "@/lib/ui-registry";

/* The product kits, from /docs/ui (`<ProductKits />` in content/docs/ui/index.mdx): each product's design system, its
   theme and its number of components read from its registry, linking to /docs/<product>/ui. Server Component. */
export function ProductKits({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs;
  return (
    <ul className="kz-related kz-product-kits not-prose">
      {PRODUCT_KITS.map((kit) => {
        const index = getRegistryIndex(kit);
        const current = index.items.filter((item) => item.status !== "deprecated").length;
        return (
          <li key={kit} className={"brand-" + kit}>
            <Link href={`/${locale}/docs/${kit}/ui`}>
              <span className="kz-related-title">
                <ProductLogo id={kit} size={20} animated={false} /> {format(t.kit.overviewTitle, { product: t.sections[kit].title })}
              </span>
              <span className="kz-related-text">
                {getKitFoundations(kit).theme} · {index.name} {index.version} · {format(t.kits.components, { count: current })}
              </span>
              <span className="kz-related-kit">
                {t.kits.open} <ForwardIcon size={12} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

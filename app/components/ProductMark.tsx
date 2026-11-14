/* A product's mark by id (krizaka-internal#3559): the brand's `ProductLogo`, or Kridoc's own `KridocLogo` — @krizaka/ui's
   ProductLogo leaves Kridoc out (it has a mark and no palette), so the one place that knows is here. */

import { KridocLogo, ProductLogo } from "@krizaka/ui";
import type { ProductId } from "@/lib/products";

export function ProductMark({ id, size }: Readonly<{ id: ProductId; size: number }>) {
  return id === "kridoc" ? (
    <KridocLogo size={size} animated={false} />
  ) : (
    <ProductLogo id={id} size={size} animated={false} />
  );
}

import type { ReactNode } from "react";

/* Every /products/yazakia page wears the Yazakia brand (BRAND.md): the scoped `.brand-yazakia` class (emerald →
   turquoise, @krizaka/tokens) re-points the accent roles for the whole subtree, in both themes. `contents`: no box. */
export default function YazakiaBrandLayout({ children }: { children: ReactNode }) {
  return <div className="brand-yazakia contents">{children}</div>;
}

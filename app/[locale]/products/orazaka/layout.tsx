import type { ReactNode } from "react";

/* Every /products/orazaka page wears the Orazaka brand (BRAND.md): the scoped `.brand-orazaka` class re-points the accent roles
   (--kz-accent, --kz-accent-text, --kz-brand-gradient-*) for the whole subtree, in both themes. `contents`: no box. */
export default function OrazakaBrandLayout({ children }: { children: ReactNode }) {
  return <div className="brand-orazaka contents">{children}</div>;
}

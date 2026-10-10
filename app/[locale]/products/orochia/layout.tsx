import type { ReactNode } from "react";

/* Every /products/orochia page wears the Orochia brand (BRAND.md): the scoped `.brand-orochia` class re-points the accent roles
   (--kz-accent, --kz-accent-text, --kz-brand-gradient-*) for the whole subtree, in both themes. `contents`: no box. */
export default function OrochiaBrandLayout({ children }: { children: ReactNode }) {
  return <div className="brand-orochia contents">{children}</div>;
}

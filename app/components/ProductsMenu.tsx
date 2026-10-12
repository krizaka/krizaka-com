"use client";

/* The bar's Products menu and the documentation breadcrumb, composed in @krizaka/ui's NavBar (lib/nav.ts feeds them).

   Products — two columns inside NavBar.Menu, like the mega-menus of Stripe, Vercel or Linear: the products on the left
   (the current page's product selected when the panel opens, each in its brand colour) and "All products"; on the right
   the selected product's four entries — @krizaka/icons icon, label, a short line. Hover or focus selects a product.
   Radix (inside NavBar) opens the menu (Enter, Space, ↓), closes it (Escape returns the focus, Tab out), and walks the
   links; this file adds the two columns: ↑/↓ (Home/End) change product, → enters its entries, ↑/↓ walk them, ← returns.
   The panel's links mount on open only (Radix), so hidden links are never prefetched. */

import { useState, type ComponentType, type KeyboardEvent } from "react";
import Link from "next/link";
import { AiIcon, BatchIcon, BookmarkIcon, HomeIcon, MessageIcon, MomentIcon, PackIcon, PlayIcon, ServerIcon, ShieldIcon, StudioIcon, type IconProps } from "@krizaka/icons";
import { NavBar } from "@krizaka/ui/nav-bar";
import { ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { useI18n } from "./I18nProvider";
import { ProductStatus } from "./ProductStatus";
import {
  NAV_COMPANY,
  NAV_DOCS_HUB,
  NAV_PRODUCTS,
  companyLinkText,
  docsLinkLogo,
  docsLinkText,
  docsSectionOf,
  isNavActive,
  productLinkDesc,
  productLinkText,
  type NavIcon,
  type NavProduct,
} from "@/lib/nav";

/* The navigation icons (@krizaka/icons): one per entry, used by the Products panel, the mobile panel and the home
   spotlights. The "signature" entry is each product's own: Orazaka's engine, Orochia's guarantees, Yazakia's mutual
   batches, Yororis' moment that stops. */
export const NAV_ICONS: Record<NavIcon, ComponentType<IconProps>> = {
  overview: HomeIcon,
  architecture: ServerIcon,
  demo: PlayIcon,
  signature: AiIcon,
  repos: PackIcon,
  contact: MessageIcon,
  products: StudioIcon,
  story: BookmarkIcon,
};
export const SIGNATURE_ICONS: Record<NavProduct["id"], ComponentType<IconProps>> = { orazaka: AiIcon, orochia: ShieldIcon, yazakia: BatchIcon, yororis: MomentIcon };
export const productLinkIcon = (product: NavProduct["id"], icon: NavIcon) => (icon === "signature" ? SIGNATURE_ICONS[product] : NAV_ICONS[icon]);

/** The content of the Products menu (rendered by NavBar.Menu, mounted while it is open). */
export function ProductsPanel({ pathname }: { pathname: string }) {
  const { t } = useI18n();
  const here = NAV_PRODUCTS.find((p) => pathname.startsWith(p.href));
  const [selected, setSelected] = useState<NavProduct["id"]>(here?.id ?? NAV_PRODUCTS[0].id);
  const product = NAV_PRODUCTS.find((p) => p.id === selected)!;
  const all = NAV_COMPANY.find((l) => l.icon === "products")!;

  // Runs before Radix's own arrow handling (which it skips once the event is handled here).
  const onKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    const panel = e.currentTarget.closest<HTMLElement>("[data-products-panel]");
    const name = e.currentTarget.closest<HTMLElement>("[data-col]")?.dataset.col;
    if (!panel || !name) return;
    const col = (c: string) => Array.from(panel.querySelectorAll<HTMLAnchorElement>(`[data-col='${c}'] a[href]`));
    const list = col(name);
    const at = list.indexOf(e.currentTarget);
    const go = (el: HTMLElement | null | undefined) => {
      e.preventDefault();
      el?.focus();
    };
    if (e.key === "ArrowDown") go(list[(at + 1) % list.length]);
    else if (e.key === "ArrowUp") go(list[(at - 1 + list.length) % list.length]);
    else if (e.key === "Home") go(list[0]);
    else if (e.key === "End") go(list[list.length - 1]);
    else if (e.key === "ArrowRight" && name === "products") go(col("entries")[0]);
    else if (e.key === "ArrowLeft" && name === "entries") go(panel.querySelector<HTMLElement>("[data-product][data-selected]"));
  };

  return (
    <div data-products-panel className="grid w-[min(88vw,29rem)] grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-2">
      <div data-col="products" className="flex flex-col gap-1 border-r border-border-subtle pr-2">
        {NAV_PRODUCTS.map((p) => (
          <NavBar.MenuLink
            key={p.id}
            asChild
            data-product={p.id}
            data-selected={p.id === selected ? "" : undefined}
            title={p.name}
            icon={
              /* The status rides the mark as a dot — the row stays one line, every row the same height; the panel's
                 header (right) says it in words. */
              <span className="relative inline-flex">
                <ProductLogo id={p.id} size={22} />
                {p.status && <ProductStatus status={p.status} t={t} variant="dot" ring className="absolute -right-0.5 -top-0.5" />}
              </span>
            }
            active={pathname === p.href}
            onMouseEnter={() => setSelected(p.id)}
            onFocus={() => setSelected(p.id)}
            onKeyDown={onKeyDown}
            className={cn(
              "brand-" + p.id,
              "relative items-center p-2.5 before:absolute before:inset-y-3 before:left-0 before:w-0.75 before:rounded-full before:bg-accent before:opacity-0 before:transition-opacity motion-reduce:before:transition-none",
              p.id === selected && "bg-surface-2 before:opacity-100",
            )}
          >
            <Link href={p.href} />
          </NavBar.MenuLink>
        ))}
        <NavBar.MenuLink
          asChild
          title={companyLinkText(t, all).label}
          active={isNavActive(all, pathname)}
          onKeyDown={onKeyDown}
          className="mt-auto p-2.5"
        >
          <Link href={all.href} />
        </NavBar.MenuLink>
      </div>

      <div key={product.id} data-col="entries" className={cn("brand-" + product.id, "flex flex-col gap-0.5")}>
        <p className="mx-3 mb-1 mt-1.5">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-fg-accent">{product.name}</span>
            {product.status && <ProductStatus status={product.status} t={t} />}
          </span>
          <span className="mt-0.5 block text-xs text-fg-secondary">{t.site.nav[product.id].tagline}</span>
        </p>
        {product.links.map((l) => {
          const Icon = productLinkIcon(product.id, l.icon);
          return (
            <NavBar.MenuLink
              key={l.href}
              asChild
              title={productLinkText(t, product.id, l)}
              description={productLinkDesc(t, product.id, l)}
              icon={<Icon size={18} />}
              active={isNavActive(l, pathname)}
              onKeyDown={onKeyDown}
              className="p-2.5"
            >
              <Link href={l.href} />
            </NavBar.MenuLink>
          );
        })}
      </div>
    </div>
  );
}

/* Under /docs: the bar names where the reader is (Docs / <set>) instead of repeating the site menu — the sets are
   switched from the documentation's own sidebar. */
export function DocsCrumb({ pathname }: { pathname: string }) {
  const { t } = useI18n();
  const section = docsSectionOf(pathname);
  const crumb =
    "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-3 text-sm font-medium text-fg-secondary no-underline transition-colors " +
    "hover:bg-surface-2 hover:text-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <nav aria-label={t.site.menu.breadcrumb} className="hidden min-w-0 md:block">
      <ol className="m-0 flex list-none items-center gap-1 p-0">
        <li>
          <Link href={NAV_DOCS_HUB} aria-current={section ? undefined : "page"} className={cn(crumb, !section && "font-semibold text-fg")}>
            {t.site.menu.docs}
          </Link>
        </li>
        {section && (
          <li className="flex items-center gap-1">
            <span aria-hidden className="text-fg-muted">
              /
            </span>
            <Link href={section.href} aria-current={pathname === section.href ? "page" : undefined} className={cn(crumb, "font-semibold text-fg")}>
              <ProductLogo id={docsLinkLogo(section)} size={16} animated={false} />
              {docsLinkText(t, section).label}
            </Link>
          </li>
        )}
      </ol>
    </nav>
  );
}

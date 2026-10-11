"use client";

/* The left group of the desktop bar: the Products menu (the bar's one menu), then Open source and Our story as plain
   links, under one sliding indicator — or, under /docs, the documentation breadcrumb. Data: lib/nav.ts, shared with
   the mobile panel, the footer, the search and the home spotlights.

   Products panel — two columns, like the mega-menus of Stripe, Vercel or Linear: the products on the left (the one of
   the current page selected by default, each in its brand colour), the selected product's four entries on the right,
   each a real target with its icon and a short line. Mouse: hovering a product selects it. Keyboard: Enter/Space/↓ on
   the trigger opens the panel on the selected product; ↑/↓ change product (Home/End jump), → enters its entries, ↑/↓
   walk them, ← returns to the product; Escape closes and gives the focus back to the trigger; Tab out closes. */

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import Link from "next/link";
import {
  AiIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ForwardIcon,
  HomeIcon,
  MessageIcon,
  PackIcon,
  PlayIcon,
  ServerIcon,
  ShieldIcon,
  StudioIcon,
  type IconProps,
} from "@krizaka/icons";
import { useI18n } from "./I18nProvider";
import {
  NAV_BAR_LINKS,
  NAV_COMPANY,
  NAV_DOCS_HUB,
  NAV_PRODUCTS,
  companyLinkText,
  docsLinkLogo,
  docsLinkText,
  docsSectionOf,
  isNavActive,
  localeless,
  productLinkDesc,
  productLinkText,
  type NavIcon,
  type NavProduct,
} from "@/lib/nav";
import { ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";

/* The navigation icons (@krizaka/icons): one per entry, used by the Products panel, the mobile panel and the home
   spotlights. The "signature" entry is each product's own: Orazaka's engine, Orochia's guarantees. */
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
export const SIGNATURE_ICONS: Record<NavProduct["id"], ComponentType<IconProps>> = { orazaka: AiIcon, orochia: ShieldIcon };
export const productLinkIcon = (product: NavProduct["id"], icon: NavIcon) => (icon === "signature" ? SIGNATURE_ICONS[product] : NAV_ICONS[icon]);

const PANEL_WIDTH = 640;
const GUTTER = 16;

function ProductsPanel({ pathname }: { pathname: string }) {
  const { t } = useI18n();
  const here = NAV_PRODUCTS.find((p) => pathname.startsWith(p.href));
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<NavProduct["id"]>(here?.id ?? NAV_PRODUCTS[0].id);
  // The panel's links mount on first open: hidden links would otherwise be prefetched on every page load (performance).
  const [seen, setSeen] = useState(false);
  if (open && !seen) setSeen(true);
  const [left, setLeft] = useState(-12);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set when the keyboard opened the menu: the selected product takes the focus once the panel is rendered.
  const focusProduct = useRef(false);

  const all = NAV_COMPANY.find((l) => l.icon === "products")!;
  const product = NAV_PRODUCTS.find((p) => p.id === selected)!;

  const rows = () => Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("[data-col='products'] a[href]") ?? []);
  const entries = () => Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("[data-col='entries'] a[href]") ?? []);
  const selectedRow = () => panel.current?.querySelector<HTMLAnchorElement>(`[data-product='${selected}']`) ?? rows()[0];

  const openPanel = useCallback(() => {
    // Back on the current page's product each time the panel opens.
    if (here) setSelected(here.id);
    setOpen(true);
  }, [here]);
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };

  // Anchored under its trigger, kept inside the viewport.
  useLayoutEffect(() => {
    if (!open || !trigger.current) return;
    const r = trigger.current.getBoundingClientRect();
    const width = Math.min(PANEL_WIDTH, window.innerWidth - 2 * GUTTER);
    const ideal = -12;
    const maxLeft = window.innerWidth - GUTTER - width - r.left;
    const minLeft = GUTTER - r.left;
    setLeft(Math.max(minLeft, Math.min(ideal, maxLeft)));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (focusProduct.current) {
      focusProduct.current = false;
      selectedRow()?.focus();
    }
    const onDown = (e: MouseEvent) => root.current && !root.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close(true);
      return;
    }
    const onTrigger = e.target === trigger.current;
    if (onTrigger && (e.key === "ArrowDown" || ((e.key === "Enter" || e.key === " ") && !open))) {
      e.preventDefault();
      if (open) selectedRow()?.focus();
      else {
        focusProduct.current = true;
        openPanel();
      }
      return;
    }
    if (onTrigger || !open) return;
    const target = e.target as HTMLElement;
    const inProducts = !!target.closest("[data-col='products']");
    const list = inProducts ? rows() : entries();
    const at = list.indexOf(target as HTMLAnchorElement);
    const go = (i: number) => {
      e.preventDefault();
      list[(i + list.length) % list.length]?.focus();
    };
    if (e.key === "ArrowDown") go(at + 1);
    else if (e.key === "ArrowUp") go(at - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(list.length - 1);
    else if (e.key === "ArrowRight" && inProducts) {
      e.preventDefault();
      entries()[0]?.focus();
    } else if (e.key === "ArrowLeft" && !inProducts) {
      e.preventDefault();
      selectedRow()?.focus();
    }
  };

  return (
    <div
      ref={root}
      className="kz-dd"
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        if (open && !root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onMouseEnter={() => {
        if (timer.current) clearTimeout(timer.current);
        if (!open) openPanel();
      }}
      onMouseLeave={() => {
        timer.current = setTimeout(() => setOpen(false), 200);
      }}
    >
      <button
        ref={trigger}
        id="nav-products-trigger"
        type="button"
        data-nav-item
        className={cn("kz-nav-item", pathname.startsWith("/products") && "is-active")}
        aria-expanded={open}
        aria-controls="nav-products-panel"
        onClick={(e) => {
          // A keyboard "click" (Enter/Space) is handled in onKeyDown; this is the pointer.
          if (e.detail === 0) return;
          if (open) setOpen(false);
          else openPanel();
        }}
      >
        {t.site.menu.products}
        <ChevronDownIcon size={13} strokeWidth={2} className="kz-dd-chevron" />
      </button>
      <div
        ref={panel}
        id="nav-products-panel"
        className={cn("kz-dd-panel", open && "is-open")}
        style={{ left, width: `min(${PANEL_WIDTH}px, calc(100vw - ${2 * GUTTER}px))` }}
        // Following a link closes the menu.
        onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
      >
        <div className="kz-dd-bridge" />
        {seen ? (
          <div className="kz-pm">
            <div className="kz-pm-products" data-col="products">
              <ul>
                {NAV_PRODUCTS.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={p.href}
                      data-product={p.id}
                      className={cn("kz-pm-product", `brand-${p.id}`, p.id === selected && "is-selected", here?.id === p.id && "is-here")}
                      aria-current={pathname === p.href ? "page" : undefined}
                      onMouseEnter={() => setSelected(p.id)}
                      onFocus={() => setSelected(p.id)}
                    >
                      <span className="kz-pm-logo">
                        <ProductLogo id={p.id} size={24} />
                      </span>
                      <span className="kz-pm-text">
                        <span className="kz-pm-name">{p.name}</span>
                        <span className="kz-pm-tagline">{t.site.nav[p.id].tagline}</span>
                      </span>
                      <ChevronRightIcon size={15} className="kz-pm-chevron" />
                    </Link>
                  </li>
                ))}
                <li className="kz-pm-all-row">
                  <Link href={all.href} className={cn("kz-pm-all", isNavActive(all, pathname) && "is-active")}>
                    <span className="kz-pm-all-label">{companyLinkText(t, all).label}</span>
                    <span className="kz-pm-all-desc">{companyLinkText(t, all).desc}</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className={cn("kz-pm-entries", `brand-${product.id}`)} data-col="entries" key={product.id}>
              <p className="kz-pm-entries-title" id="nav-products-entries-title">
                {product.name}
              </p>
              <ul aria-labelledby="nav-products-entries-title">
                {product.links.map((l) => {
                  const Icon = productLinkIcon(product.id, l.icon);
                  const active = isNavActive(l, pathname);
                  return (
                    <li key={l.href}>
                      <Link href={l.href} className={cn("kz-pm-entry", active && "is-active")} aria-current={active ? "page" : undefined}>
                        <span className="kz-pm-entry-icon">
                          <Icon size={18} nodeColor="var(--kz-accent)" />
                        </span>
                        <span className="kz-pm-entry-text">
                          <span className="kz-pm-entry-label">{productLinkText(t, product.id, l)}</span>
                          <span className="kz-pm-entry-desc">{productLinkDesc(t, product.id, l)}</span>
                        </span>
                        <ForwardIcon size={14} className="kz-pm-entry-arrow" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* Under /docs: the bar names where the reader is (Docs / <set>) instead of repeating the site menu — the sets are
   switched from the documentation's own sidebar. */
function DocsCrumb({ pathname }: { pathname: string }) {
  const { t } = useI18n();
  const section = docsSectionOf(pathname);
  return (
    <nav aria-label={t.site.menu.breadcrumb} className="kz-crumb">
      <ol>
        <li>
          <Link href={NAV_DOCS_HUB} aria-current={section ? undefined : "page"} className={cn(!section && "is-current")}>
            {t.site.menu.docs}
          </Link>
        </li>
        {section && (
          <li>
            <span aria-hidden className="kz-crumb-sep">
              /
            </span>
            <Link href={section.href} className="is-current" aria-current={pathname === section.href ? "page" : undefined}>
              <ProductLogo id={docsLinkLogo(section)} size={16} animated={false} />
              {docsLinkText(t, section).label}
            </Link>
          </li>
        )}
      </ol>
      <style>{`
        .kz-crumb ol { display:flex; align-items:center; gap:6px; margin:0; padding:0; list-style:none; }
        .kz-crumb li { display:flex; align-items:center; gap:6px; min-width:0; }
        .kz-crumb a { display:inline-flex; align-items:center; gap:7px; height:32px; padding:0 8px; border-radius:9999px; font-size:13px; font-weight:500;
          color:var(--kz-text-secondary); text-decoration:none; white-space:nowrap; transition:color 150ms ease, background-color 150ms ease; }
        .kz-crumb a:hover { color:var(--kz-text-primary); background:var(--kz-surface-2); }
        .kz-crumb a.is-current { color:var(--kz-text-primary); font-weight:600; }
        .kz-crumb a:focus-visible { outline:2px solid var(--kz-ring); outline-offset:2px; }
        .kz-crumb-sep { color:var(--kz-text-muted); font-size:15px; }
      `}</style>
    </nav>
  );
}

export function ProductsMenu({ docs }: { docs: boolean }) {
  const pathname = localeless(usePathname());
  const { t } = useI18n();
  const group = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);

  /* One indicator glides under the item the pointer or the focus is on, and rests on the current page's item. */
  const moveTo = useCallback((el: HTMLElement | null) => {
    const p = pill.current;
    if (!p) return;
    if (!el) {
      p.style.opacity = "0";
      return;
    }
    const from = group.current?.getBoundingClientRect().left ?? 0;
    const r = el.getBoundingClientRect();
    p.style.opacity = "1";
    p.style.transform = `translateX(${r.left - from}px)`;
    p.style.width = `${r.width}px`;
  }, []);
  const rest = useCallback(() => moveTo(group.current?.querySelector<HTMLElement>("[data-nav-item].is-active") ?? null), [moveTo]);

  useLayoutEffect(() => {
    if (docs) return;
    rest();
    const g = group.current;
    if (!g || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(rest);
    ro.observe(g);
    return () => ro.disconnect();
  }, [pathname, docs, rest]);

  if (docs) return <DocsCrumb pathname={pathname} />;

  const onOver = (e: { target: EventTarget }) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>("[data-nav-item]");
    if (item && group.current?.contains(item)) moveTo(item);
  };

  return (
    <div
      ref={group}
      className="kz-nav-group"
      onMouseOver={onOver}
      onFocus={(e) => (e.target as HTMLElement).matches(":focus-visible") && onOver(e)}
      onMouseLeave={rest}
      onBlur={(e) => !group.current?.contains(e.relatedTarget as Node | null) && rest()}
    >
      <span ref={pill} className="kz-nav-pill" aria-hidden />
      <ProductsPanel pathname={pathname} />
      {NAV_BAR_LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          data-nav-item
          className={cn("kz-nav-item", isNavActive(l, pathname) && "is-active")}
          aria-current={isNavActive(l, pathname) ? "page" : undefined}
        >
          {companyLinkText(t, l).label}
        </Link>
      ))}

      <style>{`
        .kz-nav-group { position:relative; display:flex; align-items:center; gap:2px; }
        .kz-nav-pill { position:absolute; left:0; top:50%; height:32px; margin-top:-16px; border-radius:9999px; background:var(--kz-surface-2);
          opacity:0; pointer-events:none; z-index:0;
          transition:transform 260ms cubic-bezier(.16,1,.3,1), width 260ms cubic-bezier(.16,1,.3,1), opacity 160ms ease; }
        .kz-nav-item { position:relative; z-index:1; display:inline-flex; align-items:center; gap:4px; height:32px; padding:0 12px; border-radius:9999px;
          border:0; background:none; font:inherit; font-size:13px; font-weight:500; line-height:1; color:var(--kz-text-secondary); cursor:pointer;
          text-decoration:none; white-space:nowrap; transition:color 150ms ease; }
        .kz-nav-item:hover, .kz-nav-item[aria-expanded="true"] { color:var(--kz-text-primary); }
        .kz-nav-item.is-active { color:var(--kz-text-primary); font-weight:600; }
        .kz-nav-item:focus-visible { outline:2px solid var(--kz-ring); outline-offset:2px; }
        .kz-dd { position:relative; }
        .kz-dd-chevron { transition:transform 200ms ease; }
        .kz-nav-item[aria-expanded="true"] .kz-dd-chevron { transform:rotate(180deg); }
        .kz-dd-panel { position:absolute; top:calc(100% + 16px); padding:8px; border-radius:18px; z-index:60;
          background:var(--kz-surface-1); border:1px solid var(--kz-border-default); box-shadow:var(--kz-shadow-lg);
          opacity:0; visibility:hidden; pointer-events:none; transform:translateY(-6px) scale(.985); transform-origin:top left;
          transition:opacity 200ms cubic-bezier(.16,1,.3,1), transform 200ms cubic-bezier(.16,1,.3,1), visibility 0s linear 200ms; }
        .kz-dd-panel.is-open { opacity:1; visibility:visible; pointer-events:auto; transform:none;
          transition:opacity 200ms cubic-bezier(.16,1,.3,1), transform 200ms cubic-bezier(.16,1,.3,1); }
        .kz-dd-bridge { position:absolute; top:-18px; left:0; right:0; height:18px; }
        .kz-pm { display:grid; grid-template-columns:minmax(0, 15rem) minmax(0, 1fr); gap:8px; }
        .kz-pm ul { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:2px; }
        .kz-pm-products { padding-right:8px; border-right:1px solid var(--kz-border-subtle); }
        .kz-pm-products ul { height:100%; }
        .kz-pm-product { position:relative; display:flex; align-items:center; gap:10px; min-height:60px; padding:8px 10px; border-radius:12px; text-decoration:none;
          transition:background-color 150ms ease; }
        .kz-pm-product::before { content:""; position:absolute; left:0; top:14px; bottom:14px; width:3px; border-radius:3px; background:var(--kz-accent);
          opacity:0; transition:opacity 150ms ease; }
        .kz-pm-product.is-selected { background:var(--kz-surface-2); }
        .kz-pm-product.is-selected::before { opacity:1; }
        .kz-pm-logo { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:10px; flex-shrink:0;
          background:var(--kz-surface-0); border:1px solid var(--kz-border-subtle); transition:border-color 150ms ease; }
        .kz-pm-product.is-selected .kz-pm-logo { border-color:color-mix(in srgb, var(--kz-accent) 55%, var(--kz-border-subtle)); }
        .kz-pm-text { flex:1; min-width:0; }
        .kz-pm-name { display:block; font-family:var(--font-display), system-ui, sans-serif; font-size:14.5px; font-weight:700; color:var(--kz-text-primary); }
        .kz-pm-product.is-selected .kz-pm-name { color:var(--kz-accent-text); }
        .kz-pm-tagline { display:block; margin-top:2px; font-size:12.5px; line-height:1.35; color:var(--kz-text-secondary); }
        .kz-pm-chevron { flex-shrink:0; color:var(--kz-text-muted); opacity:0; transition:opacity 150ms ease, transform 200ms ease; }
        .kz-pm-product.is-selected .kz-pm-chevron { opacity:1; color:var(--kz-accent-text); transform:translateX(2px); }
        .kz-pm-all-row { margin-top:auto; padding-top:6px; }
        .kz-pm-all { display:flex; flex-direction:column; gap:2px; padding:10px; border-radius:10px; text-decoration:none; transition:background-color 150ms ease; }
        .kz-pm-all:hover { background:var(--kz-surface-2); }
        .kz-pm-all-label { font-size:13px; font-weight:600; color:var(--kz-text-primary); }
        .kz-pm-all.is-active .kz-pm-all-label { color:var(--kz-accent-text); }
        .kz-pm-all-desc { font-size:12px; color:var(--kz-text-secondary); }
        .kz-pm-entries { padding:4px 4px 4px 4px; animation:kz-pm-in 220ms cubic-bezier(.16,1,.3,1); }
        .kz-pm-entries-title { margin:4px 10px 6px; font-family:var(--font-mono); font-size:10.5px; font-weight:700; letter-spacing:.12em;
          text-transform:uppercase; color:var(--kz-accent-text); }
        .kz-pm-entry { display:flex; align-items:center; gap:12px; min-height:56px; padding:8px 10px; border-radius:12px; text-decoration:none;
          transition:background-color 150ms ease; }
        .kz-pm-entry:hover, .kz-pm-entry.is-active { background:var(--kz-surface-2); }
        .kz-pm-entry-icon { display:flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:9px; flex-shrink:0;
          color:var(--kz-text-primary); background:color-mix(in srgb, var(--kz-accent) 12%, var(--kz-surface-0));
          border:1px solid color-mix(in srgb, var(--kz-accent) 28%, var(--kz-border-subtle)); }
        .kz-pm-entry-text { flex:1; min-width:0; }
        .kz-pm-entry-label { display:block; font-family:var(--font-display), system-ui, sans-serif; font-size:14px; font-weight:600; color:var(--kz-text-primary); }
        .kz-pm-entry.is-active .kz-pm-entry-label { color:var(--kz-accent-text); }
        .kz-pm-entry-desc { display:block; margin-top:2px; font-size:12.5px; line-height:1.35; color:var(--kz-text-secondary); }
        .kz-pm-entry-arrow { flex-shrink:0; color:var(--kz-text-muted); opacity:0; transition:opacity 150ms ease, transform 200ms ease; }
        .kz-pm-entry:hover .kz-pm-entry-arrow, .kz-pm-entry:focus-visible .kz-pm-entry-arrow { opacity:1; color:var(--kz-accent-text); transform:translateX(2px); }
        .kz-pm-product:focus-visible, .kz-pm-entry:focus-visible, .kz-pm-all:focus-visible { outline:2px solid var(--kz-ring); outline-offset:-2px; }
        @keyframes kz-pm-in { from { opacity:0; transform:translateX(6px); } to { opacity:1; transform:none; } }
        @media (max-width: 900px) { .kz-pm { grid-template-columns:minmax(0, 13rem) minmax(0, 1fr); } }
        @media (prefers-reduced-motion: reduce) {
          .kz-nav-pill, .kz-dd-panel, .kz-dd-panel.is-open, .kz-pm-chevron, .kz-pm-entry-arrow, .kz-dd-chevron { transition:none; }
          .kz-pm-entries { animation:none; }
          .kz-pm-product.is-selected .kz-pm-chevron, .kz-pm-entry:hover .kz-pm-entry-arrow { transform:none; }
        }
      `}</style>
    </div>
  );
}

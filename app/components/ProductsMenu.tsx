"use client";

/* Desktop navigation menus — a compact Products panel (one row per product, its entries in plain text under it) and a
   Docs menu. Data: lib/nav.ts, shared with the mobile panel, the footer and the home spotlights. Opens on hover, click or
   keyboard; closes on Escape, outside click, Tab out or following a link. */

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  AiIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ForwardIcon,
  HomeIcon,
  KnowledgeIcon,
  MessageIcon,
  PackIcon,
  PlayIcon,
  ServerIcon,
  ShieldIcon,
  StudioIcon,
  type IconProps,
} from "@krizaka/icons";
import type { ComponentType } from "react";
import { useI18n } from "./I18nProvider";
import { NAV_COMPANY, NAV_DOCS, NAV_DOCS_HUB, NAV_PRODUCTS, companyLinkText, docsLinkText, isDocsActive, isDocsSection, isNavActive, localeless, productLinkText, type NavIcon } from "@/lib/nav";
import { ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";

/* The navigation icons (@krizaka/icons): one per entry, used by the home spotlights (the menus are plain text). The "signature" entry is each product's own: Orazaka's engine, Orochia's guarantees. */
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
export const SIGNATURE_ICONS: Record<"orazaka" | "orochia", ComponentType<IconProps>> = { orazaka: AiIcon, orochia: ShieldIcon };

/* One dropdown for both menus. Mouse: opens on hover (200 ms grace on leave) or click. Keyboard: Enter/Space or ↓ on the
   trigger opens it and focuses the first link; ↑/↓ (and ←/→) walk the links, Home/End jump, Escape closes and gives the
   focus back to the trigger, Tab out of the panel closes it. */
function Dropdown({ id, label, active, width, children }: { id: string; label: string; active: boolean; width: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // The panel's links mount on first open: hidden links would otherwise be prefetched on every page load (performance).
  const [seen, setSeen] = useState(false);
  if (open && !seen) setSeen(true);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set when the keyboard opened the menu: the first link takes the focus once the panel is rendered.
  const focusFirst = useRef(false);

  const links = () => Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    if (focusFirst.current) {
      focusFirst.current = false;
      links()[0]?.focus();
    }
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
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
      if (open) links()[0]?.focus();
      else {
        focusFirst.current = true;
        setOpen(true);
      }
      return;
    }
    if (onTrigger || !open) return;
    const all = links();
    const at = all.indexOf(document.activeElement as HTMLAnchorElement);
    const go = (i: number) => {
      e.preventDefault();
      all[(i + all.length) % all.length]?.focus();
    };
    if (e.key === "ArrowDown" || e.key === "ArrowRight") go(at + 1);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(at - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(all.length - 1);
  };

  return (
    <div
      ref={ref}
      className="kz-dd"
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        if (open && !ref.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onMouseEnter={() => {
        if (timer.current) clearTimeout(timer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timer.current = setTimeout(() => setOpen(false), 200);
      }}
    >
      <button
        ref={trigger}
        id={id}
        type="button"
        className={`kz-dd-trigger${active ? " is-active" : ""}`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={(e) => {
          // A keyboard "click" (Enter/Space) is handled in onKeyDown; this is the pointer.
          if (e.detail === 0) return;
          setOpen((o) => !o);
        }}
      >
        {label}
        <ChevronDownIcon size={13} strokeWidth={2} className="kz-dd-chevron" />
      </button>
      <div
        ref={panel}
        id={`${id}-panel`}
        className={`kz-dd-panel${open ? " is-open" : ""}`}
        style={{ width }}
        // Following a link closes the menu.
        onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
      >
        <div className="kz-dd-bridge" />
        {seen ? children : null}
      </div>
    </div>
  );
}

export function ProductsMenu() {
  const pathname = localeless(usePathname());
  const { t } = useI18n();
  const m = t.site.menu;
  const productsActive = pathname.startsWith("/products");
  const all = NAV_COMPANY.find((l) => l.icon === "products")!;

  return (
    <>
      {/* Products: one row per product — the row opens its overview, the line under it holds its other entries in
          plain text. One footer link, "All products": story, open source and contact are already in the bar. */}
      <Dropdown id="nav-products-trigger" label={m.products} active={productsActive} width={440}>
        <div className="kz-pm">
          {NAV_PRODUCTS.map((p) => {
            const [overview, ...rest] = p.links;
            const here = pathname.startsWith(p.href);
            return (
              <div key={p.id} className={cn("kz-pm-product", `brand-${p.id}`, here && "is-here")}>
                <Link href={overview.href} className={cn("kz-pm-head", isNavActive(overview, pathname) && "is-active")}>
                  <span className="kz-pm-logo">
                    <ProductLogo id={p.id} size={26} />
                  </span>
                  <span className="kz-pm-text">
                    <span className="kz-pm-name">{p.name}</span>
                    <span className="kz-pm-tagline">{t.site.nav[p.id].tagline}</span>
                  </span>
                  <ForwardIcon size={15} className="kz-pm-arrow" />
                </Link>
                <ul className="kz-pm-links">
                  {rest.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={cn("kz-pm-link", isNavActive(l, pathname) && "is-active")}>
                        {productLinkText(t, p.id, l)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <Link href={all.href} className={cn("kz-pm-all", isNavActive(all, pathname) && "is-active")}>
          <span>{companyLinkText(t, all).label}</span>
          <span className="kz-pm-all-desc">{companyLinkText(t, all).desc}</span>
          <ForwardIcon size={14} className="kz-pm-arrow" />
        </Link>
      </Dropdown>

      <Dropdown id="nav-docs-trigger" label={m.docs} active={isDocsSection(pathname)} width={400}>
        {NAV_DOCS.map((d) => {
          const text = docsLinkText(t, d);
          return (
            <Link key={d.id} href={d.href} className={`kz-menu-link${isDocsActive(d, pathname) ? " is-active" : ""}`}>
              <ProductLogo id={d.id === "orazaka" || d.id === "orochia" ? d.id : "krizaka"} size={22} animated={false} />
              <span>
                <span className="kz-menu-label">{text.label}</span>
                <span className="kz-menu-desc">{text.desc}</span>
              </span>
              <ForwardIcon size={14} className="kz-menu-arrow" />
            </Link>
          );
        })}
        <div className="kz-dd-foot">
          <Link href={NAV_DOCS_HUB} className="kz-dd-foot-link">
            <KnowledgeIcon size={16} /> {t.site.nav.docs.all.label}
          </Link>
        </div>
      </Dropdown>

      <Link href="/open-source" className={`kz-dd-trigger${pathname === "/open-source" ? " is-active" : ""}`}>
        {m.openSource}
      </Link>
      <Link href="/story" className={`kz-dd-trigger${pathname === "/story" ? " is-active" : ""}`}>
        {t.site.nav.company.story.label}
      </Link>

      <style>{`
        .kz-dd { position: relative; }
        .kz-dd-trigger { display:inline-flex; align-items:center; gap:4px; padding:6px 12px; border-radius:9999px; border:0; background:none;
          font:inherit; font-size:13px; font-weight:500; line-height:1; color:var(--kz-text-secondary); cursor:pointer; text-decoration:none;
          transition:color 150ms ease, background-color 150ms ease; white-space:nowrap; }
        .kz-dd-trigger:hover, .kz-dd-trigger[aria-expanded="true"] { color:var(--kz-text-primary); background:var(--kz-surface-2); }
        .kz-dd-trigger.is-active { color:var(--kz-accent-text); font-weight:600; }
        .kz-dd-trigger:focus-visible { outline:2px solid var(--kz-ring); outline-offset:2px; }
        .kz-menu-link:focus-visible, .kz-dd-foot-link:focus-visible { outline:2px solid var(--kz-ring); outline-offset:-2px; }
        .kz-dd-chevron { transition: transform 200ms ease; }
        .kz-dd-trigger[aria-expanded="true"] .kz-dd-chevron { transform: rotate(180deg); }
        .kz-dd-panel { position:absolute; top:calc(100% + 14px); left:50%; padding:10px; border-radius:18px; z-index:60;
          background:var(--kz-surface-1); border:1px solid var(--kz-border-default);
          box-shadow:var(--kz-shadow-lg);
          opacity:0; visibility:hidden; pointer-events:none; transform:translateX(-50%) translateY(-6px);
          transition:opacity 200ms cubic-bezier(.16,1,.3,1), transform 200ms cubic-bezier(.16,1,.3,1), visibility 0s linear 200ms; }
        .kz-dd-panel.is-open { opacity:1; visibility:visible; pointer-events:auto; transform:translateX(-50%) translateY(0);
          transition:opacity 200ms cubic-bezier(.16,1,.3,1), transform 200ms cubic-bezier(.16,1,.3,1); }
        .kz-dd-bridge { position:absolute; top:-16px; left:0; right:0; height:16px; }
        /* Products panel */
        .kz-pm { display:flex; flex-direction:column; gap:4px; padding-bottom:8px; border-bottom:1px solid var(--kz-border-subtle); }
        .kz-pm-product { padding:4px; border-radius:14px; transition:background-color 150ms ease; }
        .kz-pm-product:hover, .kz-pm-product:focus-within, .kz-pm-product.is-here { background:var(--kz-surface-2); }
        .kz-pm-head { display:flex; align-items:center; gap:12px; min-height:52px; padding:8px 10px; border-radius:10px; text-decoration:none; }
        .kz-pm-logo { display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; flex-shrink:0;
          background:var(--kz-surface-0); border:1px solid var(--kz-border-subtle); transition:border-color 150ms ease; }
        .kz-pm-head:hover .kz-pm-logo, .kz-pm-head:focus-visible .kz-pm-logo { border-color:color-mix(in srgb, var(--kz-accent) 55%, var(--kz-border-subtle)); }
        .kz-pm-text { flex:1; min-width:0; }
        .kz-pm-name { display:block; font-family:var(--font-display), system-ui, sans-serif; font-size:15px; font-weight:700; color:var(--kz-text-primary); }
        .kz-pm-tagline { display:block; margin-top:1px; font-size:12.5px; color:var(--kz-text-secondary); }
        .kz-pm-arrow { flex-shrink:0; color:var(--kz-text-muted); transition:color 150ms ease, transform 200ms ease; }
        .kz-pm-head:hover .kz-pm-arrow, .kz-pm-head:focus-visible .kz-pm-arrow, .kz-pm-all:hover .kz-pm-arrow { color:var(--kz-accent-text); transform:translateX(2px); }
        .kz-pm-links { display:flex; flex-wrap:wrap; gap:2px; margin:0; padding:0 0 4px 56px; list-style:none; }
        .kz-pm-link { display:inline-flex; align-items:center; min-height:32px; padding:0 10px; border-radius:8px; font-size:13px; font-weight:500;
          color:var(--kz-text-secondary); text-decoration:none; transition:color 150ms ease, background-color 150ms ease; }
        .kz-pm-link:hover { color:var(--kz-text-primary); background:var(--kz-surface-1); }
        .kz-pm-link.is-active, .kz-pm-head.is-active .kz-pm-name { color:var(--kz-accent-text); }
        .kz-pm-link:focus-visible, .kz-pm-head:focus-visible, .kz-pm-all:focus-visible { outline:2px solid var(--kz-ring); outline-offset:-2px; }
        .kz-pm-all { display:flex; align-items:center; gap:10px; min-height:44px; margin-top:8px; padding:0 14px; border-radius:10px;
          text-decoration:none; font-size:13px; font-weight:600; color:var(--kz-text-primary);
          transition:background-color 150ms ease; }
        .kz-pm-all:hover { background:var(--kz-surface-2); }
        .kz-pm-all-desc { flex:1; min-width:0; font-weight:400; color:var(--kz-text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        @media (prefers-reduced-motion: reduce) { .kz-pm-arrow { transition:none; } .kz-pm-head:hover .kz-pm-arrow, .kz-pm-head:focus-visible .kz-pm-arrow, .kz-pm-all:hover .kz-pm-arrow { transform:none; } }
        /* Docs panel */
        .kz-menu-link { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:9px; text-decoration:none;
          transition:background-color 150ms ease; }
        .kz-menu-link:hover, .kz-menu-link.is-active { background:var(--kz-surface-2); }
        .kz-menu-label { display:block; font-family:var(--font-display), system-ui, sans-serif; font-size:12.5px; font-weight:600; color:var(--kz-text-primary); }
        .kz-menu-desc { display:block; font-size:11px; color:var(--kz-text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .kz-menu-link > span { flex:1; min-width:0; }
        .kz-menu-arrow { color:var(--kz-text-muted); flex-shrink:0; }
        .kz-dd-foot { display:flex; gap:6px; margin-top:12px; padding-top:12px; border-top:1px solid var(--kz-border-subtle); }
        .kz-dd-foot-link { flex:1; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:9px 10px; border-radius:10px;
          font-size:12.5px; font-weight:600; color:var(--kz-text-secondary); text-decoration:none; transition:background-color 150ms ease, color 150ms ease; }
        .kz-dd-foot-link:hover { background:var(--kz-surface-2); color:var(--kz-text-primary); }
        @media (prefers-reduced-motion: reduce) { .kz-dd-panel, .kz-dd-panel.is-open { transition:none; } }
      `}</style>
    </>
  );
}

"use client";

/* Desktop navigation menus — a Products mega-menu (one identical column per product) and a Docs
   menu. Data: lib/nav.ts, shared with the mobile panel. Opens on hover or click, closes on
   Escape / outside click / route change. */

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, ChevronDown, Compass, Cpu, Feather, GitBranch, LayoutGrid, Mail, PlayCircle, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "./I18nProvider";
import { NAV_COMPANY, NAV_DOCS, NAV_DOCS_HUB, NAV_PRODUCTS, companyLinkText, docsLinkText, isNavActive, localeless, type NavIcon, type NavLink } from "@/lib/nav";
import { ProductLogo } from "@krizaka/ui";

export const NAV_ICONS: Record<NavIcon, LucideIcon> = {
  overview: Compass,
  architecture: Cpu,
  demo: PlayCircle,
  docs: BookOpen,
  signature: Sparkles,
  repos: GitBranch,
  contact: Mail,
  products: LayoutGrid,
  story: Feather,
};

function Dropdown({ id, label, active, width, children }: { id: string; label: string; active: boolean; width: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  return (
    <div
      ref={ref}
      className="kz-dd"
      onMouseEnter={() => {
        if (timer.current) clearTimeout(timer.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        timer.current = setTimeout(() => setOpen(false), 200);
      }}
    >
      <button
        id={id}
        type="button"
        className={`kz-dd-trigger${active ? " is-active" : ""}`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <ChevronDown size={12} strokeWidth={2} className="kz-dd-chevron" />
      </button>
      <div
        id={`${id}-panel`}
        className={`kz-dd-panel${open ? " is-open" : ""}`}
        style={{ width }}
        // Following a link closes the menu.
        onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
      >
        <div className="kz-dd-bridge" />
        {children}
      </div>
    </div>
  );
}

function MenuLink({ link, text, pathname }: { link: NavLink; text: { label: string; desc: string }; pathname: string }) {
  const Icon = NAV_ICONS[link.icon];
  const active = isNavActive(link, pathname);
  return (
    <Link href={link.href} className={`kz-menu-link${active ? " is-active" : ""}`}>
      <Icon size={15} strokeWidth={1.8} className="kz-menu-icon" aria-hidden />
      <span>
        <span className="kz-menu-label">{text.label}</span>
        <span className="kz-menu-desc">{text.desc}</span>
      </span>
    </Link>
  );
}

export function ProductsMenu() {
  const pathname = localeless(usePathname());
  const { t } = useI18n();
  const m = t.site.menu;
  const productsActive = pathname.startsWith("/products");

  return (
    <>
      <Dropdown id="nav-products-trigger" label={m.products} active={productsActive} width={640}>
        <div className="kz-mega">
          {NAV_PRODUCTS.map((p) => (
            <div key={p.id} className="kz-mega-col">
              <Link href={p.href} className="kz-mega-head">
                <span className="kz-mega-logo">
                  <ProductLogo id={p.id} size={30} />
                </span>
                <span style={{ minWidth: 0 }}>
                  <span className="kz-mega-name">
                    {p.name} <span className="kz-mega-badge">{t.site.nav[p.id].badge}</span>
                  </span>
                  <span className="kz-mega-tagline">{t.site.nav[p.id].tagline}</span>
                </span>
              </Link>
              <div className="kz-mega-links">
                {p.links.map((l) => (
                  <MenuLink key={l.href} link={l} text={t.site.nav[p.id].links[l.icon]} pathname={pathname} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="kz-mega-foot">
          {NAV_COMPANY.map((l) => {
            const Icon = NAV_ICONS[l.icon];
            return (
              <Link key={l.href} href={l.href} className="kz-mega-foot-link">
                <Icon size={14} aria-hidden /> {companyLinkText(t, l).label}
              </Link>
            );
          })}
        </div>
      </Dropdown>

      <Dropdown id="nav-docs-trigger" label={m.docs} active={pathname === NAV_DOCS_HUB || pathname.startsWith("/docs/ui") || pathname.startsWith("/docs/java")} width={400}>
        {NAV_DOCS.map((d) => {
          const text = docsLinkText(t, d);
          const content = (
            <>
              <ProductLogo id="krizaka" size={22} animated={false} />
              <span>
                <span className="kz-menu-label">{text.label}</span>
                <span className="kz-menu-desc">{text.desc}</span>
              </span>
              {d.external ? <ArrowUpRight size={13} className="kz-menu-arrow" aria-hidden /> : <ArrowRight size={13} className="kz-menu-arrow" aria-hidden />}
            </>
          );
          return d.external ? (
            <a key={d.id} href={d.href} target="_blank" rel="noreferrer" className="kz-menu-link">{content}</a>
          ) : (
            <Link key={d.id} href={d.href} className={`kz-menu-link${pathname.startsWith(d.href) ? " is-active" : ""}`}>{content}</Link>
          );
        })}
        <div className="kz-mega-foot">
          <Link href={NAV_DOCS_HUB} className="kz-mega-foot-link">
            <LayoutGrid size={14} aria-hidden /> {t.site.nav.docs.all.label}
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
          font:inherit; font-size:13px; font-weight:500; line-height:1; color:var(--kz-text-muted); cursor:pointer; text-decoration:none;
          transition:color 150ms ease, background-color 150ms ease; white-space:nowrap; }
        .kz-dd-trigger:hover, .kz-dd-trigger[aria-expanded="true"] { color:var(--kz-text-primary); background:var(--kz-surface-2); }
        .kz-dd-trigger.is-active { color:var(--kz-accent); font-weight:600; }
        .kz-dd-chevron { transition: transform 200ms ease; }
        .kz-dd-trigger[aria-expanded="true"] .kz-dd-chevron { transform: rotate(180deg); }
        .kz-dd-panel { position:absolute; top:calc(100% + 14px); left:50%; padding:14px; border-radius:18px; z-index:60;
          background:var(--kz-surface-1); border:1px solid var(--kz-border-default);
          box-shadow:var(--kz-shadow-lg);
          opacity:0; visibility:hidden; pointer-events:none; transform:translateX(-50%) translateY(-6px);
          transition:opacity 200ms cubic-bezier(.16,1,.3,1), transform 200ms cubic-bezier(.16,1,.3,1), visibility 0s linear 200ms; }
        .kz-dd-panel.is-open { opacity:1; visibility:visible; pointer-events:auto; transform:translateX(-50%) translateY(0);
          transition:opacity 200ms cubic-bezier(.16,1,.3,1), transform 200ms cubic-bezier(.16,1,.3,1); }
        .kz-dd-bridge { position:absolute; top:-16px; left:0; right:0; height:16px; }
        .kz-mega { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .kz-mega-col { display:flex; flex-direction:column; gap:6px; min-width:0; }
        .kz-mega-head { display:flex; align-items:center; gap:12px; padding:10px; border-radius:12px; text-decoration:none;
          background:var(--kz-surface-2); border:1px solid var(--kz-border-subtle); transition:border-color 150ms ease; }
        .kz-mega-head:hover { border-color:var(--kz-border-strong); }
        .kz-mega-logo { display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px;
          background:var(--kz-surface-0); border:1px solid var(--kz-border-subtle); flex-shrink:0; }
        .kz-mega-name { display:flex; align-items:center; gap:6px; font-family:var(--font-display), system-ui, sans-serif; font-size:14px;
          font-weight:700; color:var(--kz-text-primary); }
        .kz-mega-badge { font-family:var(--font-mono); font-size:9px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;
          padding:2px 6px; border-radius:999px; color:var(--kz-text-muted); border:1px solid var(--kz-border-default); }
        .kz-mega-tagline { display:block; font-size:11.5px; color:var(--kz-text-secondary); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .kz-mega-links { display:flex; flex-direction:column; gap:1px; }
        .kz-menu-link { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:9px; text-decoration:none;
          transition:background-color 150ms ease; }
        .kz-menu-link:hover, .kz-menu-link.is-active { background:var(--kz-surface-2); }
        .kz-menu-icon { color:var(--kz-text-muted); flex-shrink:0; transition:color 150ms ease, transform 200ms ease; }
        .kz-menu-link:hover .kz-menu-icon, .kz-menu-link.is-active .kz-menu-icon { color:var(--kz-accent); transform:scale(1.1); }
        .kz-menu-label { display:block; font-family:var(--font-display), system-ui, sans-serif; font-size:12.5px; font-weight:600; color:var(--kz-text-primary); }
        .kz-menu-desc { display:block; font-size:11px; color:var(--kz-text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .kz-menu-link > span { flex:1; min-width:0; }
        .kz-menu-arrow { color:var(--kz-text-muted); flex-shrink:0; }
        .kz-mega-foot { display:flex; gap:6px; margin-top:12px; padding-top:12px; border-top:1px solid var(--kz-border-subtle); }
        .kz-mega-foot-link { flex:1; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:9px 10px; border-radius:10px;
          font-size:12.5px; font-weight:600; color:var(--kz-text-secondary); text-decoration:none; transition:background-color 150ms ease, color 150ms ease; }
        .kz-mega-foot-link:hover { background:var(--kz-surface-2); color:var(--kz-text-primary); }
        @media (prefers-reduced-motion: reduce) { .kz-dd-panel, .kz-dd-panel.is-open { transition:none; } }
      `}</style>
    </>
  );
}

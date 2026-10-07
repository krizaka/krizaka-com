"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "./I18nProvider";
import KrizakaLogo from "./KrizakaLogo";
import { NAV_PRODUCTS } from "@/lib/nav";
import ProductLogo from "./ProductLogo";

/* GitHub Icon SVG */
function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function SiteFooter() {
  const { t } = useI18n();
  const f = t.site.footer;

  // Same five entries per product as the menus (lib/nav.ts).
  const linksOf = (id: "orazaka" | "orochia") =>
    NAV_PRODUCTS.find((p) => p.id === id)!.links.map((l) => ({ label: t.site.nav[id].links[l.icon].label, href: l.href }));
  const orazakaLinks = linksOf("orazaka");
  const orochiaLinks = linksOf("orochia");

  const krizakaLinks = [
    { label: f.products, href: "/products" },
    { label: f.story, href: "/story" },
    { label: f.openSource, href: "/open-source" },
    { label: f.contact, href: "/contact" },
    { label: f.privacy, href: "/privacy" },
    { label: f.terms, href: "/terms" },
  ];

  const columns = [
    { key: "orazaka", title: <><ProductLogo id="orazaka" size={18} animated={false} /> Orazaka</>, links: orazakaLinks },
    { key: "orochia", title: <><ProductLogo id="orochia" size={18} animated={false} /> Orochia</>, links: orochiaLinks },
    { key: "krizaka", title: <>Krizaka</>, links: krizakaLinks },
  ];

  return (
    <footer className="kz-footer">
      <div className="kz-footer-inner">
        <div className="kz-footer-brand">
          <Link href="/" className="kz-footer-logo">
            <KrizakaLogo size={28} /> Krizaka
          </Link>
          <p>
            {f.tagline}
          </p>
          <a href="https://github.com/krizaka" target="_blank" rel="noopener noreferrer" className="kz-footer-gh">
            <GitHubIcon size={14} /> github.com/krizaka <ArrowUpRight size={12} />
          </a>
        </div>

        <nav className="kz-footer-cols" aria-label={t.site.menu.footerAria}>
          {columns.map((col) => (
            <div key={col.key} className="kz-footer-col">
              <p className="kz-footer-title">{col.title}</p>
              <ul>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="kz-footer-bottom">
        <span>© {new Date().getFullYear()} Krizaka</span>
        <span>{f.madeIn}</span>
      </div>

      <style>{`
        .kz-footer { padding: 64px 20px 28px; background: var(--kz-surface-0); border-top: 1px solid var(--kz-border-subtle); text-align: left; }
        .kz-footer-inner { max-width: 72rem; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 2fr); gap: 48px; }
        .kz-footer-logo { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-display), system-ui, sans-serif; font-size: 16px;
          font-weight: 700; color: var(--kz-text-primary); text-decoration: none; }
        .kz-footer-brand p { margin: 14px 0 16px; max-width: 300px; font-size: 13.5px; line-height: 1.65; color: var(--kz-text-secondary); }
        .kz-footer-gh { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--kz-text-muted); text-decoration: none; }
        .kz-footer-gh:hover { color: var(--kz-text-primary); }
        .kz-footer-cols { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; }
        .kz-footer-title { display: flex; align-items: center; gap: 8px; margin: 0 0 14px; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; color: var(--kz-text-primary); }
        .kz-footer-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
        .kz-footer-col a { font-size: 13.5px; color: var(--kz-text-secondary); text-decoration: none; transition: color 150ms ease; }
        .kz-footer-col a:hover { color: var(--kz-text-primary); }
        .kz-footer-bottom { max-width: 72rem; margin: 48px auto 0; padding-top: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px;
          border-top: 1px solid var(--kz-border-subtle); font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-muted); }
        @media (max-width: 860px) {
          .kz-footer-inner { grid-template-columns: 1fr; gap: 36px; }
        }
        @media (max-width: 560px) {
          .kz-footer-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 20px; }
          .kz-footer-col:last-child { grid-column: 1 / -1; }
          .kz-footer-col:last-child ul { grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 20px; }
        }
      `}</style>
    </footer>
  );
}

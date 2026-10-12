"use client";

import Link from "next/link";
import { ExternalIcon } from "@krizaka/icons";
import { GitHubMark } from "./brand/GitHubMark";
import { useI18n } from "./I18nProvider";
import { useContactHref } from "./useContactHref";
import { NAV_DOCS, NAV_DOCS_HUB, NAV_PRODUCTS, docsLinkText } from "@/lib/nav";
import { KrizakaLogo, ProductLogo } from "@krizaka/ui";

export default function SiteFooter() {
  const { t } = useI18n();
  const f = t.site.footer;
  const contactHref = useContactHref();

  // Same entries per product as the menus (lib/nav.ts), one column each.
  const productColumns = NAV_PRODUCTS.map((p) => ({
    key: p.id,
    title: (
      <>
        <ProductLogo id={p.id} size={18} animated={false} /> {p.name}
      </>
    ),
    links: p.links.map((l) => ({ label: t.site.nav[p.id].links[l.icon].label, href: l.href })),
  }));

  const krizakaLinks = [
    { label: f.products, href: "/products" },
    { label: f.story, href: "/story" },
    { label: f.openSource, href: "/open-source" },
    { label: f.contact, href: contactHref },
    { label: f.privacy, href: "/privacy" },
    { label: f.terms, href: "/terms" },
  ];

  // Every documentation (NAV_DOCS), then the hub.
  const docsLinks = [...NAV_DOCS.map((d) => ({ label: docsLinkText(t, d).label, href: d.href })), { label: t.site.nav.docs.all.label, href: NAV_DOCS_HUB }];

  const columns = [
    ...productColumns,
    { key: "docs", title: <>{f.docs}</>, links: docsLinks },
    { key: "krizaka", title: <><ProductLogo id="krizaka" size={18} animated={false} /> Krizaka</>, links: krizakaLinks },
  ];

  return (
    <footer className="kz-footer">
      <div className="kz-frame kz-footer-inner">
        <div className="kz-footer-brand">
          <Link href="/" className="kz-footer-logo">
            <KrizakaLogo size={28} /> Krizaka
          </Link>
          <p>
            {f.tagline}
          </p>
          <a href="https://github.com/krizaka" target="_blank" rel="noopener noreferrer" className="kz-footer-gh">
            <GitHubMark size={14} /> github.com/krizaka <ExternalIcon size={13} />
          </a>
        </div>

        <nav className="kz-footer-cols" aria-label={t.site.menu.footerAria}>
          {columns.map((col) => (
            <div key={col.key} className="kz-footer-col">
              <p className="kz-footer-title">{col.title}</p>
              <ul>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} prefetch={false}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="kz-frame kz-footer-bottom">
        <span>© {new Date().getFullYear()} Krizaka</span>
        <span>{f.madeIn}</span>
      </div>

      <style>{`
        .kz-footer { padding: 64px 0 28px; background: var(--kz-surface-0); border-top: 1px solid var(--kz-border-subtle); text-align: left; }
        .kz-footer-inner { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2.4fr); gap: 48px; }
        .kz-footer-logo { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-display), system-ui, sans-serif; font-size: 16px;
          font-weight: 700; color: var(--kz-text-primary); text-decoration: none; }
        .kz-footer-brand p { margin: 14px 0 16px; max-width: 300px; font-size: 13.5px; line-height: 1.65; color: var(--kz-text-secondary); }
        .kz-footer-gh { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--kz-text-secondary); text-decoration: none; }
        .kz-footer-gh:hover { color: var(--kz-text-primary); }
        .kz-footer-cols { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 24px; }
        .kz-footer-title { display: flex; align-items: center; gap: 8px; margin: 0 0 14px; font-family: var(--font-mono); font-size: 10.5px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; color: var(--kz-text-primary); }
        .kz-footer-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
        .kz-footer-col a { font-size: 13.5px; color: var(--kz-text-secondary); text-decoration: none; transition: color 150ms ease; }
        .kz-footer-col a:hover { color: var(--kz-text-primary); }
        .kz-footer-bottom { margin-top: 48px; padding-top: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px;
          border-top: 1px solid var(--kz-border-subtle); font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-secondary); }
        @media (max-width: 1120px) {
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

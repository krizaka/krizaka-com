/* The Krizaka know-hows, one card each, proved by a product (lib/products.ts): the know-how first, then the product that
   proves it — the mark, the name, its status when it is not released yet — one provable sentence, one line, "Visit the dev site" (the product's own site — where it is presented, demonstrated and documented) and
   "Source" (its GitHub repository). A server component; the same cards on /products and, as a section, on the home.
   Each card wears its product's brand (`.brand-<id>`). No recording, no screenshot, no product page here. */

import { ExternalIcon, ForwardIcon } from "@krizaka/icons";
import { ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { Page } from "@krizaka/ui/page";
import { format } from "@krizaka/i18n";
import { getDictionary } from "@/lib/i18n";
import { PRODUCTS } from "@/lib/products";
import { reveal } from "@/lib/motion";
import { GitHubMark } from "../brand/GitHubMark";
import { ProductStatus } from "../ProductStatus";
import ButtonLink from "../ButtonLink";

/** `heading="h2"`: a section of the home; `"none"`: the body of /products under its PageHero. */
export default function ProductCards({ locale, heading = "h2" }: { locale: string; heading?: "h2" | "none" }) {
  const t = getDictionary(locale);
  const h = t.site.products;
  return (
    <section id="products" aria-label={heading === "none" ? h.title : undefined} aria-labelledby={heading === "h2" ? "products-title" : undefined}>
      <Page className="kz-pc-page">
        {heading === "h2" && (
          <h2 id="products-title" className="kz-heading-title" {...reveal()}>
            {h.title}
          </h2>
        )}
        <ul className="kz-pc-grid">
          {PRODUCTS.map((p, i) => (
            <li key={p.id} id={p.id} className={cn("brand-" + p.id, "kz-pc-card")} {...(heading === "none" && i < 2 ? {} : reveal(i % 2))}>
              <div className="kz-pc-head">
                <ProductLogo id={p.id} size={48} />
                <div className="kz-pc-titles">
                  <p className="kz-pc-proof-by">
                    {format(h.proofBy, { name: p.name })}
                    {p.status && <ProductStatus status={p.status} t={t} className="kz-pc-status" />}
                  </p>
                  <h3>{h.knowhow[p.id].name}</h3>
                </div>
              </div>
              <p className="kz-pc-proof">{h.knowhow[p.id].proof}</p>
              <p className="kz-pc-line">{h.cards[p.id].line}</p>
              <div className="kz-pc-actions">
                {p.noSite ? (
                  // In development, no site yet: the one way in is its code.
                  <ButtonLink href={p.repoUrl} variant="primary" ariaLabel={format(h.seeCodeAria, { name: p.name })}>
                    <GitHubMark size={14} /> {h.seeCode} <ExternalIcon size={13} />
                  </ButtonLink>
                ) : (
                  <>
                    <ButtonLink href={p.devUrl} variant="primary" ariaLabel={format(h.visitAria, { name: p.name })}>
                      {h.visit} <ForwardIcon size={15} />
                    </ButtonLink>
                    <ButtonLink href={p.repoUrl} variant="ghost" ariaLabel={format(h.sourceAria, { name: p.name })}>
                      <GitHubMark size={14} /> {h.source} <ExternalIcon size={13} />
                    </ButtonLink>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Page>
      <style>{`
        .kz-pc-page { padding-block: clamp(32px, 5vw, 64px); }
        .kz-pc-grid { list-style: none; margin: 24px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)); gap: 16px; }
        .kz-pc-card { display: flex; flex-direction: column; gap: 14px; padding: 24px; border-radius: 20px; scroll-margin-top: var(--kz-anchor-offset, 96px);
          background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle);
          box-shadow: inset 3px 0 0 0 var(--kz-accent); }
        .kz-pc-head { display: flex; align-items: center; gap: 14px; }
        .kz-pc-head h3 { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; font-family: var(--font-display), system-ui, sans-serif; font-size: 24px; font-weight: 800; letter-spacing: -.02em; color: var(--kz-text-primary); }
        .kz-pc-titles { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .kz-pc-proof-by { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; font-family: var(--font-mono), ui-monospace, monospace; font-size: 12px; letter-spacing: .02em; color: var(--kz-text-secondary); }
        .kz-pc-proof { margin: 0; font-size: 16px; line-height: 1.6; color: var(--kz-text-primary); }
        .kz-pc-line { margin: 0; flex: 1; font-size: 14px; line-height: 1.6; color: var(--kz-text-secondary); }
        .kz-pc-actions { display: flex; flex-wrap: wrap; gap: 8px; }
      `}</style>
    </section>
  );
}

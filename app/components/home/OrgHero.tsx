/* Home hero — Krizaka as an organisation: what we build (three products) and how. A server component: the title,
   the promise and the product cards are the first paint (LCP); everything behind them is decoration that arrives later.

   Depth, back to front (BRAND.md §4), every layer decorative and still under prefers-reduced-motion:
   - the section gradient and its drifting light (SectionBackdrop), a light dome and a perspective floor;
   - an aurora in the three brand colours — Orazaka orange on the left, Krizaka blue in the middle, Orochia violet on
     the right — that breathes very slowly (org-hero.css);
   - the two released products glimpsed through depth of field on their side (HeroProductMedia): hovering a card brightens its
     product and lights its mark;
   - the signature landscape as the horizon: it rises as the page scrolls and fades into the next section — no hard
     edge, never behind the title;
   - an invitation to scroll that is a real link to the products.
   The parallax and the breathing are CSS (scroll-driven animations, org-hero.css): no script runs for them. */

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { ProductLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { format } from "@krizaka/i18n";
import { GitHubMark } from "../brand/GitHubMark";
import { Landscape } from "@krizaka/ui/landscape";
import RotatingWord from "./RotatingWord";
import HeroProductMedia from "./HeroProductMedia";
import { getDictionary } from "@/lib/i18n";
import { PRODUCTS } from "@/lib/org-data";
import { NAV_PRODUCTS } from "@/lib/nav";
import { GITHUB_ORG_URL } from "@/lib/site";
import "./org-hero.css";
import ButtonLink from "@/app/components/ButtonLink";

export default function OrgHero({ locale, repositoryCount }: { locale: string; repositoryCount: number }) {
  const t = getDictionary(locale);
  const h = t.site.home.hero;

  return (
    <SectionBackdrop as="section" id="hero" className="org-hero" grid>
      <div data-backdrop-layer aria-hidden className="org-hero-aurora" data-parallax="">
        <span className="org-aurora brand-orazaka" />
        <span className="org-aurora org-aurora-core" />
        <span className="org-aurora brand-orochia" />
      </div>
      <HeroProductMedia />
      <div data-backdrop-layer aria-hidden className="org-hero-fade" />
      <div data-backdrop-layer aria-hidden className="org-hero-horizon" data-parallax="">
        <Landscape />
      </div>

      <div className="org-hero-inner">
        <span className="org-hero-badge">{h.badge}</span>
        <h1 className="org-hero-title" aria-label={h.titleAria}>
          <span className="org-hero-line">Open source.</span>
          <span className="org-hero-line">
            {h.closedTo}
            <RotatingWord key={locale} className="org-hero-accent" words={h.words} />
          </span>
        </h1>
        <p className="org-hero-sub">{format(h.sub, { count: repositoryCount })}</p>

        <div className="org-hero-products">
          {PRODUCTS.map((p) => (
            <Link key={p.id} href={p.href} prefetch={false} className={cn("org-hero-product", "brand-" + p.id)} data-product={p.id}>
              <span className="org-hero-mark">
                <ProductLogo id={p.id} size={34} />
              </span>
              <span className="org-hero-product-text">
                <strong>
                  {p.name}{" "}
                  {NAV_PRODUCTS.find((n) => n.id === p.id)?.soon && <span className="org-hero-soon">{t.site.nav[p.id].badge}</span>}
                </strong>
                <span className="org-hero-product-tag">{t.site.products[p.id].tagline}</span>
              </span>
              <ForwardIcon size={16} />
            </Link>
          ))}
        </div>

        <div className="org-hero-cta">
          <ButtonLink href="/products" variant="primary" size="lg" shimmer magnetic>
            {h.cta} <ForwardIcon size={16} strokeWidth={2.25} />
          </ButtonLink>
          <ButtonLink href={GITHUB_ORG_URL} size="lg">
            <GitHubMark size={15} /> github.com/krizaka
          </ButtonLink>
        </div>

        <a href="#products" className="org-hero-scroll">
          <span>{h.scroll}</span>
          <span className="org-hero-scroll-line" aria-hidden />
        </a>
      </div>

    </SectionBackdrop>
  );
}

"use client";

/* The Krizaka products, presented the same way: animated mark, promise, proof points, stack, a recording of the real
   product, and the same entry points as the navigation (lib/nav.ts). A product not released yet (`soon`) says so in its
   badge and shows its animated mark where the recording will be — never an invented screenshot. */

import { useSyncExternalStore } from "react";
import { CheckIcon, ExternalIcon, ForwardIcon } from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { useI18n } from "../I18nProvider";
import { NAV_ICONS, SIGNATURE_ICONS } from "../ProductsMenu";
import { GitHubMark } from "../brand/GitHubMark";
import { PRODUCTS } from "@/lib/org-data";
import { NAV_PRODUCTS } from "@/lib/nav";
import { ProductLogo } from "@krizaka/ui";
import { reveal } from "@/lib/motion";
import { cn } from "@krizaka/ui/cn";
import ButtonLink from "../sections/ButtonLink";

/* prefers-reduced-motion, read without an animation library; the server and the first client render say "still". */
const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/* The recordings load only near the screen (poster included: it would compete with the first paint) and play only
   while on screen — never under reduced motion, where the native controls play on demand. */
function playWhenVisible(video: HTMLVideoElement | null) {
  if (!video) return;
  const reduce = window.matchMedia(REDUCE).matches;
  const near = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    if (video.dataset.poster) video.poster = video.dataset.poster;
    near.disconnect();
  }, { rootMargin: "400px 0px" });
  const onScreen = new IntersectionObserver(([entry]) => {
    if (reduce) return;
    if (entry.isIntersecting) void video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0.25 });
  near.observe(video);
  onScreen.observe(video);
  return () => {
    near.disconnect();
    onScreen.disconnect();
  };
}

/* Links below the first screen are not prefetched on sight (prefetch={false}): every linked route would load its
   chunks while the page paints (Lighthouse LCP); they still prefetch on hover. */

/** `heading="h1"` where the showcase is the page itself (/products); a section of the home page otherwise. */
export default function ProductsShowcase({ heading: Heading = "h2" }: { heading?: "h1" | "h2" }) {
  const { t } = useI18n();
  const h = t.site.home.products;
  const still = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCE).matches, () => true);

  return (
    <section id="products">
      <div className="kz-section" style={{ paddingBottom: 0 }}>
        <Heading className="kz-h2" style={{ marginBottom: 0 }} {...(Heading === "h2" ? reveal() : {})}>{h.title}</Heading>
      </div>

      {/* Each product in its own brand (BRAND.md): the section rises from the page into its colour and settles back. */}
      <div className="kz-spots">
        {PRODUCTS.map((p, i) => {
          const nav = NAV_PRODUCTS.find((n) => n.id === p.id)!;
          // Where the showcase is the page (/products), its first product is the first screen: painted at once.
          const firstScreen = Heading === "h1" && i === 0;
          return (
            <SectionBackdrop key={p.id} as="div" className={cn("brand-" + p.id, "bp-glide")} dome={false}>
            <article className={cn("kz-spot kz-section", i % 2 === 1 && "is-flipped")}>
              <div className="kz-spot-copy" {...(firstScreen ? {} : reveal())}>
                <div className="kz-spot-head">
                  <ProductLogo id={p.id} size={56} />
                  <div>
                    <h3>{p.name}</h3>
                    <span className="kz-spot-badge">{t.site.nav[p.id].badge} · open source</span>
                  </div>
                </div>
                <p className="kz-spot-tagline">{t.site.products[p.id].tagline}</p>
                <p className="kz-spot-summary">{t.site.products[p.id].summary}</p>
                <ul className="kz-spot-points">
                  {t.site.products[p.id].points.map((point) => (
                    <li key={point}>
                      <CheckIcon size={16} /> {point}
                    </li>
                  ))}
                </ul>
                <p className="kz-spot-stack">{p.stack}</p>
                <nav className="kz-spot-links" aria-label={p.name}>
                  {nav.links
                    .filter((l) => l.icon === "overview" || l.icon === "architecture" || l.icon === "demo")
                    .map((l) => {
                      const Icon = l.icon === "signature" ? SIGNATURE_ICONS[p.id] : NAV_ICONS[l.icon];
                      return (
                        <ButtonLink key={l.href} href={l.href} prefetch={false} variant={l.icon === "overview" ? "primary" : "ghost"}>
                          {l.icon !== "overview" && <Icon size={16} nodeColor="var(--kz-accent)" />} {l.icon === "overview" ? h.discover : t.site.nav[p.id].links[l.icon].label}
                          {l.icon === "overview" && <ForwardIcon size={15} />}
                        </ButtonLink>
                      );
                    })}
                  {p.appUrl && (
                    <ButtonLink href={p.appUrl} rel="noopener" variant="ghost">
                      <ExternalIcon size={16} /> {h.openApp}
                    </ButtonLink>
                  )}
                  <ButtonLink href={p.repoUrl} variant="ghost">
                    <GitHubMark size={14} /> GitHub
                  </ButtonLink>
                </nav>
              </div>

              {p.media ? (
                <figure className="kz-spot-media" {...(firstScreen ? {} : reveal(2))}>
                  <div className="kz-spot-chrome" aria-hidden>
                    <span /><span /><span /> <em>{p.media.frame}</em>
                  </div>
                  <video
                    ref={playWhenVisible}
                    muted
                    loop
                    playsInline
                    controls={still}
                    preload="none"
                    data-poster={`${p.media.src}.jpg`}
                    style={{ aspectRatio: p.media.aspect }}
                    aria-label={`${p.name} — ${h.demo}`}
                  >
                    <source src={`${p.media.src}.webm`} type="video/webm" />
                    <source src={`${p.media.src}.mp4`} type="video/mp4" />
                  </video>
                </figure>
              ) : (
                /* Nothing recorded yet: the mark, alive, where the app will be — the words say it is coming. */
                <figure className="kz-spot-media is-mark" {...(firstScreen ? {} : reveal(2))}>
                  <ProductLogo id={p.id} size={148} />
                  <figcaption>{h.soon}</figcaption>
                </figure>
              )}
            </article>
            </SectionBackdrop>
          );
        })}
      </div>

      <style>{`
        .kz-spots { display: grid; }
        .kz-spot { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: clamp(24px, 4vw, 48px); align-items: center; }
        .kz-spot.is-flipped .kz-spot-copy { order: 2; }
        @media (max-width: 900px) { .kz-spot { grid-template-columns: 1fr; } .kz-spot.is-flipped .kz-spot-copy { order: 0; } }
        .kz-spot-copy { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
        .kz-spot-head { display: flex; align-items: center; gap: 14px; }
        .kz-spot-head h3 { margin: 0; font-family: var(--font-display), system-ui, sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -.02em; color: var(--kz-text-primary); }
        .kz-spot-badge { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--kz-accent-text); }
        .kz-spot-tagline { margin: 4px 0 0; font-size: 18px; font-weight: 700; color: var(--kz-text-primary); }
        .kz-spot-summary { margin: 0; font-size: 14.5px; line-height: 1.7; color: var(--kz-text-secondary); }
        .kz-spot-points { list-style: none; padding: 0; margin: 2px 0 0; display: grid; gap: 8px; }
        .kz-spot-points li { display: flex; gap: 8px; align-items: baseline; font-size: 14px; color: var(--kz-text-secondary); }
        .kz-spot-points svg { color: var(--kz-accent-text); flex-shrink: 0; transform: translateY(2px); }
        .kz-spot-stack { margin: 2px 0 0; font-family: var(--font-mono); font-size: 11.5px; color: var(--kz-text-secondary); }
        .kz-spot-links { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
        .kz-spot-media { margin: 0; border-radius: 18px; overflow: hidden; border: 1px solid var(--kz-border-default); background: var(--kz-media);
          box-shadow: 0 30px 60px -30px color-mix(in srgb, var(--kz-accent) 45%, transparent); }
        .kz-spot-chrome { display: flex; align-items: center; gap: 6px; padding: 9px 12px; background: var(--kz-surface-2); border-bottom: 1px solid var(--kz-border-subtle); }
        .kz-spot-chrome span { width: 9px; height: 9px; border-radius: 50%; background: var(--kz-border-strong); }
        .kz-spot-chrome em { margin-left: 8px; font-style: normal; font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-secondary); }
        .kz-spot-media video { display: block; width: 100%; height: auto; object-fit: cover; }
        .kz-spot-media.is-mark { display: grid; place-items: center; align-content: center; gap: 22px; aspect-ratio: 16 / 10; padding: 24px;
          background: radial-gradient(60% 70% at 50% 42%, color-mix(in srgb, var(--kz-accent) 16%, var(--kz-surface-1)), var(--kz-surface-1)); }
        .kz-spot-media.is-mark figcaption { font-family: var(--font-mono); font-size: 11.5px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
          color: var(--kz-accent-text); text-align: center; }
      `}</style>
    </section>
  );
}

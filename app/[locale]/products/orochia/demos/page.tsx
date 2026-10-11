import type { Metadata } from "next";
import { AuctionIcon, ChallengeIcon, CheckIcon, ExternalIcon, ForwardIcon, HeartIcon, PlayIcon, TipIcon, UnlockIcon, VideoIcon, WalletIcon } from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { OrochiaLogo } from "@krizaka/ui";
import { cn } from "@krizaka/ui/cn";
import { localizedMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import { contactHref } from "@/lib/contact";
import { OROCHIA_APP_URL } from "@/lib/site";
import { DEMO_USE_CASES, tourSrc } from "@/lib/orochia-demo";
import { reveal } from "@/lib/motion";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import OrochiaTour from "@/app/components/OrochiaTour";
import DemoClip from "@/app/components/demos/DemoClip";
import Rich from "@/app/components/Rich";
import ButtonLink from "@/app/components/sections/ButtonLink";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orochia/demos",
    en: getDictionary("en").site.orochiaDemo.meta,
    fr: getDictionary("fr").site.orochiaDemo.meta,
  });
}

const ICONS = { video: VideoIcon, tip: TipIcon, heart: HeartIcon, unlock: UnlockIcon, auction: AuctionIcon, challenge: ChallengeIcon, wallet: WalletIcon } as const;
const node = "var(--kz-accent-2)";

/* Elena's and Alex's day on Orochia (lib/orochia-demo.ts): the tour, then one section per moment that pays. */
export default async function OrochiaDemoPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale).site.orochiaDemo;

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <TopNavBar />

      {/* ─── Hero: the product, the two people, the promise ─── */}
      <SectionBackdrop
        as="header"
        grid
        media={
          <div className="bp-media">
            <div style={{ backgroundImage: `url(${tourSrc("alex-story")}.jpg)` }} />
            <div style={{ backgroundImage: `url(${tourSrc("elena-earnings")}.jpg)` }} />
          </div>
        }
      >
        <div className="bp-wrap bp-hero bp-center">
          <p className="oc-lockup">
            <OrochiaLogo size={56} />
            <span>Orochia</span>
          </p>
          <p className="bp-eyebrow">{t.eyebrow}</p>
          <h1 className="bp-h1">
            <Rich text={t.title} />
          </h1>
          <p className="bp-lead" style={{ marginTop: 20 }}>{t.lead}</p>
          <div className="bp-actions">
            <ButtonLink href="#tour" variant="primary" size="lg" shimmer magnetic>
              <PlayIcon size={18} /> {t.ctaTour}
            </ButtonLink>
            <ButtonLink href="#use-cases" size="lg">
              {t.ctaCases}
            </ButtonLink>
            <ButtonLink href={OROCHIA_APP_URL} size="lg" rel="noopener">
              <ExternalIcon size={16} /> {t.ctaApp}
            </ButtonLink>
          </div>
          <dl className="ocd-facts">
            {t.facts.map((fact) => (
              <div key={fact.value}>
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </SectionBackdrop>

      {/* ─── The tour: a fan's day or a creator's ─── */}
      <section id="tour" className="bp-wrap" style={{ scrollMarginTop: 72, paddingTop: 24 }}>
        <div className="bp-center" style={{ marginBottom: 24 }} {...reveal()}>
          <p className="bp-eyebrow">{t.tourEyebrow}</p>
          <h2 className="bp-h2">{t.tourTitle}</h2>
        </div>
        <div {...reveal(1)}>
          <OrochiaTour />
        </div>
      </section>

      {/* ─── One section per moment that pays ─── */}
      <SectionBackdrop className="bp-glide" dome={false} id="use-cases" style={{ scrollMarginTop: 72 }}>
        <div className="bp-wrap">
          <div className="bp-center" {...reveal()}>
            <p className="bp-eyebrow">{t.useCasesEyebrow}</p>
            <h2 className="bp-h2"><Rich text={t.useCasesTitle} /></h2>
          </div>
          {DEMO_USE_CASES.map(({ id, clip, side, icon }, k) => {
            const Icon = ICONS[icon];
            const uc = t.useCases[id];
            return (
              <article key={id} className={cn("bp-split ocd-case", k % 2 === 1 && "ocd-case-flip")}>
                <div {...reveal()}>
                  <span className="ocd-head">
                    <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
                    <span className="ocd-side">{t.sideBadge[side]}</span>
                  </span>
                  <h3 className="ocd-case-title">{uc.title}</h3>
                  <p className="bp-lead">{uc.body}</p>
                  <ul className="ocd-points">
                    {uc.points.map((point) => (
                      <li key={point}><CheckIcon size={16} /> {point}</li>
                    ))}
                  </ul>
                </div>
                <div {...reveal(2)}>
                  <DemoClip src={tourSrc(clip)} label={t.tour[clip].caption} frameLabel={t.frameLabel} />
                </div>
              </article>
            );
          })}
          <aside className="ocd-persona" {...reveal()}>
            <strong>{t.persona.title}</strong> {t.persona.body}
          </aside>
        </div>
      </SectionBackdrop>

      {/* ─── Closing ─── */}
      <section className="bp-wrap bp-center" {...reveal()}>
        <h2 className="bp-h2"><Rich text={t.closing.title} /></h2>
        <p className="bp-lead">{t.closing.body}</p>
        <div className="bp-actions">
          <ButtonLink href={OROCHIA_APP_URL} variant="primary" size="lg" rel="noopener">
            <ExternalIcon size={16} /> {t.closing.app}
          </ButtonLink>
          <ButtonLink href={contactHref("orochia", "orochia")} size="lg">
            {t.closing.contact} <ForwardIcon size={16} />
          </ButtonLink>
        </div>
      </section>
      <SiteFooter />

      <style>{`
        .oc-lockup { display: flex; width: fit-content; align-items: center; gap: 12px; margin: 0 auto 16px; font-family: var(--font-display), system-ui, sans-serif;
          font-size: clamp(1.9rem, 4vw, 2.6rem); font-weight: 800; letter-spacing: -.03em; line-height: 1; color: var(--kz-text-primary); }
        .ocd-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 12px; margin: 40px auto 0; max-width: 52rem; text-align: left; }
        .ocd-facts div { padding: 14px 16px; border-radius: 14px; border: 1px solid var(--kz-border-subtle); background: color-mix(in srgb, var(--kz-surface-1) 80%, transparent); }
        .ocd-facts dt { font-family: var(--font-display), system-ui, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -.02em; color: var(--kz-accent-text); }
        .ocd-facts dd { margin: 4px 0 0; font-size: 13px; line-height: 1.55; color: var(--kz-text-secondary); }
        .ocd-case { margin-top: clamp(40px, 6vw, 72px); align-items: center; }
        .ocd-case-flip > :first-child { order: 2; }
        .ocd-head { display: inline-flex; align-items: center; gap: 10px; }
        .ocd-side { font-family: var(--font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--kz-accent-text); }
        .ocd-case-title { margin: 14px 0 10px; font-size: clamp(1.25rem, 2.4vw, 1.6rem); font-weight: 750; letter-spacing: -.02em; }
        .ocd-points { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
        .ocd-points li { display: flex; gap: 10px; align-items: center; font-size: 14px; color: var(--kz-text-secondary); }
        .ocd-points svg { flex-shrink: 0; color: var(--kz-accent-text); }
        .ocd-persona { margin-top: 40px; padding: 16px 18px; border-radius: 14px; border: 1px dashed var(--kz-border-default); font-size: 13.5px; line-height: 1.65; color: var(--kz-text-secondary); }
        .ocd-persona strong { color: var(--kz-text-primary); }
        @media (max-width: 900px) { .ocd-case-flip > :first-child { order: 0; } }
      `}</style>
    </main>
  );
}

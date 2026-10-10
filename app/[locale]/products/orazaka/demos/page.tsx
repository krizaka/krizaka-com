import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckIcon, CreditsIcon, ForwardIcon, ImageIcon, KnowledgeIcon, LocalIcon, PlayIcon, StudioIcon } from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { localizedMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import { DEMO_GALLERY, DEMO_TOUR, DEMO_USE_CASES, gallerySrc, tourSrc } from "@/lib/orazaka-demo";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import ProductTour from "@/app/components/ProductTour";
import DemoClip from "@/app/components/demos/DemoClip";
import Rich from "@/app/components/Rich";
import { reveal } from "@/lib/motion";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orazaka/demos",
    en: getDictionary("en").site.orazakaDemo.meta,
    fr: getDictionary("fr").site.orazakaDemo.meta,
  });
}

const ICONS = { knowledge: KnowledgeIcon, image: ImageIcon, studio: StudioIcon, credits: CreditsIcon } as const;
const node = "var(--kz-accent)";

export default async function OrazakaDemoPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale).site.orazakaDemo;

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <TopNavBar />

      {/* ─── Hero: who, what, and the one promise ─── */}
      <SectionBackdrop
        as="header"
        grid
        media={
          <div className="bp-media">
            <div style={{ backgroundImage: `url(${tourSrc("dashboard")}.jpg)` }} />
            <div style={{ backgroundImage: `url(${tourSrc("create")}.jpg)` }} />
          </div>
        }
      >
        <div className="bp-wrap bp-hero bp-center">
          <p className="bp-eyebrow">
            <LocalIcon size={18} nodeColor={node} /> {t.eyebrow}
          </p>
          <h1 className="bp-h1">
            <Rich text={t.title} />
          </h1>
          <p className="bp-lead" style={{ marginTop: 20 }}>{t.lead}</p>
          <div className="bp-actions">
            <Link href="#tour" className="bp-btn bp-btn-primary btn-sheen">
              <PlayIcon size={18} /> {t.ctaTour}
            </Link>
            <Link href="#made-here" className="bp-btn bp-btn-ghost">
              <ImageIcon size={16} /> {t.ctaGallery}
            </Link>
            <Link href="/products/orazaka#how" className="bp-btn bp-btn-ghost">
              {t.ctaInstall} <ForwardIcon size={16} />
            </Link>
          </div>
          <dl className="od-facts">
            {t.facts.map((fact) => (
              <div key={fact.value}>
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </SectionBackdrop>

      {/* ─── The whole day, chained ─── */}
      <section id="tour" className="bp-wrap" style={{ scrollMarginTop: 72, paddingTop: 24 }}>
        <div className="bp-center" style={{ marginBottom: 28 }} {...reveal()}>
          <p className="bp-eyebrow">{t.tourEyebrow}</p>
          <h2 className="bp-h2">{t.tourTitle}</h2>
        </div>
        <div {...reveal(1)}>
          <ProductTour clips={DEMO_TOUR.map((id) => ({ id, src: tourSrc(id), ...t.tour[id] }))} frameLabel={t.frameLabel} />
        </div>
      </section>

      {/* ─── One section per job a client wants done ─── */}
      <SectionBackdrop className="bp-glide" dome={false} id="use-cases">
        <div className="bp-wrap">
          <div className="bp-center" {...reveal()}>
            <p className="bp-eyebrow">{t.useCasesEyebrow}</p>
            <h2 className="bp-h2"><Rich text={t.useCasesTitle} /></h2>
          </div>
          {DEMO_USE_CASES.map(({ id, clip, icon }, k) => {
            const Icon = ICONS[icon];
            const uc = t.useCases[id];
            return (
              <article key={id} className={`bp-split od-case${k % 2 ? " od-case-flip" : ""}`}>
                <div {...reveal()}>
                  <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
                  <h3 className="od-case-title">{uc.title}</h3>
                  <p className="bp-lead">{uc.body}</p>
                  <ul className="od-points">
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
        </div>
      </SectionBackdrop>

      {/* ─── What the image Studio made on the Mac, with the prompts ─── */}
      <section id="made-here" className="bp-wrap" style={{ scrollMarginTop: 72 }}>
        <div {...reveal()}>
          <p className="bp-eyebrow"><LocalIcon size={18} nodeColor={node} /> {t.gallery.eyebrow}</p>
          <h2 className="bp-h2"><Rich text={t.gallery.title} /></h2>
          <p className="bp-lead">{t.gallery.lead}</p>
          <p className="od-engine">{t.gallery.engine}</p>
        </div>
        <ul className="od-gallery">
          {DEMO_GALLERY.map(({ id, prompt }, i) => (
            <li key={id} {...reveal(i + 1)}>
              <figure>
                <Image src={gallerySrc(id)} alt={t.gallery.items[id].alt} width={512} height={512} sizes="(max-width: 640px) 100vw, 300px" />
                <figcaption>
                  <strong>{t.gallery.items[id].use}</strong>
                  <span className="od-prompt-label">{t.gallery.promptLabel}</span>
                  <q lang="en">{prompt}</q>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <aside className="od-persona" {...reveal()}>
          <strong>{t.persona.title}</strong> {t.persona.body}
        </aside>
      </section>

      {/* ─── Closing ─── */}
      <SectionBackdrop className="bp-glide" dome={false}>
        <div className="bp-wrap bp-center" {...reveal()}>
          <h2 className="bp-h2"><Rich text={t.closing.title} /></h2>
          <p className="bp-lead">{t.closing.body}</p>
          <div className="bp-actions">
            <Link href="/products/orazaka#how" className="bp-btn bp-btn-primary btn-sheen">{t.closing.install}</Link>
            <Link href="/contact" className="bp-btn bp-btn-ghost">{t.closing.contact} <ForwardIcon size={16} /></Link>
          </div>
        </div>
      </SectionBackdrop>
      <SiteFooter />

      <style>{`
        .od-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 12px; margin: 40px auto 0; max-width: 52rem; text-align: left; }
        .od-facts div { padding: 14px 16px; border-radius: 14px; border: 1px solid var(--kz-border-subtle); background: color-mix(in srgb, var(--kz-surface-1) 80%, transparent); }
        .od-facts dt { font-family: var(--font-display), system-ui, sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -.02em; color: var(--kz-accent-text); }
        .od-facts dd { margin: 4px 0 0; font-size: 13px; line-height: 1.55; color: var(--kz-text-secondary); }
        .od-case { margin-top: clamp(40px, 6vw, 72px); align-items: center; }
        .od-case-flip > :first-child { order: 2; }
        .od-case-title { margin: 14px 0 10px; font-size: clamp(1.25rem, 2.4vw, 1.6rem); font-weight: 750; letter-spacing: -.02em; }
        .od-points { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
        .od-points li { display: flex; gap: 10px; align-items: center; font-size: 14px; color: var(--kz-text-secondary); }
        .od-points svg { flex-shrink: 0; color: var(--kz-accent-text); }
        .od-engine { margin: 14px 0 0; font-family: var(--font-mono); font-size: 12px; color: var(--kz-text-secondary); }
        .od-gallery { margin: 28px 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap: 16px; }
        .od-gallery figure { margin: 0; height: 100%; display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; border: 1px solid var(--kz-border-subtle); background: var(--kz-surface-1); }
        .od-gallery img { display: block; width: 100%; height: auto; aspect-ratio: 1; object-fit: cover; background: var(--kz-media); }
        .od-gallery figcaption { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px 14px; }
        .od-gallery strong { font-size: 14px; color: var(--kz-text-primary); }
        .od-prompt-label { margin-top: 4px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--kz-text-secondary); }
        .od-gallery q { font-size: 12.5px; line-height: 1.55; color: var(--kz-text-secondary); quotes: "“" "”"; }
        .od-persona { margin-top: 28px; padding: 16px 18px; border-radius: 14px; border: 1px dashed var(--kz-border-default); font-size: 13.5px; line-height: 1.65; color: var(--kz-text-secondary); }
        .od-persona strong { color: var(--kz-text-primary); }
        @media (max-width: 900px) { .od-case-flip > :first-child { order: 0; } }
      `}</style>
    </main>
  );
}

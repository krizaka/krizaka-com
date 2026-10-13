import type { Metadata } from "next";
import { SectionHeading } from "@krizaka/ui/page";
import Link from "next/link";
import {
  AgentIcon,
  AiIcon,
  AutomationIcon,
  ChatIcon,
  CheckIcon,
  CreditsIcon,
  EyeOffIcon,
  ForwardIcon,
  KnowledgeIcon,
  LocalIcon,
  PackIcon,
  PlayIcon,
  ServerIcon,
  ShieldIcon,
  StudioIcon,
} from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { OrazakaLogo } from "@krizaka/ui";
import { Mascot } from "@krizaka/ui/mascots";
import { DEMO_TOUR, tourSrc } from "@/lib/orazaka-demo";
import MadeHereGallery from "@/app/components/demos/MadeHereGallery";
import type { GalleryItem } from "@/lib/orazaka-gallery";
import { localizedMetadata } from "@/lib/seo";
import { asLocale, format, getDictionary } from "@/lib/i18n";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { DecisionList } from "@krizaka/ui/decision-list";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Ticks } from "@krizaka/ui/page";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import ProductTour from "@/app/components/ProductTour";
import OnYourPhone from "@/app/components/products/OnYourPhone";
import ContactCta from "@/app/components/home/ContactCta";
import PacksCallout from "@/app/components/products/PacksCallout";
import AdminCallout from "@/app/components/products/AdminCallout";
import UnfilteredModels from "@/app/components/orazaka/UnfilteredModels";
import Rich from "@/app/components/Rich";
import { OrazakaIso } from "@/app/components/products/ProductIso";
import { GitHubMark } from "@/app/components/brand/GitHubMark";
import { reveal } from "@/lib/motion";
import ButtonLink from "@/app/components/ButtonLink";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orazaka",
    en: {
      title: "Orazaka — The AI that never leaves home | Krizaka",
      description:
        "Orazaka is Krizaka's open-source sovereign AI platform: chat, documents, images, video and agents on your own machines — no telemetry, a cost you decide, agents that ask first. Law 25 and GDPR by architecture.",
    },
    fr: {
      title: "Orazaka — L'IA qui ne quitte jamais la maison | Krizaka",
      description:
        "Orazaka est la plateforme d'IA souveraine open source de Krizaka : conversation, documents, images, vidéo et agents sur vos propres machines — aucune télémétrie, un coût que vous décidez, des agents qui demandent d'abord. Loi 25 et RGPD par l'architecture.",
    },
  });
}

/** Screen recordings of the real web client (orazaka-web-client `npm run record:tour`, Orazaka orange);
 *  label and caption: messages → site.orazakaPage.tour.<id>. */
const TOUR = DEMO_TOUR;
/** What the product does, shown: each capability, its bird of the flock, the demo section that plays it. */
const SHOWN = [
  { id: "creations", bird: "duck", demo: "visuals" },
  { id: "documents", bird: "owl", demo: "documents" },
  { id: "studios", bird: "falcon", demo: "studios" },
  { id: "jobs", bird: "pigeon", demo: "jobs" },
  { id: "chat", bird: "owl", demo: "chat" },
  { id: "wellbeing", bird: "flamingo", demo: "costs" },
] as const;
const PROOFS = [
  { id: "local", Icon: LocalIcon },
  { id: "capabilities", Icon: AiIcon },
  { id: "pipeline", Icon: ShieldIcon },
  { id: "telemetry", Icon: EyeOffIcon },
] as const;
/** Why, argued: the trap elsewhere, what Orazaka does, the rule a bird stands for (one bird, one idea — the falcon
    watches, the flamingo gets paid, the pigeon delivers). Words: site.orazakaPage.why.pillars.<id>. */
const PILLARS = [
  { id: "sovereignty", Icon: ShieldIcon, bird: "falcon" },
  { id: "cost", Icon: CreditsIcon, bird: "flamingo" },
  { id: "control", Icon: AgentIcon, bird: "pigeon" },
] as const;
const PLATFORM = [
  { id: "chat", Icon: ChatIcon },
  { id: "agents", Icon: AgentIcon },
  { id: "knowledge", Icon: KnowledgeIcon },
  { id: "studios", Icon: StudioIcon },
  { id: "automation", Icon: AutomationIcon },
  { id: "packs", Icon: PackIcon },
] as const;
const STEPS = [
  { id: "install", command: "npx orazaka install" },
  { id: "start", command: "orazaka start && orazaka dev" },
  { id: "ask", command: "open http://localhost:3000" },
] as const;
const EXPLORE = [
  { id: "architecture", href: "/products/orazaka/architecture", Icon: ServerIcon },
  { id: "demos", href: "/products/orazaka/demos", Icon: PlayIcon },
  { id: "signature", href: "/products/orazaka/ingenierie-cognitive", Icon: AiIcon },
  { id: "docs", href: "/docs/orazaka", Icon: KnowledgeIcon },
  { id: "mobile", href: "/docs/orazaka/mobile", Icon: LocalIcon },
  { id: "usecases", href: "/products/orazaka/usecases", Icon: PackIcon },
] as const;

const node = "var(--kz-accent)";

/** The images the product page shows from the "Made on this Mac" gallery — one per art direction, Montreal twice. */
const MADE_PICKS: readonly GalleryItem["id"][] = ["tea-pour", "mini-ironing", "mtl-ruelle", "still-tea", "mini-souk", "mtl-mont-royal"];

export default async function OrazakaPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.site.orazakaPage;
  /* The page language's labels, shared with /open-source (site.blocks). */
  const b = dict.site.blocks;
  const dl = { chose: b.page.chose, refused: b.page.refused, because: b.page.because, cost: b.page.cost };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Orazaka",
    applicationCategory: "BusinessApplication",
    operatingSystem: "macOS, Linux",
    description: t.lead,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
    publisher: { "@type": "Organization", name: "Krizaka" },
  };

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopNavBar />

      {/* ─── Hero: the promise, the sovereign stack, four proofs ─── */}
      <SectionBackdrop
        as="header"
        grid
        media={
          <div className="bp-media">
            <div style={{ backgroundImage: `url(${tourSrc("creations").poster})` }} />
            <div style={{ backgroundImage: `url(${tourSrc("documents").poster})` }} />
          </div>
        }
      >
        <div className="kz-frame bp-wrap bp-hero">
          <div className="bp-hero-grid">
            <div>
              {/* The product's name first — the mark and the word together, as in the menu, on the home and on Orochia. */}
              <p className="oz-lockup">
                <OrazakaLogo size={72} />
                <span>Orazaka</span>
              </p>
              <p className="bp-eyebrow">{t.kicker}</p>
              <h1 className="bp-h1">
                {t.titleLead} <span className="bp-accent">{t.titleAccent}</span>
              </h1>
              <p className="bp-lead" style={{ marginTop: 20 }}>{t.lead}</p>
              <div className="bp-actions">
                <ButtonLink href="#tour" variant="primary" size="lg" shimmer magnetic>
                  <PlayIcon size={18} /> {t.ctaTour}
                </ButtonLink>
                <ButtonLink href="#how" size="lg">
                  {t.ctaHow} <ForwardIcon size={16} />
                </ButtonLink>
                <ButtonLink href="https://github.com/krizaka/orazaka" size="lg">
                  <GitHubMark size={16} /> krizaka/orazaka
                </ButtonLink>
              </div>
            </div>
            <OrazakaIso locale={asLocale(locale)} className="bp-hero-art" />
          </div>
          <ul className="bp-proofs">
            {PROOFS.map(({ id, Icon }) => (
              <li key={id} className="bp-proof">
                <Icon size={22} nodeColor={node} />
                <span>
                  <strong>{t.proofs[id].title}</strong>
                  {t.proofs[id].body}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </SectionBackdrop>

      {/* ─── Product tour (recordings of the real application) ─── */}
      <section id="tour" className="kz-frame bp-wrap" style={{ scrollMarginTop: 72, paddingTop: 24 }}>
        <SectionHeading eyebrow={t.tourEyebrow} title={t.tourTitle} align="center" reveal />
        <div {...reveal(1)}>
          <ProductTour
            clips={TOUR.map((id) => ({ id, media: tourSrc(id), ...t.tour[id] }))}
            frameLabel="orazaka · localhost"
          />
        </div>
      </section>

      {/* ─── What it does, shown: six capabilities, each watched over by a bird of the flock ─── */}
      {/* ─── On your phone: the iOS app in one clip, then the mobile docs ─── */}
      <OnYourPhone product="orazaka" text={t.phone} />

      <section className="kz-frame bp-wrap" id="shown" style={{ scrollMarginTop: 72 }}>
        <SectionHeading eyebrow={t.shown.eyebrow} title={<Rich text={t.shown.title} />} lead={t.shown.lead} reveal />
        <div className="bp-cards">
          {SHOWN.map(({ id, bird, demo }, i) => (
            <Link key={id} href={`/products/orazaka/demos#${demo}`} className="bp-card oz-shown" {...reveal(i + 1)}>
              <Mascot bird={bird} mood={id === "jobs" ? "thinking" : "welcome"} size={84} />
              <h3>{t.shown.items[id].title}</h3>
              <p>{t.shown.items[id].body}</p>
              <span className="bp-card-more">
                {t.shown.more} <ForwardIcon size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Made on this Mac: art-direction Studios, one Mac, nothing sent anywhere ─── */}
      <section className="bp-wrap" id="made" style={{ scrollMarginTop: 72 }}>
        <div {...reveal()}>
          <p className="bp-eyebrow">{t.made.eyebrow}</p>
          <h2 className="bp-h2"><Rich text={t.made.title} /></h2>
          <p className="bp-lead">{t.made.lead}</p>
        </div>
        <MadeHereGallery t={dict.site.orazakaDemo.gallery} only={MADE_PICKS} compact />
        <div className="bp-actions" style={{ marginTop: 24 }} {...reveal()}>
          <ButtonLink href="/products/orazaka/demos#made-here" size="lg">
            {t.made.cta} <ForwardIcon size={16} />
          </ButtonLink>
        </div>
      </section>

      {/* ─── Why: sovereignty, cost, control ─── */}
      <SectionBackdrop className="bp-glide" dome={false} id="why">
        <div className="kz-frame bp-wrap">
          <SectionHeading eyebrow={t.why.eyebrow} title={<Rich text={t.why.title} />} lead={t.why.lead} reveal />
          <div className="bp-argue">
            <CardGrid columns={3} min={300}>
              {PILLARS.map(({ id, Icon, bird }) => (
                <ArgumentCard
                  key={id}
                  id={`why-${id}`}
                  icon={<Icon size={20} nodeColor={node} />}
                  title={t.why.pillars[id].title}
                  panelLabel={b.details}
                  mark={<Mascot bird={bird} size={40} animated={false} />}
                  hook={{ label: b.trap, text: <Ticks>{t.why.pillars[id].trap}</Ticks> }}
                  points={{ label: b.answer, items: (t.why.pillars[id].points).map((x) => <Ticks key={x}>{x}</Ticks>) }}
                  rule={<MascotQuote bird={bird} label={format(b.birdSays, { bird: b.birds[bird] })}><Ticks>{t.why.pillars[id].rule}</Ticks></MascotQuote>}
                />
              ))}
            </CardGrid>
          </div>
        </div>
      </SectionBackdrop>

      {/* ─── Unfiltered models, your rules ─── */}
      <UnfilteredModels locale={asLocale(locale)} variant="pitch" />

      {/* ─── Platform: six capabilities ─── */}
      <section className="kz-frame bp-wrap">
        <SectionHeading eyebrow={t.platform.eyebrow} title={<Rich text={t.platform.title} />} lead={t.platform.lead} reveal />
        <div className="bp-cards">
          {PLATFORM.map(({ id, Icon }, i) => (
            <div key={id} className="bp-card" {...reveal(i + 1)}>
              <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
              <h3>{t.platform.items[id].title}</h3>
              <p>{t.platform.items[id].body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Cost & control: the same questions, two answers ─── */}
      <SectionBackdrop className="bp-glide" dome={false} id="compare">
        <div className="kz-frame bp-wrap">
          <SectionHeading eyebrow={t.compare.eyebrow} title={<Rich text={t.compare.title} />} lead={t.compare.lead} reveal />
          <table className="bp-compare" {...reveal(1, "soft")}>
            <thead>
              <tr>
                <th scope="col">{t.compare.topic}</th>
                <th scope="col">{t.compare.cloud}</th>
                <th scope="col" className="bp-ours">{t.compare.orazaka}</th>
              </tr>
            </thead>
            <tbody>
              {t.compare.rows.map((row) => (
                <tr key={row.topic}>
                  <th scope="row">{row.topic}</th>
                  <td data-label={t.compare.cloud}>{row.cloud}</td>
                  <td data-label={t.compare.orazaka} className="bp-ours">{row.orazaka}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionBackdrop>

      {/* ─── Decisions: what we chose, refused, why, and what it costs ─── */}
      <section className="kz-frame bp-wrap" id="decisions" style={{ scrollMarginTop: 72 }}>
        <SectionHeading eyebrow={t.decisions.eyebrow} title={<Rich text={t.decisions.title} />} lead={t.decisions.lead} reveal />
        <div className="bp-argue">
          <DecisionList decisions={t.decisions.items.map((d) => ({ id: d.chose, chose: <Ticks>{d.chose}</Ticks>, refused: <Ticks>{d.refused}</Ticks>, because: <Ticks>{d.because}</Ticks>, cost: <Ticks>{d.cost}</Ticks> }))} labels={dl} />
        </div>
      </section>

      {/* ─── Law 25 · GDPR ─── */}
      <section className="kz-frame bp-wrap">
        <div className="bp-split">
          <div {...reveal()}>
            <SectionHeading eyebrow={t.law25.eyebrow} title={<Rich text={t.law25.title} />} lead={t.law25.lead} />
            <div className="bp-argue" style={{ marginTop: 24 }}>
              <MascotQuote variant="callout" bird="owl" mood="welcome" label={format(b.birdSays, { bird: b.birds.owl })}><Ticks>{t.law25.rule}</Ticks></MascotQuote>
            </div>
          </div>
          <ul className="bp-ledger">
            {t.law25.points.map((point, i) => (
              <li key={point} {...reveal(i + 1)} style={{ gridTemplateColumns: "auto minmax(0, 1fr)", ...reveal(i + 1).style }}>
                <span className="bp-icon"><CheckIcon size={18} /></span>
                <span className="bp-ledger-what">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── How it works: three commands ─── */}
      <SectionBackdrop className="bp-glide" dome={false} grid id="how" style={{ scrollMarginTop: 72 }}>
        <div className="kz-frame bp-wrap">
          <div className="bp-split">
            <div {...reveal()}>
              <SectionHeading eyebrow={t.how.eyebrow} title={<Rich text={t.how.title} />} lead={t.how.lead} />
              <ol className="bp-steps">
                {STEPS.map(({ id }) => (
                  <li key={id}>
                    <span>
                      <strong>{t.how.steps[id].title}</strong>
                      <p>{t.how.steps[id].body}</p>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bp-term" {...reveal(2)}>
              <div className="bp-term-bar" aria-hidden>
                <i /><i /><i /> {t.how.terminal}
              </div>
              <pre>
                {STEPS.map(({ id, command }) => (
                  <div key={id}>
                    <span>$</span> {command}
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      </SectionBackdrop>

      <PacksCallout locale={asLocale(locale)} />
      <AdminCallout product="orazaka" locale={asLocale(locale)} />

      {/* ─── Go deeper ─── */}
      <section className="kz-frame bp-wrap">
        <SectionHeading eyebrow={t.explore.eyebrow} title={<Rich text={t.explore.title} />} reveal />
        <div className="bp-cards">
          {EXPLORE.map(({ id, href, Icon }, i) => (
            <Link key={id} href={href} className="bp-card" {...reveal(i + 1)}>
              <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
              <h3>{t.explore.items[id].title}</h3>
              <p>{t.explore.items[id].body}</p>
              <span className="bp-card-more">
                {t.explore.more} <ForwardIcon size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SectionBackdrop className="bp-glide" dome={false}>
        <ContactCta topic="orazaka" />
      </SectionBackdrop>
      <SiteFooter />
      <style>{`
        .oz-lockup { display: flex; width: fit-content; align-items: center; gap: 14px; margin: 0 0 18px; font-family: var(--font-display), system-ui, sans-serif;
          font-size: clamp(2.25rem, 5vw, 3.25rem); font-weight: 800; letter-spacing: -.03em; line-height: 1; color: var(--kz-text-primary); }
        .oz-shown svg[data-bird] { margin: -6px 0 4px -6px; }
      `}</style>
    </main>
  );
}

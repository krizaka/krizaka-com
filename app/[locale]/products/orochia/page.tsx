import type { Metadata } from "next";
import { ProductFaq } from "@/app/components/ProductFaq";
import { SectionHeading } from "@krizaka/ui/page";
import Link from "next/link";
import {
  AuctionIcon,
  BillingIcon,
  ChallengeIcon,
  ExternalIcon,
  ForwardIcon,
  HeartIcon,
  KnowledgeIcon,
  LocalIcon,
  LockIcon,
  PlayIcon,
  ShieldIcon,
  TipIcon,
  UnlockIcon,
  UsersIcon,
  VideoIcon,
  WalletIcon,
} from "@krizaka/icons";
import { SectionBackdrop } from "@krizaka/ui/section-backdrop";
import { OROCHIA_APP_URL } from "@/lib/site";
import { localizedMetadata } from "@/lib/seo";
import orochia from "@/app/data/orochia-architecture.json";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import ModuleMap from "@/app/components/diagrams/ModuleMap";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { reveal } from "@/lib/motion";
import OrochiaTour from "@/app/components/OrochiaTour";
import { tourSrc } from "@/lib/orochia-demo";
import { asLocale, format, getDictionary } from "@/lib/i18n";
import ContactCta from "@/app/components/home/ContactCta";
import AdminCallout from "@/app/components/products/AdminCallout";
import OnYourPhone from "@/app/components/products/OnYourPhone";
import { moduleMapData } from "@/lib/architecture-model";
import { journeysFor } from "@/lib/journeys";
import { OrochiaLogo } from "@krizaka/ui";
import Rich from "@/app/components/Rich";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { DecisionList } from "@krizaka/ui/decision-list";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Mascot } from "@krizaka/ui/mascots";
import { Ticks } from "@krizaka/ui/page";
import { OrochiaIso } from "@/app/components/products/ProductIso";
import { GlowCard } from "@krizaka/ui/glow-card";
import { Meter } from "@krizaka/ui/meter";
import { GitHubMark } from "@/app/components/brand/GitHubMark";
import { PAYOUT_MINIMUM_CENTS, PLATFORM_FEE_PERCENTAGE, SPLIT_EXAMPLES, creatorNetCents, formatUsd } from "@/lib/orochia-economics";
import ButtonLink from "@/app/components/ButtonLink";

/** Whole numbers while the figure climbs (NumberTicker formats every frame). */
const WHOLE = { maximumFractionDigits: 0 } as const;

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orochia",
    en: {
      title: "Orochia — Fans pay, creators keep 90% | Krizaka",
      description:
        "Orochia is Krizaka's open-source video platform for independent creators: signed 4K streaming, audiences the creator chooses (followers, contacts, paid unlock, invited lists), video auctions, challenges (goals, dares and open calls funded in escrow), collections, gateway-confirmed payments and 18+ compliance.",
    },
    fr: {
      title: "Orochia — Les fans paient, les créateurs gardent 90 % | Krizaka",
      description:
        "Orochia est la plateforme vidéo open source de Krizaka pour créateurs indépendants : diffusion 4K signée, publics choisis par le créateur (abonnés, contacts, déblocage payant, listes d'invités), enchères vidéo, défis (objectifs, défis lancés aux créateurs et appels ouverts financés sous séquestre), collections, paiements confirmés par la passerelle et conformité 18+.",
    },
  });
}


/** The guarantees, each with its signature icon (texts: messages → site.orochia.pillars.<id>). */
const PILLARS = [
  { id: "cdn", Icon: VideoIcon },
  { id: "access", Icon: LockIcon },
  { id: "audiences", Icon: UsersIcon },
  { id: "engagement", Icon: HeartIcon },
  { id: "payments", Icon: BillingIcon },
  { id: "wallet", Icon: WalletIcon },
  { id: "auctions", Icon: AuctionIcon },
  { id: "challenges", Icon: ChallengeIcon },
  { id: "compliance", Icon: ShieldIcon },
] as const;

/** The four ways a fan pays a creator (texts: messages → site.orochia.ways.<id>). */
const WAYS = [
  { id: "tip", Icon: TipIcon },
  { id: "unlock", Icon: UnlockIcon },
  { id: "bid", Icon: AuctionIcon },
  { id: "challenge", Icon: ChallengeIcon },
] as const;

/** Auctions and challenges, argued: the flamingo gets paid (the winner pays, the creator is paid), the pigeon delivers
    (pledges wait for the video). Words: site.orochia.rules.<id>. */
const RULES = [
  { id: "auctions", Icon: AuctionIcon, bird: "flamingo" },
  { id: "challenges", Icon: ChallengeIcon, bird: "pigeon" },
] as const;

const node = "var(--kz-accent-2)";

export default async function OrochiaPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const t = dict.site.orochia;
  /* The page language's labels, shared with /open-source (site.blocks). */
  const b = dict.site.blocks;
  const dl = { chose: b.page.chose, refused: b.page.refused, because: b.page.because, cost: b.page.cost };
  const tables = orochia.modules.find((m) => m.id === "data")?.tables ?? [];
  const journeys = journeysFor("orochia", getDictionary(locale));
  const money = (cents: number) => formatUsd(cents, locale);
  /* "{value} %": the figure climbs (NumberTicker), the words around it stay the message's. */
  const share = t.paid.percent.split("{value}");

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <TopNavBar />

      {/* ─── Hero: the promise, the four ways to pay, footage out of focus behind ─── */}
      <SectionBackdrop
        as="header"
        grid
        media={
          <div className="bp-media">
            <div style={{ backgroundImage: `url(${tourSrc("alex-discover").poster})` }} />
            <div style={{ backgroundImage: `url(${tourSrc("elena-earnings").poster})` }} />
          </div>
        }
      >
        <div className="kz-frame bp-wrap bp-hero">
          <div className="bp-hero-grid">
          <div>
          {/* The product's name first — the mark and the word together, as in the menu, on the home and on Orazaka. */}
          <p className="oc-lockup">
            <OrochiaLogo size={72} />
            <span>Orochia</span>
          </p>
          <p className="bp-eyebrow">{t.kicker}</p>
          <h1 className="bp-h1">
            {t.titleLead} <span style={{ display: "block" }} className="bp-accent">{t.titleAccent}</span>
          </h1>
          <p className="bp-lead" style={{ marginTop: 20 }}>{t.heroLead}</p>
          <div className="bp-actions">
            <ButtonLink href="/products/orochia/demos" variant="primary" size="lg" shimmer magnetic>
              <PlayIcon size={18} /> {t.watchDemo}
            </ButtonLink>
            <ButtonLink href={OROCHIA_APP_URL} size="lg" rel="noopener">
              <ExternalIcon size={16} /> {t.openApp}
            </ButtonLink>
            <ButtonLink href="https://github.com/krizaka/orochia" size="lg">
              <GitHubMark size={16} /> krizaka/orochia
            </ButtonLink>
          </div>
          </div>
          <OrochiaIso locale={asLocale(locale)} className="bp-hero-art" />
          </div>
          <ul className="bp-proofs">
            {WAYS.map(({ id, Icon }) => (
              <li key={id} className="bp-proof">
                <Icon size={22} nodeColor={node} />
                <span>
                  <strong>{t.ways[id].title}</strong>
                  {t.ways[id].body}
                </span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 12, color: "var(--kz-text-secondary)", margin: "20px 0 0", textAlign: "center" }}>{t.audience}</p>
        </div>
      </SectionBackdrop>

      {/* ─── Get paid: the 90 / 10 split, worked examples ─── */}
      <section id="get-paid" className="kz-frame bp-wrap" style={{ scrollMarginTop: 72 }}>
        <div className="bp-split">
          {/* The split, drawn: a ring of the creator's share, the figure climbing in its centre. */}
          <div {...reveal()}>
            <GlowCard className="oc-split">
              <p className="bp-eyebrow" aria-hidden>{t.paid.meter.label}</p>
              <Meter
                variant="ring"
                size="lg"
                className="oc-ring"
                label={t.paid.meter.label}
                max={100}
                parts={[
                  { label: t.paid.meter.creator, value: 100 - PLATFORM_FEE_PERCENTAGE, valueText: format(t.paid.percent, { value: 100 - PLATFORM_FEE_PERCENTAGE }) },
                  { label: t.paid.meter.platform, value: PLATFORM_FEE_PERCENTAGE, valueText: format(t.paid.percent, { value: PLATFORM_FEE_PERCENTAGE }) },
                ]}
              >
                <span className="oc-ring-figure">
                  {share[0]}
                  <NumberTicker value={100 - PLATFORM_FEE_PERCENTAGE} locale={locale} format={WHOLE} />
                  {share[1]}
                </span>
                <span className="oc-ring-caption">{t.paid.meter.caption}</span>
              </Meter>
            </GlowCard>
          </div>
          <div {...reveal(1)}>
            <SectionHeading eyebrow={t.paid.eyebrow} title={<Rich text={t.paid.title} />} lead={t.paid.lead} />
            <ul className="bp-ledger">
              {SPLIT_EXAMPLES.map(({ id, grossCents }, i) => {
                const Icon = { tip: TipIcon, unlock: UnlockIcon, pledge: ChallengeIcon, bid: AuctionIcon }[id];
                return (
                  <li key={id} {...reveal(i + 2)}>
                    <span className="bp-icon"><Icon size={20} nodeColor={node} /></span>
                    <span className="bp-ledger-what"><Rich text={format(t.paid.examples[id], { gross: money(grossCents) })} /></span>
                    <span className="bp-ledger-net">{format(t.paid.net, { net: money(creatorNetCents(grossCents)) })}</span>
                  </li>
                );
              })}
            </ul>
            <p className="bp-fine">{format(t.paid.fine, { fee: PLATFORM_FEE_PERCENTAGE, minimum: money(PAYOUT_MINIMUM_CENTS) })}</p>
          </div>
        </div>
      </section>

      {/* ─── Auctions · challenges: the rules, as the code applies them ─── */}
      <SectionBackdrop className="bp-glide" dome={false}>
        <div className="kz-frame bp-wrap">
          <SectionHeading eyebrow={t.rules.eyebrow} title={<Rich text={t.rules.title} />} reveal />
          <div className="bp-argue">
            <CardGrid columns={2} min={320}>
              {RULES.map(({ id, Icon, bird }) => (
                <ArgumentCard
                  key={id}
                  id={`rules-${id}`}
                  icon={<Icon size={20} nodeColor={node} />}
                  title={t.rules[id].title}
                  panelLabel={b.details}
                  mark={<Mascot bird={bird} size={40} animated={false} />}
                  hook={{ label: b.trap, text: <Ticks>{t.rules[id].trap}</Ticks> }}
                  points={{ label: b.answer, items: ([t.rules[id].body, ...t.rules[id].facts]).map((x) => <Ticks key={x}>{x}</Ticks>) }}
                  rule={<MascotQuote bird={bird} label={format(b.birdSays, { bird: b.birds[bird] })}><Ticks>{t.rules[id].rule}</Ticks></MascotQuote>}
                />
              ))}
            </CardGrid>
          </div>
        </div>
      </SectionBackdrop>

      {/* ─── Product tour (screen recordings of the real app) ─── */}
      <section id="tour" className="kz-frame bp-wrap" style={{ scrollMarginTop: 72 }}>
        <SectionHeading eyebrow={t.tourEyebrow} title={t.tourTitle} align="center" reveal />
        <div {...reveal(1)}>
          <OrochiaTour />
        </div>
        <p className="bp-center" style={{ marginTop: 20 }}>
          <Link href="/products/orochia/demos" className="kz-link-strong">
            <PlayIcon size={16} /> {t.tourMore}
          </Link>
        </p>
      </section>

      {/* ─── On your phone: the iOS app in one clip, then the mobile docs ─── */}
      <OnYourPhone product="orochia" text={t.phone} />

      {/* ─── Guarantees ─── */}
      <SectionBackdrop className="bp-glide" dome={false} id="guarantees" style={{ scrollMarginTop: 72 }}>
        <div className="kz-frame bp-wrap">
          <SectionHeading eyebrow={t.pillarsEyebrow} title={t.pillarsTitle} reveal />
          <div className="bp-cards">
            {PILLARS.map(({ id, Icon }, i) => (
              <div key={id} className="bp-card" {...reveal(i % 3 + 1)}>
                <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
                <h3>{t.pillars[id].title}</h3>
                <p>{t.pillars[id].body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionBackdrop>

      {/* ─── Decisions: built like financial infrastructure, and what it costs ─── */}
      <section className="kz-frame bp-wrap" id="decisions" style={{ scrollMarginTop: 72 }}>
        <SectionHeading eyebrow={t.decisions.eyebrow} title={<Rich text={t.decisions.title} />} lead={t.decisions.lead} reveal />
        <div className="bp-argue">
          <DecisionList decisions={t.decisions.items.map((d) => ({ id: d.chose, chose: <Ticks>{d.chose}</Ticks>, refused: <Ticks>{d.refused}</Ticks>, because: <Ticks>{d.because}</Ticks>, cost: <Ticks>{d.cost}</Ticks> }))} labels={dl} />
        </div>
      </section>

      {/* ─── How it works: the module map, its three journeys played step by step (lib/journeys.ts) ─── */}
      <section id="architecture" className="kz-frame bp-wrap" style={{ scrollMarginTop: 72 }}>
        <SectionHeading eyebrow={t.archEyebrow} title={t.archTitle} lead={t.archLead} reveal />
        <div {...reveal(1, "soft")}>
          <ModuleMap data={moduleMapData("orochia")} journeys={journeys} initial={{ view: "journey" }} />
        </div>
      </section>

      {/* ─── Repositories & facts ─── */}
      <section className="kz-frame bp-wrap" style={{ paddingTop: 0 }}>
        <SectionHeading eyebrow={t.sourceEyebrow} title={t.sourceTitle} lead={format(t.sourceLead, { endpoints: orochia.apiEndpoints.length, tables: tables.length })} reveal />
        <div className="bp-cards" style={{ marginTop: 0 }}>
          {orochia.repositories.map((r, i) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="bp-card" {...reveal(i + 1)}>
              <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13.5 }}>
                {r.repo} <ForwardIcon size={14} style={{ color: "var(--kz-text-secondary)" }} />
              </span>
              <span style={{ fontSize: 12, color: "var(--kz-accent-text)", fontWeight: 600 }}>{r.role}</span>
              <p>{r.description}</p>
              <span style={{ marginTop: "auto", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--kz-text-secondary)" }}>{r.stack.join(" · ")}</span>
            </a>
          ))}
        </div>
        <p style={{ marginTop: 20 }}>
          <Link href="/docs/orochia" className="kz-link-strong">
            <KnowledgeIcon size={16} /> {t.docs}
          </Link>
        </p>
        <p style={{ marginTop: 8 }}>
          <Link href="/docs/orochia/mobile" className="kz-link-strong">
            <LocalIcon size={16} /> {t.mobileDocs}
          </Link>
        </p>
        <p style={{ marginTop: 8 }}>
          <Link href="/docs/orochia/ux_decisions" className="kz-link-strong">
            <HeartIcon size={16} /> {t.uxDocs}
          </Link>
        </p>
        <p style={{ marginTop: 8 }}>
          <Link href="/docs/orochia/accessibility" className="kz-link-strong">
            <UsersIcon size={16} /> {t.a11yDocs}
          </Link>
        </p>
      </section>

      <AdminCallout product="orochia" locale={asLocale(locale)} />

      <SectionBackdrop className="bp-glide" dome={false}>
        <ContactCta topic="orochia" />
      </SectionBackdrop>
      <ProductFaq product="orochia" locale={locale} />
      <SiteFooter />
      <style>{`
        .oc-lockup { display: flex; width: fit-content; align-items: center; gap: 14px; margin: 0 0 18px; font-family: var(--font-display), system-ui, sans-serif;
          font-size: clamp(2.25rem, 5vw, 3.25rem); font-weight: 800; letter-spacing: -.03em; line-height: 1; color: var(--kz-text-primary); }
        .oc-split { display: grid; justify-items: center; gap: 18px; padding: clamp(24px, 4vw, 44px); border-radius: 24px; background: var(--kz-surface-1); border: 1px solid var(--kz-border-subtle); }
        .oc-split .bp-eyebrow { margin: 0; }
        .oc-ring { gap: 18px; font-size: 13.5px; }
        .oc-ring > div:first-child { width: min(260px, 62vw); height: auto; aspect-ratio: 1; }
        .oc-ring-figure { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(2.8rem, 7vw, 4rem); font-weight: 800; letter-spacing: -.04em; line-height: 1; color: var(--kz-accent-text); }
        .oc-ring-caption { margin-top: 6px; font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--kz-text-secondary); }
        /* The ring draws itself when the card arrives (the reveal of its column); still under reduced motion. */
        @media (prefers-reduced-motion: no-preference) {
          .kz-in .oc-ring circle + circle { animation: oc-draw 1.4s var(--kz-ease) both; }
          .kz-in .oc-ring circle + circle + circle { animation-delay: .5s; }
        }
        @keyframes oc-draw { from { stroke-dasharray: 0 100; } }
      `}</style>
    </main>
  );
}

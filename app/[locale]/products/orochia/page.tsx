import type { Metadata } from "next";
import Link from "next/link";
import {
  AuctionIcon,
  BillingIcon,
  ChallengeIcon,
  CheckIcon,
  ExternalIcon,
  ForwardIcon,
  HeartIcon,
  KnowledgeIcon,
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
import OrochiaArchitecture from "@/app/components/OrochiaArchitecture";
import ProductTour from "@/app/components/ProductTour";
import { format, getDictionary } from "@/lib/i18n";
import ContactCta from "@/app/components/home/ContactCta";
import { verifiedJourneys } from "@/lib/orochia-journeys";
import { OrochiaLogo } from "@krizaka/ui";
import Rich from "@/app/components/Rich";
import { IsoSplit } from "@/app/components/brand/Iso";
import { GitHubMark } from "@/app/components/brand/GitHubMark";
import { PAYOUT_MINIMUM_CENTS, PLATFORM_FEE_PERCENTAGE, SPLIT_EXAMPLES, creatorNetCents, formatUsd } from "@/lib/orochia-economics";

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

/** Screen recordings of the real app; label and caption: messages → site.orochia.tour.<id>. */
const TOUR = ["feed", "unlock", "community", "studio", "admin"] as const;

const node = "var(--kz-accent-2)";

export default async function OrochiaPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale).site.orochia;
  const tables = orochia.modules.find((m) => m.id === "data")?.tables ?? [];
  const journeys = verifiedJourneys();
  const money = (cents: number) => formatUsd(cents, locale);

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <TopNavBar />

      {/* ─── Hero: the promise, the four ways to pay, footage out of focus behind ─── */}
      <SectionBackdrop
        as="header"
        grid
        media={
          <div className="bp-media">
            <div style={{ backgroundImage: "url(/assets/orochia/tour/feed.jpg)" }} />
            <div style={{ backgroundImage: "url(/assets/orochia/tour/community.jpg)" }} />
          </div>
        }
      >
        <div className="bp-wrap bp-hero bp-center">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <OrochiaLogo size={104} />
          </div>
          <p className="bp-eyebrow">{t.kicker}</p>
          <h1 className="bp-h1">
            {t.titleLead} <span style={{ display: "block" }} className="bp-accent">{t.titleAccent}</span>
          </h1>
          <p className="bp-lead" style={{ margin: "20px auto 0" }}>{t.heroLead}</p>
          <div className="bp-actions">
            <Link href="#tour" className="bp-btn bp-btn-primary btn-sheen">
              <PlayIcon size={18} /> {t.watchDemo}
            </Link>
            <a href={OROCHIA_APP_URL} target="_blank" rel="noopener" className="bp-btn bp-btn-ghost">
              <ExternalIcon size={16} /> {t.openApp}
            </a>
            <a href="https://github.com/krizaka/orochia" target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
              <GitHubMark size={16} /> krizaka/orochia
            </a>
          </div>
          <ul className="bp-proofs" style={{ textAlign: "left" }}>
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
          <p style={{ fontSize: 12, color: "var(--kz-text-secondary)", margin: "20px 0 0" }}>{t.audience}</p>
        </div>
      </SectionBackdrop>

      {/* ─── Get paid: the 90 / 10 split, worked examples ─── */}
      <section id="get-paid" className="bp-wrap" style={{ scrollMarginTop: 72 }}>
        <div className="bp-split">
          <IsoSplit share={100 - PLATFORM_FEE_PERCENTAGE} className="bp-hero-art" />
          <div>
            <p className="bp-eyebrow">{t.paid.eyebrow}</p>
            <h2 className="bp-h2"><Rich text={t.paid.title} /></h2>
            <p className="bp-lead">{t.paid.lead}</p>
            <p className="bp-share">
              <b>{format(t.paid.percent, { value: 100 - PLATFORM_FEE_PERCENTAGE })}</b> <span>{t.paid.share}</span>
            </p>
            <ul className="bp-ledger">
              {SPLIT_EXAMPLES.map(({ id, grossCents }) => {
                const Icon = { tip: TipIcon, unlock: UnlockIcon, pledge: ChallengeIcon, bid: AuctionIcon }[id];
                return (
                  <li key={id}>
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
        <div className="bp-wrap">
          <p className="bp-eyebrow">{t.rules.eyebrow}</p>
          <h2 className="bp-h2"><Rich text={t.rules.title} /></h2>
          <div className="bp-cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))" }}>
            {(["auctions", "challenges"] as const).map((id) => {
              const Icon = id === "auctions" ? AuctionIcon : ChallengeIcon;
              return (
                <div key={id} className="bp-card">
                  <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
                  <h3>{t.rules[id].title}</h3>
                  <p>{t.rules[id].body}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0", display: "grid", gap: 8 }}>
                    {t.rules[id].facts.map((fact) => (
                      <li key={fact} style={{ display: "flex", gap: 8, fontSize: 13.5, lineHeight: 1.55, color: "var(--kz-text-primary)" }}>
                        <CheckIcon size={16} style={{ flexShrink: 0, marginTop: 2, color: "var(--kz-accent-text)" }} /> {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </SectionBackdrop>

      {/* ─── Product tour (screen recordings of the real app) ─── */}
      <section id="tour" className="bp-wrap" style={{ scrollMarginTop: 72 }}>
        <ProductTour
          clips={TOUR.map((id) => ({ id, src: `/assets/orochia/tour/${id}`, ...t.tour[id] }))}
          frameLabel="orochia · localhost"
        />
      </section>

      {/* ─── Guarantees ─── */}
      <SectionBackdrop className="bp-glide" dome={false} id="guarantees" style={{ scrollMarginTop: 72 }}>
        <div className="bp-wrap">
          <p className="bp-eyebrow">{t.pillarsEyebrow}</p>
          <h2 className="bp-h2">{t.pillarsTitle}</h2>
          <div className="bp-cards">
            {PILLARS.map(({ id, Icon }) => (
              <div key={id} className="bp-card">
                <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
                <h3>{t.pillars[id].title}</h3>
                <p>{t.pillars[id].body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionBackdrop>

      {/* ─── How it works: animated journeys ─── */}
      <section id="architecture" className="bp-wrap" style={{ scrollMarginTop: 72 }}>
        <p className="bp-eyebrow">{t.archEyebrow}</p>
        <h2 className="bp-h2">{t.archTitle}</h2>
        <p className="bp-lead" style={{ marginBottom: 24 }}>{t.archLead}</p>
        <OrochiaArchitecture journeys={journeys} />
      </section>

      {/* ─── Repositories & facts ─── */}
      <section className="bp-wrap" style={{ paddingTop: 0 }}>
        <p className="bp-eyebrow">{t.sourceEyebrow}</p>
        <h2 className="bp-h2">{t.sourceTitle}</h2>
        <p className="bp-lead" style={{ marginBottom: 24 }}>
          {format(t.sourceLead, { endpoints: orochia.apiEndpoints.length, tables: tables.length })}
        </p>
        <div className="bp-cards" style={{ marginTop: 0 }}>
          {orochia.repositories.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="bp-card">
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
          <Link href="/products/orochia/docs" className="kz-link-strong">
            <KnowledgeIcon size={16} /> {t.docs}
          </Link>
        </p>
      </section>

      <SectionBackdrop className="bp-glide" dome={false}>
        <ContactCta topic="orochia" />
      </SectionBackdrop>
      <SiteFooter />
    </main>
  );
}

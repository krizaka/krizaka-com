import type { Metadata } from "next";
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
import { localizedMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/i18n";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import ProductTour from "@/app/components/ProductTour";
import ContactCta from "@/app/components/home/ContactCta";
import Rich from "@/app/components/Rich";
import { IsoSovereignStack } from "@/app/components/brand/Iso";
import { GitHubMark } from "@/app/components/brand/GitHubMark";
import { reveal } from "@/lib/motion";

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
const TOUR = ["home", "chat", "studios", "settings"] as const;
const PROOFS = [
  { id: "local", Icon: LocalIcon },
  { id: "capabilities", Icon: AiIcon },
  { id: "pipeline", Icon: ShieldIcon },
  { id: "telemetry", Icon: EyeOffIcon },
] as const;
const PILLARS = [
  { id: "sovereignty", Icon: ShieldIcon },
  { id: "cost", Icon: CreditsIcon },
  { id: "control", Icon: AgentIcon },
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
  { id: "usecases", href: "/products/orazaka/usecases", Icon: PackIcon },
] as const;

const node = "var(--kz-accent)";

export default async function OrazakaPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale).site.orazakaPage;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Orazaka",
    applicationCategory: "BusinessApplication",
    operatingSystem: "macOS, Linux",
    description: t.lead,
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
            <div style={{ backgroundImage: "url(/assets/orazaka/tour/chat.jpg)" }} />
            <div style={{ backgroundImage: "url(/assets/orazaka/tour/studios.jpg)" }} />
          </div>
        }
      >
        <div className="bp-wrap bp-hero">
          <div className="bp-hero-grid">
            <div>
              <p className="bp-eyebrow">
                <OrazakaLogo size={28} /> {t.kicker}
              </p>
              <h1 className="bp-h1">
                {t.titleLead} <span className="bp-accent">{t.titleAccent}</span>
              </h1>
              <p className="bp-lead" style={{ marginTop: 20 }}>{t.lead}</p>
              <div className="bp-actions">
                <Link href="#tour" className="bp-btn bp-btn-primary btn-sheen">
                  <PlayIcon size={18} /> {t.ctaTour}
                </Link>
                <Link href="#how" className="bp-btn bp-btn-ghost">
                  {t.ctaHow} <ForwardIcon size={16} />
                </Link>
                <a href="https://github.com/krizaka/orazaka" target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn-ghost">
                  <GitHubMark size={16} /> krizaka/orazaka
                </a>
              </div>
            </div>
            <IsoSovereignStack className="bp-hero-art" />
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
      <section id="tour" className="bp-wrap" style={{ scrollMarginTop: 72, paddingTop: 24 }}>
        <div className="bp-center" style={{ marginBottom: 28 }} {...reveal()}>
          <p className="bp-eyebrow">{t.tourEyebrow}</p>
          <h2 className="bp-h2">{t.tourTitle}</h2>
        </div>
        <div {...reveal(1)}>
          <ProductTour
            clips={TOUR.map((id) => ({ id, src: `/assets/orazaka/tour/${id}`, ...t.tour[id] }))}
            frameLabel="orazaka · localhost"
          />
        </div>
      </section>

      {/* ─── Why: sovereignty, cost, control ─── */}
      <SectionBackdrop className="bp-glide" dome={false} id="why">
        <div className="bp-wrap">
          <div {...reveal()}>
            <p className="bp-eyebrow">{t.why.eyebrow}</p>
            <h2 className="bp-h2"><Rich text={t.why.title} /></h2>
            <p className="bp-lead">{t.why.lead}</p>
          </div>
          <div className="bp-cards">
            {PILLARS.map(({ id, Icon }, i) => (
              <div key={id} className="bp-card" {...reveal(i + 1)}>
                <span className="bp-icon"><Icon size={22} nodeColor={node} /></span>
                <h3>{t.why.pillars[id].title}</h3>
                <p>{t.why.pillars[id].body}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionBackdrop>

      {/* ─── Platform: six capabilities ─── */}
      <section className="bp-wrap">
        <div {...reveal()}>
          <p className="bp-eyebrow">{t.platform.eyebrow}</p>
          <h2 className="bp-h2"><Rich text={t.platform.title} /></h2>
          <p className="bp-lead">{t.platform.lead}</p>
        </div>
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
        <div className="bp-wrap">
          <div {...reveal()}>
            <p className="bp-eyebrow">{t.compare.eyebrow}</p>
            <h2 className="bp-h2"><Rich text={t.compare.title} /></h2>
            <p className="bp-lead">{t.compare.lead}</p>
          </div>
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

      {/* ─── Law 25 · GDPR ─── */}
      <section className="bp-wrap">
        <div className="bp-split">
          <div {...reveal()}>
            <p className="bp-eyebrow">{t.law25.eyebrow}</p>
            <h2 className="bp-h2"><Rich text={t.law25.title} /></h2>
            <p className="bp-lead">{t.law25.lead}</p>
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
        <div className="bp-wrap">
          <div className="bp-split">
            <div {...reveal()}>
              <p className="bp-eyebrow">{t.how.eyebrow}</p>
              <h2 className="bp-h2"><Rich text={t.how.title} /></h2>
              <p className="bp-lead">{t.how.lead}</p>
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

      {/* ─── Go deeper ─── */}
      <section className="bp-wrap">
        <div {...reveal()}>
          <p className="bp-eyebrow">{t.explore.eyebrow}</p>
          <h2 className="bp-h2"><Rich text={t.explore.title} /></h2>
        </div>
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
    </main>
  );
}

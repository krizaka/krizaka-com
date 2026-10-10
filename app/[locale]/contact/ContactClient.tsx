"use client";

import { ArrowRight, MessagesSquare, CircleDot } from "lucide-react";
import TopNavBar from "../../components/TopNavBar";
import SiteFooter from "../../components/SiteFooter";
import { useI18n } from "../../components/I18nProvider";
import ContactForm from "../../components/ContactForm";
import { ProductLogo } from "@krizaka/ui";
import { reveal } from "@/lib/motion";

/* ─── Mascot: Owl (Questions & help) ─── */
function OwlMascot() {
  return (
    <svg width="64" height="64" viewBox="0 0 60 60" fill="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="contact-owl-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <g>
        {/* Body */}
        <path
          d="M 18 22 C 18 10, 42 10, 42 22 C 42 38, 36 45, 30 45 C 24 45, 18 38, 18 22 Z"
          fill="url(#contact-owl-grad)"
          stroke="var(--kz-border-strong)"
          strokeWidth="1.5"
        />
        {/* Eyes */}
        <circle cx="24" cy="18" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
        <circle cx="36" cy="18" r="4.5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
        <circle className="ct-blink" cx="24" cy="18" r="1.5" fill="#00ff66" />
        <circle className="ct-blink" cx="36" cy="18" r="1.5" fill="#00ff66" />
        {/* Beak */}
        <polygon points="28,20 32,20 30,25" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
        {/* Ears */}
        <polygon className="ct-sway" points="20,11 24,14 18,18" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="1"
          style={{ transformOrigin: "24px 14px" }} />
        <polygon className="ct-sway ct-sway-rev" points="40,11 36,14 42,18" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="1"
          style={{ transformOrigin: "36px 14px" }} />
      </g>
    </svg>
  );
}

/* ─── Mascot: Falcon (Bugs & features) ─── */
function FalconMascot() {
  return (
    <svg width="64" height="64" viewBox="0 0 60 60" fill="none" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="contact-falcon-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9f00" />
          <stop offset="100%" stopColor="#ff2a00" />
        </linearGradient>
      </defs>
      <g>
        {/* Legs */}
        <line x1="24" y1="38" x2="21" y2="48" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="36" y1="38" x2="39" y2="48" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        {/* Body */}
        <path
          d="M 15 24 C 15 12, 45 12, 45 24 C 45 38, 38 45, 30 45 C 22 45, 15 38, 15 24 Z"
          fill="url(#contact-falcon-grad)"
          stroke="var(--kz-border-strong)"
          strokeWidth="1.5"
        />
        {/* Head */}
        <circle cx="30" cy="15" r="11" fill="url(#contact-falcon-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
        <polygon points="27,16 33,16 30,24" fill="#ffb300" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
        {/* Visor */}
        <rect x="20" y="7" width="20" height="7" rx="2" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
        <g className="ct-scan">
          <circle cx="25" cy="10.5" r="1.5" fill="#00f2fe" />
          <circle cx="35" cy="10.5" r="1.5" fill="#00f2fe" />
        </g>
        {/* Wings */}
        <path className="ct-flap" d="M 14 22 C 6 28, 8 40, 18 38" fill="none" stroke="#d84315" strokeWidth="3.5" strokeLinecap="round"
          style={{ transformOrigin: "18px 38px" }} />
        <path className="ct-flap ct-flap-rev" d="M 46 22 C 54 28, 52 40, 42 38" fill="none" stroke="#d84315" strokeWidth="3.5" strokeLinecap="round"
          style={{ transformOrigin: "42px 38px" }} />
      </g>
    </svg>
  );
}

/* ─── Where each conversation happens: the products, and the building blocks they share ─── */
const PUBLIC_REPOSITORIES = [
  { product: "orazaka", repo: "orazaka" },
  { product: "orochia", repo: "orochia" },
  { product: "krizaka", repo: "krizaka-platform-kit" },
] as const;

/* ─── Channel data ─── */
const CHANNELS = [
  {
    id: "discussions",
    Icon: MessagesSquare,
    Mascot: OwlMascot,
    accent: "#a78bfa",
    glow: "rgba(167, 139, 250, 0.08)",
    path: "discussions/new/choose",
  },
  {
    id: "issues",
    Icon: CircleDot,
    Mascot: FalconMascot,
    accent: "#ff9f00",
    glow: "rgba(255, 159, 0, 0.08)",
    path: "issues/new/choose",
  },
];

export default function ContactClient() {
  const { t } = useI18n();

  // Only keep the first 2 channels (Questions & Bugs), skip "Partenariats & presse"
  const channels = t.contact.channels.slice(0, 2);

  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)" }}>
      <TopNavBar />

      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "140px 24px 80px",
        }}
      >
        {/* ─── Header ─── */}
        {/* The first screen is painted at once (no entrance: LCP). */}
        <div style={{ marginBottom: "56px" }}>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--kz-accent)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "14px",
            }}
          >
            {t.site.contactPage.eyebrow}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            {t.site.contactPage.title}
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--kz-text-secondary)",
              lineHeight: 1.7,
              maxWidth: "620px",
            }}
          >
            {t.site.contactPage.lead}
          </p>
        </div>

        {/* ─── Private message to the team, and what happens after ─── */}
        <div className="contact-main">
          <ContactForm />
          <aside className="contact-next" aria-labelledby="contact-next-title">
            <h2 id="contact-next-title">{t.site.contactPage.nextTitle}</h2>
            <ol>
              {t.site.contactPage.nextSteps.map((step, i) => (
                <li key={step.title}>
                  <span className="contact-next-num">{i + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ul className="contact-facts">
              {t.site.contactPage.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </aside>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--kz-text-primary)",
            margin: "0 0 6px",
          }}
        >
          {t.site.contactPage.publicTitle}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--kz-text-secondary)", margin: "0 0 20px" }}>
          {t.site.contactPage.publicLead}
        </p>

        {/* ─── Two Channel Cards ─── */}
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            marginBottom: "48px",
          }}
        >
          {channels.map((ch, index) => {
            const channelDef = CHANNELS[index];
            if (!channelDef) return null;
            const { Mascot, Icon, accent, glow, path } = channelDef;

            return (
              <div
                key={ch.kind}
                className="contact-card"
                {...reveal(index)}
                style={{
                  ...reveal(index).style,
                  ["--ch" as string]: accent,
                  ["--ch-glow" as string]: glow,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "40px 28px 32px",
                  borderRadius: "20px",
                  border: "1px solid var(--kz-border-subtle)",
                  background: "color-mix(in srgb, var(--kz-surface-1) 70%, transparent)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Mascot */}
                <div style={{ marginBottom: "20px" }}>
                  <Mascot />
                </div>

                {/* Icon + Category */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <span style={{ color: accent, display: "flex" }}>
                    <Icon size={15} strokeWidth={2} />
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "var(--kz-text-muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    GitHub
                  </span>
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--kz-text-primary)",
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {ch.title}
                </h2>

                {/* Description */}
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--kz-text-secondary)",
                    lineHeight: 1.6,
                    marginBottom: "20px",
                    flex: 1,
                  }}
                >
                  {ch.desc}
                </p>

                {/* CTA — one link per product: each has its own repository */}
                <span style={{ fontSize: "11px", color: "var(--kz-text-muted)", marginBottom: "10px" }}>
                  {ch.cta} — {t.site.contactPage.whichProduct}
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  {PUBLIC_REPOSITORIES.map(({ product, repo }) => (
                    <a
                      key={product}
                      href={`https://github.com/krizaka/${repo}/${path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-product"
                      style={{ ["--accent" as string]: accent }}
                    >
                      <ProductLogo id={product} size={18} animated={false} />
                      {t.site.contactPage.publicProducts[product]}
                      <ArrowRight size={13} strokeWidth={2} />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SiteFooter />

      <style>{`
        .contact-product { display: inline-flex; align-items: center; gap: 8px; padding: 9px 14px; border-radius: 12px; font-size: 13px; font-weight: 600;
          text-decoration: none; color: var(--kz-text-primary); background: var(--kz-surface-2); border: 1px solid var(--kz-border-subtle);
          transition: border-color 150ms ease, transform 150ms ease; }
        .contact-product:hover { border-color: var(--accent); transform: translateY(-1px); }

        /* The channel cards answer the pointer, and their mascot wakes up (still otherwise: nothing loops by itself). */
        .contact-card { transition: border-color 250ms var(--kz-ease), box-shadow 250ms var(--kz-ease), transform 250ms var(--kz-ease), opacity .8s var(--kz-ease), filter .8s var(--kz-ease); }
        @media (hover: hover) {
          .contact-card:hover { transform: translateY(-4px); border-color: var(--ch) !important; box-shadow: 0 16px 40px -18px var(--ch), 0 0 24px var(--ch-glow); }
          .contact-card:hover .ct-blink { animation: ct-blink 4s infinite; }
          .contact-card:hover .ct-sway { animation: ct-sway 2.8s ease-in-out infinite; }
          .contact-card:hover .ct-sway-rev, .contact-card:hover .ct-flap-rev { animation-direction: reverse; }
          .contact-card:hover .ct-scan { animation: ct-scan 2.2s ease-in-out infinite; }
          .contact-card:hover .ct-flap { animation: ct-flap 3.2s ease-in-out infinite; }
        }
        @keyframes ct-blink { 0%, 43%, 50%, 100% { opacity: 1; } 46% { opacity: .1; } }
        @keyframes ct-sway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        @keyframes ct-scan { 0%, 100% { opacity: .3; } 50% { opacity: 1; } }
        @keyframes ct-flap { 0%, 100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
        @media (prefers-reduced-motion: reduce) {
          .contact-card, .contact-card:hover { transform: none; }
          .contact-card :is(.ct-blink, .ct-sway, .ct-scan, .ct-flap) { animation: none !important; }
        }

        .contact-main { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr); gap: clamp(24px, 4vw, 48px);
          align-items: start; margin-bottom: 72px; }
        .contact-next { position: sticky; top: 110px; padding: 8px 0; }
        .contact-next h2 { margin: 0 0 20px; font-family: var(--font-display), system-ui, sans-serif; font-size: 16px; font-weight: 700; color: var(--kz-text-primary); }
        .contact-next ol { position: relative; margin: 0; padding: 0; list-style: none; display: grid; gap: 22px; }
        .contact-next ol::before { content: ""; position: absolute; left: 13px; top: 8px; bottom: 8px; width: 1px; background: var(--kz-border-default); }
        .contact-next li { position: relative; display: flex; gap: 14px; }
        .contact-next-num { position: relative; z-index: 1; display: grid; place-items: center; width: 27px; height: 27px; flex-shrink: 0; border-radius: 50%;
          font-size: 12px; font-weight: 700; color: var(--kz-accent); background: var(--kz-surface-0); border: 1px solid color-mix(in srgb, var(--kz-accent) 45%, transparent); }
        .contact-next strong { display: block; font-size: 14px; color: var(--kz-text-primary); margin: 3px 0 4px; }
        .contact-next p { margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--kz-text-secondary); }
        .contact-facts { margin: 28px 0 0; padding: 18px 0 0; list-style: none; display: grid; gap: 8px; border-top: 1px solid var(--kz-border-subtle); }
        .contact-facts li { font-size: 13px; color: var(--kz-text-muted); }
        @media (max-width: 900px) {
          .contact-main { grid-template-columns: 1fr; }
          .contact-next { position: static; }
        }

        @media (max-width: 640px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import architecture from "@/app/data/architecture.json";
import ArchitectureMesh from "../../../../components/illustrations/ArchitectureMesh";
import TopNavBar from "../../../../components/TopNavBar";
import SiteFooter from "../../../../components/SiteFooter";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "fr" ? "Fonctionnement d'Orazaka — Krizaka" : "How Orazaka Works — Krizaka";
  const description = locale === "fr"
    ? "Schéma interactif du fonctionnement interne de la plateforme d'orchestration d'IA souveraine Orazaka."
    : "Interactive schema of the operational inner workings of the Orazaka sovereign AI orchestration platform.";
  return {
    title,
    description,
    alternates: buildAlternates(locale, `/products/orazaka/architecture`),
  };
}

export default async function ArchitecturePage({ params }: Props) {
  const { locale } = await params;

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <TopNavBar />

      {/* ─── Hero Header with Landscape Backdrop ─── */}
      <section
        style={{
          position: "relative",
          padding: "140px 24px 48px",
          textAlign: "center",
          maxWidth: "1120px",
          margin: "0 auto",
          overflow: "visible",
        }}
      >
        {/* Decorative Landscape SVG Backdrop */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 360"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1200px",
            height: "360px",
            minWidth: "1200px",
            maxWidth: "none",
            pointerEvents: "none",
            zIndex: 0,
            overflow: "visible",
          }}
        >
          <defs>
            {/* Ambient glow */}
            <radialGradient id="arch-ambient" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.04" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Mountain gradients */}
            <linearGradient id="arch-mtn-back" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--kz-surface-0)" />
            </linearGradient>
            <linearGradient id="arch-mtn-front" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--kz-surface-0)" />
            </linearGradient>

            {/* Owl gradient */}
            <linearGradient id="arch-owl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            {/* Falcon gradient */}
            <linearGradient id="arch-falcon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
          </defs>

          {/* Ambient background glow */}
          <rect x="0" y="0" width="1200" height="360" fill="url(#arch-ambient)" className="arch-ambient-pulse" />

          {/* Constellation dots (decorative grid) */}
          <circle cx="120" cy="60" r="2.5" fill="var(--kz-accent)" opacity="0.3" className="arch-node-pulse" />
          <circle cx="300" cy="40" r="2" fill="var(--kz-accent)" opacity="0.2" className="arch-node-pulse-delay" />
          <circle cx="500" cy="70" r="3" fill="var(--kz-accent)" opacity="0.35" className="arch-node-pulse" />
          <circle cx="700" cy="50" r="2" fill="var(--kz-accent)" opacity="0.25" className="arch-node-pulse-delay" />
          <circle cx="900" cy="65" r="2.5" fill="var(--kz-accent)" opacity="0.3" className="arch-node-pulse" />
          <circle cx="1080" cy="45" r="2" fill="var(--kz-accent)" opacity="0.2" className="arch-node-pulse-delay" />

          {/* Constellation lines */}
          <line x1="120" y1="60" x2="300" y2="40" stroke="var(--kz-accent)" strokeWidth="0.5" opacity="0.12" />
          <line x1="300" y1="40" x2="500" y2="70" stroke="var(--kz-accent)" strokeWidth="0.5" opacity="0.1" />
          <line x1="500" y1="70" x2="700" y2="50" stroke="var(--kz-accent)" strokeWidth="0.5" opacity="0.12" />
          <line x1="700" y1="50" x2="900" y2="65" stroke="var(--kz-accent)" strokeWidth="0.5" opacity="0.1" />
          <line x1="900" y1="65" x2="1080" y2="45" stroke="var(--kz-accent)" strokeWidth="0.5" opacity="0.12" />

          {/* Distant mountain range (back) */}
          <path d="M0 360 L0 280 L150 210 L300 260 L450 190 L600 230 L750 180 L900 240 L1050 200 L1200 270 L1200 360Z" fill="url(#arch-mtn-back)" />
          <path d="M0 360 L0 280 L150 210 L300 260 L450 190 L600 230 L750 180 L900 240 L1050 200 L1200 270 L1200 360Z" stroke="var(--kz-accent)" strokeWidth="0.8" opacity="0.15" fill="none" />

          {/* Front mountain range */}
          <path d="M0 360 L0 310 L200 260 L400 290 L550 250 L700 280 L850 240 L1000 300 L1200 270 L1200 360Z" fill="url(#arch-mtn-front)" />
          <path d="M0 360 L0 310 L200 260 L400 290 L550 250 L700 280 L850 240 L1000 300 L1200 270 L1200 360Z" stroke="#06b6d4" strokeWidth="0.6" opacity="0.12" fill="none" />

          {/* Hexagonal data nodes on the ridgeline */}
          <g opacity="0.18">
            <polygon points="450,185 457,189 457,197 450,201 443,197 443,189" stroke="var(--kz-accent)" strokeWidth="1" fill="none" />
            <polygon points="750,175 757,179 757,187 750,191 743,187 743,179" stroke="var(--kz-accent)" strokeWidth="1" fill="none" />
            <polygon points="300,255 307,259 307,267 300,271 293,267 293,259" stroke="#06b6d4" strokeWidth="1" fill="none" />
          </g>

          {/* ─── Sage Owlbot (left side, centered on Peak 1) ─── */}
          <g transform="translate(150, 162) scale(0.7)" style={{ pointerEvents: "auto" }}>
            <g className="arch-owl-bot">
              {/* Body */}
              <ellipse cx="25" cy="45" rx="18" ry="22" fill="url(#arch-owl-grad)" />
              {/* Head */}
              <circle cx="25" cy="22" r="14" fill="url(#arch-owl-grad)" />
              {/* Ear tufts */}
              <polygon points="14,12 18,2 20,14" fill="#7c3aed" />
              <polygon points="30,14 32,2 36,12" fill="#7c3aed" />
              {/* Eyes */}
              <circle cx="20" cy="21" r="5" fill="white" />
              <circle cx="30" cy="21" r="5" fill="white" />
              <circle cx="20" cy="21" r="3" fill="#1e1b4b" className="arch-owl-eye" />
              <circle cx="30" cy="21" r="3" fill="#1e1b4b" className="arch-owl-eye" />
              {/* Beak */}
              <polygon points="23,26 25,31 27,26" fill="#fbbf24" />
              {/* Belly marking */}
              <ellipse cx="25" cy="48" rx="10" ry="13" fill="#c4b5fd" opacity="0.5" />
              {/* Feet */}
              <path d="M16 65 L14 70 L18 68 L22 70 L20 65" fill="#fbbf24" />
              <path d="M28 65 L26 70 L30 68 L34 70 L32 65" fill="#fbbf24" />
            </g>
          </g>

          {/* ─── Cyber-Sentry Falcon (right side, centered on Peak 4) ─── */}
          <g transform="translate(1050, 147) scale(0.7)" style={{ pointerEvents: "auto" }}>
            <g className="arch-falcon-bot">
              {/* Body */}
              <ellipse cx="25" cy="48" rx="16" ry="24" fill="url(#arch-falcon-grad)" />
              {/* Head */}
              <circle cx="25" cy="22" r="13" fill="url(#arch-falcon-grad)" />
              {/* Visor */}
              <rect x="12" y="17" width="26" height="8" rx="4" fill="#1e293b" opacity="0.85" />
              <circle cx="19" cy="21" r="3" fill="#00f2fe" className="arch-falcon-eye" />
              <circle cx="31" cy="21" r="3" fill="#00f2fe" className="arch-falcon-eye" />
              {/* Beak */}
              <polygon points="23,28 25,34 27,28" fill="#fbbf24" />
              {/* Wing (left) */}
              <path className="arch-falcon-wing-l" d="M9 38 Q2 50 8 60 L16 55 Z" fill="#c2410c" />
              {/* Wing (right) */}
              <path className="arch-falcon-wing-r" d="M41 38 Q48 50 42 60 L34 55 Z" fill="#c2410c" />
              {/* Belly */}
              <ellipse cx="25" cy="52" rx="9" ry="12" fill="#fed7aa" opacity="0.4" />
              {/* Tail */}
              <path d="M20 70 L25 82 L30 70" fill="#ea580c" opacity="0.8" />
              {/* Feet */}
              <path d="M18 70 L16 76 L20 74 L24 76 L22 70" fill="#fbbf24" />
              <path d="M28 70 L26 76 L30 74 L34 76 L32 70" fill="#fbbf24" />
            </g>
          </g>
        </svg>

        {/* Header content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--kz-accent)",
              margin: 0,
            }}
          >
            {locale === "fr" ? "Fonctionnement" : "How it works"}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 2.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--kz-text-primary)",
              margin: "12px 0 0",
            }}
          >
            {locale === "fr" ? "Le moteur sous le capot." : "The engine under the hood."}
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--kz-text-secondary)", margin: "16px 0 0" }}>
            {locale === "fr"
              ? "Orazaka orchestre un flux de traitement cognitif modulaire, hautement sécurisé et entièrement souverain. Explorez le schéma interactif ci-dessous pour découvrir le rôle de chaque composant."
              : "Orazaka orchestrates a modular, highly secure, and fully sovereign cognitive processing flow. Explore the interactive schema below to discover the role of each component."}
          </p>
        </div>
      </section>

      {/* ─── Operation Flow Schema ─── */}
      <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 24px 100px" }}>
        <ArchitectureMesh modules={architecture.modules} dependencies={architecture.dependencies} />
      </section>

      <SiteFooter />

      {/* ─── Bird Animations (CSS) ─── */}
      <style>{`
        /* Constellation pulse */
        @keyframes arch-node-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50%      { transform: scale(1.5); opacity: 0.8; }
        }
        .arch-node-pulse {
          animation: arch-node-pulse 3s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .arch-node-pulse-delay {
          animation: arch-node-pulse 3.5s ease-in-out infinite 1.2s;
          transform-box: fill-box;
          transform-origin: center;
        }

        /* Ambient pulse */
        .arch-ambient-pulse {
          animation: arch-ambient-breathe 8s ease-in-out infinite;
        }
        @keyframes arch-ambient-breathe {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }

        /* ─── Owl Animations ─── */
        .arch-owl-bot {
          animation: arch-owl-sway 5s ease-in-out infinite;
          transform-origin: 25px 45px;
          transform-box: fill-box;
        }
        @keyframes arch-owl-sway {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50%      { transform: rotate(-3deg) translateY(-3px); }
        }
        .arch-owl-eye {
          animation: arch-eye-blink 4s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes arch-eye-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        /* ─── Falcon Animations ─── */
        .arch-falcon-bot {
          animation: arch-falcon-idle 4.5s ease-in-out infinite;
          transform-origin: 25px 48px;
          transform-box: fill-box;
        }
        @keyframes arch-falcon-idle {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .arch-falcon-eye {
          animation: arch-falcon-eye-pulse 2s ease-in-out infinite;
        }
        @keyframes arch-falcon-eye-pulse {
          0%, 100% { fill: #00f2fe; filter: drop-shadow(0 0 2px #00f2fe); }
          50%      { fill: #00ff66; filter: drop-shadow(0 0 5px #00ff66); }
        }
        .arch-falcon-wing-l {
          animation: arch-falcon-flap-l 3s ease-in-out infinite;
          transform-origin: right center;
        }
        .arch-falcon-wing-r {
          animation: arch-falcon-flap-r 3s ease-in-out infinite;
          transform-origin: left center;
        }
        @keyframes arch-falcon-flap-l {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-6deg); }
        }
        @keyframes arch-falcon-flap-r {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(6deg); }
        }

        /* Hide mascots on small/medium screens to prevent clipping */
        @media (max-width: 992px) {
          .arch-owl-bot, .arch-falcon-bot {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}

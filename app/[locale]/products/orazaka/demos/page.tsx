import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import TopNavBar from "../../../../components/TopNavBar";
import DemosGallery from "../../../../components/DemosGallery";
import SiteFooter from "../../../../components/SiteFooter";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return localizedMetadata(locale, {
    path: "/products/orazaka/demos",
    en: {
      title: "Sovereign AI Interactive Demos — Orazaka by Krizaka",
      description:
        "See Orazaka's sovereign AI in action: local administration consoles, stable diffusion renders, and secure pipeline logs.",
      og: {
        title: "Sovereign AI Interactive Demos | Krizaka",
        description:
          "Visualize Orazaka's capabilities: web app interfaces, local image generation, and semantic routing.",
      },
    },
    fr: {
      title: "Démos Interactives IA Souveraine — Orazaka | Krizaka Montréal",
      description:
        "Visualisez l'IA souveraine d'Orazaka en action : console d'administration locale, rendus Stable Diffusion et logs de traitement sécurisés.",
      og: {
        title: "Démos Interactives — IA souveraine | Krizaka Montréal",
        description:
          "Visualisez les capacités d'Orazaka : console d'administration locale, génération d'images et animations de flux sémantiques.",
      },
    },
  });
}


export default async function DemosPage({ params }: Props) {
  const { locale } = await params;
  return (
    <main className="min-h-screen" style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)" }}>
      <TopNavBar />
      
      {/* Title Header */}
      <section
        style={{
          padding: "160px 24px 80px",
          textAlign: "center",
          position: "relative",
          maxWidth: "1120px",
          margin: "0 auto",
          overflow: "visible",
        }}
      >
        {/* Unified Cyber Landscape Backdrop */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 400"
          preserveAspectRatio="xMidYMax slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "1200px",
            height: "400px",
            pointerEvents: "none",
            zIndex: 0,
            overflow: "visible",
          }}
        >
          <defs>
            {/* Cyber Sun Glow */}
            <radialGradient id="demo-sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="30%" stopColor="#ec4899" stopOpacity="0.22" />
              <stop offset="70%" stopColor="#6366f1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Mountains Vibrant Gradients */}
            <linearGradient id="demo-mtn-back" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--kz-surface-0)" />
            </linearGradient>
            <linearGradient id="demo-mtn-mid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#0891b2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--kz-surface-0)" />
            </linearGradient>
            <linearGradient id="demo-mtn-front" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--kz-surface-0)" />
            </linearGradient>

            {/* Mascot Gradients */}
            <linearGradient id="demo-falcon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff9f00" />
              <stop offset="100%" stopColor="#ff2a00" />
            </linearGradient>
            <linearGradient id="demo-owl-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            <linearGradient id="demo-duck-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
            <linearGradient id="demo-flamingo-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Hologram Projections */}
            <linearGradient id="demo-holo-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>

            {/* Cyber tree foliage gradient */}
            <linearGradient id="demo-tree-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--kz-accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>

            {/* Cyber Bench Gradient */}
            <linearGradient id="demo-bench-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--kz-surface-3)" />
              <stop offset="100%" stopColor="var(--kz-surface-2)" />
            </linearGradient>
          </defs>

          {/* Cyber Aurora / Sky Node Glows */}
          <circle cx="600" cy="180" r="280" fill="url(#demo-sun-glow)" />
          <circle cx="600" cy="180" r="45" fill="#f59e0b" opacity="0.12" className="sun-pulsing" />

          {/* Constellation grid lines in the sky */}
          <g opacity="0.25" stroke="var(--kz-accent)" strokeWidth="1">
            <line x1="250" y1="100" x2="350" y2="60" />
            <line x1="350" y1="60" x2="430" y2="90" />
            <line x1="430" y1="90" x2="250" y2="100" />
            <line x1="770" y1="60" x2="850" y2="110" />
            <line x1="850" y1="110" x2="930" y2="50" />
            <line x1="930" y1="50" x2="770" y2="60" />
          </g>
          <g fill="var(--kz-accent)" opacity="0.5">
            <circle cx="250" cy="100" r="3" />
            <circle cx="350" cy="60" r="4.5" className="faq-node-pulse" />
            <circle cx="430" cy="90" r="3" />
            <circle cx="770" cy="60" r="4" />
            <circle cx="850" cy="110" r="3" />
            <circle cx="930" cy="50" r="5" className="faq-node-pulse-delay" />
          </g>

          {/* Layered Mountains */}
          {/* Far Peaks */}
          <path d="M 120 385 L 320 220 L 520 385 Z" fill="url(#demo-mtn-back)" stroke="#818cf8" strokeWidth="1.2" />
          <path d="M 680 385 L 880 200 L 1080 385 Z" fill="url(#demo-mtn-back)" stroke="#818cf8" strokeWidth="1.2" />

          {/* Mid Peaks */}
          <path d="M -20 385 L 200 250 L 420 385 Z" fill="url(#demo-mtn-mid)" stroke="#22d3ee" strokeWidth="1.2" />
          <path d="M 780 385 L 1000 230 L 1220 385 Z" fill="url(#demo-mtn-mid)" stroke="#22d3ee" strokeWidth="1.2" />

          {/* Front Peaks */}
          <path d="M 60 385 L 280 290 L 500 385 Z" fill="url(#demo-mtn-front)" stroke="#e879f9" strokeWidth="1.5" />
          <path d="M 700 385 L 920 270 L 1140 385 Z" fill="url(#demo-mtn-front)" stroke="#e879f9" strokeWidth="1.5" />

          {/* Ground boundary line */}
          <line x1="0" y1="385" x2="1200" y2="385" stroke="var(--kz-border-subtle)" strokeWidth="1.2" />

          {/* Winding Data Stream (Neon glowing stream) */}
          <path
            d="M 500 385 C 520 350, 600 330, 600 300 C 600 270, 680 250, 700 220"
            fill="none"
            stroke="var(--kz-accent)"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.3"
            style={{ strokeDasharray: "10, 8" }}
          />

          {/* Left Tree */}
          <g transform="translate(140, 265)">
            <line x1="0" y1="120" x2="0" y2="40" stroke="var(--kz-border-strong)" strokeWidth="3" />
            <polygon points="0,-8 28,8 28,38 0,54 -28,38 -28,8" fill="url(#demo-tree-grad)" stroke="var(--kz-accent)" strokeWidth="1" opacity="0.4" />
            <polygon points="0,-4 20,8 20,30 0,42 -20,30 -20,8" fill="url(#demo-tree-grad)" stroke="var(--kz-accent)" strokeWidth="1" opacity="0.6" />
          </g>

          {/* Right Tree */}
          <g transform="translate(1060, 245)">
            <line x1="0" y1="140" x2="0" y2="50" stroke="var(--kz-border-strong)" strokeWidth="3" />
            <polygon points="0,-10 32,8 32,42 0,60 -32,42 -32,8" fill="url(#demo-tree-grad)" stroke="var(--kz-accent)" strokeWidth="1" opacity="0.4" />
            <polygon points="0,-4 22,8 22,32 0,45 -22,32 -22,8" fill="url(#demo-tree-grad)" stroke="var(--kz-accent)" strokeWidth="1" opacity="0.6" />
          </g>

          {/* Tech Bench */}
          <g transform="translate(740, 325)">
            <line x1="20" y1="35" x2="20" y2="60" stroke="var(--kz-border-strong)" strokeWidth="3" />
            <line x1="140" y1="35" x2="140" y2="60" stroke="var(--kz-border-strong)" strokeWidth="3" />
            <rect x="0" y="22" width="160" height="12" rx="4" fill="url(#demo-bench-grad)" stroke="var(--kz-border-default)" strokeWidth="1" />
            <rect x="0" y="0" width="160" height="10" rx="3" fill="url(#demo-bench-grad)" stroke="var(--kz-border-default)" strokeWidth="1" transform="rotate(-5, 80, 5)" />
            <line x1="15" y1="10" x2="15" y2="24" stroke="var(--kz-border-strong)" strokeWidth="2" />
            <line x1="145" y1="10" x2="145" y2="24" stroke="var(--kz-border-strong)" strokeWidth="2" />
          </g>

          {/* ─── MASCOT BIRD 1: Cyber-Sentry Falcon (Orange - Left Ridge) ─── */}
          <g transform="translate(280, 215) scale(1.1)" className="bird-hitbox demos-bird-left">
            <rect x="-10" y="0" width="70" height="90" fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />
            <g className="bird-graphics falcon-bot">
              <ellipse cx="25" cy="85" rx="24" ry="5" fill="rgba(0,0,0,0.15)" />
              <line x1="16" y1="65" x2="12" y2="85" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              <line x1="34" y1="65" x2="38" y2="85" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              <path d="M 6 85 L 14 85 M 34 85 L 44 85" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              <path d="M 5 35 C 5 20, 45 20, 45 35 C 45 58, 38 68, 25 68 C 12 68, 5 58, 5 35 Z" fill="url(#demo-falcon-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
              <path d="M 12 38 C 12 28, 38 28, 38 38 C 38 52, 32 58, 25 58 C 18 58, 12 52, 12 38 Z" fill="#ff9800" opacity="0.85" />
              <path d="M 2 30 C -8 40, -4 60, 10 58 C 5 50, 4 38, 2 30 Z" fill="#d84315" stroke="var(--kz-border-strong)" strokeWidth="1.2" className="wing-left" style={{ transformOrigin: "2px 30px" }} />
              <path d="M 48 30 C 58 40, 54 60, 40 58 C 45 50, 46 38, 48 30 Z" fill="#d84315" stroke="var(--kz-border-strong)" strokeWidth="1.2" className="wing-right" style={{ transformOrigin: "48px 30px" }} />
              <path d="M 20 66 L 15 80 L 25 76 L 35 80 L 30 66" fill="#bf360c" stroke="var(--kz-border-strong)" strokeWidth="1" />
              <g className="head-group" style={{ transformOrigin: "25px 28px" }}>
                <circle cx="25" cy="22" r="18" fill="url(#demo-falcon-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
                <polygon points="21,24 29,24 25,36" fill="#ffb300" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
                <rect x="9" y="10" width="32" height="10" rx="3" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
                <circle cx="17" cy="15" r="2.5" fill="#00f2fe" className="falcon-eye" />
                <circle cx="33" cy="15" r="2.5" fill="#00f2fe" className="falcon-eye" />
                <path d="M 41 15 C 44 15, 43 25, 41 28" stroke="var(--kz-border-strong)" strokeWidth="1" fill="none" />
              </g>
            </g>
          </g>

          {/* ─── MASCOT BIRD 2: Developer Duck (Pink - Center Bench) ─── */}
          <g transform="translate(775, 240) scale(1.1)" className="bird-hitbox demos-duck">
            <rect x="-10" y="5" width="70" height="75" fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />
            <g className="bird-graphics developer-duck">
              <path d="M 5 45 C 5 30, 45 30, 45 45 C 45 62, 38 72, 25 72 C 12 72, 5 62, 5 45 Z" fill="url(#demo-duck-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
              <path d="M 12 48 C 12 40, 38 40, 38 48 C 38 60, 32 64, 25 64 C 18 64, 12 60, 12 48 Z" fill="#f472b6" opacity="0.85" />
              <path d="M -2 40 C -8 46, -4 55, 10 52" fill="none" stroke="#db2777" strokeWidth="6" strokeLinecap="round" className="wing-left-type" />
              <path d="M 52 40 C 58 46, 54 55, 40 52" fill="none" stroke="#db2777" strokeWidth="6" strokeLinecap="round" className="wing-right-type" />
              <g className="head-group" style={{ transformOrigin: "25px 32px" }}>
                <circle cx="25" cy="24" r="16" fill="url(#demo-duck-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
                <path d="M 12 24 C 12 20, 22 18, 25 18 C 28 18, 38 20, 38 24 C 38 28, 28 32, 25 32 C 22 32, 12 28, 12 24 Z" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
                <circle cx="19" cy="16" r="2" fill="var(--kz-text-primary)" className="duck-eye" />
                <circle cx="31" cy="16" r="2" fill="var(--kz-text-primary)" className="duck-eye" />
                <circle cx="19" cy="16" r="4.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
                <circle cx="31" cy="16" r="4.5" fill="none" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
                <line x1="23.5" y1="16" x2="26.5" y2="16" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              </g>
              {/* Laptop */}
              <g transform="translate(10, 52)">
                <polygon points="-8,16 38,16 30,22 -14,22" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="1" />
                <polygon points="-4,14 34,14 30,-2 -8,-2" fill="var(--kz-accent-soft)" stroke="var(--kz-accent)" strokeWidth="1" opacity="0.8" className="laptop-screen" />
                <line x1="-2" y1="4" x2="24" y2="4" stroke="var(--kz-accent)" strokeWidth="1.5" opacity="0.9" />
                <line x1="-2" y1="8" x2="16" y2="8" stroke="var(--kz-accent)" strokeWidth="1.5" opacity="0.6" />
                <polygon points="12,-2 -40,-80 70,-80" fill="url(#demo-holo-grad)" opacity="0" className="holo-projection" style={{ pointerEvents: "none" }} />
              </g>
            </g>
          </g>

          {/* ─── MASCOT BIRD 3: High-Neck Flamingo-Bot (Blue - Right Tree) ─── */}
          <g transform="translate(995, 175) scale(1.1)" className="bird-hitbox demos-flamingo">
            <rect x="-15" y="0" width="65" height="165" fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />
            <g className="bird-graphics flamingo-bot">
              <ellipse cx="20" cy="160" rx="22" ry="5" fill="rgba(0,0,0,0.15)" />
              <line x1="12" y1="105" x2="12" y2="160" stroke="var(--kz-border-strong)" strokeWidth="2.5" />
              <line x1="26" y1="105" x2="28" y2="160" stroke="var(--kz-border-strong)" strokeWidth="2.5" />
              <circle cx="12" cy="130" r="2.5" fill="#3b82f6" />
              <circle cx="27" cy="130" r="2.5" fill="#3b82f6" />
              <path d="M 2 80 C 2 68, 38 68, 38 80 C 38 108, 28 112, 20 112 C 12 112, 2 108, 2 80 Z" fill="url(#demo-flamingo-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.5" />
              <path d="M 8 82 L 20 74 L 32 82 L 32 94 L 20 102 L 8 94 Z" fill="#ec4899" stroke="var(--kz-border-strong)" strokeWidth="1" opacity="0.95" className="flamingo-wing" />
              <path d="M 20 74 C 20 60, -2 40, 8 18" fill="none" stroke="url(#demo-flamingo-grad)" strokeWidth="6" strokeLinecap="round" className="flamingo-neck" />
              <g className="head-group" transform="translate(8, 12)" style={{ transformOrigin: "0px 0px" }}>
                <circle cx="0" cy="0" r="10" fill="url(#demo-flamingo-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
                <circle cx="-3" cy="-2" r="1.5" fill="var(--kz-surface-0)" />
                <circle cx="-3" cy="-2" r="0.6" fill="#f43f5e" className="flamingo-eye" />
                <path d="M -8 -2 C -18 2, -16 14, -22 18 C -14 10, -8 4, -8 -2 Z" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
                <path d="M -8 -8 L 8 -8 L 6 -14 L -6 -14 Z" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
                <ellipse cx="0" cy="-8" rx="10" ry="1.5" fill="var(--kz-surface-3)" stroke="var(--kz-border-strong)" strokeWidth="1" />
              </g>
            </g>
          </g>

          {/* ─── MASCOT BIRD 4: Cyber Owl (Teal/Purple - Left Tree) ─── */}
          <g transform="translate(140, 185) scale(1.1)" className="bird-hitbox demos-owl">
            <rect x="-20" y="-15" width="40" height="70" fill="transparent" style={{ cursor: "pointer", pointerEvents: "all" }} />
            <g className="bird-graphics owl-bot">
              <ellipse cx="0" cy="50" rx="16" ry="4" fill="rgba(0,0,0,0.15)" />
              <path d="M -15,10 C -15,-10, 15,-10, 15,10 C 15,30, 10,45, 0,45 C -10,45, -15,30, -15,10 Z" fill="url(#demo-owl-grad)" stroke="var(--kz-border-strong)" strokeWidth="1.2" />
              <path d="M -8,15 C -8,5, 8,5, 8,15 C 8,28, 5,35, 0,35 C -5,35, -8,28, -8,15 Z" fill="#00f2fe" opacity="0.35" />
              <circle cx="-6" cy="2" r="5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
              <circle cx="6" cy="2" r="5" fill="var(--kz-surface-0)" stroke="var(--kz-border-strong)" strokeWidth="1" />
              <circle cx="-6" cy="2" r="2" fill="#00ff66" className="owl-eye" />
              <circle cx="6" cy="2" r="2" fill="#00ff66" className="owl-eye" />
              <polygon points="-2,4 2,4 0,10" fill="#fbbf24" stroke="var(--kz-border-strong)" strokeWidth="1" />
              <polygon points="-12,-8 -6,-4 -14,2" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="1" />
              <polygon points="12,-8 6,-4 14,2" fill="#7c3aed" stroke="var(--kz-border-strong)" strokeWidth="1" />
            </g>
          </g>
        </svg>

        <h1
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            color: "var(--kz-text-primary)",
            marginBottom: "16px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {locale === "fr" ? "Démos & Visualisation" : "Demos & Visualization"}
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "var(--kz-text-secondary)",
            maxWidth: "580px",
            margin: "0 auto",
            lineHeight: 1.6,
            position: "relative",
            zIndex: 1,
          }}
        >
          {locale === "fr" 
            ? "Démonstrations et preuves visuelles de l'exécution locale du moteur et de son pipeline cognitif."
            : "Visual proof of the local orchestration engine and cognitive pipeline execution."}
        </p>
      </section>

      {/* Demos Gallery Component */}
      <DemosGallery />

      <SiteFooter />

      <style>{`
        /* --- Mascot Hover Animations (Stable Hitboxes) --- */
        .bird-graphics {
          transform-box: fill-box;
          transform-origin: center;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .bird-hitbox:hover .bird-graphics {
          transform: scale(1.15) translateY(-5px);
        }

        /* --- Bird Eye Blinking/Glowing Animations --- */
        .falcon-eye {
          animation: falcon-eye-pulse 2.5s ease-in-out infinite;
        }
        .owl-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: eye-blink 4s ease-in-out infinite 0.5s;
        }
        .duck-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: eye-blink 5s ease-in-out infinite 1s;
        }
        .flamingo-eye {
          transform-box: fill-box;
          transform-origin: center;
          animation: eye-blink 6s ease-in-out infinite 2.5s;
        }

        @keyframes eye-blink {
          0%, 90%, 100% {
            transform: scaleY(1);
          }
          95% {
            transform: scaleY(0.15);
          }
        }

        @keyframes falcon-eye-pulse {
          0%, 100% { fill: #00f2fe; filter: drop-shadow(0 0 2px #00f2fe); }
          50%      { fill: #00ff66; filter: drop-shadow(0 0 5px #00ff66); }
        }

        /* FalconBot constant loop animations */
        .falcon-bot .head-group {
          animation: head-bob 4s ease-in-out infinite;
        }
        .falcon-bot .wing-left {
          animation: wing-flap-left 3s ease-in-out infinite;
        }
        .falcon-bot .wing-right {
          animation: wing-flap-right 3s ease-in-out infinite;
        }

        @keyframes head-bob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-2px) rotate(2deg); }
        }
        @keyframes wing-flap-left {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-8deg) scaleX(1.05); }
        }
        @keyframes wing-flap-right {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(8deg) scaleX(1.05); }
        }

        /* Owl Bot constant loop animations */
        .owl-bot {
          animation: owl-sway 5s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes owl-sway {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50%      { transform: rotate(-3deg) translateY(-2px); }
        }

        /* Developer Duck animations */
        .developer-duck .head-group {
          animation: duck-look 6s ease-in-out infinite;
        }
        .developer-duck .wing-left-type {
          animation: wing-type-l 0.5s ease-in-out infinite;
        }
        .developer-duck .wing-right-type {
          animation: wing-type-r 0.5s ease-in-out infinite 0.25s;
        }
        .developer-duck .laptop-screen {
          animation: screen-flicker-idle 3s ease-in-out infinite;
        }
        .developer-duck .holo-projection {
          animation: holo-flicker 6s ease-in-out infinite;
        }

        .bird-hitbox:hover .developer-duck .wing-left-type {
          animation: wing-type-l-fast 0.12s ease-in-out infinite;
        }
        .bird-hitbox:hover .developer-duck .wing-right-type {
          animation: wing-type-r-fast 0.12s ease-in-out infinite;
        }
        .bird-hitbox:hover .developer-duck .holo-projection {
          animation: holo-fade-hover 1.5s ease-in-out infinite alternate;
        }

        @keyframes screen-flicker-idle {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 0.95; filter: drop-shadow(0 0 3px var(--kz-accent)); }
        }
        @keyframes holo-flicker {
          0%, 100% { opacity: 0; }
          20%, 80% { opacity: 0.25; }
          50%      { opacity: 0.45; }
        }
        @keyframes holo-fade-hover {
          0%   { opacity: 0.1; filter: drop-shadow(0 0 2px #10b981); }
          100% { opacity: 0.8; filter: drop-shadow(0 0 8px #10b981); }
        }
        @keyframes duck-look {
          0%, 100% { transform: rotate(0deg); }
          30%      { transform: rotate(-5deg); }
          70%      { transform: rotate(5deg); }
        }
        @keyframes wing-type-l {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-3px) rotate(-4deg); }
        }
        @keyframes wing-type-r {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-3px) rotate(4deg); }
        }
        @keyframes wing-type-l-fast {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px) translateX(1px); }
        }
        @keyframes wing-type-r-fast {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px) translateX(-1px); }
        }

        /* Flamingo Bot constant loop animations */
        .flamingo-bot .head-group {
          animation: flamingo-head-bob 5s ease-in-out infinite;
        }
        .flamingo-bot .flamingo-neck {
          animation: flamingo-neck-sway 7s ease-in-out infinite;
          transform-origin: 20px 74px;
        }
        .flamingo-bot .flamingo-wing {
          animation: flamingo-wing-flap 4s ease-in-out infinite;
        }

        @keyframes flamingo-neck-sway {
          0%, 100% { transform: rotate(0deg); }
          50%      { transform: rotate(-3deg) scaleY(1.02); }
        }
        @keyframes flamingo-head-bob {
          0%, 100% { transform: translate(8px, 12px) translateY(0) rotate(0deg); }
          50%      { transform: translate(8px, 12px) translateY(-5px) rotate(-3deg); }
        }
        @keyframes flamingo-wing-flap {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-2px) rotate(-6deg); }
        }

        /* Constellation grid pulse animations */
        @keyframes faq-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50%      { transform: scale(1.35); opacity: 0.95; }
        }
        .faq-node-pulse {
          animation: faq-pulse 3s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .faq-node-pulse-delay {
          animation: faq-pulse 3.5s ease-in-out infinite 1s;
          transform-box: fill-box;
          transform-origin: center;
        }

        /* Sun breathing pulse */
        @keyframes sun-pulse {
          0%, 100% { opacity: 0.12; transform: scale(0.96); }
          50%      { opacity: 0.24; transform: scale(1.04); }
        }
        .sun-pulsing {
          animation: sun-pulse 6s ease-in-out infinite;
          transform-origin: 600px 180px;
        }

        @media (max-width: 992px) {
          .bird-hitbox {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}

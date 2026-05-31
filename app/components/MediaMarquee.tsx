"use client";

import { useI18n } from "./I18nProvider";
import { Eye, Film, ImageIcon } from "lucide-react";

interface MarqueeItem {
  id: string;
  type: "image" | "video";
  src: string;
  title: {
    fr: string;
    en: string;
  };
  desc: {
    fr: string;
    en: string;
  };
}

const ITEMS: MarqueeItem[] = [
  {
    id: "img-1",
    type: "image",
    src: "/assets/orasaka/orasaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_202752.png",
    title: { fr: "Raisonnement Local", en: "Local Reasoning" },
    desc: { fr: "Inférence 100% hors-ligne & souveraine", en: "100% offline & sovereign inference" }
  },
  {
    id: "vid-1",
    type: "video",
    src: "/assets/orasaka/orasaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_203751.mp4",
    title: { fr: "Régulation Cognitive", en: "Cognitive Regulation" },
    desc: { fr: "Vérification continue en boucle fermée", en: "Closed-loop output checking" }
  },
  {
    id: "img-2",
    type: "image",
    src: "/assets/orasaka/orasaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_203432.png",
    title: { fr: "Isolation Souveraine", en: "Sovereign Isolation" },
    desc: { fr: "Protection intégrale des métriques sensibles", en: "Complete sensitive data shielding" }
  },
  {
    id: "vid-2",
    type: "video",
    src: "/assets/orasaka/orasaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_204246.mp4",
    title: { fr: "Indexation RAG", en: "RAG Ingestion" },
    desc: { fr: "Vectorisation de documents et injection à chaud", en: "Live document embedding & context injection" }
  },
  {
    id: "img-3",
    type: "image",
    src: "/assets/orasaka/orasaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_204836.png",
    title: { fr: "Maillage d'Agents", en: "Multi-Agent Mesh" },
    desc: { fr: "Consensus local distribué multi-thread", en: "Local multi-threaded consensus matrix" }
  },
  {
    id: "vid-3",
    type: "video",
    src: "/assets/orasaka/orasaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_204836.mp4",
    title: { fr: "Pipeline Neural", en: "Neural Pipeline" },
    desc: { fr: "Orchestration asynchrone d'intercepteurs", en: "Async prompt interceptor orchestration" }
  }
];

export default function MediaMarquee() {
  const { locale } = useI18n();

  // Duplicate the list of items twice to ensure smooth, seamless infinite scrolling
  const marqueeItems = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <section
      aria-label="Orasaka Generative Visual Gallery"
      style={{
        width: "100%",
        padding: "48px 0 64px",
        overflow: "hidden",
        position: "relative",
        background: "var(--kz-surface-0)",
      }}
    >
      {/* Dynamic backdrop glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
          height: "60%",
          background: "radial-gradient(circle, var(--kz-accent-soft) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.45,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Title / subtitle explaining what this is */}
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto 36px",
          padding: "0 24px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--kz-accent)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "8px",
          }}
        >
          {locale === "fr" ? "Flux Génératifs de l'IA" : "AI Generative Output Stream"}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "var(--kz-text-primary)",
            margin: 0,
          }}
        >
          {locale === "fr" ? "Modélisation & Synthèse en Temps Réel" : "Real-Time Modeling & Synthesis"}
        </h2>
      </div>

      {/* Marquee Wrapper */}
      <div
        className="marquee-container"
        style={{
          width: "100%",
          display: "flex",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          padding: "12px 0",
        }}
      >
        {/* Left and Right blur masks to give premium faded edges */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "12%",
            background: "linear-gradient(to right, var(--kz-surface-0), transparent)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "12%",
            background: "linear-gradient(to left, var(--kz-surface-0), transparent)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        {/* Moving track */}
        <div
          className="marquee-track"
          style={{
            display: "flex",
            gap: "24px",
            width: "max-content",
            animation: "scroll-horizontal 45s linear infinite",
          }}
        >
          {marqueeItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="marquee-card group"
              style={{
                width: "360px",
                height: "220px",
                position: "relative",
                borderRadius: "var(--kz-radius-lg)",
                overflow: "hidden",
                background: "var(--kz-surface-1)",
                border: "1px solid var(--kz-border-subtle)",
                boxShadow: "var(--kz-shadow-sm)",
                transition: "all 350ms cubic-bezier(0.16, 1, 0.3, 1)",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              {/* Media element */}
              <div style={{ width: "100%", height: "100%", position: "relative" }}>
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 500ms ease",
                    }}
                    className="group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={locale === "fr" ? item.title.fr : item.title.en}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 500ms ease",
                    }}
                    className="group-hover:scale-105"
                  />
                )}

                {/* Badge Overlay */}
                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    background: "rgba(0, 0, 0, 0.65)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(8px)",
                    color: "var(--kz-text-primary)",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    zIndex: 2,
                  }}
                >
                  {item.type === "video" ? <Film size={10} className="text-indigo-400" /> : <ImageIcon size={10} className="text-indigo-400" />}
                  {item.type.toUpperCase()}
                </span>

                {/* Hover Glassmorphic Details Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "16px",
                    background: "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 70%, transparent 100%)",
                    backdropFilter: "blur(4px)",
                    opacity: 0,
                    transform: "translateY(10px)",
                    transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                    zIndex: 2,
                  }}
                  className="group-hover:opacity-100 group-hover:transform-none"
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: 700,
                      color: "white",
                      letterSpacing: "-0.01em",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {locale === "fr" ? item.title.fr : item.title.en}
                    <Eye size={12} className="text-indigo-400 opacity-80" />
                  </h3>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {locale === "fr" ? item.desc.fr : item.desc.en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded CSS style */}
      <style>{`
        @keyframes scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
        .marquee-card:hover {
          border-color: var(--kz-accent) !important;
          box-shadow: 0 12px 30px -8px hsla(217, 92%, 60%, 0.22) !important;
          transform: translateY(-4px);
        }
      `}</style>
    </section>
  );
}

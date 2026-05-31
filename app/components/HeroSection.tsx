"use client";

import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";
import { useI18n } from "./I18nProvider";
import KrizakaLandscape from "./illustrations/KrizakaLandscape";

const COPY = {
  fr: {
    title: "Krizaka, spécialiste de l'IA cognitive souveraine.",
    ctaGetStarted: "Découvrir Orazaka",
  },
  en: {
    title: "Krizaka, specialist in sovereign cognitive AI.",
    ctaGetStarted: "Discover Orazaka",
  },
} as const;

export default function HeroSection() {
  const { locale } = useI18n();
  const c = COPY[locale];

  return (
    <section
      id="hero"
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(900px, 95vw)",
          height: "400px",
          background: "radial-gradient(ellipse at center, hsla(217, 92%, 50%, 0.08) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Landscape background taking the entire page height */}
      <div className="hero-landscape-container">
        <KrizakaLandscape relative={false} />
      </div>

      {/* Center container for content */}
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header and Call to Action */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "800px",
            width: "100%",
            paddingTop: "150px",
            position: "relative",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.4rem, 4vw, 2.1rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              color: "var(--kz-text-primary)",
              marginBottom: "16px",
              maxWidth: "600px",
            }}
          >
            {c.title}
          </h1>

          {/* Buttons - positioned directly below the title for a clean, premium KOF-style hero */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              width: "100%",
              marginTop: "28px",
            }}
          >
            <Link
              href="/products/orazaka/ingenierie-cognitive"
              className="btn-premium-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: 600,
                background: "var(--kz-accent)",
                color: "var(--kz-on-accent)",
                textDecoration: "none",
                boxShadow: "0 4px 10px var(--kz-accent-soft)",
                transition: "transform 200ms ease, background 200ms ease",
              }}
            >
              {c.ctaGetStarted}
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        #hero {
          position: relative;
          width: 100%;
          padding: 0 0 160px;
          overflow: hidden;
        }
        @media (min-width: 768px) {
          #hero {
            padding: 0 0 400px;
          }
        }
        .hero-landscape-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 480px;
          pointer-events: none;
          z-index: 0;
        }
        @media (min-width: 768px) {
          .hero-landscape-container {
            height: 720px;
          }
        }
        #hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.8;
          mask-image: radial-gradient(circle at 50% 30%, black 50%, transparent 95%);
          -webkit-mask-image: radial-gradient(circle at 50% 30%, black 50%, transparent 95%);
          pointer-events: none;
          z-index: 0;
        }
        .btn-premium-primary:hover {
          background: var(--kz-accent-hover) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </section>
  );
}

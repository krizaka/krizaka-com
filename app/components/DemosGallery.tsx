"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "./I18nProvider";
import { Layout, Image as ImageIcon, Video, Play, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoItem {
  type: "webapp" | "image" | "video";
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  src: string;
}

const DEMOS: DemoItem[] = [
  {
    type: "webapp",
    titleFr: "Console d'Administration",
    titleEn: "Administration Console",
    descFr: "Tableau de bord local de configuration et suivi du moteur Orazaka.",
    descEn: "Local setup and monitoring dashboard for the Orazaka engine.",
    src: "/assets/orazaka/orazaka/screenshots/start.gif",
  },
  {
    type: "webapp",
    titleFr: "Portail de Connexion",
    titleEn: "Client Sign-in",
    descFr: "Connexion sécurisée du client et chargement du workspace local.",
    descEn: "Secure client authentication and local workspace loading.",
    src: "/assets/orazaka/orazaka/screenshots/login.gif",
  },
  {
    type: "webapp",
    titleFr: "Interface de Dialogue",
    titleEn: "Conversational Interface",
    descFr: "Console de chat multi-agents et flux de réflexion souverain.",
    descEn: "Multi-agent conversational interface and sovereign reasoning flow.",
    src: "/assets/orazaka/orazaka/screenshots/awnser.gif",
  },
  {
    type: "image",
    titleFr: "Pipeline Souverain",
    titleEn: "Sovereign Pipeline",
    descFr: "Architecture locale du traitement d'inférence.",
    descEn: "Local execution architecture of inference processing.",
    src: "/assets/orazaka/orazaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_202752.png",
  },
  {
    type: "image",
    titleFr: "Protection des Données",
    titleEn: "Data Protection",
    descFr: "Blindage et isolation des métriques locales.",
    descEn: "Local shielding and isolation of metrics.",
    src: "/assets/orazaka/orazaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_203432.png",
  },
  {
    type: "image",
    titleFr: "Maillage de Contexte",
    titleEn: "Context Mesh",
    descFr: "Matrice gérant l'intégration des outils et de la mémoire.",
    descEn: "Matrix orchestrating tools and memory integration.",
    src: "/assets/orazaka/orazaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_204836.png",
  },
  {
    type: "video",
    titleFr: "Régulation Cognitive",
    titleEn: "Cognitive Regulation",
    descFr: "Ajustement sémantique continu en boucle fermée.",
    descEn: "Continuous closed-loop semantic adjustment.",
    src: "/assets/orazaka/orazaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_203751.mp4",
  },
  {
    type: "video",
    titleFr: "Flux Vectoriel RAG",
    titleEn: "RAG Vector Stream",
    descFr: "Indexation et injection de contexte dynamique.",
    descEn: "Real-time indexation and dynamic context injection.",
    src: "/assets/orazaka/orazaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_204246.mp4",
  },
  {
    type: "video",
    titleFr: "Maillage d'Intercepteurs",
    titleEn: "Interceptor Mesh",
    descFr: "Passage de la requête à travers le pipeline d'ingénierie.",
    descEn: "Traversing the cognitive engineering pipeline.",
    src: "/assets/orazaka/orazaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_204836.mp4",
  },
  {
    type: "video",
    titleFr: "Sécurisation des Flux",
    titleEn: "Secure Stream Routing",
    descFr: "Contrôle d'accès et filtrage cryptographique des flux de données sortants.",
    descEn: "Access control and cryptographic filtering of outbound data streams.",
    src: "/assets/orazaka/orazaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260619_204836.mp4",
  },
  {
    type: "video",
    titleFr: "Raisonnement Localisé",
    titleEn: "Localized Reasoning Loop",
    descFr: "Inférence neuronale optimisée s'exécutant sur le matériel de l'hôte.",
    descEn: "Optimized neural inference running directly on host hardware.",
    src: "/assets/orazaka/orazaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260619_244836.mp4",
  },
];

export default function DemosGallery() {
  const { locale } = useI18n();
  const [filter, setFilter] = useState<"all" | "webapp" | "image" | "video">("video");
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [activeMedia, setActiveMedia] = useState<DemoItem | null>(null);

  const filteredDemos = DEMOS.filter((d) => filter === "all" || d.type === filter);

  const handleMediaLoad = (src: string) => {
    setLoaded((prev) => ({ ...prev, [src]: true }));
  };

  const getBadgeLabel = (type: "webapp" | "image" | "video") => {
    if (type === "webapp") return "Web App";
    if (type === "image") return "Image SD";
    return "Vidéo";
  };

  return (
    <div
      style={{
        maxWidth: "1120px",
        margin: "0 auto",
        padding: "80px 24px 120px",
      }}
      className="w-full"
    >
      {/* Category filter tabs */}
      <div
        role="tablist"
        aria-label={locale === "fr" ? "Filtrer les démos" : "Filter demos"}
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "48px",
        }}
      >
        {[
          { id: "all", labelFr: "Tous les Démos", labelEn: "All Demos", icon: <Play size={13} strokeWidth={2} /> },
          { id: "webapp", labelFr: "Web App & Dashboard", labelEn: "Web App & Dashboard", icon: <Layout size={13} strokeWidth={2} /> },
          { id: "image", labelFr: "Générations SD", labelEn: "SD Generations", icon: <ImageIcon size={13} strokeWidth={2} /> },
          { id: "video", labelFr: "Boucles Vidéo", labelEn: "Video Loops", icon: <Video size={13} strokeWidth={2} /> },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(tab.id as "all" | "webapp" | "image" | "video")}
              className="demos-filter-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "var(--kz-radius-sm)",
                border: "1px solid",
                borderColor: isActive ? "var(--kz-accent)" : "var(--kz-border-subtle)",
                background: isActive ? "var(--kz-surface-2)" : "transparent",
                color: isActive ? "var(--kz-accent)" : "var(--kz-text-secondary)",
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
                transition: "all 150ms ease",
              }}
            >
              <span style={{ display: "inline-flex", color: isActive ? "var(--kz-accent)" : "var(--kz-text-muted)", transition: "color 150ms ease" }}>
                {tab.icon}
              </span>
              {locale === "fr" ? tab.labelFr : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div layout className="demo-grid">
        <AnimatePresence mode="popLayout">
          {filteredDemos.map((demo) => {
            const isLoaded = loaded[demo.src];
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={demo.src}
                className="demo-card"
              >
                {/* Media Container */}
                <div className="demo-media-container">
                  {/* Skeleton */}
                  {!isLoaded && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(90deg, var(--kz-surface-2), var(--kz-surface-1))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          border: "2px solid var(--kz-border-default)",
                          borderTopColor: "var(--kz-accent)",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                    </div>
                  )}

                  {/* Media element */}
                  {demo.type === "video" ? (
                    <video
                      src={demo.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onLoadedData={() => handleMediaLoad(demo.src)}
                      className={`demo-media-item ${isLoaded ? "opacity-100" : "opacity-0"}`}
                      style={{ transition: "opacity 300ms ease" }}
                    />
                  ) : (
                    <Image
                      src={demo.src}
                      alt={locale === "fr" ? demo.titleFr : demo.titleEn}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onLoad={() => handleMediaLoad(demo.src)}
                      className={`demo-media-item ${isLoaded ? "opacity-100" : "opacity-0"}`}
                      style={{ transition: "opacity 300ms ease", objectFit: "cover" }}
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="demo-overlay">
                    <button
                      onClick={() => setActiveMedia(demo)}
                      style={{
                        padding: "12px",
                        borderRadius: "50%",
                        background: "var(--kz-accent)",
                        color: "var(--kz-on-accent)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 200ms ease",
                      }}
                      className="zoom-btn"
                      aria-label="Zoom media"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Text Meta */}
                <div className="demo-card-content">
                  <div>
                    <span className="demo-card-badge">
                      {getBadgeLabel(demo.type)}
                    </span>
                    <h3 className="demo-card-title">
                      {locale === "fr" ? demo.titleFr : demo.titleEn}
                    </h3>
                    <p className="demo-card-desc">
                      {locale === "fr" ? demo.descFr : demo.descEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox / Zoom Modal */}
      {activeMedia && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setActiveMedia(null)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "896px",
              width: "100%",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--kz-border-default)",
              background: "var(--kz-surface-0)",
              boxShadow: "var(--kz-shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close trigger */}
            <button
              onClick={() => setActiveMedia(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 10,
                padding: "8px",
                borderRadius: "8px",
                background: "rgba(0, 0, 0, 0.6)",
                border: "1px solid var(--kz-border-subtle)",
                color: "var(--kz-text-primary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 150ms ease",
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Media */}
            <div style={{ flex: 1, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", aspectRatio: "16/9", position: "relative" }}>
              {activeMedia.type === "video" ? (
                <video
                  src={activeMedia.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", width: "100%", height: "100%" }}
                />
              ) : (
                <Image
                  src={activeMedia.src}
                  alt={locale === "fr" ? activeMedia.titleFr : activeMedia.titleEn}
                  fill
                  sizes="(max-width: 900px) 100vw, 900px"
                  style={{ objectFit: "contain" }}
                />
              )}
            </div>

            {/* Modal Info */}
            <div style={{ padding: "24px", background: "var(--kz-surface-1)", borderTop: "1px solid var(--kz-border-subtle)" }}>
              <span className="demo-card-badge">
                {getBadgeLabel(activeMedia.type)}
              </span>
              <h3 className="font-display font-extrabold text-lg text-kz-text-primary mb-2" style={{ color: "var(--kz-text-primary)", margin: "0 0 8px 0" }}>
                {locale === "fr" ? activeMedia.titleFr : activeMedia.titleEn}
              </h3>
              <p style={{ fontSize: "13.5px", color: "var(--kz-text-secondary)", lineHeight: 1.55, margin: 0 }}>
                {locale === "fr" ? activeMedia.descFr : activeMedia.descEn}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Demos custom responsive grid */
        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
        }

        /* Demos custom premium card styles */
        .demo-card {
          background: var(--kz-surface-1);
          border: 1px solid var(--kz-border-subtle);
          border-radius: var(--kz-radius-lg, 16px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 350ms ease,
                      box-shadow 350ms ease;
          box-shadow: var(--kz-shadow-sm);
        }

        .demo-card:hover {
          transform: translateY(-5px);
          border-color: var(--kz-accent);
          box-shadow: 0 16px 36px var(--kz-accent-soft);
        }

        .demo-media-container {
          position: relative;
          aspect-ratio: 16 / 9;
          background: var(--kz-surface-2);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--kz-border-subtle);
        }

        .demo-media-item {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .demo-card:hover .demo-media-item {
          transform: scale(1.05);
        }

        .demo-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          opacity: 0;
          transition: opacity 300ms ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .demo-card:hover .demo-overlay {
          opacity: 1;
        }

        .zoom-btn:hover {
          transform: scale(1.1);
        }

        .demo-card-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
          background: var(--kz-surface-1);
        }

        .demo-card-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 6px;
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: var(--kz-accent-soft);
          color: var(--kz-accent);
          border: 1px solid color-mix(in srgb, var(--kz-accent) 20%, transparent);
          width: fit-content;
          margin-bottom: 12px;
        }

        .demo-card-title {
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          color: var(--kz-text-primary);
          margin: 0 0 8px 0;
          transition: color 250ms ease;
        }

        .demo-card:hover .demo-card-title {
          color: var(--kz-accent);
        }

        .demo-card-desc {
          font-size: 12px;
          color: var(--kz-text-secondary);
          line-height: 1.55;
          margin: 0;
        }

        .demos-filter-btn:hover {
          border-color: var(--kz-accent) !important;
          color: var(--kz-text-primary) !important;
        }
        
        .demos-filter-btn[aria-selected="true"]:hover {
          color: var(--kz-accent) !important;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

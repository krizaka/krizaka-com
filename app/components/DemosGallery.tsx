"use client";

import { useState } from "react";
import { useI18n } from "./I18nProvider";
import { Terminal, Image as ImageIcon, Video, Play, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoItem {
  type: "cli" | "image" | "video";
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  src: string;
}

const DEMOS: DemoItem[] = [
  {
    type: "cli",
    titleFr: "Démarrage CLI Cognitif",
    titleEn: "Cognitive CLI Start",
    descFr: "Lancement de l'agent local Orasaka en ligne de commande.",
    descEn: "Launching the local Orasaka agent in terminal mode.",
    src: "/assets/orasaka/orasaka/screenshots/start.gif",
  },
  {
    type: "cli",
    titleFr: "Authentification BFF OAuth2",
    titleEn: "BFF OAuth2 Authentication",
    descFr: "Connexion sécurisée du workspace client avec authentification d'identité.",
    descEn: "Secure user workspace connection with OAuth2 identity flow.",
    src: "/assets/orasaka/orasaka/screenshots/login.gif",
  },
  {
    type: "cli",
    titleFr: "Orchestration en Boucle Fermée",
    titleEn: "Closed-Loop Orchestration",
    descFr: "Flux de raisonnement multi-agents diffusé en temps réel.",
    descEn: "Multi-agent reasoning workflow streamed in real time.",
    src: "/assets/orasaka/orasaka/screenshots/awnser.gif",
  },
  {
    type: "image",
    titleFr: "Architecture du Pipeline Souverain",
    titleEn: "Sovereign Pipeline Architecture",
    descFr: "Schéma d'exécution local généré par Stable Diffusion.",
    descEn: "Local pipeline workflow generated via Stable Diffusion.",
    src: "/assets/orasaka/orasaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_202752.png",
  },
  {
    type: "image",
    titleFr: "Isolation des Données d'Entreprise",
    titleEn: "Enterprise Data Isolation",
    descFr: "Blindage et chiffrement local des métriques sensibles.",
    descEn: "Sovereign boundary protecting sensitive operational metrics.",
    src: "/assets/orasaka/orasaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_203432.png",
  },
  {
    type: "image",
    titleFr: "Maillage d'Interaction des Agents",
    titleEn: "Agent Interaction Mesh",
    descFr: "Matrice de contexte gérant l'intégration des outils et de la mémoire.",
    descEn: "Context matrix orchestrating multi-agent tool execution.",
    src: "/assets/orasaka/orasaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_204836.png",
  },
  {
    type: "video",
    titleFr: "Boucle de Rétroaction Cognitive",
    titleEn: "Cognitive Feedback Loop",
    descFr: "Régulation dynamique et ajustement sémantique continu (AnimateDiff).",
    descEn: "Dynamic agent output checking and regulation stream.",
    src: "/assets/orasaka/orasaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_203751.mp4",
  },
  {
    type: "video",
    titleFr: "Flux d'Ingestion Vectoriel",
    titleEn: "Vector Ingestion Stream",
    descFr: "Indexation RAG en temps réel et injection de contexte dynamique.",
    descEn: "Real-time context ingestion and vector store retrieval stream.",
    src: "/assets/orasaka/orasaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_204246.mp4",
  },
  {
    type: "video",
    titleFr: "Optimisation de Pipeline Neural",
    titleEn: "Neural Pipeline Optimization",
    descFr: "Exécution séquentielle à travers le maillage d'intercepteurs.",
    descEn: "Sequential prompt optimization traversing the interceptors.",
    src: "/assets/orasaka/orasaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260601_204836.mp4",
  },
];

export default function DemosGallery() {
  const { locale } = useI18n();
  const [filter, setFilter] = useState<"all" | "cli" | "image" | "video">("video");
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [activeMedia, setActiveMedia] = useState<DemoItem | null>(null);

  const filteredDemos = DEMOS.filter((d) => filter === "all" || d.type === filter);

  const handleMediaLoad = (src: string) => {
    setLoaded((prev) => ({ ...prev, [src]: true }));
  };

  return (
    <div
      style={{
        maxWidth: "1120px",
        margin: "0 auto",
        padding: "40px 24px",
      }}
      className="w-full"
    >
      {/* Category filter tabs — roadmap-style pills, blue accent on the active one */}
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
          { id: "cli", labelFr: "CLI & Terminal", labelEn: "CLI & Terminal", icon: <Terminal size={13} strokeWidth={2} /> },
          { id: "image", labelFr: "Générations SD", labelEn: "SD Generations", icon: <ImageIcon size={13} strokeWidth={2} /> },
          { id: "video", labelFr: "Boucles Vidéo", labelEn: "Video Loops", icon: <Video size={13} strokeWidth={2} /> },
        ].map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(tab.id as "all" | "cli" | "image" | "video")}
              className="demos-filter-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "1px solid",
                borderColor: isActive ? "var(--kz-accent)" : "var(--kz-border-default)",
                background: isActive ? "var(--kz-accent-soft)" : "var(--kz-surface-1)",
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
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-kz-border-subtle bg-kz-surface-1/70 backdrop-blur-md hover:border-kz-accent/30 hover:shadow-lg hover:shadow-kz-accent/5 hover:-translate-y-1.5 transition-all duration-300 ease-out"
              >
                {/* Media Container */}
                <div className="relative aspect-video bg-kz-surface-2/40 overflow-hidden flex items-center justify-center border-b border-kz-border-subtle/50">
                  {/* Skeleton */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-kz-surface-2 to-kz-surface-3 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-kz-border-strong border-t-kz-accent animate-spin" />
                    </div>
                  )}

                  {/* Media element with hover zoom */}
                  {demo.type === "video" ? (
                    <video
                      src={demo.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onLoadedData={() => handleMediaLoad(demo.src)}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ) : (
                    <img
                      src={demo.src}
                      alt={locale === "fr" ? demo.titleFr : demo.titleEn}
                      loading="lazy"
                      onLoad={() => handleMediaLoad(demo.src)}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveMedia(demo)}
                      className="p-3 rounded-full bg-kz-accent text-kz-on-accent hover:scale-110 transition-transform duration-200 cursor-pointer animate-none"
                      aria-label="Zoom media"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Text Meta */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-kz-accent px-2.5 py-0.5 rounded-full bg-kz-accent-soft/80 border border-kz-accent/10">
                        {demo.type}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-kz-text-primary tracking-tight mb-2 group-hover:text-kz-accent transition-colors duration-200">
                      {locale === "fr" ? demo.titleFr : demo.titleEn}
                    </h3>
                    <p className="text-xs text-kz-text-secondary leading-relaxed">
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
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col rounded-2xl overflow-hidden border border-kz-border-strong bg-kz-surface-0 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close trigger */}
            <button
              onClick={() => setActiveMedia(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/60 border border-kz-border-subtle text-kz-text-primary hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Media */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden aspect-video">
              {activeMedia.type === "video" ? (
                <video
                  src={activeMedia.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <img
                  src={activeMedia.src}
                  alt={locale === "fr" ? activeMedia.titleFr : activeMedia.titleEn}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Modal Info */}
            <div className="p-6 bg-kz-surface-1 border-t border-kz-border-subtle">
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-kz-accent px-2.5 py-0.5 rounded bg-kz-accent-soft inline-block mb-3">
                {activeMedia.type}
              </span>
              <h3 className="font-display font-extrabold text-lg text-kz-text-primary mb-2">
                {locale === "fr" ? activeMedia.titleFr : activeMedia.titleEn}
              </h3>
              <p className="text-sm text-kz-text-secondary leading-relaxed">
                {locale === "fr" ? activeMedia.descFr : activeMedia.descEn}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .demos-filter-btn:hover {
          border-color: var(--kz-accent) !important;
          color: var(--kz-text-primary) !important;
        }
        .demos-filter-btn[aria-selected="true"]:hover {
          color: var(--kz-accent) !important;
        }
      `}</style>
    </div>
  );
}

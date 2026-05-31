"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "./I18nProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

/* ─── Media Highlights constant ─── */
interface MediaHighlightItem {
  type: "webapp" | "image" | "video";
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  src: string;
}

const MEDIA_HIGHLIGHTS: MediaHighlightItem[] = [
  {
    type: "video",
    titleFr: "Raisonnement Localisé",
    titleEn: "Localized Reasoning Loop",
    descFr: "Inférence neuronale optimisée s'exécutant sur le matériel de l'hôte.",
    descEn: "Optimized neural inference running directly on host hardware.",
    src: "/assets/orazaka/orazaka/output/video/animatediff-lightning/diffusers-pytorch/video_output_20260619_244836.mp4",
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
    type: "webapp",
    titleFr: "Console d'Administration",
    titleEn: "Administration Console",
    descFr: "Tableau de bord local de configuration et suivi du moteur Orazaka.",
    descEn: "Local setup and monitoring dashboard for the Orazaka engine.",
    src: "/assets/orazaka/orazaka/screenshots/start.gif",
  },
  {
    type: "image",
    titleFr: "Pipeline Souverain",
    titleEn: "Sovereign Pipeline",
    descFr: "Architecture locale de traitement d'inférence cognitif d'Orazaka.",
    descEn: "Local execution architecture of Orazaka's cognitive inference processing.",
    src: "/assets/orazaka/orazaka/output/image/sd-1.5/stable-diffusion-cpp/image_output_20260601_202752.png",
  }
];

export function MediaShowcaseGallery({ locale }: { locale: "fr" | "en" }) {
  const t = useI18n().t;
  const [activeMedia, setActiveMedia] = useState<MediaHighlightItem | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  const handleMediaLoad = (src: string) => {
    setLoaded((prev) => ({ ...prev, [src]: true }));
  };

  const getBadgeLabel = (type: "webapp" | "image" | "video") => {
    if (type === "webapp") return locale === "fr" ? "Console Web" : "Web Console";
    if (type === "image") return locale === "fr" ? "Rendu SD" : "SD Render";
    return locale === "fr" ? "Flux Vidéo" : "Video Flow";
  };

  return (
    <div className="media-gallery-subsection">
      <div className="gallery-header">
        <h3 className="gallery-title">{t.engineShowcase.galleryTitle}</h3>
        <p className="gallery-subtitle">{t.engineShowcase.gallerySubtitle}</p>
      </div>

      <div className="gallery-grid">
        {MEDIA_HIGHLIGHTS.map((item, idx) => {
          const isLoaded = loaded[item.src];
          return (
            <div key={idx} className="gallery-card" onClick={() => setActiveMedia(item)}>
              <div className="gallery-media-container">
                {!isLoaded && (
                  <div className="gallery-skeleton">
                    <div className="skeleton-spinner" />
                  </div>
                )}
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => handleMediaLoad(item.src)}
                    style={{ opacity: isLoaded ? 1 : 0 }}
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={locale === "fr" ? item.titleFr : item.titleEn}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    onLoad={() => handleMediaLoad(item.src)}
                    style={{ opacity: isLoaded ? 1 : 0, objectFit: "cover" }}
                  />
                )}
                <div className="gallery-hover-overlay">
                  <div className="zoom-icon-wrapper">
                    <Maximize2 size={16} />
                  </div>
                </div>
              </div>
              <div className="gallery-card-content">
                <span className="gallery-card-badge">{getBadgeLabel(item.type)}</span>
                <h4 className="gallery-card-title">
                  {locale === "fr" ? item.titleFr : item.titleEn}
                </h4>
                <p className="gallery-card-desc">
                  {locale === "fr" ? item.descFr : item.descEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setActiveMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close-btn" onClick={() => setActiveMedia(null)}>
                <X size={18} />
              </button>

              <div className="lightbox-media-wrapper">
                {activeMedia.type === "video" ? (
                  <video src={activeMedia.src} autoPlay loop muted playsInline controls />
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

              <div className="lightbox-meta">
                <span className="gallery-card-badge">{getBadgeLabel(activeMedia.type)}</span>
                <h3 className="lightbox-meta-title">
                  {locale === "fr" ? activeMedia.titleFr : activeMedia.titleEn}
                </h3>
                <p className="lightbox-meta-desc">
                  {locale === "fr" ? activeMedia.descFr : activeMedia.descEn}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useI18n } from "./I18nProvider";

/* ─── Command-palette search (⌘K) ─── */
export function SearchCommand({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { locale } = useI18n();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset query + selection each time the palette opens (trigger or ⌘K). Done with
  // the adjust-state-during-render pattern rather than an effect (no cascade render).
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }

  const searchItems = locale === "fr" ? [
    { title: "Vue d'ensemble Orazaka", category: "Produit", url: "/products/orazaka", desc: "IA souveraine, orchestration locale et RAG sécurisé." },
    { title: "Documentation Orazaka", category: "Ressources", url: "/products/orazaka/getting-started/101", desc: "Guides de démarrage rapide, référence de configuration." },
    { title: "Démo interactive", category: "Outils", url: "/products/orazaka/demos", desc: "Simulations interactives du fonctionnement d'Orazaka." },
    { title: "Schéma de fonctionnement", category: "Outils", url: "/products/orazaka/architecture", desc: "Flux de traitement et schéma de fonctionnement du moteur Orazaka." },
    { title: "Packs de solutions", category: "Produit", url: "/products/orazaka/packages", desc: "Configuration de souveraineté et conformité de sécurité." },
    { title: "Contact", category: "Général", url: "/contact", desc: "Prendre contact avec l'équipe Krizaka." },
  ] : [
    { title: "Orazaka Overview", category: "Product", url: "/products/orazaka", desc: "Sovereign AI, local orchestration and secure RAG." },
    { title: "Orazaka Documentation", category: "Resources", url: "/products/orazaka/getting-started/101", desc: "Quickstart guides, configuration reference." },
    { title: "Interactive Demo", category: "Tools", url: "/products/orazaka/demos", desc: "Interactive simulations of Orazaka operations." },
    { title: "Operational Flow Diagram", category: "Tools", url: "/products/orazaka/architecture", desc: "Operational flow and interactive schema of the Orazaka engine." },
    { title: "Solution Packages", category: "Product", url: "/products/orazaka/packages", desc: "Sovereignty configuration and security compliance." },
    { title: "Contact Us", category: "General", url: "/contact", desc: "Get in touch with the Krizaka team." },
  ];

  const filteredItems = searchItems.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Lock body scroll when search is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keyboard navigation & search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setSearchQuery("");
        setSelectedIndex(0);
      }

      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          router.push(filteredItems[selectedIndex].url);
          setOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredItems, selectedIndex, router, setOpen]);

  if (!open) return null;

  return (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "80px 16px 16px",
            background: "hsla(0, 0%, 0%, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            overflowY: "auto",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* Main search box container */}
          <div
            style={{
              width: "100%",
              maxWidth: "540px",
              background: "var(--kz-surface-1)",
              border: "1px solid var(--kz-border-default)",
              borderRadius: "18px",
              boxShadow: "0 32px 64px hsla(0, 0%, 0%, 0.6), 0 0 0 1px var(--kz-border-subtle)",
              overflow: "hidden",
              animation: "navSearchFadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Input area */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 20px",
                borderBottom: "1px solid var(--kz-border-subtle)",
              }}
            >
              <Search size={16} style={{ color: "var(--kz-text-muted)" }} />
              <input
                autoFocus
                type="text"
                placeholder={locale === "fr" ? "Rechercher une page, documentation..." : "Search page, documentation..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--kz-text-primary)",
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
              <button
                onClick={() => setOpen(false)}
                style={{
                  fontSize: "10px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background: "var(--kz-surface-2)",
                  border: "1px solid var(--kz-border-subtle)",
                  color: "var(--kz-text-muted)",
                  cursor: "pointer",
                }}
              >
                ESC
              </button>
            </div>

            {/* Results list */}
            <div
              style={{
                maxHeight: "360px",
                overflowY: "auto",
                padding: "8px",
              }}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.url}
                      onClick={() => {
                        router.push(item.url);
                        setOpen(false);
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        textDecoration: "none",
                        background: isSelected ? "var(--kz-surface-2)" : "transparent",
                        border: "1px solid transparent",
                        borderColor: isSelected ? "var(--kz-border-subtle)" : "transparent",
                        transition: "all 100ms ease",
                        width: "100%",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: isSelected ? "var(--kz-accent)" : "var(--kz-text-primary)",
                            fontFamily: "var(--font-display), system-ui, sans-serif",
                          }}
                        >
                          {item.title}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 500,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: isSelected ? "var(--kz-surface-3)" : "var(--kz-surface-2)",
                            color: "var(--kz-text-muted)",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "var(--kz-text-secondary)",
                        }}
                      >
                        {item.desc}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "32px 16px",
                    textAlign: "center",
                    color: "var(--kz-text-muted)",
                    fontSize: "13.5px",
                  }}
                >
                  {locale === "fr" ? "Aucun résultat trouvé pour votre recherche." : "No results found for your search."}
                </div>
              )}
            </div>

            {/* Footer tips */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 20px",
                borderTop: "1px solid var(--kz-border-subtle)",
                background: "color-mix(in srgb, var(--kz-surface-1) 95%, transparent)",
                fontSize: "10.5px",
                color: "var(--kz-text-muted)",
              }}
            >
              <span>
                {locale === "fr" ? "Entrée pour sélectionner" : "Enter to select"}
              </span>
              <span style={{ display: "flex", gap: "12px" }}>
                <span>↑↓ {locale === "fr" ? "Naviguer" : "Navigate"}</span>
                <span>ESC {locale === "fr" ? "Fermer" : "Close"}</span>
              </span>
            </div>
          </div>
        </div>
  );
}

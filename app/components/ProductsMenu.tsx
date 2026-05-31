"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, BookOpen, Cpu, Layers, Play } from "lucide-react";
import { useI18n } from "./I18nProvider";
import OrazakaLogo from "./OrazakaLogo";

/* ─── Desktop Products mega-menu (hover-open dropdown) ─── */
export function ProductsMenu() {
  const pathname = usePathname();
  const { t, locale } = useI18n();
  const [productsOpen, setProductsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDocsActive = pathname.startsWith("/products/orazaka") &&
    !pathname.startsWith("/products/orazaka/packages") &&
    !pathname.startsWith("/products/orazaka/usecases") &&
    !pathname.startsWith("/products/orazaka/architecture") &&
    !pathname.startsWith("/products/orazaka/demos") &&
    !pathname.startsWith("/products/orazaka/ingenierie-cognitive");
  const isDemosActive = pathname === "/products/orazaka/demos";
  const isArchitectureActive = pathname === "/products/orazaka/architecture";
  const isEditionsActive = pathname === "/editions";
  const isProductsActive = isDocsActive || isDemosActive || isArchitectureActive || isEditionsActive || pathname.startsWith("/products/orazaka/packages") || pathname.startsWith("/products/orazaka/usecases") || pathname === "/products/orazaka/ingenierie-cognitive";

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setProductsOpen(false), 250);
  };

  return (
            <div
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ position: "relative" }}
            >
              <button
                id="nav-products-trigger"
                type="button"
                aria-expanded={productsOpen}
                aria-haspopup="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "13px",
                  lineHeight: 1,
                  color: isProductsActive ? "var(--kz-accent)" : "var(--kz-text-muted)",
                  fontWeight: isProductsActive ? 600 : 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "6px 12px",
                  borderRadius: "9999px",
                  transition: "all 200ms ease",
                }}
              >
                {locale === "fr" ? "Produits" : "Products"}
                <ChevronDown
                  size={12}
                  strokeWidth={2}
                  style={{
                    transition: "transform 200ms ease",
                    transform: productsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {isProductsActive && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "var(--kz-accent)",
                    boxShadow: "0 0 8px var(--kz-accent)",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Dropdown panel */}
              <div
                role="menu"
                style={{
                  position: "absolute",
                  top: "calc(100% + 14px)",
                  left: "50%",
                  width: "350px",
                  padding: "16px",
                  borderRadius: "16px",
                  background: "color-mix(in srgb, var(--kz-surface-1) 97%, transparent)",
                  backdropFilter: "blur(32px) saturate(200%)",
                  WebkitBackdropFilter: "blur(32px) saturate(200%)",
                  border: "1px solid var(--kz-border-subtle)",
                  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.25), 0 0 32px var(--kz-accent-soft)",
                  opacity: productsOpen ? 1 : 0,
                  pointerEvents: productsOpen ? "auto" : "none",
                  transform: productsOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-8px)",
                  transition: "opacity 250ms cubic-bezier(0.16,1,0.3,1), transform 250ms cubic-bezier(0.16,1,0.3,1)",
                }}
              >
                {/* Hover bridge */}
                <div style={{ position: "absolute", top: "-16px", left: 0, right: 0, height: "16px" }} />

                {/* Dropdown Header — Orazaka as a Product */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingBottom: "14px",
                    borderBottom: "1px solid var(--kz-border-subtle)",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, var(--kz-surface-2), var(--kz-surface-1))",
                      border: "1px solid hsla(217, 92%, 60%, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 2px 8px var(--kz-accent-soft)",
                    }}
                  >
                    <OrazakaLogo size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--kz-text-primary)", fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                      Orazaka
                    </span>
                    <div style={{ fontSize: "11px", color: "var(--kz-text-secondary)", marginTop: "1px" }}>
                      {locale === "fr" ? "Moteur d'orchestration IA souverain" : "Sovereign AI orchestration engine"}
                    </div>
                  </div>
                </div>

                {/* Group 1: Plateforme & Flow */}
                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "var(--kz-text-muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                      paddingLeft: "8px",
                    }}
                  >
                    {locale === "fr" ? "Moteur & Flow" : "Engine & Flow"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {[
                      { href: "/products/orazaka/architecture", label: t.nav.architecture, desc: locale === "fr" ? "Schéma de fonctionnement interactif" : "Interactive operational schema", icon: <Cpu size={13} strokeWidth={1.8} /> },
                    ].map((sub, idx) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={idx}
                          href={sub.href}
                          role="menuitem"
                          className="nav-sub-link"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 10px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            background: isSubActive ? "var(--kz-surface-2)" : "transparent",
                            transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <div style={{ color: isSubActive ? "var(--kz-accent)" : "var(--kz-text-secondary)", display: "flex", alignItems: "center", flexShrink: 0 }}>
                            {sub.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: isSubActive ? "var(--kz-text-primary)" : "var(--kz-text-secondary)", fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                              {sub.label}
                            </div>
                            <div style={{ fontSize: "10.5px", color: "var(--kz-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {sub.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Group 2: Ressources & Dev */}
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "var(--kz-text-muted)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                      paddingLeft: "8px",
                    }}
                  >
                    {locale === "fr" ? "Ressources & Dev" : "Resources & Dev"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {[
                      { href: "/products/orazaka/demos", label: t.nav.demos, desc: locale === "fr" ? "Bac à sable & simulations" : "Sandbox & simulations", icon: <Play size={13} strokeWidth={1.8} /> },
                      { href: "/products/orazaka", label: t.nav.docs, desc: locale === "fr" ? "Référence d'API & Guides de configuration" : "API Reference & Config guides", icon: <BookOpen size={13} strokeWidth={1.8} /> },
                      { href: "/products/orazaka/packages", label: t.nav.packages, desc: locale === "fr" ? "Configurations de souveraineté & conformité" : "Sovereignty & compliance configs", icon: <Layers size={13} strokeWidth={1.8} /> },
                    ].map((sub, idx) => {
                      const isSubActive = pathname === sub.href || (sub.href === "/products/orazaka" && isDocsActive);
                      return (
                        <Link
                          key={idx}
                          href={sub.href}
                          role="menuitem"
                          className="nav-sub-link"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 10px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            background: isSubActive ? "var(--kz-surface-2)" : "transparent",
                            transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <div style={{ color: isSubActive ? "var(--kz-accent)" : "var(--kz-text-secondary)", display: "flex", alignItems: "center", flexShrink: 0 }}>
                            {sub.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: isSubActive ? "var(--kz-text-primary)" : "var(--kz-text-secondary)", fontFamily: "var(--font-display), system-ui, sans-serif" }}>
                              {sub.label}
                            </div>
                            <div style={{ fontSize: "10.5px", color: "var(--kz-text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {sub.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
  );
}

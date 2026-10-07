/* Site navigation — one source for the desktop mega-menu (ProductsMenu) and the mobile panel.
   Every product exposes the same five entries, in the same order, so the two read alike:
   overview · how it works · demo · documentation · its signature capability. */

import type { L } from "@/lib/org-data";

export type NavIcon = "overview" | "architecture" | "demo" | "docs" | "signature" | "repos" | "contact" | "products";

export interface NavLink {
  href: string;
  label: L;
  desc: L;
  icon: NavIcon;
  /** Extra path prefixes that mark this entry active. */
  match?: string[];
}

export interface NavProduct {
  id: "orazaka" | "orochia";
  name: string;
  href: string;
  tagline: L;
  badge: L;
  links: NavLink[];
}

export const NAV_PRODUCTS: NavProduct[] = [
  {
    id: "orazaka",
    name: "Orazaka",
    href: "/products/orazaka",
    tagline: { fr: "IA souveraine, hébergée chez vous", en: "Sovereign AI on your infrastructure" },
    badge: { fr: "IA", en: "AI" },
    links: [
      { href: "/products/orazaka", icon: "overview", label: { fr: "Vue d'ensemble", en: "Overview" }, desc: { fr: "Le moteur et ses composants", en: "The engine and its components" } },
      { href: "/products/orazaka/architecture", icon: "architecture", label: { fr: "Fonctionnement", en: "How it works" }, desc: { fr: "Le parcours d'une requête, animé", en: "A request's journey, animated" } },
      { href: "/products/orazaka/demos", icon: "demo", label: { fr: "Démos", en: "Demos" }, desc: { fr: "Chat, médias et agents en action", en: "Chat, media and agents in action" } },
      { href: "/products/orazaka/getting-started/101", icon: "docs", label: { fr: "Documentation", en: "Documentation" }, desc: { fr: "Démarrage, API, exploitation", en: "Getting started, API, operations" }, match: ["/products/orazaka/getting-started", "/products/orazaka/api", "/products/orazaka/core-features", "/products/orazaka/guidelines", "/products/orazaka/usecases"] },
      { href: "/products/orazaka/ingenierie-cognitive", icon: "signature", label: { fr: "Ingénierie cognitive", en: "Cognitive engineering" }, desc: { fr: "Pourquoi un pipeline plutôt qu'un prompt", en: "Why a pipeline, not a prompt" }, match: ["/products/orazaka/packages"] },
    ],
  },
  {
    id: "orochia",
    name: "Orochia",
    href: "/products/orochia",
    tagline: { fr: "La plateforme vidéo des créateurs", en: "The video platform for creators" },
    badge: { fr: "Vidéo", en: "Video" },
    links: [
      { href: "/products/orochia", icon: "overview", label: { fr: "Vue d'ensemble", en: "Overview" }, desc: { fr: "Streaming, paywalls, versements", en: "Streaming, paywalls, payouts" } },
      { href: "/products/orochia#architecture", icon: "architecture", label: { fr: "Fonctionnement", en: "How it works" }, desc: { fr: "Lecture, déblocage et téléversement, animés", en: "Playback, unlock and upload, animated" } },
      { href: "/products/orochia#tour", icon: "demo", label: { fr: "Démo", en: "Demo" }, desc: { fr: "Visite vidéo de l'application", en: "A video tour of the app" } },
      { href: "/products/orochia/docs", icon: "docs", label: { fr: "Documentation", en: "Documentation" }, desc: { fr: "Architecture, API, déploiement", en: "Architecture, API, deployment" }, match: ["/products/orochia/docs"] },
      { href: "/products/orochia#guarantees", icon: "signature", label: { fr: "Paiements & conformité", en: "Payments & compliance" }, desc: { fr: "Webhooks signés, registres 2257", en: "Signed webhooks, 2257 records" } },
    ],
  },
];

export const NAV_COMPANY: NavLink[] = [
  { href: "/products", icon: "products", label: { fr: "Tous les produits", en: "All products" }, desc: { fr: "Comparer Orazaka et Orochia", en: "Compare Orazaka and Orochia" } },
  { href: "/open-source", icon: "repos", label: { fr: "Open source", en: "Open source" }, desc: { fr: "Tous les dépôts Krizaka", en: "Every Krizaka repository" } },
  { href: "/contact", icon: "contact", label: { fr: "Contact", en: "Contact" }, desc: { fr: "Écrire à l'équipe", en: "Write to the team" } },
];

/** True when `pathname` (locale-less) is this link's page — anchors (#…) never mark a link active. */
export function isNavActive(link: NavLink, pathname: string): boolean {
  if (link.href.includes("#")) return false;
  if (pathname === link.href) return true;
  return (link.match ?? []).some((p) => pathname.startsWith(p));
}

/** Strips the /fr or /en prefix. */
export function localeless(pathname: string): string {
  return pathname.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
}

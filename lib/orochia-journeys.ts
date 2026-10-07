/* Orochia request journeys for the animated architecture (OrochiaArchitecture).
   The narrative is curated here; every endpoint it names is checked against the endpoints the
   generator extracted from the Orochia code (app/data/orochia-architecture.json) — a renamed or
   removed route fails the build instead of leaving the page wrong. */

import orochia from "@/app/data/orochia-architecture.json";
import type { L } from "@/lib/org-data";

export type NodeId = "viewer" | "creator" | "app" | "db" | "gateway" | "bunny";

export interface ArchNode {
  id: NodeId;
  x: number;
  y: number;
  label: L;
  sub: L;
}

export interface JourneyStep {
  from: NodeId;
  to: NodeId;
  title: L;
  detail: L;
  endpoint?: string; // "METHOD /path", must exist in the generated data
}

export interface Journey {
  id: "playback" | "unlock" | "upload";
  color: string;
  name: L;
  summary: L;
  steps: JourneyStep[];
}

export const ARCH_NODES: ArchNode[] = [
  { id: "viewer", x: 110, y: 110, label: { fr: "Spectateur", en: "Viewer" }, sub: { fr: "Navigateur · lecteur HLS", en: "Browser · HLS player" } },
  { id: "creator", x: 110, y: 330, label: { fr: "Créateur", en: "Creator" }, sub: { fr: "Studio · envoi Tus", en: "Studio · Tus upload" } },
  { id: "app", x: 380, y: 220, label: { fr: "Orochia", en: "Orochia" }, sub: { fr: "Next.js · API · accès", en: "Next.js · API · access" } },
  { id: "gateway", x: 650, y: 90, label: { fr: "Passerelle", en: "Gateway" }, sub: { fr: "Cartes · crypto", en: "Cards · crypto" } },
  { id: "db", x: 650, y: 350, label: { fr: "PostgreSQL", en: "PostgreSQL" }, sub: { fr: "Grand livre · accès", en: "Ledger · grants" } },
  { id: "bunny", x: 890, y: 220, label: { fr: "Bunny Stream", en: "Bunny Stream" }, sub: { fr: "Ingestion · encodage · CDN", en: "Ingest · encoding · CDN" } },
];

export const JOURNEYS: Journey[] = [
  {
    id: "playback",
    color: "#0ea5e9",
    name: { fr: "Lecture", en: "Playback" },
    summary: { fr: "Aucune URL vidéo brute n'atteint jamais le client.", en: "No raw video URL ever reaches the client." },
    steps: [
      {
        from: "viewer", to: "app", endpoint: "GET /api/videos/[id]/stream",
        title: { fr: "Demande de lecture", en: "Asks to play" },
        detail: { fr: "Le lecteur ne détient aucune URL média : il en demande une à Orochia.", en: "The player holds no media URL: it asks Orochia for one." },
      },
      {
        from: "app", to: "db",
        title: { fr: "Contrôle d'accès", en: "Access check" },
        detail: { fr: "Publique, contacts, abonnés ou déblocage payant : la visibilité est vérifiée contre les contacts, abonnements et droits d'accès.", en: "Public, contacts, followers or paid unlock: visibility is checked against contacts, follows and access grants." },
      },
      {
        from: "db", to: "app",
        title: { fr: "Décision", en: "Decision" },
        detail: { fr: "Pas de droit, pas d'URL : la réponse est un refus ou le paywall.", en: "No grant, no URL: the answer is a refusal or the paywall." },
      },
      {
        from: "app", to: "viewer",
        title: { fr: "URL signée · 300 s", en: "Signed URL · 300 s" },
        detail: { fr: "Un jeton HMAC-SHA256 lié à la vidéo et à son expiration : un lien partagé meurt en cinq minutes.", en: "An HMAC-SHA256 token bound to the video and its expiry: a shared link dies in five minutes." },
      },
      {
        from: "viewer", to: "bunny",
        title: { fr: "Diffusion 4K HLS", en: "4K HLS streaming" },
        detail: { fr: "Les segments viennent directement du CDN de Bunny, jamais des serveurs applicatifs.", en: "Segments come straight from Bunny's edge, never through the application servers." },
      },
    ],
  },
  {
    id: "unlock",
    color: "#10b981",
    name: { fr: "Déblocage payant", en: "Paid unlock" },
    summary: { fr: "Le client ne dit jamais qu'il a payé : la passerelle le prouve.", en: "The client never says it paid: the gateway proves it." },
    steps: [
      {
        from: "viewer", to: "app", endpoint: "POST /api/videos/unlock-video",
        title: { fr: "Demande de déblocage", en: "Asks to unlock" },
        detail: { fr: "L'acheteur choisit un montant et une passerelle configurée.", en: "The buyer picks an amount and a configured gateway." },
      },
      {
        from: "app", to: "db",
        title: { fr: "Intention de paiement", en: "Payment intent" },
        detail: { fr: "Acheteur, créateur, vidéo et montant sont enregistrés avant tout mouvement d'argent.", en: "Buyer, creator, video and amount are recorded before any money moves." },
      },
      {
        from: "app", to: "viewer",
        title: { fr: "Page de paiement", en: "Checkout page" },
        detail: { fr: "L'acheteur part sur la page hébergée du prestataire : Orochia ne voit jamais de carte.", en: "The buyer goes to the provider's hosted page: Orochia never sees a card." },
      },
      {
        from: "viewer", to: "gateway",
        title: { fr: "Paiement", en: "Payment" },
        detail: { fr: "Seules les passerelles dont tous les identifiants sont configurés sont proposées.", en: "Only gateways whose credentials are all configured are offered." },
      },
      {
        from: "gateway", to: "app", endpoint: "POST /api/webhooks/payments/[gateway]",
        title: { fr: "Webhook signé", en: "Signed webhook" },
        detail: { fr: "Signature vérifiée en temps constant sur le corps brut — aucun mode permissif.", en: "Signature verified in constant time over the raw body — no lenient mode." },
      },
      {
        from: "app", to: "db",
        title: { fr: "Règlement, une seule fois", en: "Settled exactly once" },
        detail: { fr: "Crédit au grand livre et droit d'accès dans une même transaction ; un webhook rejoué ne change rien.", en: "Ledger credit and access grant in one transaction; a replayed webhook changes nothing." },
      },
    ],
  },
  {
    id: "upload",
    color: "#a855f7",
    name: { fr: "Téléversement", en: "Upload" },
    summary: { fr: "Les fichiers lourds ne traversent jamais les serveurs web.", en: "Heavy files never cross the web servers." },
    steps: [
      {
        from: "creator", to: "app", endpoint: "POST /api/videos/create-upload-session",
        title: { fr: "Ouverture d'envoi", en: "Opens an upload" },
        detail: { fr: "Seuls les créateurs vérifiés (registres 18 U.S.C. § 2257) peuvent ouvrir une session.", en: "Only verified creators (18 U.S.C. § 2257 records) can open a session." },
      },
      {
        from: "app", to: "bunny",
        title: { fr: "Création de la vidéo", en: "Creates the video" },
        detail: { fr: "Orochia enregistre la vidéo chez Bunny Stream et signe une session Tus.", en: "Orochia registers the video with Bunny Stream and signs a Tus session." },
      },
      {
        from: "app", to: "creator",
        title: { fr: "Session Tus signée", en: "Signed Tus session" },
        detail: { fr: "Le studio reçoit l'adresse d'envoi et sa signature, valables pour cette seule vidéo.", en: "The studio receives the upload address and its signature, valid for this video only." },
      },
      {
        from: "creator", to: "bunny",
        title: { fr: "Envoi reprenable", en: "Resumable upload" },
        detail: { fr: "Le fichier part directement vers Bunny et reprend après une coupure.", en: "The file goes straight to Bunny and resumes after a cut." },
      },
      {
        from: "bunny", to: "app", endpoint: "POST /api/webhooks/bunny",
        title: { fr: "Encodage terminé", en: "Encoding done" },
        detail: { fr: "Bunny signale la fin du transcodage par un webhook signé.", en: "Bunny signals the end of transcoding with a signed webhook." },
      },
      {
        from: "app", to: "db",
        title: { fr: "Prête à diffuser", en: "Ready to stream" },
        detail: { fr: "La vidéo devient lisible, sous la visibilité choisie par son créateur.", en: "The video becomes playable, under the visibility its creator chose." },
      },
    ],
  },
];

/** The journeys, after checking that every endpoint they name exists in the generated data. */
export function verifiedJourneys(): Journey[] {
  const known = new Set(orochia.apiEndpoints.map((e) => `${e.method} ${e.path}`));
  const missing = JOURNEYS.flatMap((j) => j.steps.map((s) => s.endpoint).filter((e): e is string => !!e && !known.has(e)));
  if (missing.length) {
    throw new Error(`orochia-journeys: endpoints not found in app/data/orochia-architecture.json: ${missing.join(", ")}`);
  }
  return JOURNEYS;
}

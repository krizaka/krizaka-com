/* The addresses of the Krizaka products, as the mobile apps load them (ADR-003, krizaka/.github#120): the single list
   behind https://www.krizaka.com/.well-known/krizaka/services.json. A URL change is an edit here, then
   `npm run services:sign` (the vault's Ed25519 key signs; the signature is committed in lib/services.signed.json),
   then a pull request and its deploy — never a store release. tests/services.test.mjs fails when the data and the
   signature disagree, or when an address leaves its allow-list.

   A product appears here when it has a client that reads it (a mobile app today): Orazaka. Yomizaka and Akinaza have no
   mobile app reading it yet — their entry arrives with it (one edit).
   The values are what is LIVE: no code-name host serves anything since the org standardisation (2026-11-06,
   krizaka-internal#2660); each product's development app answers on dev.<commercial name>.com (Sovkora on
   dev.sovkora.com). `webBase` moves to www.<commercial name>.com product by product, the day that www serves the real
   app (never a coming-soon page) — one edit here, then `npm run services:sign`. */

import type { ProductId } from "./products";

/** The product ids of the discovery document, as the shipped mobile apps read them (`services.<id>`): a wire contract, so it
    keeps the id the apps were built with and moves with them (a coordinated change of sovkora-mobile and this document),
    not with the site's own ids. `lib/retired-product-ids.json` says which product each one is. */
type WireId = "orazaka" | "yomizaka" | "akinaza";

export type ServiceEnvironment = "dev" | "prod";

export interface ServiceMessage {
  en: string;
  fr: string;
}

export interface ServiceEntry {
  /** What the app calls (bearer API). No trailing slash; a path is allowed (`/edge`). */
  apiBase: string;
  /** The product's website: legal pages, « open on the web », top-ups. */
  webBase: string;
  /** Sign-in, when it is not the API. */
  authBase?: string;
  /** Media, when they are not under the API — a name on a domain Krizaka owns, never a shared CDN host. */
  mediaBase?: string;
  /** Builds older than this show « please update ». */
  minAppVersion: string;
  /** The newest build in the stores. */
  latestAppVersion: string;
  status: "ok" | "maintenance";
  message?: ServiceMessage;
}

/** The key that signs today (the vault's `APP_DISCOVERY_SIGNING_KEY_K1`); `k2` is the standby, kept offline. */
export const SERVICES_KEY_ID = "k1";

export const SERVICES: Partial<Record<WireId, Partial<Record<ServiceEnvironment, ServiceEntry>>>> = {
  orazaka: {
    dev: {
      apiBase: "https://dev.sovkora.com/edge",
      webBase: "https://dev.sovkora.com",
      minAppVersion: "1.0.0",
      latestAppVersion: "1.0.0",
      status: "ok",
    },
  },
};

/** The domains a product's addresses may live on, besides krizaka.com: its own commercial domain (`sovkora.com`). */
export const PRODUCT_DOMAINS: Record<ProductId, string> = {
  sovkora: "sovkora.com",
  verikora: "verikora.com",
  folioviv: "folioviv.com",
};

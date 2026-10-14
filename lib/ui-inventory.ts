/* The inventory of /docs/ui (krizaka-com#115): for every component of the catalogue, why it is there.

   - used     a product imports it today — lib/ui-usage.json, a dated scan of the committed sources of the product
              repositories (`npm run ui:usage`); the "why" is the product that uses it.
   - planned  nobody imports it yet, and a piece of planned work needs it: it is listed below with that work.
   - remove   no product uses it and no planned work needs it: it is deprecated (registry `status: deprecated`, with
              the major that removes it), never silently kept.
   A component that is neither used nor listed here fails tests/docs-ia.test.mjs: a new component arrives with its
   reason, or with a product that uses it. Words here are English, like the component pages they sit beside. */

import usage from "./ui-usage.json" with { type: "json" };

export type Product = "orochia" | "orazaka" | "yasakia" | "krizaka";
export const PRODUCTS: readonly Product[] = ["orochia", "orazaka", "yasakia", "krizaka"];

export interface UsageSnapshot {
  scannedAt: string;
  repos: Record<string, { repo: string; commit: string; files: number }[]>;
  components: Record<string, Partial<Record<Product, number>>>;
}
export const USAGE = usage as UsageSnapshot;

/** Who imports a component today, products in a fixed order. */
export const usedBy = (name: string): Product[] => PRODUCTS.filter((product) => (USAGE.components[name]?.[product] ?? 0) > 0);

const MOBILE = "the native apps: Yasakia (PY4), Yororis (PYO2), Orochia mobile (PS6), Orazaka mobile";
const WEB_APPS = "the web apps' adoption: Orochia (PS5), Orazaka (PS6)";
const SITE = "krizaka.com migrating its pages to the specialised template (TPL)";
const COMMUNITY = "Yasakia's people screens (PY3/PY4) and Orochia's creator pages";

/** Why an unused component stays: the planned work that needs it. */
export const PLANNED: Record<string, string> = {
  "action-sheet": `${MOBILE}: the menu of a long press and of "more" on a row.`,
  "activity-feed": "Orochia's notifications and Orazaka's job history (the adoption of Elements, PS-E).",
  "app-shell": `${WEB_APPS}: the shell of every authenticated web screen.`,
  "audio-player": "Yororis' voice moments and Orazaka's speech studio (audio outputs).",
  "auth-layout": `${WEB_APPS}: sign-in and sign-up screens.`,
  "changelog-page": `${SITE}: /changelog.`,
  checkbox: "The form and data-table primitives are built on it (they import it); apps reach it through them.",
  combobox: "The form and tag input are built on it; Orazaka's model pickers use it through them.",
  "component-page": `${SITE}: the component pages of /docs.`,
  "contact-page": `${SITE}: /contact.`,
  "dashboard-layout": `${WEB_APPS}: the creator and operator dashboards.`,
  "date-picker": "Orochia's scheduling and Yasakia's availability (DS5 dates), through the form.",
  "description-list": "Facts of an object: Orazaka's job details and Orochia's order pages.",
  "detail-layout": `${WEB_APPS}: the page of one video, job or account.`,
  "docs-article-page": `${SITE}: the product documentation pages.`,
  "docs-layout": "Builds the documentation article template.",
  fab: `${MOBILE}: the main creation action of a list screen.`,
  "file-upload": "Orochia's uploads and Orazaka's document intake, through the form.",
  "filter-bar": "The data table's filters (Orochia and Orazaka admin tables).",
  form: "PS3's form (TanStack Form): every business form of the products migrates to it.",
  "gallery-page": `${SITE}: the demo gallery.`,
  header: `${MOBILE}: the header of every screen.`,
  "how-it-works-page": `${SITE}: the "how it works" pages of the products.`,
  kanban: "Orochia admin's moderation queue (to review, reviewing, resolved), moved by keyboard as well as by drag.",
  "image-viewer": `${MOBILE}: full-screen photos of a profile or a gallery.`,
  iso: "The product heroes on dev.orazaka.com and dev.orochia.com (IsoHub), which left krizaka.com with the product pages (#150).",
  "landing-page": `${SITE}: the home page and the product landings.`,
  list: `${MOBILE}: every list on FlashList; Orochia web's infinite lists.`,
  "longform-page": `${SITE}: /story.`,
  "marketing-layout": `${SITE}: the frame of every public page.`,
  "mascot-state": "Empty, loading and error states carried by a bird (#102), in every app.",
  "media-picker": `${MOBILE}: choosing or taking a photo.`,
  onboarding: `${MOBILE}: first launch and profile set-up flows.`,
  "otp-input": `${MOBILE}: the code of a sign-in or a phone check.`,
  "permission-prompt": `${MOBILE}: asking for the camera, the location, notifications — in words, before the system dialog.`,
  "photo-grid": `${COMMUNITY}.`,
  "pointer-light": "Builds the card grid (the light that follows the pointer).",
  "pricing-page": `${SITE}: /pricing of the products.`,
  "product-page": `${SITE}: the product pages.`,
  "pull-to-refresh": `${MOBILE}: lists and feeds (and BrandedRefresh, krizaka-ui#137).`,
  "search-field": "The data table's search and every filtered list.",
  segmented: `${MOBILE}: switching a view inside a screen.`,
  separator: "A primitive of the platform: dividers inside menus, lists and cards.",
  "settings-layout": `${WEB_APPS}: account and product settings.`,
  "skip-link": "Every app shell that keeps its own layout — Orochia, Orazaka, Yasakia, Yororis (the accessibility pass, krizaka-ui#134); MarketingLayout and AppShell already use it.",
  slot: "The `asChild` mechanism: every primitive that renders your own link or element is built on it.",
  "splash-handoff": `${MOBILE}: the launch screen that dissolves into the product mark (krizaka-ui#137).`,
  "split-view": `${WEB_APPS}: messages and any list-and-detail screen.`,
  "status-page": `${SITE}: /status and the "under construction" pages.`,
  "step-progress": `${MOBILE}: the head of their sign-up and onboarding flows.`,
  "swipeable-row": `${MOBILE}: archive / delete on a row of a list.`,
  "tab-bar": `${MOBILE}: the main navigation of every app.`,
  "tag-input": "Free tags in the form: Orazaka's pack metadata, Orochia's video tags.",
  "video-player": "Orochia's video pages and the products' tours: the demos moved to the product sites with the showcase (#150).",
  virtual: "The data table and the long lists are built on it.",
  // @krizaka/charts — what the products will draw (PS-C: creator revenue, credits, latency, funnel, goal gauge, KPI sparkline, activity heat map, geo map).
  "area-chart": "Revenue and latency over time (PS-C).",
  "calendar-heatmap": "A creator's activity by day (PS-C).",
  funnel: "Orochia's sign-up and purchase funnel (PS-C).",
  "geo-map": "Audience by region, on MapLibre (PS-C).",
  "credit-usage": "Orazaka's credits left and Orochia's allowance (PS-C ready-made charts).",
  "earnings-chart": "A creator's earnings per period in Orochia's studio (PS-C).",
  "goal-progress": "Orochia's challenge pots: raised of the goal (PS-C).",
  "job-throughput": "Orazaka's jobs per period by status (PS-C).",
  "latency-chart": "Orazaka's median and p95 latency per studio (PS-C).",
  "price-ticker": "Orochia's live auction price (PS-C).",
  chart: "The base the other charts are built on.",
};

/** Charts no product will draw: retired by PS-C (the @krizaka/charts major), listed so the removal is a decision. */
export const RETIRED: Record<string, string> = {
  candlestick: "A financial chart: no product shows prices over time. Removed in the next major of @krizaka/charts (PS-C).",
  globe: "A 3D globe: heavy, decorative, and the geo map on MapLibre replaces it. Removed with PS-C.",
  heatmap: "Merged into the calendar heat map, which is the one the products need. Removed with PS-C.",
  "radar-chart": "No product compares profiles on axes. Removed with PS-C.",
  sankey: "No product follows flows between stages; the funnel does. Removed with PS-C.",
  "scatter-chart": "No product plots two measures against each other. Removed with PS-C.",
  treemap: "No product shows a part-to-whole hierarchy. Removed with PS-C.",
};

export type InventoryState = "used" | "planned" | "removal";

export interface Inventory {
  state: InventoryState;
  /** One line: who uses it, what needs it, or why it goes. */
  why: string;
  usedBy: Product[];
}

/** The decision on one component: used (and by whom), planned (and for what), or on its way out (and why). */
export function inventoryOf(name: string, status: string, deprecated?: { reason?: string; removedIn?: string } | null): Inventory | null {
  const users = usedBy(name);
  if (status === "deprecated") return { state: "removal", why: deprecated?.reason ?? RETIRED[name] ?? "", usedBy: users };
  if (RETIRED[name]) return { state: "removal", why: RETIRED[name], usedBy: users };
  if (users.length > 0) return { state: "used", why: `Used by ${users.map((p) => PRODUCT_NAMES[p]).join(", ")}.`, usedBy: users };
  const plan = PLANNED[name];
  return plan ? { state: "planned", why: plan, usedBy: [] } : null;
}

export const PRODUCT_NAMES: Record<Product, string> = { orochia: "Orochia", orazaka: "Orazaka", yasakia: "Yasakia", krizaka: "krizaka.com" };

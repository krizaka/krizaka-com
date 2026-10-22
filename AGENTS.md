# 🥷 KRIZAKA — Site Governance (agent-neutral)

> Governance contract for **`krizaka-com`**, the public Next.js site of the company Krizaka: a lightweight
> showcase — Krizaka UI, Krizaka Java, the story, open source, and one page that points to each product's own site.
> This file is the single source of truth for how the site is built and themed.
> The product engine has its **own** contract at `products/orazaka/AGENTS.md` (the Orazaka
> workspace, [`krizaka/orazaka`](https://github.com/krizaka/orazaka), one repository per component) —
> do not mix the two.

---

## 1. What this repo is

- A **Next.js (App Router)** static-first site with **two views** (Oussama, 2026-10-17): the **home** (reached through the
  mark; it presents the products) and **Open source** — plus `/story` (footer), contact and legal.
- It is the **read side**. Component, version and architecture facts come from the published packages and the
  generated data — the site never hand-authors them.

## 2. What is generated, what is written

- **krizaka.com is the company's lightweight showcase.** Each product has **its public address at `www.<product>.com`**
  (orazaka, orochia, yasakia — identifiers keep "yasakia" until the rename lands —, yororis, yomizaka, kachizaka, akinaza;
  epic krizaka/.github#119, 2026-10-21): the product's real app on its own deployment, sign-up closed everywhere; the apex
  `<product>.com` answers 308 with www. `lib/products.ts` carries `siteUrl` (www) — **every public link, sitemap, llms.txt and JSON-LD
  uses it, never a `dev.<product>.com` host** (the legal pages name dev.orochia.com in words, as the privacy policy and terms
  must). `dev.<product>.com` is the development host of the same deployment: `noindex`, robots `Disallow: /`, every HTML page
  answers 308 to the same path on www, and only what is called keeps serving there (`/api/*`, auth callbacks, webhooks,
  `/.well-known/*`, `/healthz` — the mobile builds and the services' server-to-server calls), with `X-Robots-Tag: noindex`.
  This repo carries **no product page, demo, gallery, journey, recording or documentation** of the products: the home's
  products section (`#products`) has a card per product (mark from `@krizaka/ui`, name, one neutral line, status,
  « Visit the site » → its www address, and « Source »); `/products` and `/{en,fr}/products` answer 308 to `/#products` /
  `/<locale>#products`. Orochia's card is neutral — no adult-adjacent wording, no media.
- **Old addresses redirect.** `lib/product-redirects.ts` (read by `next.config.ts`, tested by
  `tests/product-redirects.test.mjs`): `/products/<p>(/…)`, `/docs/<p>/*` and the old Orazaka pages (`/architecture`,
  `/demos`, `/use-cases`…) → the product's www address — all 308, with or without the locale prefix.
  Never add a product page back: change the product's site.
- **The focus** (Oussama, 2026-10-22): by default krizaka.com shows **three products** — Orazaka, Akinaza, Yomizaka (`FOCUS_IDS`,
  `lib/focus.ts`, the one list). The four others stay in the data and in every page, **hidden, not removed**: an item of a hidden
  product wears `{...focusProps(id)}` (`data-focus="off"`, hidden by `app/components/focus.css`), a sentence or number worded for
  both cases is a `<Mode focus full>`, a client list filters with `useCarnet()` (the flock, the engine flow, the contact picker,
  the open-source tables); the family footer (`@krizaka/ui/sites` has no filter) and /story's contents are hidden by CSS from
  `hiddenCss()`. The state is the address, `?carnet=complet` (read before the first paint, kept across client navigations,
  « refermer » is a link to the same page without it). A visual focus only: the JSON-LD Organization still owns every product,
  `llms.txt`, the sitemaps, the redirects and the products' own sites are untouched (`tests/focus.test.mjs`). A new list of
  products must wear the focus; a new product is in or out of `FOCUS_IDS`.
- **Product first, Orazaka as the engine.** On a product's own site the product is the subject of the hero, the steps and the feature cards (« Yomizaka reads your lease »); Orazaka appears only as the engine — one discreet « Powered by Orazaka » line and the proof sections (run ids) — never as the one doing the product's job (« Orazaka reads your lease »). Each product repository tests that its hero and steps do not name Orazaka. The engine card here draws the flow both ways, from `lib/engine-uses.ts`, and claims only what runs (results, analytics; run events and webhooks are orazaka#189).
- A product **in development** (`status: "development"`: Yomizaka, Kachizaka, Akinaza) is built in the open: its repository is
  public, sign-up is closed, and it says « In development ». Each has its www address (its card says « Visit the site »). Kachizaka is points only, never money;
  Akinaza prepares tax returns and never files them, and is not for restaurants and bars — the card words say so, no more.
- **« Dev preview » is data, not words** ([krizaka/.github `docs/standards/dev-preview.md`](https://github.com/krizaka/.github/blob/main/docs/standards/dev-preview.md), ADR-002).
  `ProductStatus` has `devPreview`; every product has an explicit `status` (no status no longer means a badge). A product may wear
  `devPreview` only when the `dev-preview.json` at the root of its repository is complete (every criterion: fresh evidence URL or a
  justified `na`). `scripts/gen-dev-preview.mjs` (in `npm run build`) reads the checklists from GitHub raw, writes the git-ignored
  `lib/dev-preview-checklists.json`, checks the evidence URLs and **fails the build** if the status is not supported; the pure rules
  are in `scripts/dev-preview-lib.mjs`, guarded by `tests/dev-preview.test.mjs`. Orazaka and Orochia keep the badge under a
  time-boxed waiver (`WAIVERS`, until 2026-11-01) while their gaps close; the test fails the day it ends. Other statuses are never gated.
- A product not released says so with a status chip (`status: "upcoming"` — « Soon »; `"construction"` — « In
  construction »), never beta, early access, waiting list or sign-up. No store button, no invented screenshot or figure.
- **Yororis' lexicon** is law for every message whose key contains `yororis`: `npm run lexicon` (in `npm run lint`) fails
  on the "never" column of `company/prompts-yororis.md` §2.1. The reviewed texts (`site.yororis.reviewed.*`, quoted by
  /story's Yororis chapter) are fingerprinted in `scripts/lexicon-reviewed.json`: change one only with
  `npm run lexicon -- --accept-review YYYY-MM-DD` and say so in the PR.
- The site's media (Krizaka UI's home gallery, posters) live on Bunny, never in `public/` (§5.2). The CDN manifest names
  only what is still drawn: `home/kit`, `home/kit-native`, `people/**`, the products' real takes that `/story` plays in its lightbox (`lib/story-takes.ts`: a poster per product, the recording on click), the three Orochia clips that published
  `@krizaka/ui` examples reach through `/assets/orochia/tour/` (a redirect in `lib/cdn.ts`), and `brand-films/**` — the
  films of the flock, rendered from the code by krizaka-ui `tools/brand-films` (« Le monde de Krizaka » on `/story`, its
  captions from the messages through `/<locale>/story/film.vtt`; the loops of each bird, loaded by ui.krizaka.com and the
  products' sites by their hashed URL). A new render replaces them: upload, then `cdn-assets prune`.
- **French is the default language** (Loi 96, `lib/locale-negotiation.ts`): an unprefixed URL goes to the cookie `NEXT_LOCALE` if set, else English only when the browser asks for English and never French, else French; hreflang `x-default` → `/fr`.

- **The home's order** (2026-10-22, the honest chronology, #337): the hero (`HomeHero`, whose lead tells it in two or three
  short sentences), then **Orazaka, our first build** (`EngineSection`, § 2), then **the open stack that came out of
  building it**, Krizaka UI and Krizaka Java (`OpenStack`, § 3), then **the products built on them** (`ProductShowcase`, § 4),
  then the principles (`Principles`, § 5), and it stops there: no Montréal (`Company`) section, no closing contact panel
  and no FAQ (so no FAQPage JSON-LD; the SEO check asks the home for Organization and WebSite only). Krizaka, the company,
  was born from that work: the Organization `owns` the products and sites, its `foundingDate` is unchanged. The marks row under the hero
  follows the story: Orazaka, Akinaza, Yomizaka, then the rest (`heroMarkOrder`). `/story` is in the footer, « Contact us »
  in the bar. The section numbers (§ n) and the folio (« page n of N ») come from `lib/home-sections.ts`, never typed
  (`tests/home.test.mjs`, `tests/home-order.test.mjs`).

## 2.2 Text & languages — nothing hard-coded

- **Every user-facing string lives in `messages/en.json` and `messages/fr.json`** (`lib/i18n.ts`).
  `en.json` is the reference: its shape is the `TranslationDictionary` type, so a missing French key
  fails type-checking, and `npm run lint` runs `krizaka-i18n check messages` (same keys, no empty
  strings, same `{placeholders}`, same markup).
- The engine is [`@krizaka/i18n`](https://github.com/krizaka/krizaka-ui/tree/main/packages/i18n) on npm,
  shared with every Krizaka app: `lib/i18n.ts` binds it to the catalogues, `I18nProvider` to the
  routing, `Rich` re-exports it. Never re-implement `format`, `Rich` or the check here — change the package.
- Components read `t` from `useI18n()` (client) or `getDictionary(locale)` (server); variables go
  through `format(message, { name })`; emphasis through `<Rich>` (`<b>…</b>` only).
- **Never** choose a text with `locale === "fr" ? … : …` (or `isFr ? …`): ESLint refuses it. Only
  routing code (`proxy.ts`, `lib/i18n.ts`, `lib/seo.ts`, the locale layout) compares locales.
- Data modules keep **structure** (ids, links, colors, endpoints); their words are messages keyed by
  the same ids (e.g. `site.nav.<product>.links.<id>`). Long,
  structured content collections (`lib/use-cases-data.ts`) may hold
  `{ fr, en }` fields read with the locale key — never with a ternary.

## 2.3 Documentation — on its own sites, never here

- krizaka.com renders **no documentation** and carries no docs engine (no Fumadocs, no MDX collection, no generated
  pages). Each open-source project documents itself on its site, built from its own repository at every change:
  **Krizaka UI → https://ui.krizaka.com** (krizaka-ui `apps/site`: one page per component generated from the registries,
  the foundations, the templates, EN/FR) and **Krizaka Java → https://java.krizaka.com** (krizaka-build `site/`). The
  products document themselves on their sites (dev.<product>.com).
- Every old address answers **308** with its page there: `/docs/ui/*` and `/{en,fr}/docs/ui/*` through
  `lib/ui-redirects.ts` (the same map as krizaka-ui `apps/site/lib/urls.ts`; tested by `tests/ui-redirects.test.mjs`),
  `/docs/java/*` through `lib/java-redirects.ts`, the products' docs through `lib/product-redirects.ts`; `/docs` itself
  goes to `/open-source`, the hub towards ui. and java.
- A link to the documentation is an absolute URL on its site (`https://ui.krizaka.com/components/button`), never a
  relative `/docs/…`. The only figures read from Krizaka UI here are `lib/ui-facts.ts` (the installed registries' counts).
- The documentation of the components is **only** on ui.krizaka.com: there is no public Storybook (krizaka-ui's is an
  internal test tool) — never link one.
- **The site's faces are `@krizaka/fonts`**, loaded by `next/font/local` in the locale layout (preloaded, fingerprinted,
  CLS 0) and mapped to the token roles in `app/globals.css`. Never `next/font/google`, never a font file committed here.

## 2.4 Search engines & AI assistants — one contract for the whole family

- Every Krizaka site (www · ui. · java. · www.<product>.com · the dev.<product>.com hosts · the admin consoles) owes
  the same files, checked by **`scripts/check-seo-family.mjs`** — one dependency-free file, copied unchanged into each
  site's repository (keep the copies identical; its unit test is `tests/check-seo-family.test.mjs`). CI runs it against the
  container: `node scripts/check-seo-family.mjs --base http://localhost:3000 --host https://www.krizaka.com --organization`.
- `robots.txt` with a `Sitemap:` line on the site's host and the **same AI-crawler list everywhere, allowed** on public
  sites (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, anthropic-ai, PerplexityBot,
  Perplexity-User, Google-Extended, Applebot(-Extended), Bingbot, CCBot); `sitemap.xml` with hreflang alternates en/fr and
  `lastmod`; `llms.txt` (llmstxt.org) that links back to the family; a canonical that is the page itself on the site's
  host; Open Graph + Twitter card **with an image**; JSON-LD whose every node leads back to the Organization
  `https://www.krizaka.com/#organization` (this site defines it, and says it `owns` the products and open-source sites).
- Indexing policy (epic krizaka/.github#119, 2026-10-21): **indexed** — www.krizaka.com, ui., java. and the products' public
  addresses `www.<product>.com` (sign-up closed; the apex answers 308 with www); **`noindex`** — every `dev.<product>.com`
  (robots `Disallow: /`, `X-Robots-Tag: noindex`; its pages answer 308 to www, its API keeps serving — checked by
  `check-seo-family.mjs --redirects-to https://www.<product>.com`) and both `admin.*` consoles — but they still serve
  correct files for the day they open. Orochia's www stays `noindex` until its indexing is decided on its own (an adult
  platform: `APP_SEARCH_INDEXING=off` in its spec). Providers (Stripe, Google…) are given the www URLs, never a dev host.
  Search Console / Bing verification is by DNS TXT record, never a file or a token in the repository; the sitemap to submit
  is `https://www.<product>.com/sitemap.xml`.

## 2.5 Service discovery — the mobile apps' backend addresses are data

- **The apps never hard-code a backend address** ([krizaka/.github ADR-003](https://github.com/krizaka/.github/blob/main/docs/adr/ADR-003-mobile-service-discovery.md)):
  they load `https://www.krizaka.com/.well-known/krizaka/services.json` through [`@krizaka/discovery`](https://ui.krizaka.com/packages/discovery),
  so a URL change is never a store release. This site **serves** it; it is the one place the addresses are edited.
- **The data** is `lib/services.ts` (one entry per product and environment: `apiBase`, `webBase`, optional `authBase` / `mediaBase`,
  `minAppVersion`, `latestAppVersion`, `status` `ok | maintenance`, optional `message` `{ en, fr }`). A product appears when a
  client reads it; the values are what is **live**: APIs, auth and webhooks stay on the dev sites; `webBase` moves to www.<product>.com once that product's www serves the app (#119).
- **Signed, never on the host.** `npm run services:sign` signs the data with the vault's Ed25519 key (`APP_DISCOVERY_SIGNING_KEY_K1`,
  read by `secret.sh`, never printed) into the committed `lib/services.signed.json`; the build (`services:check`) and
  `tests/services.test.mjs` fail when the data and the signature disagree. The hosting platform and CI hold no private key.
  `issuedAt` only grows. A new key id (`k2`, the standby) is baked in `@krizaka/discovery` first, then used.
- **Served** by `app/.well-known/krizaka/services.json/route.ts` (static), `Cache-Control: public, max-age=300`, CORS open for GET
  (`next.config.ts`). The **fallback copy** is `discovery/services.json` on Bunny (`krizaka-assets`, one writer:
  `npm run services:sign -- --publish --env-file …`); `npm run services:sign -- --live` compares both live copies with the
  committed one. After a deploy of a changed manifest, publish the Bunny copy.
- **Every address** passes the apps' allow-list (`https`, `krizaka.com` or the product's own domain; never a shared CDN host):
  `tests/services.test.mjs`. Never add a product page, only an entry.

## 3. Theming — dark **and** light are first-class

- One token system: `@krizaka/tokens` through the `@krizaka/tailwind` preset (imported by `app/globals.css`) —
  dark on `:root`, light on `html.light`, toggled by `app/components/ThemeProvider.tsx` (persisted as `kz-theme`).
  `app/globals.css` only adds the site's own tokens (font, grid, sheen, transitions).
- **Components use `var(--kz-*)` only.** No hard-coded hex/rgb/zinc colors, no
  Tailwind literal color utilities (`bg-zinc-900`, `text-blue-400`, …) for
  surfaces/text/borders. Semantic accents (e.g. per-phase/per-layer identity)
  may use fixed mid-tone colors that read on both themes.
- `color-scheme` is pinned to the active theme (`:root` dark / `html.light`
  light) so scrollbars, controls and third-party CSS follow it.
- Every new view must be verified in **both** themes before it is considered done.

## 4. Visualizations

- **No architecture drawing here.** Krizaka Java's building blocks map (`ModuleMap`, generated from the POMs) lives on
  java.krizaka.com (`krizaka-build/site`); the Orazaka and Orochia models, journeys, pipeline and topology on the products'
  sites. A schema is added here only when a page here draws it.
- **Mermaid is retired**, with no fallback: never rendered in the browser, never shipped (`mermaid` is not a dependency),
  and a ` ```mermaid ` fence in a published doc fails the build. (Unpublished
  internal design notes of the product repositories may still hold some; they never reach the site — converting one is
  part of publishing it.)
- Every schema reads correctly at phone width (one column, top to bottom), works with the keyboard,
  honours `prefers-reduced-motion`, and carries a **text version** (tables or
  ordered lists) of everything it draws.
- **Motion is one system — @krizaka/ui's.** `MotionObserver` (`@krizaka/ui/motion`) is mounted once in the locale
  layout: blocks arrive once with `reveal(i)` (`lib/motion.ts` → `[data-reveal]`, staggered 70 ms; `reveal(i, "soft")`
  for schemas and dense content; never on the first screen), figures climb with `NumberTicker`
  (`@krizaka/ui/number-ticker`), loops pause off screen (`data-offscreen`) and wait for the page to settle
  (`html[data-motion]`). **Nothing moves under the pointer** (krizaka-ui#393, ADR-003): a hover changes a colour — a card's
  surface and hairline one step up, a button its hover colour — never a position; no lift, no zoom, no light that follows
  the pointer, no `magnetic`, no `shimmer`; the keyboard focus is a 2 px `--kz-ring` ring. Only an arrow leans where it leads. The site only
  adds what is its own, in `app/globals.css` (« SITE MOTION ») and `org-hero.css`: no second conductor, no counter of its
  own. No animation library for new work, no permanent `requestAnimationFrame`, no canvas; docs stay almost still (a
  reading hairline), `/story` keeps its own. Missing generic primitives go to krizaka-ui, not into a copy here.
- **Every action is the @krizaka/ui `Button`** — through `ButtonLink` (`app/components/ButtonLink.tsx`, the router
  adapter) for links: `primary` for the one action a block is about, `secondary` for the others, `ghost` for quiet chips;
  **one shape, the Button's default** (an 8 px radius, the radius of a field; never `shape="cut"` — the chamfer is retired,
  krizaka-ui#393 — and never `shimmer` or `magnetic`, deprecated no-ops); `lg` on a hero or a closing call, `md` in a
  section. No page-local button class (`.bp-btn`, `.org-btn`, `.st-btn`…).
## 4.1 The Krizaka page language — from `@krizaka/ui` blocks

- **Every page is made of the page blocks of [`@krizaka/ui`](https://ui.krizaka.com) (category *Blocks*),
  never of a copy here.** There is no `app/components/sections` any more: a missing block or variant is added to
  krizaka-ui (meta, examples, stories, tests), released, then used here. The rule of the language: **read in five
  seconds, then go deeper on demand.**
- **Every page declares its template** — one of the page templates of `@krizaka/ui` (category *Templates* of ui.krizaka.com:
  landing, product, how-it-works, gallery, docs-hub, docs-article, component, catalogue, longform, changelog, contact,
  legal, status, error, pricing) or `redirect` — in `lib/page-templates.ts`. `npm run lint` fails on a page missing
  from the map (`scripts/check-page-templates.mjs`). A page is rebuilt on its template's component (the legal pages on `LegalPage`, the 404 on `ErrorPage`); a composition the catalogue lacks is added
  to krizaka-ui first.
- **One shell.** `Page` (`@krizaka/ui/page`) is the frame of everything: the content is at most `--kz-page-max` (72rem)
  wide between the gutters `--kz-page-gutter` (16 → 32 px); the documentation uses `--kz-page-max-docs` (88rem). The
  bar (`TopNavBar`, `.kz-site-bar`), every hero, section, the footer share those edges —
  no page centres its own container (`maxWidth: 1100px`, `.os-section`…). Settings live in `app/globals.css` (« One
  frame for every page »): `--kz-hero-top` clears the bar, `--kz-anchor-offset` places anchors.
- **Styles.** The blocks' stylesheet is `@krizaka/ui/blocks.css`, imported once by package path in
  `app/[locale]/layout.tsx` — never by a relative `@import` inside `globals.css` (the production build dropped one, #74).
- The blocks, by role:
  - `PageHero` (`@krizaka/ui/page-hero`) — the first screen of every page but the home: back link (`linkAs={Link}`),
    eyebrow, h1, lead, facts or actions as children, the page's bird in `aside`. Painted at once, never revealed (LCP).
  - `Section` + `SectionHeading` (`@krizaka/ui/page`) — eyebrow · h2 · lead · actions; `divider` (a hairline) or
    `backdrop` (the brand's colour transition) between sections; `Facts` (registry and version `ok`, work in progress
    `wip` — said honestly); `Ticks` — words between backticks in a message (`` `requestId` ``) read as code.
  - `CardGrid` + `LinkCard` — entry points (the docs hub, a product's docs index, « the other blocks »): the whole card
    one link, icon · title · one sentence · the way in.
  - `CardGrid` + `ArgumentCard` — cards that argue, **compact**: icon · name · mono meta, the bird **small in the
    corner** (`mark`), the **hook in one line** (≤ 90 characters, regular weight), compact `facts`, **one short action**
    (`more`, « Details → ») and discreet icon actions (`ActionBar variant="icons"`). What it does, the bird's quote and
    the long version are **never on the face**: on the detail page (`more`) or unfolded in place (`panelLabel`, a
    native `<details>`; a grid with folds aligns its cards at the top). Under the pointer the card's surface and hairline
    go one step up — it never lifts and no light follows the pointer (`PointerLight` is a deprecated no-op).
  - `MascotQuote` — a rule told by a bird (`inline` in an unfolded card or a detail page, `callout` in a section, at
    most one per section). The bird carries a promise, never decoration: the falcon watches (security), the owl reads
    and knows every face (documents, identity), the duck builds (code), the flamingo answers or gets paid, the pigeon
    delivers. On one page no two subjects wear the same bird in the same mood and hue.
  - `DecisionList` — chose (✓) · refused (✕) · because (→) · what it costs (!). `CodeBlock` / `CodeTabs` — file name,
    highlighted code on the tokens, copy (Maven · Gradle). `TocLayout` + `Toc` — a reading page's sticky contents.
  - `ActionBar` (`buttons` | `icons`) and `CtaPanel` — discuss · propose · report, contact, get started.
- **Hues**: a card or a page about one subject wears `data-hue` (`cobalt · sky · cyan · indigo · steel · ink`), mapped
  in `app/globals.css` onto the blocks' contract `--kz-hue` (decorative, ≥ 3:1), `--kz-hue-2`, `--kz-hue-text` (small
  text, ≥ 4.5:1, both themes). Krizaka palette only; without a hue, blocks fall back to the page's brand accent.
- **Versions are data.** Every version the site shows (facts, the Maven list, the module map, code samples) is read
  from npm and Maven Central at build (`scripts/gen-registry-versions.mjs` → git-ignored `lib/registry-versions.json`,
  read by `lib/registry-versions.ts`): never a version typed in a module or a message.
- What the blocks leave to a page (prose, two columns, yes/no lists, release lines) is the small `rd-*` set of
  `app/globals.css` (« Reading pages »). Words come from `messages/*.json`; data modules keep links, code, birds and
  hues. The first section under a `PageHero` is on a phone's first screen: no `reveal` there (LCP).

## 5. Code conventions

- TypeScript, App Router. UI in `app/components/`, logic/data access in `lib/`.
- Server Components by default; add `"use client"` only when needed (state,
  effects, WebGL, browser APIs).
- Prefer static generation; keep client bundles lean: schemas receive the slice of generated data
  they draw as props from a server component, never the whole JSON.
- i18n via `app/components/I18nProvider` where text is user-facing.
- **The stack rules** ([krizaka-ui ADR-001](https://github.com/krizaka/krizaka-ui/blob/main/docs/adr/ADR-001-tanstack-under-krizaka-facades.md)):
  no `fetch` in a client `useEffect` (a Server Component renders the data), no `@tanstack/*` import (only through a
  `@krizaka/*` facade), no hand-written `<table>` or multi-field `<form>` outside the documented exceptions. ESLint warns
  (`krizakaStack()` of `@krizaka/config`), `krizaka-ratchet` holds the counts of `lint-ratchet.json` (they only go
  down; `retire` lists the dependencies on their way out — none left), and `depcruise` (`.dependency-cruiser.cjs`,
  extending `@krizaka/config/dependency-cruiser`) fails the lint on a forbidden import or a cycle.

- A product's public address is `siteUrl` in `lib/products.ts` (`www.<product>.com`, `lib/product-hosts.ts`): never hard-code a
  product's address, and never link a `dev.<product>.com` host from a public page. `llms.txt` and `llms-full.txt` are rendered from `content/`.
- The contact form posts to `app/api/contact` (validation in `lib/contact.ts`). Delivery is
  configured by environment and fails closed (503) when nothing is set:
  `MAIL_PROVIDER=mailgun` + `MAIL_API_KEY` + `MAIL_DOMAIN` + `MAIL_CONTACT_TO` (+ `MAIL_API_URL`, `MAIL_FROM`)
  and/or `MAIL_CONTACT_WEBHOOK_URL`. Template: `.env.example`.
- **Environment variables are named by bounded context** (krizaka/.github#46): `<CONTEXT>_<THING>` with CONTEXT one of
  `APP_` `DATABASE_` `AUTH_` `MEDIA_` `MAIL_` `PUSH_` `PAYMENTS_` `REALTIME_` `ABUSE_` `OBSERVABILITY_` `AI_` `OPERATOR_` —
  never a product (`OROCHIA_…`) nor a vendor (`BUNNY_…`, `MAILGUN_…`): a vendor is a value (`MAIL_PROVIDER=mailgun`);
  `NEXT_PUBLIC_` only where the browser needs it, then the context. Every variable is declared once in `lib/env.ts`
  (zod); `tests/env.test.mjs` refuses an undeclared or misnamed one and keeps README's table (generated,
  `npm run docs:env`) in sync.
- **Commit attribution & AI co-authors**: Commits or pull request descriptions authored with AI assistants must attribute their co-author using GitHub-recognized Git trailers:
  - **Claude**: `Co-authored-by: Claude <81847+claude@users.noreply.github.com>`
  - **Antigravity (Gemini)**: `Co-authored-by: Antigravity (Gemini) <200291788+gemini-code-assist@users.noreply.github.com>`
  Both map to verified GitHub user accounts ([`claude`](https://github.com/claude) and [`gemini-code-assist`](https://github.com/gemini-code-assist)), ensuring their official avatars appear on commits and in the repository's Contributors list.

## 5.1 PR captures — never committed

- Screenshots, recordings and metrics of a PR (before/after, Lighthouse…) are **never committed**, in
  any `krizaka` repository, nor pushed to a `pr-assets/*` branch. They go to Bunny Storage under
  `pr-assets/<repo>/<pr-or-topic>/` and the PR body links their CDN URLs:

  ```bash
  node scripts/pr-assets.mjs upload <dir> --repo <repo> --key <pr-or-topic> --env-file <path/to/.env>  # --dry-run to preview
  ```

  It prints each CDN URL and a Markdown block to paste in the PR. Credentials come from the
  environment or `--env-file`: `MEDIA_STORAGE_API_KEY`, `MEDIA_STORAGE_ZONE`,
  `MEDIA_STORAGE_ENDPOINT` (default `storage.bunnycdn.com`), `MEDIA_CDN_HOSTNAME` — never
  printed, never committed. The upload fails if the pull zone does not serve the first file publicly.
- `node scripts/pr-assets.mjs rewrite <file> --repo <repo> [--write]` turns links to a committed
  `docs/screenshots/<key>/…` folder into the CDN URLs of the same key (migration of old PR bodies).
- `docs/screenshots/`, `.github/pr-assets/` and `.github/screenshots/` are git-ignored (the old committed captures
  were moved to Bunny with their PR bodies rewritten); keep captures in a scratch folder.

## 5.2 Site media — on Bunny, never committed

- Bunny Storage (zone `krizaka-assets`) is **the media library of Krizaka** — browse it by brand, person, product. The
  layout is `scripts/bunny-layout.mjs` (the README.txt at the zone root is generated from it; `node scripts/cdn-assets.mjs
  tree` audits the zone against it), one writer per prefix:

  ```
  brand/<krizaka|orazaka|orochia|yasakia|yororis|yomizaka|kachizaka|akinaza>/   logo + mark, SVG and PNG 256/512/1024 on transparent, dark & light,
                                                     avatar 500/1024, social-preview 1280x640 · brand/manifest.json
  people/defaults/v1/<brand>/                        default profile pictures: person|plain-<1-6> .svg / -256.webp / -512.webp
  people/personas/<product>/                         the demo personas' portraits
  products/<product>/{home,tour,mobile,gallery,studios,docs}/<name>.<ext>   a readable mirror of what the products serve
  site/<area>/…/<name>.<hash>.<ext>                  what the pages load (hashed, immutable)
  ui/  maps/  pr-assets/                             ui.krizaka.com media · the basemap · PR evidence (§5.1)
  ```
- **`brand/` and `people/defaults/` are generated from the code**, never drawn or uploaded by hand: krizaka-ui's
  `tools/export-brand.mjs` renders `@krizaka/ui`'s marks and `defaultAvatarSvg` (the source of `Avatar`'s
  `defaultAvatar`) to SVG/PNG/WebP and uploads them with a `manifest.json`. A mark changes in krizaka-ui, then the export
  is re-run. Default avatars are versioned by folder (`v1`): a changed picture is a new folder.
- **`products/` and `people/personas/` are a mirror**: `node scripts/cdn-assets.mjs library` copies the newest hashed
  file of `site/` to its human name. Pages and apps keep loading `site/` (its URLs never change content, and published
  packages use them); the mirror is for browsing and downloading.
- **Orochia has its own storage zone (`orochia-dev`) and Stream library**: new Orochia media go there, not in this zone.
  `site/products/orochia` and `site/people/orochia` move there later (krizaka/orochia#153); until then they stay under `site/` and are never mirrored in `products/` or `people/personas/`.
- **Yazakia is retired (renamed Yasakia)**: its folders are in `RETIRED` (`bunny-layout.mjs`); `cdn-assets prune
  --retired --yes` removes them. Never write a `yazakia` path again.
- The site's media — product tours, posters, the gallery, the home backdrop, any heavy image or video — are sent under
  `site/` with `cdn-assets upload`:

  ```
  site/home/backdrop/<product>.<hash>.{webm,mp4,jpg}
  site/blog/<post>/<name>.<hash>.<ext>            (the blog's images; the blog repository never commits media)
  site/products/<product>/tour/<clip>.<hash>.{webm,mp4,jpg}
  site/products/<product>/gallery/<id>.<hash>.webp
  ```

  `node scripts/cdn-assets.mjs upload <file-or-dir> --to <path> --env-file <path/to/.env>` (`--dry-run` to preview)
  sends each file as `<name>.<hash>.<ext>` (first 10 hex of its SHA-256 — a URL never changes content, so it is cached
  for good) and records its hash in `lib/cdn-manifest.json` — commit that file, never the media. A file already
  recorded with the same hash is skipped. `check` asks the pull zone for every recorded file; `prune` previews (and
  with `--yes` deletes) the old versions the manifest no longer names, never under another writer's prefixes (`FOREIGN_WRITERS` in `bunny-layout.mjs`: the product sites, Orazaka's `gallery-video/` and `video/`, the blog). Same credentials as §5.1, never printed.
- Code never writes a media URL: `lib/cdn.ts` turns a logical path (`cdn("products/orazaka/gallery/
  tea-pour.webp")`, `video("products/orochia/tour/alex-bid")` → `{ webm, mp4, poster }`) and fails the build on a
  path the manifest does not know. The host is `NEXT_PUBLIC_MEDIA_CDN_URL` (read at build; default
  `https://krizaka-assets.b-cdn.net`); `next.config` allows it for `next/image` and redirects the old `/assets/…` URLs
  (still used by published `@krizaka/ui` examples) to their file on the CDN.
- Same-origin on purpose: the favicon (`public/favicon.svg`, the manifest and the tab), what Next.js generates (robots,
  sitemap, `llms.txt`, Open Graph metadata, `/_next/static`) and the fonts (`next/font/local`, preloaded with the page).
  `public/ui-examples/` is generated at build, git-ignored. Nothing else goes in `public/`; a file nothing references is
  deleted, not kept "just in case" — git and Bunny keep the history.

## 5.3 Tests — no test, not done

- Every feature and every fix ships with its tests in the same pull request: a unit test (`tests/*.test.mjs`,
  `node:test`, run by `npm test`) for logic — a data module, a generator, a script, an API route's validation —, and a
  build-time check for what the site renders from data (`scripts/gen-ui-docs.mjs --check`
  are the pattern: a page that cannot be right does not build). A component's own tests live in krizaka-ui.
- **A fix starts with a failing test** that reproduces the bug; the fix turns it green and the test stays as the guard.
- CI (`.github/workflows/ci.yml`: lint, `npm test`, build) runs them on every pull request and must be green. A test is
  never skipped, weakened or deleted to get there.

- **The fast local loop.** `npm run dev:check` (ESLint on the files changed against origin/main, `tsc --noEmit`, the unit tests: ~10 s) is what to run while working; `npm test` is unit-only and takes seconds; CI still runs the whole of lint, test and build. `dev` and `postinstall` reuse `lib/*.json` younger than 6 h (`scripts/gen-fresh.mjs`; `KRIZAKA_GEN_FORCE=1` or `KRIZAKA_GEN_MAX_AGE_MIN=0` refetches; `build` and CI always fetch).

## Static rules & codemods (ast-grep)

The org code rules (addendum 2026-10-15) are lint rules, not review comments. [`@ast-grep/cli`](https://ast-grep.github.io)
is a **pinned devDependency** (no global install, CI reproduces local): `sgconfig.yml` + `rules/*.yml` (one rule per file,
with a message and, where safe, a `fix:`; written for Tsx and `.ts` is parsed as Tsx too, so each rule covers `.ts` and `.tsx`), `rule-tests/` (valid/invalid cases of each rule).

| Rule | What it refuses |
| :--- | :--- |
| `no-hand-ms-*`, `no-get-time-difference`, `no-get-time-arithmetic` | hand-written time arithmetic (`n * 60 * 1000`, `a.getTime() - b.getTime()`): date-fns, or a duration read from the settings |
| `no-env-in-domain` | an `env` import in domain code (`packages/*/src`, `src/`): the value arrives as a parameter |
| `no-db-in-service-or-rules` | a db client / schema import in `*.service.ts`, `*-service.ts`, `*.rules.ts`, `*-rules.ts` |
| `no-ts-enum` | the TypeScript `enum` keyword (`as const` object + derived type, or a Postgres enum) |
| `no-enum-string-compare` | `x.status === "OPEN"` (field named status/kind/role/reason/state/direction compared to a string literal) |
| `no-ambient-clock` | `new Date()` / `Date.now()` in domain code: the clock is injected |
| `no-types-at-package-root` | `types.ts` at a package root (`<feature>/<feature>.types.ts`) |
| `no-unjustified-numeric-export` | a numeric (or `…ToMilliseconds(n)`) `export const` in feature code without `// @fixed: <reason>` just above |
| `no-hand-made-nav`, `no-hand-made-language-switch` | a navigation bar that is not `NavBar` of @krizaka/ui (own Radix NavigationMenu, a local `NavBar`/`TopNav`), a hand-made language switch (`hrefLang` in a component, a row of `aria-pressed={locale === …}` buttons): use `NavBar` and `NavBar.Language` (« Navigation in the family », ui.krizaka.com) |

- **Run**: `npm run lint` runs everything (it includes `ast-grep test` and the ratchet). `npx ast-grep scan` lists the
  violations with their message; `npm run lint:sg:test` runs the rule tests.
- **Ratchet**: `scripts/sg-ratchet.mjs` counts the violations per rule and refuses any increase against
  `sg-ratchet.json` (same idea as `krizaka-ratchet` / `lint-ratchet.json`: the debt only goes down). Fixed some? Lock the gain with
  `npm run sg:ratchet:update` (it never raises a count and records a new rule at its current count). A new rule is
  added with its test in `rule-tests/` and its baseline in the same pull request. The script is identical in every
  Krizaka TypeScript repository (keep the copies identical; its unit test is `tests/sg-ratchet.test.mjs`).
- **Codemods**: `npm run sg:fix` applies the `fix:` of the rules (`ast-grep scan --update-all`) and adds the date-fns import;
  behaviour is identical — run `npm run lint && npm test` after, and land the result in a small pull request.
- A rule is never silenced to get a PR green; fix the code, or (a business parameter that is a technical fact) justify it with `// @fixed:`.

## 6. Definition of done

1. `npm run build` is green and the route is statically generated.
2. `npm run lint` is clean, and `npm test` is green with the change's own tests (§5.3).
3. The change reads correctly in **dark and light** mode.
4. No hand-edited generated content; no hard-coded colors.

*Agent-neutral contract for `krizaka-com`. The Orazaka engine contract lives at
`products/orazaka/AGENTS.md`.*

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

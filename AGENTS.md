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
  (orazaka, yomizaka, akinaza; epic krizaka/.github#119, 2026-10-21): the product's real app on its own deployment, sign-up closed everywhere; the apex
  `<product>.com` answers 308 with www. `lib/products.ts` carries `siteUrl` (www) — **every public link, sitemap, llms.txt and JSON-LD
  uses it, never a `dev.<product>.com` host**. `dev.<product>.com` is the development host of the same deployment: `noindex`, robots `Disallow: /`, every HTML page
  answers 308 to the same path on www, and only what is called keeps serving there (`/api/*`, auth callbacks, webhooks,
  `/.well-known/*`, `/healthz` — the mobile builds and the services' server-to-server calls), with `X-Robots-Tag: noindex`.
  This repo carries **no product page, demo, gallery, journey, recording or documentation** of the products: the home's
  products section (`#products`) has a card per product (mark from `@krizaka/ui`, name, one neutral line, status,
  « See the dev site » → `devUrl` with its build-read version, and « Source »; 2026-10-26: production is not open); `/products` and `/{en,fr}/products` answer 308 to `/#products` /
  `/<locale>#products`.
- **Departed products** (Oussama, 2026-10-29, krizaka/.github#413): the org holds Yomizaka, Akinaza, Orazaka and the platforms. krizaka.com names no other
  product anywhere — code, messages, docs, configs, manifests; the org's conformance rule `no-departed-product` proves it (history is
  allow-listed in the registry only). An old product address (`/products/<anything else>`) answers 308 with `/#products`
  (`lib/product-redirects.ts`), never a dead site.
- **Commercial names** (Oussama, 2026-11-01, krizaka-internal#2103): the site shows **Verikora** (code name yomizaka), **Folioviv** (akinaza) and **Sovkora** (orazaka, the engine: « Powered by Sovkora »); only the words change. Ids, `siteUrl`/`devUrl` (www.yomizaka.com…), repositories, redirects and Bunny paths keep the code names. The display name is data (`brandOf(code).commercialName` of `@krizaka/org`, read by `lib/products.ts`), messages say the commercial name or take `{product}`, and `krizaka-code-names messages content` (in `npm run lint`) refuses a code name in a message or in `content/`; the built HTML is checked by the same bin in CI (`scripts/ci-container-smoke.sh`).
- **Old addresses redirect.** `lib/product-redirects.ts` (read by `next.config.ts`, tested by
  `tests/product-redirects.test.mjs`): `/products/<p>(/…)`, `/docs/<p>/*` and the old Orazaka pages (`/architecture`,
  `/demos`, `/use-cases`…) → the product's www address — all 308, with or without the locale prefix.
  Never add a product page back: change the product's site.
- **The changelog is data** (`/changelog`, krizaka/.github#184): `scripts/gen-changelog.mjs` reads, at build, the GitHub Releases of
  the repositories listed in `krizaka/.github/release-repos.json` (written by the shared `release-notes` workflow: `YYYY.MM.DD.N`,
  an English and a French section; Orazaka is one product line) and the `@krizaka/*` versions. krizaka/.github's `changelog-rebuild.yml` (environment `dev`) rebuilds
  on the `product-release` dispatch and daily. The page filters by `?produit=` (the address is the state), lists only the
  products it presents and the stack, keeps its RSS and shows the French lines on `/fr`. The public
  text has no personal name and no em dash: `cleanText` (lib/changelog.ts) cleans, `releaseProblems` fails the build.
- **Product first, Orazaka as the engine.** On a product's own site the product is the subject of the hero, the steps and the feature cards (« Yomizaka reads your lease »); Orazaka appears only as the engine — one discreet « Powered by Orazaka » line and the proof sections (run ids) — never as the one doing the product's job (« Orazaka reads your lease »). Each product repository tests that its hero and steps do not name Orazaka. The engine card here draws the flow both ways, from `lib/engine-uses.ts`, and claims only what runs (results, analytics; run events and webhooks are orazaka#189).
- A product **in development** (`status: "development"`: Orazaka, Yomizaka, Akinaza) is built in the open: its repository is
  public, sign-up is closed, and it says « In development ». Each card links its dev site (« See the dev site », 2026-10-26); the www address stays for the nav, sitemap and JSON-LD.
  Akinaza prepares tax returns and never files them, and is not for restaurants and bars — the card words say so, no more.
- **« Dev preview » is data, not words** ([krizaka/.github `docs/standards/dev-preview.md`](https://github.com/krizaka/.github/blob/main/docs/standards/dev-preview.md), ADR-002).
  `ProductStatus` has `devPreview`; every product has an explicit `status` (no status no longer means a badge). A product may wear
  `devPreview` only when the `dev-preview.json` at the root of its repository is complete (every criterion: fresh evidence URL or a
  justified `na`). `scripts/gen-dev-preview.mjs` (in `npm run build`) reads the checklists from GitHub raw, writes the git-ignored
  `lib/dev-preview-checklists.json`, checks the evidence URLs and **fails the build** if the status is not supported; the pure rules
  are in `scripts/dev-preview-lib.mjs`, guarded by `tests/dev-preview.test.mjs`. No product wears it today (Orazaka went back to
  `development` on 2026-10-25, the CTO's call) and `WAIVERS` is empty; a waiver is time-boxed and its test fails the day it ends.
  Other statuses are never gated.
- A product not released says so with a status chip (`status: "upcoming"` — « Soon »; `"construction"` — « In
  construction »), never beta, early access, waiting list or sign-up. No store button, no invented screenshot or figure.
- The site's media (Krizaka UI's home gallery, posters) live on Bunny, never in `public/` (§5.2). The CDN manifest names
  only what is still drawn: `home/kit`, `home/kit-native`, `people/**`, the products' real takes that `/story` plays in its lightbox (`lib/story-takes.ts`: a poster per product, the recording on click), and `brand-films/**` — the
  brand film « Montrer son travail » (`lib/brand-film.ts`, made with Orazaka, approved 2026-11-01: the home's « Watch the
  film », `/story` and its watch page `/films/montrer-son-travail`; no speech, so its text version is the list of its
  shots; its 9:16 cut plays upright on a phone once uploaded) and the loops of each bird, loaded by ui.krizaka.com and the
  products' sites by their hashed URL. A new film replaces it: upload, then `cdn-assets prune`. **/story is Krizaka's
  story, the company's: it never links to the founder's blog** (krizaka-internal#138, `tests/story.test.mjs`).
- **French is the default language** (Loi 96, `lib/locale-negotiation.ts`): an unprefixed URL goes to the cookie `NEXT_LOCALE` if set, else English only when the browser asks for English and never French, else French; hreflang `x-default` → `/fr`.

- **Services and a short home** (founder, 2026-10-30, #487): the home's « what we know how to do » section is gone; in its slot (§ 4) one line leads to **`/services`** (« Nos services », longform): Krizaka Entreprise, the one offer for companies — custom modules, adoption of a sovereign AI, maintenance — on quote, no price, claims backed by public artefacts (`lib/services-page.ts`), one action (the contact form, topic `enterprise`), words in `site.services`, a `Service` JSON-LD node under the Organization, in the bar (Open source · Services), the footer, the sitemap and `llms.txt`. **`/open-source` is lighter**: hero, stack, packages, how it fits, contribute — no CI intro, standards, repositories table or nomenclature (GitHub is the source of the repository list).
- **The footer is data, as an admin configures it** (founder, 2026-11-01): `lib/footer.ts` holds it in the exact settings
  shape the apps store (`FooterSettings` of `@krizaka/ui/site-footer`, validated by `footerSettingsProblems`): three columns —
  Products (status once), Open source, Krizaka — at most six links each, then one legal line that names the company once
  (`Technologies Krizaka Inc. · NEQ … · Montréal (Québec)`), the site's version and the legal links. `SiteFooter.tsx` only
  resolves the words and prefixes the locale; never a column typed in the component (`tests/footer.test.mjs`).
- **The home's order** (2026-10-22, the honest chronology, #337): the hero (`HomeHero`, whose lead tells it in two or three
  short sentences), then **Orazaka, our first build** (`EngineSection`, § 2), then **the products built on it** (`ProductShowcase`, § 3: each card names its dev address and the version its dev site runs — read at build from `/api/healthz`, `scripts/gen-dev-versions.mjs` → git-ignored `lib/dev-versions.json`, `tests/dev-versions.test.mjs` — and links « See the dev site » while production is not open; the tags hang slightly off the square, -0.6° then +0.5°, straight under reduced motion and on focus; the plates redraw what the apps show, demo data said as demo), then the principles (`Principles`, § 4), and it stops there: no Montréal (`Company`) section, no closing contact panel
  and no FAQ (so no FAQPage JSON-LD; the SEO check asks the home for Organization and WebSite only). Krizaka, the company,
  was born from that work: the Organization `owns` the products and sites, its `foundingDate` is unchanged. The marks row under the hero
  follows the story: Orazaka, Akinaza, Yomizaka, then the rest (`heroMarkOrder`). `/story` is in the footer, « Contact us »
  in the bar. **The libraries are not on the home** (2026-10-26): Krizaka UI, Motion, Java and TypeScript live on `/open-source` only (`StackTiles`, from `lib/stack.ts`). **`/open-source` lists only what is open source** — the platform's libraries, kits and tooling (`openSourceRepositories`, `packageRows(…, products)`); the products (Orazaka, Yomizaka, Akinaza) are *operated by Krizaka*, out of every list and table there, and no page here claims a licence for them (a legal session decides). The section numbers (§ n) and the folio (« page n of N ») come from `lib/home-sections.ts`, never typed
  (`tests/home.test.mjs`, `tests/home-order.test.mjs`).

- **Docs (founder, 2026-10-30; overrides every « Open source » line above).** The bar's centre is **Services then Docs**
  (`NAV_BAR_LINKS`); « Docs » (FR « Documentation ») is `/docs`, the old `/open-source` page renamed because it read as « une page de stats ».
  It is **a documentation hub people can follow** (docs-hub template): « where do I start? » by who you are
  (`lib/docs-start.ts`: build an interface → ui.krizaka.com, a Java service → java.krizaka.com, our products, contribute),
  2-3 first pages each, the Krizaka UI quick start, **one quiet line of figures** (never the hero), how it fits, then the
  packages table folded as reference. The documentation itself stays on its own sites; `tests/docs-hub.test.mjs`.

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
  the foundations, the templates, EN/FR) and **Krizaka Java → https://java.krizaka.com** (krizaka-build `site/`) and **Krizaka TypeScript → https://ts.krizaka.com** (krizaka-ts `site/`: one page per package, generated from the packages). The
  products document themselves on their sites (dev.<product>.com).
- Every old address answers **308** with its page there: `/docs/ui/*` and `/{en,fr}/docs/ui/*` through
  `lib/ui-redirects.ts` (the same map as krizaka-ui `apps/site/lib/urls.ts`; tested by `tests/ui-redirects.test.mjs`),
  `/docs/java/*` through `lib/java-redirects.ts`, the products' docs through `lib/product-redirects.ts`; `/docs` itself
  is the hub towards ui., java. and the products; `/open-source` and `/<locale>/open-source` answer 308 to it (`lib/ui-redirects.ts`).
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
  correct files for the day they open. Providers (Stripe, Google…) are given the www URLs, never a dev host.
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
- **The Cahier register, not the product register** (ADR-006, Krizaka UI 2027): this site never sets `data-surface="product"` or a
  `.brand-<product>` root on `<html>` / `<body>` (the product cards scope their brand on the card), so the 2027 product values and
  Plus Jakarta Sans never reach it; Young Serif stays. Fields and checkboxes draw `--kz-border-control` (the Cahier aliases it to the
  strong border); `tests/cahier-register.test.mjs` guards it.
- `color-scheme` is pinned to the active theme (`:root` dark / `html.light`
  light) so scrollbars, controls and third-party CSS follow it.
- Every new view must be verified in **both** themes before it is considered done.

## 4. Visualizations

- **No architecture drawing here.** Krizaka Java's building blocks map (`ModuleMap`, generated from the POMs) lives on
  java.krizaka.com (`krizaka-build/site`); the Orazaka models, journeys, pipeline and topology on the products'
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
  bar (`SiteBar`, `.kz-site-bar`), every hero, section, the footer share those edges —
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
    and knows every face (documents, identity), the duck builds (code) — and is Orazaka's bird everywhere on this site (decision 2026-10-30; the open-source subject of /story wears the pigeon, which delivers) —, the flamingo answers or gets paid, the pigeon
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
  product's address, and a `dev.<product>.com` host is linked only by the home's product cards (`devUrl`, 2026-10-26: the products are in development), never by the nav, sitemap or JSON-LD. `llms.txt` and `llms-full.txt` are rendered from `content/`.
- The contact form posts to `app/api/contact` (validation in `lib/contact.ts`). Delivery is
  configured by environment and fails closed (503) when nothing is set:
  `MAIL_PROVIDER=mailgun` + `MAIL_API_KEY` + `MAIL_DOMAIN` + `MAIL_CONTACT_TO` (+ `MAIL_API_URL`, `MAIL_FROM`)
  and/or `MAIL_CONTACT_WEBHOOK_URL`. Template: `.env.example`.
- **Environment variables are named by bounded context** (krizaka/.github#46): `<CONTEXT>_<THING>` with CONTEXT one of
  `APP_` `DATABASE_` `AUTH_` `MEDIA_` `MAIL_` `PUSH_` `PAYMENTS_` `REALTIME_` `ABUSE_` `OBSERVABILITY_` `AI_` `OPERATOR_` —
  never a product (`ORAZAKA_…`) nor a vendor (`BUNNY_…`, `MAILGUN_…`): a vendor is a value (`MAIL_PROVIDER=mailgun`);
  `NEXT_PUBLIC_` only where the browser needs it, then the context. Every variable is declared once in `lib/env.ts`
  (zod); `tests/env.test.mjs` refuses an undeclared or misnamed one and keeps README's table (generated,
  `npm run docs:env`) in sync.
- **Commit attribution & AI co-authors**: Commits or pull request descriptions authored with AI assistants must attribute their co-author using GitHub-recognized Git trailers:
  - **Claude**: `Co-authored-by: Claude <81847+claude@users.noreply.github.com>`
  - **Antigravity (Gemini)**: `Co-authored-by: Antigravity (Gemini) <200291788+gemini-code-assist@users.noreply.github.com>`
  Both map to verified GitHub user accounts ([`claude`](https://github.com/claude) and [`gemini-code-assist`](https://github.com/gemini-code-assist)), ensuring their official avatars appear on commits and in the repository's Contributors list.

- **Deploys: a release train** (#389). release-please (`release-type: node`) keeps one « chore: release X.Y.Z » pull
  request from the Conventional Commits on `main` (`package.json`, `CHANGELOG.md`); merging it tags `vX.Y.Z` and publishes
  the release; `production.yml` fast-forwards the `production` branch to the tag (`scripts/promote-production.mjs`, never
  forced, never backwards). **The DigitalOcean app deploys from `production`, not `main`** (switched once by
  `scripts/do-app-production-branch.sh`). Never push to `production` by hand, never hand-edit the version or `CHANGELOG.md`.
  The footer shows krizaka.com's own version only (`vX.Y.Z` → its GitHub release); package versions are never on the page.

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

- **Layout v2 (ADR-014, krizaka/.github, 2026-10-28)** — Bunny Storage (zone `krizaka-assets`) has four roots, at most five
  folders deep, in reading order: **the org**, then **the sites**, then **the apps** (`scripts/bunny-layout.mjs` is the single
  source; the README.txt at the zone root is generated from it):

  ```
  org/v<n>/                 Krizaka's own data, the defaults of the family: org.json + apps/<app>.json (@krizaka/org),
                            defaults/<kind>/ + defaults/tones/<brand>/, brand/<brand>/, maps/{tiles,fonts}/, films/<series>/, discovery/
  sites/<site>/<kind>/…     what one public site shows (www, blog, ui, java, each dev site), hashed: home, tour, gallery, docs, personas…
  apps/<app>/<kind>/…       runtime data of one app only (defaults, uploads, generated) — e.g. apps/akinaza/defaults/
  pr-assets/<repo>/<topic>/ PR evidence (§5.1)
  ```

  This site's manifest (`lib/cdn-manifest.json`, root `sites`) resolves through `manifestObject`: `home/…` → `sites/www/home/…`,
  `products/<p>/…` → `sites/<p>/…`, `brand-films/…` → `org/v1/films/…`. **A new write outside v2 fails** (`assertWritable`).
  The old folders (`brand/`, `defaults/`, `people/`, `maps/`, `discovery/`, `site/`, `ui/`, `products/`) are **legacy**: copied
  by `cdn-assets migrate` (copy, never move), kept only while something names them (code on main, the latest npm tarballs,
  live pages, unmerged manifests), each with its switch issue (`SWITCH_ISSUES`); what nothing names is deleted
  (`cdn-assets purge-unused --refs <dir> --backup <vault> --yes`). `cdn-assets tree` reports `ok` / `legacy` / `misplaced`
  (`--strict`: fails on legacy too); `node scripts/bunny-tree.mjs` feeds the cockpit (`status`, `issues`, `totals.legacyRoots`).
- **Another zone, not a root: `krizaka-gpu-out`** (2026-11-01, krizaka-internal#2121). Rented GPU pods write their outputs there directly and hold
  only that zone's key (`MEDIA_GPU_STORAGE_API_KEY`), never `MEDIA_STORAGE_API_KEY`; a compromised pod cannot touch the sites. It has no pull
  zone and no layout; objects live under `<day>/<run>/<pod>/` and are deleted after 7 days. The server promotes a validated clip to
  `krizaka-assets` with `cdn-assets upload` (orazaka `scripts/gpu-out/cli.mjs promote`). The provider and zone are Orazaka admin settings.
- **Default media URLs (avatars, banners, logos) come from the Krizaka org JSON** (`https://krizaka-assets.b-cdn.net/org/v1/org.json`,
  `@krizaka/org`: `listDefaults(kind)`, `defaultFor(kind, seed)`) — **never hard-coded or bundled in an app**; ast-grep's
  `no-hard-coded-default-media` refuses a `people/defaults`, `defaults/v<n>/` or `krizaka-defaults` path
  ([standard](https://github.com/krizaka/.github/blob/main/docs/standards/default-media.md)). A folder is never given a person.
- **`org/v1/brand/` and `org/v1/defaults/` are generated from the code**, never drawn or uploaded by hand (krizaka-ui
  `tools/export-brand.mjs`, `tools/export-defaults.mjs`). A mark changes in krizaka-ui, then the export is re-run; a
  changed picture gets a new id or `org/v2/`.
- **Departed products' folders** are deleted from the zone by the CTO (krizaka/.github#413); `RETIRED` (`bunny-layout.mjs`) names none of them.
- The site's media — product tours, posters, the gallery, the home backdrop, any heavy image or video — are sent with
  `cdn-assets upload`; the logical path (`--to`) keeps its area (`home`, `products/<p>/<kind>`, `docs/<p>`, `people/<p>`,
  `brand-films/<series>`) and lands in layout v2:

  ```
  home/backdrop/<product>.mp4          → sites/www/home/backdrop/<product>.<hash>.mp4
  products/<product>/tour/<clip>.mp4   → sites/<product>/tour/<clip>.<hash>.mp4
  brand-films/<series>/<name>.mp4      → org/v1/films/<series>/<name>.<hash>.mp4
  ```

  `node scripts/cdn-assets.mjs upload <file-or-dir> --to <path> --env-file <path/to/.env>` (`--dry-run` to preview)
  sends each file as `<name>.<hash>.<ext>` (first 10 hex of its SHA-256 — a URL never changes content, so it is cached
  for good) and records its hash in `lib/cdn-manifest.json` — commit that file, never the media. A file already
  recorded with the same hash is skipped. `check` asks the pull zone for every recorded file; `prune` previews (and
  with `--yes` deletes) the old versions the manifest no longer names, never under another writer's prefixes (`FOREIGN_WRITERS` / `FOREIGN_WRITERS_V2` in `bunny-layout.mjs`: the product sites, the blog), and keeps the legacy `site/` copy of every current entry until the v2 release is live. Same credentials as §5.1, never printed.
- Code never writes a media URL: `lib/cdn.ts` turns a logical path (`cdn("products/orazaka/gallery/
  tea-pour.webp")`, `video("products/orazaka/tour/tea-pour")` → `{ webm, mp4, poster }`) and fails the build on a
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

- **Accessibility is a guard, not a hand check.** `scripts/check-a11y.mjs` (in `scripts/ci-container-smoke.sh`) runs axe-core
  (WCAG 2.1 AA: contrast, names, labels, landmarks) through [`@krizaka/a11y-audit`](https://www.npmjs.com/package/@krizaka/a11y-audit) —
  never `axe-core` itself — on every sitemap page, dark and light, phone and desktop. `a11y-baseline.json` counts the violations
  per rule: a new one fails, the count only goes down (`node scripts/check-a11y.mjs --a11y-update` after a fix). Serious and
  critical findings are fixed, never recorded (`tests/a11y-guard.test.mjs`).

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
- **Ratchet**: `krizaka-sg-ratchet` (the bin of `@krizaka/config`, no copy here) counts the violations per rule and refuses any increase against
  `sg-ratchet.json` (same idea as `krizaka-ratchet` / `lint-ratchet.json`: the debt only goes down). Fixed some? Lock the gain with
  `npm run sg:ratchet:update` (it never raises a count and records a new rule at its current count). A new rule is
  added with its test in `rule-tests/` and its baseline in the same pull request. The rules of the `core` and `web` sets come from `@krizaka/config` (`sgconfig.yml` `ruleDirs`); only the site's own rules live in `rules/`.
- **Codemods**: `npm run sg:fix` applies the `fix:` of the rules (`ast-grep scan --update-all`) and adds the date-fns import;
  behaviour is identical — run `npm run lint && npm test` after, and land the result in a small pull request.
- A rule is never silenced to get a PR green; fix the code, or (a business parameter that is a technical fact) justify it with `// @fixed:`.

- **A bug means a missing guard** ([standard](https://github.com/krizaka/.github/blob/main/docs/standards/bug-means-missing-guard.md)): the fix PR first adds a guard that fails on `main`, then fixes the bug; the bug issue says why the guards missed it.

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

## Before you open or update a pull request (coding agents)

These are the defects code review found most often on 2026-10-23. Check them yourself before you open or update a pull request:
1. **Checks:** run the repository's full check (lint, typecheck, tests, build) and fix it. Never push a red check.
2. **Concurrency:** any « count then insert » or « check then write » runs in one transaction with a lock, and has a concurrency test.
3. **One gate:** a rule (limit, permission, validation) is enforced in the service, so no route can skip it. Test every route.
4. **Errors:** a cleanup (ROLLBACK, DROP, close) never masks the original error. Rethrow it, or throw an `AggregateError` with the original first.
5. **Validation:** validate the original input, never a truncated or pre-trimmed copy. Server and client reject the same inputs.
6. **Accessibility:**
   - every control has a unique label, and FR/EN pairs say their language;
   - focus rings are never clipped by `overflow`;
   - text never overflows its box at 360 px.
7. **Naming:** environment variables follow `<CONTEXT>_<THING>` (`APP_`, `DATABASE_`, `AUTH_`, `MEDIA_`, `MAIL_`, `PAYMENTS_`, `AI_`…) and are declared once.
8. **Words:** every user-facing string is in the FR and EN messages, and no colour is hard-coded.
9. **Review threads:** answer every one. Fix it test-first, or reply with the reason, then resolve it.

**Repository layout:** the root follows [krizaka/.github `docs/standards/repo-layout.md`](https://github.com/krizaka/.github/blob/main/docs/standards/repo-layout.md); the CI guard `check-repo-layout` fails on a stray root file, and a justified extra is declared in `.repo-layout.json` with its why.

## 9. Anti-slop (ADR-015)

What a model tends to write and the code does not need. Each line points at the rule that refuses it
([ADR-015](https://github.com/krizaka/.github/blob/main/docs/adr/ADR-015-ai-code-audit-measured-and-enforced.md), [docs/standards/guards.md](https://github.com/krizaka/.github/blob/main/docs/standards/guards.md)).

1. **No defensive null on `@NullMarked` code.** No `Objects.requireNonNull` or `if (x == null)` on a value the type already
   guarantees. Enforced by NullAway at compile time; a new package is `@NullMarked` (ArchUnit).
2. **A closed set is a type.** An enum, a sealed interface or an `as const` object, never a string compared by hand;
   strategies are a `Map<Kind, Strategy>` built once at startup. Enforced by PMD / ArchUnit (Java) and `no-enum-string-compare` (ast-grep).
3. **HTTP in Java is a DTO record, `@Valid` and `ProblemDetail`.** No `Map.of("error", …)`, no entity in a response, one
   `@RestControllerAdvice` per service. Enforced by ArchUnit.
4. **No `*Utils`, `*Helper` or `*Manager`.** Name the thing by what it does (§4). Enforced by ArchUnit (ADR-015 §5).
5. **`?.` and `??` in TypeScript**, not a chain of `&&` or a ternary on null. The target rules are `@typescript-eslint/prefer-optional-chain` and `prefer-nullish-coalescing`; they are not in `@krizaka/config` yet.
6. **The build is the judge.** Compile, lint and test before every push; `krizaka-edit-check` runs on each edit (below) and
   NullAway and ArchUnit run at pre-push and in CI. A rule is never silenced to get green.

**The edit hook.** Every repository adds this to `.claude/settings.json`. After each `Edit` or `Write`, the one file is
checked in under 10 s: ESLint with the repository's config for TypeScript, PMD with the Krizaka rules for Java (never Maven).
A finding comes back to the agent (exit 2); a timeout is silent.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx --yes -p @krizaka/config krizaka-edit-check", "timeout": 10 }]
      }
    ]
  }
}
```

In a TypeScript repository that already depends on `@krizaka/config`, use `npx --no-install krizaka-edit-check` (no download).

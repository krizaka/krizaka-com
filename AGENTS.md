# 🥷 KRIZAKA — Site Governance (agent-neutral)

> Governance contract for **`krizaka-com`**, the public Next.js site of the company Krizaka: a lightweight
> showcase — Krizaka UI, Krizaka Java, the story, open source, and one page that points to each product's own site.
> This file is the single source of truth for how the site is built and themed.
> The product engine has its **own** contract at `products/orazaka/AGENTS.md` (the Orazaka
> workspace, [`krizaka/orazaka`](https://github.com/krizaka/orazaka), one repository per component) —
> do not mix the two.

---

## 1. What this repo is

- A **Next.js (App Router)** static-first site: the company home, `/products`, Krizaka UI and Krizaka Java
  documentation (with their code-driven visualizations), `/story`, `/open-source`, contact and legal.
- It is the **read side**. Component, version and architecture facts come from the published packages and the
  generated data — the site never hand-authors them.

## 2. What is generated, what is written

- **krizaka.com is the company's lightweight showcase.** The products have their own sites — dev.orazaka.com,
  dev.orochia.com, dev.yasakia.com (Yasakia is being renamed Yasakia; identifiers here keep "yasakia" until that rename
  lands) and dev.yororis.com. This repo carries **no product page, demo, gallery, journey, recording or documentation**
  of them: one page, `/products`, has a card per product (mark from `@krizaka/ui`, name, one neutral line, status,
  « Visit the dev site » and « Source »). Orochia's card is neutral — no adult-adjacent wording, no media.
- **Old addresses redirect.** `lib/product-redirects.ts` (read by `next.config.ts`, tested by
  `tests/product-redirects.test.mjs`): `/products/<p>(/…)` → the product's site, `/docs/orazaka/*` →
  dev.orazaka.com/docs, `/docs/orochia/*` → dev.orochia.com/docs, `/docs/yororis/*` → dev.yororis.com, the old Orazaka
  pages (`/architecture`, `/demos`, `/use-cases`…) → dev.orazaka.com — all 308, with or without the locale prefix.
  Never add a product page back: change the product's site.
- `app/data/architecture.json` and `app/data/orochia-architecture.json` are **generated** by the product repositories
  (`orazaka docs sync`, `npm run docs:generate`). **Never hand-edit** `app/data/`. They stay because Krizaka Java's
  `ModuleMap` (`buildingBlocks`) and the open-source repository lists (`lib/org-data.ts`) read them; a fact the schemas need
  and the model lacks is added to the **generator**, never to the site. `lib/architecture-model.ts` checks the shape at
  build time.
- Orazaka's packs, use cases, gallery and the synced `orazaka-content/` / `orochia-content/` docs (and their publication
  manifests) are gone from this repository.

## 2.1 Products are presented the same way

- `lib/products.ts` is the single list of the products (id, name, status, `devUrl`, `repoUrl`); `lib/nav.ts` derives the
  navigation from it. The bar (`@krizaka/ui/nav-bar`, composed in `TopNavBar`, never hand-made, no inline styles):
  the mark · **Products** (a plain link to `/products`) · Open source · Our story; right: Search ⌘K · **Docs** (the hub) ·
  GitHub · theme · language · Contact us (`primary` + `shimmer`). Under `/docs` the left group becomes a breadcrumb
  (`DocsCrumb`). Mobile: one panel (`MobilePanel`), every destination once. The footer's Products column links each
  product's own site. The ⌘K search lists these destinations and `NAV_DOCS` (Krizaka UI, Krizaka Java).
- `ProductCards` (`app/components/home/`) renders the cards on `/products` and as a section of the home; each card wears
  its brand (`@krizaka/tokens/brands/scoped.css`: `.brand-orazaka` orange, `.brand-orochia` violet → magenta,
  `.brand-yasakia` emerald → turquoise, `.brand-yororis` sand → sage; the rest of the site is Krizaka ink + blue).
  Icons come from [`@krizaka/icons`](https://www.npmjs.com/package/@krizaka/icons); marks from `@krizaka/ui`
  (`KrizakaLogo`, `OrazakaLogo`, `OrochiaLogo`, `YasakiaLogo`, `YororisLogo`, `ProductLogo`) — never a copy here.
- A product not released says so with a status chip (`status: "upcoming"` — « Soon »; `"construction"` — « In
  construction »), never beta, early access, waiting list or sign-up. No store button, no invented screenshot or figure.
- **Yororis' lexicon** is law for every message whose key contains `yororis`: `npm run lexicon` (in `npm run lint`) fails
  on the "never" column of `company/prompts-yororis.md` §2.1. The reviewed texts (`site.yororis.reviewed.*`, quoted by
  /story's Yororis chapter) are fingerprinted in `scripts/lexicon-reviewed.json`: change one only with
  `npm run lexicon -- --accept-review YYYY-MM-DD` and say so in the PR.
- The site's media (Krizaka UI's home gallery, posters) live on Bunny, never in `public/` (§5.2). The CDN manifest names
  only what is still drawn: `home/kit`, `home/kit-native`, `people/**`, and the three Orochia clips that published
  `@krizaka/ui` examples reach through `/assets/orochia/tour/` (a redirect in `lib/cdn.ts`).
- English is the default language; French is served when chosen (cookie `NEXT_LOCALE`) or opened.

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

## 2.3 Documentation — one engine (Fumadocs)

- `/docs/{ui,java}` render two Fumadocs collections (`source.config.ts`, `lib/docs-source.ts`), both written here
  (`content/docs/ui`, `content/docs/java`). The products document themselves on their sites; the **product kit** docs
  (`/docs/<product>/ui`, generated from `@krizaka/orazaka-design-system` / `@krizaka/orochia-design-system`) went with
  them — those kits are documented where the products live, and the two packages are no longer dependencies here
  (`scripts/gen-ui-docs.mjs` `PACKAGES` lists only Krizaka UI's; `lib/ui-registry.ts`, `ComponentDoc` and
  `ExamplePreview` know no kit — no `kit` parameter, no `kit-themes.css`: a kit that returns is documented where it lives).
- **The code drives `/docs/ui`.** One page per component of the **published `@krizaka/ui` registry**, generated at
  every build (virtual pages in `lib/docs-source.ts`, rendered by `ComponentDoc`): summary, platforms (Web · Mobile ·
  both), status, when to use / not, installation, every named example (web: live + code; React Native: its story's
  screenshots + code), props (web and native), accessibility, related. That content is written **in krizaka-ui**
  (`meta.ts`, `registry/examples`, the props' JSDoc) — never here: no page, demo, prop table or component is copied
  into this repository. An optional `content/docs/ui/components/<name>.mdx` adds notes to a generated page.
  `scripts/gen-ui-docs.mjs` (on `postinstall`, `dev`, `build --strict`; `lint` runs `--check`) writes the git-ignored
  `lib/ui-examples.ts` and `public/ui-examples/`. `/docs/ui` lists every component (`<ComponentCatalog />`, filtered
  by platform). A new `@krizaka/ui` arrives as a Dependabot pull request (`.github/dependabot.yml`): merge it when CI
  is green — nothing else to regenerate.
- **Krizaka UI is several packages, one catalogue.** `/docs/ui` reads the registries of `@krizaka/ui` **and
  `@krizaka/charts`** (`UI_PACKAGES` in `lib/ui-registry.ts`, `PACKAGES` in `scripts/gen-ui-docs.mjs`):
  the charts are the `charts` category, their install line and source link come from each item (`install`, `source`).
  An ECharts chart loads its engine on its own page only (dynamic import in the package).
- **The foundations are generated too.** `/docs/ui/typography` and `/docs/ui/icons` are virtual pages
  (`lib/ui-foundations.ts`, `TypographyDoc`, `IconsDoc`/`IconGallery`) laid out from the packages' data:
  `@krizaka/fonts` (`fonts`, `rules`), `@krizaka/tokens` (`typeScale`), `@krizaka/icons/glyphs` (`glyphIndex`,
  `iconGroups`, `iconGuidelines`). Their words are written in krizaka-ui; the chrome and sample sentences are messages
  (`docs.foundations.*`).
- **The site's faces are `@krizaka/fonts`**, loaded by `next/font/local` in the locale layout (preloaded, fingerprinted,
  CLS 0) and mapped to the token roles in `app/globals.css`. Never `next/font/google`, never a font file committed here.
- **The sidebar of `/docs/ui` is an information architecture, not a list** (`lib/ui-ia.ts`): Get started → Foundations →
  Components (by the job they do) → Patterns (page blocks, screen layouts) → Templates (by intent: Convince, Explain, Show,
  Act, Operate, Converse, Recover — the `purpose` and `why` of each template come from krizaka-ui's `meta.ts`) → Tooling →
  Mobile. Each group says "you come here when…" (`docs.ia` in the messages), a heading is said once, and every component
  has a reason to be there (`lib/ui-inventory.ts`): a product imports it (`lib/ui-usage.json`, a dated scan of the products'
  repositories — `npm run ui:usage`), a planned work needs it, or it is deprecated for the next major.
  `tests/docs-ia.test.mjs` fails on a component without group or reason, a repeated heading, a group without its sentence.
  The catalogue on `/docs/ui` mirrors the same structure with four filters (platform, group, status, used by) and a live,
  lazy preview on every card.
- The documentation of the components is **only** here: there is no public Storybook (krizaka-ui's is an internal test
  tool) — never link one.
- Each product's **UI section** (`/docs/<product>/ui`) is laid out like `/docs/ui` and generated from its kit's
  registry (`kitFiles`/`kitTree` in `lib/docs-source.ts`): an overview with the same catalogue (category, platform
  filter), foundations, one page per component (live example, code, props) in the product's brand. In the sidebar it
  is open, right after *Getting started*.
- Titles and descriptions of written pages: `messages/*.json` → `docs.pages.<section>.<page>`; a component page's come
  from its code (English, like its content); its chrome (headings, badges, tabs) from `docs.component.*`.

## 3. Theming — dark **and** light are first-class

- One token system: `@krizaka/tokens` through the `@krizaka/tailwind` preset (imported by `app/globals.css`) —
  dark on `:root`, light on `html.light`, toggled by `app/components/ThemeProvider.tsx` (persisted as `kz-theme`).
  `app/globals.css` only adds the site's own tokens (font, grid, sheen, transitions) and maps Fumadocs' colours to them.
- **Components use `var(--kz-*)` only.** No hard-coded hex/rgb/zinc colors, no
  Tailwind literal color utilities (`bg-zinc-900`, `text-blue-400`, …) for
  surfaces/text/borders. Semantic accents (e.g. per-phase/per-layer identity)
  may use fixed mid-tone colors that read on both themes.
- `color-scheme` is pinned to the active theme (`:root` dark / `html.light`
  light) so scrollbars, controls and third-party CSS follow it.
- Every new view must be verified in **both** themes before it is considered done.

## 4. Visualizations

- **One way to see an architecture.** `ModuleMap` (`app/components/diagrams/`) draws the generated model of Krizaka Java
  (`architecture.json` · `buildingBlocks`, from the POMs) on `/docs/java` — and only that: the Orazaka and Orochia
  models, their journeys, the interceptor pipeline, the messaging topology, sequence and state diagrams went with the
  product pages (they live on the products' sites). One band per role, chips with their version, a Dependencies /
  Runtime calls toggle (requests solid, events dashed), search, and selection that lights *uses / used by* or
  *calls / called by*. There is no other architecture drawing (no floating nodes, no graph library).
- `lib/architecture-model.ts` checks the shape of the model at build time (roles, modules, relations, the words of
  every role); a fact the map lacks is added to the **generator**, never to the site.
- The same visual language (chip, 11px radius, a rail in the group colour, `--dg-<group>` with an AA `-ink` variant) —
  2D, labels in full: a schema whose labels need zooming is not done.
- **Docs ask for the map with a fenced block** (`lib/remark-diagrams.ts`): ` ```architecture ` (`product: java`, `focus`,
  `mode` build|runtime, `owner`); in MDX: `<ArchitectureView product="java" focus="krizaka-security" mode="build" />`.
  Blocks are written in the docs themselves (`content/docs/**`). A new kind of schema is added to krizaka-ui or the
  docs engine only when a page here draws it.
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
  (`html[data-motion]`), the pointer lights the node of the signature icons and pulls `magnetic` buttons. The site only
  adds what is its own, in `app/globals.css` (« SITE MOTION ») and `org-hero.css`: no second conductor, no counter of its
  own. No animation library for new work, no permanent `requestAnimationFrame`, no canvas; docs stay almost still (a
  reading hairline), `/story` keeps its own. Missing generic primitives go to krizaka-ui, not into a copy here.
- **Every action is the @krizaka/ui `Button`** — through `ButtonLink` (`app/components/ButtonLink.tsx`, the router
  adapter) for links: `primary` for the one action a block is about, `secondary` for the others, `ghost` for quiet chips;
  the Krizaka chamfer (`shape="cut"`) on every call to action — heroes, closing calls, contact, featured cards, the bar's
  « Contact us »; `lg` on a hero or a closing call, `md` in a section. `shimmer` only on **the** main action of a page
  (with `magnetic` on a hero). No page-local button class (`.bp-btn`, `.org-btn`, `.st-btn`…).
## 4.1 The Krizaka page language — from `@krizaka/ui` blocks

- **Every page is made of the page blocks of [`@krizaka/ui`](https://www.krizaka.com/docs/ui) (category *Blocks*),
  never of a copy here.** There is no `app/components/sections` any more: a missing block or variant is added to
  krizaka-ui (meta, examples, stories, tests), released, then used here. The rule of the language: **read in five
  seconds, then go deeper on demand.**
- **Every page declares its template** — one of the page templates of `@krizaka/ui` (category *Templates* of /docs/ui:
  landing, product, how-it-works, gallery, docs-hub, docs-article, component, catalogue, longform, changelog, contact,
  legal, status, error, pricing) or `redirect` — in `lib/page-templates.ts`. `npm run lint` fails on a page missing
  from the map (`scripts/check-page-templates.mjs`). A page is rebuilt on its template's component (the /docs hub on
  `DocsHubPage`, the legal pages on `LegalPage`, the 404 on `ErrorPage`); a composition the catalogue lacks is added
  to krizaka-ui first.
- **One shell.** `Page` (`@krizaka/ui/page`) is the frame of everything: the content is at most `--kz-page-max` (72rem)
  wide between the gutters `--kz-page-gutter` (16 → 32 px); the documentation uses `--kz-page-max-docs` (88rem). The
  bar (`TopNavBar`, `.kz-site-bar`), every hero, section, the footer and Fumadocs' grid (`.kz-docs`) share those edges —
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
    native `<details>`; a grid with folds aligns its cards at the top). The pointer lifts the card and carries a light
    over it (`PointerLight`, built into `CardGrid`) — still under reduced motion.
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

- Links to the running Orochia go through `OROCHIA_APP_URL` (`lib/site.ts`), set by
  `NEXT_PUBLIC_APP_DEMO_URL` (dev today, production later; read at build time). `llms.txt` and
  `llms-full.txt` are rendered from `content/` with that URL — never hard-code the app's address.
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

- The site's media — product tours, posters, the gallery, the home backdrop, any heavy image or video — live on Bunny
  Storage (zone `krizaka-assets`) under `site/`, apart from the PR captures (`pr-assets/`):

  (the full layout of the zone is the table under « Bunny layout » below)

  `node scripts/cdn-assets.mjs upload <file-or-dir> --to <path> --env-file <path/to/.env>` (`--dry-run` to preview)
  sends each file as `<name>.<hash>.<ext>` (first 10 hex of its SHA-256 — a URL never changes content, so it is cached
  for good) and records its hash in `lib/cdn-manifest.json` — commit that file, never the media. A file already
  recorded with the same hash is skipped. `check` asks the pull zone for every recorded file; `prune` previews (and
  with `--yes` deletes) the old versions the manifest no longer names. Same credentials as §5.1, never printed.
- Code never writes a media URL: `lib/cdn.ts` turns a logical path into the CDN URL (`cdn("products/orazaka/gallery/
  tea-pour.webp")`, `video("products/orochia/tour/alex-bid")` → `{ webm, mp4, poster }`) and fails the build on a
  path the manifest does not know. The host is `NEXT_PUBLIC_MEDIA_CDN_URL` (read at build; default
  `https://krizaka-assets.b-cdn.net`); `next.config` allows it for `next/image` and redirects the old `/assets/…` URLs
  (still used by published `@krizaka/ui` examples) to their file on the CDN.
- Same-origin on purpose: the favicon (`public/favicon.svg`, the manifest and the tab), what Next.js generates (robots,
  sitemap, `llms.txt`, Open Graph metadata, `/_next/static`) and the fonts (`next/font/local`, preloaded with the page).
  `public/ui-examples/` is generated at build, git-ignored. Nothing else goes in `public/`; a file nothing references is
  deleted, not kept "just in case" — git and Bunny keep the history.

### Bunny layout — one zone, three prefixes

The storage zone `krizaka-assets` (pull zone `krizaka-assets.b-cdn.net`) holds **every media of every Krizaka repository**.
Nothing lives at its root except three folders and a `README.txt` (published by `node scripts/cdn-assets.mjs readme`).
The layout is written once, in `scripts/bunny-layout.mjs`; each script writes under **one** prefix and refuses the others.

| Prefix | Written by | Shape | Lifetime |
| --- | --- | --- | --- |
| `site/` | `scripts/cdn-assets.mjs` | `site/<area>/<product?>/<kind>/<name>.<hash>.<ext>` | immutable, named by `lib/cdn-manifest.json` |
| `maps/` | `tools/map-assets.mjs` (krizaka-ui) | `maps/v1/tiles/<region>-<YYYYMMDD>.pmtiles`, `maps/v1/fonts/<stack>/<a>-<b>.pbf` | a new extract is a new dated file |
| `pr-assets/` | `scripts/pr-assets.mjs` | `pr-assets/<repo>/<pr-or-topic>/<file>` | review evidence, kept while a PR or issue links it |

- `site/` areas: `home/` (backdrop, `kit-native/`), `products/<product>/{tour,gallery,mobile}/`, `docs/<product>/…` (media of the
  documentation pages), `people/<product>/<person>-{256,512}.webp` (the demo personas). A new area is added in `bunny-layout.mjs`
  first. Add a file with `cdn-assets upload <file|dir> --to <area/…>` — the hash is in the name, the manifest records it,
  `cdn()` / `video()` (`lib/cdn.ts`) resolve it. Never put a media in the repository, never upload by hand.
- `node scripts/cdn-assets.mjs tree` weighs the zone by folder and lists what is outside the layout (exit 1);
  `prune` (preview, then `--yes`) removes the superseded versions of `site/` — it keeps anything named by the manifest of **any**
  branch, so unmerged work is safe; `check` HEADs every recorded file on the pull zone.
- `pr-assets/` is never pruned by script: delete a whole `<repo>/<topic>/` by hand only when no PR or issue links it any more.
- The CDN caches immutable names for good; a moved or deleted path is purged from the account's dashboard (the storage key
  cannot purge).

## 5.3 Tests — no test, not done

- Every feature and every fix ships with its tests in the same pull request: a unit test (`tests/*.test.mjs`,
  `node:test`, run by `npm test`) for logic — a data module, a generator, a script, an API route's validation —, and a
  build-time check for what the site renders from data (`lib/architecture-model.ts`, `scripts/gen-ui-docs.mjs --check`
  are the pattern: a page that cannot be right does not build). A component's own tests live in krizaka-ui.
- **A fix starts with a failing test** that reproduces the bug; the fix turns it green and the test stays as the guard.
- CI (`.github/workflows/ci.yml`: lint, `npm test`, build) runs them on every pull request and must be green. A test is
  never skipped, weakened or deleted to get there.

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

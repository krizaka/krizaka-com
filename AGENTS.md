# 🥷 KRIZAKA — Site Governance (agent-neutral)

> Governance contract for **`krizaka-com`**, the public Next.js site for Krizaka
> and its flagship product Orazaka. This file is the single source of truth for
> how the site is built, themed, and kept in sync with the Orazaka engine.
> The product engine has its **own** contract at `products/orazaka/AGENTS.md` (the Orazaka
> workspace, [`krizaka/orazaka`](https://github.com/krizaka/orazaka), one repository per component) —
> do not mix the two.

---

## 1. What this repo is

- A **Next.js (App Router)** static-first site: marketing, documentation, and
  **code-driven interactive visualizations** of the Orazaka architecture.
- It is the **read side**. Architecture/doc facts come from the Orazaka source —
  the site never hand-authors them.

## 2. Content & data are generated, not hand-written

- `orazaka-content/docs/` and `app/data/architecture.json` are **synced from
  Orazaka** via `orazaka docs sync` (run from `products/orazaka`). **Never
  hand-edit** files under `orazaka-content/` or `app/data/` — change the Orazaka
  source and re-sync.
- What is **published** is gated by `lib/docs-manifest.ts` (an allow-list with
  curated title/category/order/audience/intro). Docs not in the manifest stay
  internal. Add a manifest entry to publish a synced doc — do not copy markdown
  into the repo by hand.
- The architecture schemas (module map, interceptor pipeline, messaging topology, the Orazaka
  request journey) render `app/data/architecture.json` through `lib/architecture-model.ts`, which
  checks at build time the shape they rely on; treat the JSON as read-only generated data. A fact
  the schemas need and the model lacks (a role, a flow, a binding) is added to the **generator**
  (`products/orazaka/scripts/generate-docs.mjs`), never to the site.
- The Orazaka repository map (`RepositoryMap`, architecture page `#repositories`) renders
  `repositories` from the same generated file — never hard-code a repository list in a component.
- The Orazaka packs (`/products/orazaka/packages`, the packs section of `/products/orazaka`) render `packs` from the
  same generated file (`lib/orazaka-packs.ts`, read from krizaka/orazaka-packs by the generator) — never a hand-written
  list; a bundle with `catalog.status: DRAFT` (the test pack) is never shown. A pack's words are its own translations.

## 2.1 Products are presented the same way

- `lib/nav.ts` is the single source of the navigation: the desktop bar (`TopNavBar` · `ProductsMenu`), the mobile
  panel, the footer, the ⌘K search and the home spotlights all render it. Every product exposes the same four
  entries in the same order (overview · how it works · demo · signature), each with a label and a short line
  (`site.nav.<product>.links.<id>.{label,desc}`); documentation lives under **Docs** (`NAV_DOCS`: Orazaka, CLI, Orochia,
  Krizaka UI, Krizaka Java — the one entry point of every documentation, also listed by the ⌘K search and the footer's
  Documentation column; the CLI entry is a direct link to the generated `/docs/orazaka/cli`). A product page may still link its documentation in context.
- **The bar** is `@krizaka/ui/nav-bar` (`NavBar.Root/Brand/Items/Menu/MenuLink/Link/Actions/Mobile`), composed in
  `TopNavBar` and fed by `lib/nav.ts` — never a hand-made bar, no inline styles; buttons are `@krizaka/ui/button`
  (`asChild` with Next's `Link`, Contact us `primary` + `shimmer`). Left: the mark · **Products** (the bar's only menu) ·
  Open source · Our story (`NAV_BAR_LINKS`), under NavBar's light that glides to the hovered/focused item and rests on
  the current page's (`active`). Right (`NavBar.Actions`): Search ⌘K · **Docs** (a plain link to the hub `/docs`, never
  a menu — it never covers Products) · GitHub · theme · language · Contact us. Under `/docs` the left group becomes a
  breadcrumb (Docs / <entry>, `docsSectionOf`, the most specific entry): the sets are switched from the documentation's
  own sidebar, never from a second menu. The bar tightens on scroll (NavBar `compactAfter`).
- **The Products panel** is composed inside `NavBar.Menu` (`ProductsPanel`), in two columns: on the left the products
  (mark · name, the selected one on a surface with a rail in its brand colour; the current page's product is selected
  when it opens) and "All products"; on the right the selected product's name and tagline, then its four entries as
  `NavBar.MenuLink` — `@krizaka/icons` icon, label, one short line, never truncated. Hover or focus selects a product.
  Keyboard: Radix opens it (Enter, Space, ↓), Tab/↓ enter it, Escape closes and returns the focus, Tab out closes; in the
  panel ↑/↓ (Home/End) change product, → enters its entries, ↑/↓ walk them, ← returns. NavBar's panel is capped at
  30 rem: a wider mega-panel waits for krizaka-ui ([krizaka/krizaka-ui#69](https://github.com/krizaka/krizaka-ui/issues/69)), never a CSS override here.
- **Mobile** (`MobilePanel`, inside `NavBar.Mobile`): one panel, every destination once — Products (an accordion per
  product whose entries read clearly: icon, label, short line, ≥ 44 px targets) and All products, Docs (NAV_DOCS + the
  hub), Open source, Our story, then Contact us, theme and language. It scrolls inside the viewport.
- Each product wears its brand (`@krizaka/tokens/brands/scoped.css`): `/products/orazaka*` under `.brand-orazaka`
  (orange), `/products/orochia*` under `.brand-orochia` (violet → magenta), the rest of the site Krizaka (ink + blue).
  Icons come from [`@krizaka/icons`](https://www.npmjs.com/package/@krizaka/icons); sections use `SectionBackdrop`
  (`@krizaka/ui/section-backdrop`) and the `bp-*` classes of `app/globals.css` (BRAND.md §4).
- Brand marks come from [`@krizaka/ui`](https://github.com/krizaka/krizaka-ui) on npm (`KrizakaLogo`,
  `OrazakaLogo`, `OrochiaLogo`, `ProductLogo`) — the same package the products use, never a copy in this repo.
  Never a placeholder icon. A change to a mark is made in `krizaka-ui`, released, then adopted here.
- Product recordings live in `public/assets/<product>/tour/<clip>.{webm,mp4,jpg}`, recorded on the
  real application; endpoints named by the Orochia journeys are verified against the generated
  architecture data at build time (`lib/journeys.ts`).
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
  the same ids (e.g. `site.nav.<product>.links.<id>`, `diagrams.journeys.<product>.<id>`). Long,
  structured content collections (`lib/use-cases-data.ts`) may hold
  `{ fr, en }` fields read with the locale key — never with a ternary.

## 2.3 Documentation — one engine (Fumadocs)

- `/docs/{ui,java,orazaka,orochia}` render four Fumadocs collections (`source.config.ts`, `lib/docs-source.ts`).
  Product docs stay synced and manifest-gated (§2); `content/docs/ui` and `content/docs/java` are written here; the
  `ui/` pages of a product are generated from its kit (below).
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
- **The code of each product kit drives `/docs/<product>/ui`** (the "UI" section of `/docs/orazaka` and `/docs/orochia`):
  an overview (how the kit extends Krizaka UI — its theme's layers, install, what it adds, what is deprecated, what it
  re-exports), **Foundations** (the palette resolved in both modes with the layer that sets each role, WCAG contrasts,
  Orazaka's named themes drawn live, product tokens, typography, icons, the product rules quoted from the contracts,
  React Native) and one page per component (why it exists above Krizaka UI, the primitives it is built on, deprecated →
  its replacement), generated at every build from the **published registries** of `@krizaka/orazaka-design-system` and
  `@krizaka/orochia-design-system` — the format of `@krizaka/ui`'s, plus `why`, `builtOn`, `deprecated` and
  `registry/foundations.json`. That content is written **in the kit** (`<name>.meta.ts`, `registry/examples`, JSDoc,
  `foundations.meta.ts`), never here. `scripts/gen-ui-docs.mjs` reads the three registries: the import map of the live
  examples, and `app/components/docs/kit-themes.css` (git-ignored) — each kit's theme as a scope (`.kz-kit-<product>`,
  `.kz-kit-<product>-<named theme>`) so a kit's example wears its product, in both modes, without the kit's theme ever
  reaching the rest of the site. The kits are in `transpilePackages` (they ship their examples as `.tsx`); product docs
  wear their brand (`.brand-<product>` on the docs container). `/docs/ui` links them (`<ProductKits />`).
- **Krizaka UI is several packages, one catalogue.** `/docs/ui` reads the registries of `@krizaka/ui` **and
  `@krizaka/charts`** (`UI_PACKAGES` in `lib/ui-registry.ts`, `KITS` with `part: "ui"` in `scripts/gen-ui-docs.mjs`):
  the charts are the `charts` category, their install line and source link come from each item (`install`, `source`).
  An ECharts chart loads its engine on its own page only (dynamic import in the package).
- **The foundations are generated too.** `/docs/ui/typography` and `/docs/ui/icons` are virtual pages
  (`lib/ui-foundations.ts`, `TypographyDoc`, `IconsDoc`/`IconGallery`) laid out from the packages' data:
  `@krizaka/fonts` (`fonts`, `rules`), `@krizaka/tokens` (`typeScale`), `@krizaka/icons/glyphs` (`glyphIndex`,
  `iconGroups`, `iconGuidelines`). Their words are written in krizaka-ui; the chrome and sample sentences are messages
  (`docs.foundations.*`).
- **The site's faces are `@krizaka/fonts`**, loaded by `next/font/local` in the locale layout (preloaded, fingerprinted,
  CLS 0) and mapped to the token roles in `app/globals.css`. Never `next/font/google`, never a font file committed here.
- The documentation of the components is **only** here: there is no public Storybook (krizaka-ui's is an internal test
  tool) — never link one.
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

- **One way to see an architecture, for every product.** `ModuleMap` (`app/components/diagrams/`) draws the generated
  model of Orazaka (`architecture.json`), Krizaka Java (`architecture.json` · `buildingBlocks`, from the POMs) and
  Orochia (`orochia-architecture.json` · `map`): one band per role, chips with their owner and version, a
  Dependencies / Runtime calls toggle (requests solid, events — messages, webhooks, SSE, NOTIFY, push — dashed), the
  owner filter, search, selection that lights *uses / used by* or *calls / called by*, and **Journeys**: a real request
  played step by step on the same map (the modules and links of the step lit, the rest dimmed, the numbered steps
  beside it — `lib/journeys.ts`, every module, link and endpoint checked against the model at build time). A product's
  page, its docs and `/docs/java` show the same component; there is no other architecture drawing (no floating nodes,
  no graph library).
- `lib/architecture-model.ts` checks the shape of each model at build time (roles, modules, relations, flow kinds, the
  words of every role); a fact the map lacks is added to the product's **generator**, never to the site.
- With it, the same visual language (chip, 11px radius, a rail in the group colour, `--dg-<group>` with an AA `-ink`
  variant, the domain core in the page's brand accent): `InterceptorPipeline`, `MessagingTopology`, `SequenceDiagram`
  (numbered steps by phase, participants as chips) and `StateDiagram` (one card per state, in reading order).
  2D, labels in full — a schema whose labels need zooming is not done.
- **Docs ask for a schema with a fenced block** (`lib/remark-diagrams.ts`): ` ```architecture ` (`product`, `focus`,
  `mode` build|runtime|journey, `journey`, `owner`), ` ```pipeline `, ` ```sequence ` (participants — `@module` ids are
  checked against the model — then `a -> b: …` / `a --> b: …`, `## phase`, `if … / else … / end`) and ` ```states `
  (`enum: <pg enum>` checks every state against the Orochia schema). In MDX: `<ArchitectureView product="orazaka"
  focus="krizaka-billing-service" mode="runtime" />`. Blocks are written in the source repository and synced.
- **Mermaid is retired**, with no fallback: a ` ```mermaid ` fence in a published doc fails the build. (Unpublished
  internal design notes of the product repositories may still hold some; they never reach the site — converting one is
  part of publishing it.)
- Every schema reads correctly at phone width (one column, top to bottom), works with the keyboard,
  honours `prefers-reduced-motion` (a journey never plays by itself then), and carries a **text version** (tables or
  ordered lists) of everything it draws.
- **Motion is one system — @krizaka/ui's.** `MotionObserver` (`@krizaka/ui/motion`) is mounted once in the locale
  layout: blocks arrive once with `reveal(i)` (`lib/motion.ts` → `[data-reveal]`, staggered 70 ms; `reveal(i, "soft")`
  for schemas and dense content; never on the first screen), figures climb with `NumberTicker`
  (`@krizaka/ui/number-ticker`), loops pause off screen (`data-offscreen`) and wait for the page to settle
  (`html[data-motion]`), the pointer lights the node of the signature icons and pulls `magnetic` buttons. The site only
  adds what is its own, in `app/globals.css` (« SITE MOTION ») and `org-hero.css`: no second conductor, no counter of its
  own. No animation library for new work, no permanent `requestAnimationFrame`, no canvas; docs stay almost still (a
  reading hairline), `/story` keeps its own. Missing generic primitives go to krizaka-ui, not into a copy here.
- **Every action is the @krizaka/ui `Button`** — through `ButtonLink` (`app/components/sections`) for links: `primary`
  for the one action a block is about, `secondary` for the others, `ghost` for quiet chips; the Krizaka chamfer
  (`shape="cut"`) everywhere; `lg` on a hero or a closing call, `md` in a section. `shimmer` + `magnetic` only on a
  hero's main action. No page-local button class (`.bp-btn`, `.org-btn`, `.st-btn`…).
- **Product heroes are `IsoHub`** (`@krizaka/ui/iso`), driven by data — Orazaka's stack under its dome, Orochia's
  creator with the four ways fans pay converging on her; names and labels in `messages/*.json`, the light from the
  brand (`.brand-orazaka` / `.brand-orochia`). Never an isometric drawing of the site's own.

## 4.1 The Krizaka page language

- A page that **argues** (a product, a block, a decision, a promise) is built from `app/components/sections`
  (`import { … } from "@/app/components/sections"`, styles in `sections.css`, classes `ps-*`), first used by
  `/open-source` and `/open-source/<block>`. The rule of the language: **read in five seconds, then go deeper on demand.**
  - `PageHero` — sub-page first screen: back link, eyebrow, h1, lead, facts under it (`Badges`), the page's bird.
    Painted at once, no reveal.
  - `SectionHeading` (eyebrow · h2 · lead) and `ContentSection` (a hairline above = the transition, an h2, content).
    The section a page is about stands on a `SectionBackdrop` (BRAND.md §4).
  - `CardGrid` + `ArgumentCard` — cards that argue, **compact by default** (about a third of a full card): icon · name ·
    mono meta, the bird **small in the corner** (whose rule it is), the **hook in one line** (≤ 90 characters, regular
    weight — never three bold lines), compact `Badges` (registry and version `ok`, work in progress `wip` — said
    honestly, linked to where it is explained), then the foot: **one short primary action** on one line (« Details → »)
    and, discreet, `ActionLinks variant="icons"`. What it does, the bird's quote and the long version are **never on
    the face of a card**: they live on the detail page (`more`, e.g. `/open-source/<block>`) or, without one, in the card
    unfolded in place (`expand`, a native `<details>`; a grid with folds aligns its cards at the top so opening one
    never stretches its neighbours). The pointer lifts the card, carries a light over it (`PointerLight`) and lights
    its icon's node — still under reduced motion. A list (one row per subject) was evaluated against it on
    /open-source: denser, but it loses each subject's hue, bird and actions; the compact card stays the reference.
  - **Versions are data.** Every version the site shows (badges, the Maven list, the module map, code samples) is
    read from npm and Maven Central at build (`scripts/gen-registry-versions.mjs` → git-ignored
    `lib/registry-versions.json`, read by `lib/registry-versions.ts`): never a version typed in a module or a message.
  - **Hues**: a card or a page about one subject wears `data-hue` (`cobalt · sky · cyan · indigo · steel · ink`,
    sections.css): its rail, icon node, bird, light and numbers. Krizaka palette only (blues and ink, never a product
    colour); `--ps-hue` is decorative (≥ 3:1), `--ps-hue-text` is for small text (≥ 4.5:1, both themes). Without a
    hue everything falls back to the page's accent, so a brand page stays on brand.
  - `MascotRule` — a rule told by a bird, as a quote: a speech bubble (opening quote mark, the hue), the bird and who
    speaks under its tail; `inline` in an unfolded card or a detail page, `callout` in a section (larger, alive) — at
    most one rule put forward per section.
    The bird carries a promise, never decoration: the falcon watches (security), the owl reads and knows every face
    (documents, identity), the duck builds (code), the flamingo answers or gets paid, the pigeon delivers. Birds from
    `@krizaka/ui/mascots` only; on one page no two subjects wear the same bird in the same mood and hue (five birds
    for six blocks: the owl appears twice on /open-source, in two moods and two hues).
  - `Inline` — words between backticks in a message (`` `requestId` ``) render as inline code: the technical keyword
    stands out without markup in the catalogue. Prefer three short points to a paragraph.
  - `DecisionList` — one card per decision: the choice large (✓), then refused (✕) · because (→) · what it costs (!)
    side by side, each with its colour. `CodeSample` — language, file name, server-side highlighting
    (`highlight.tsx`, token colours only), code that scrolls, copy; `CodeTabs` (@krizaka/ui/tabs) when there are
    several ways to write it (Maven · Gradle). `PageToc` — a reading page's table of contents, sticky beside the
    content (chips that scroll on a phone), the section being read marked.
  - `ActionLinks` (`buttons` | `icons`) and `DiscussionCta` — discuss · propose · report, where to talk back.
- Words come from `messages/*.json`; data modules keep links, code, birds and hues. The first section under a `PageHero`
  is on a phone's first screen: no `reveal` there (LCP). Anything generic enough for a product goes to krizaka-ui
  (krizaka/krizaka-ui#63), not here.

## 5. Code conventions

- TypeScript, App Router. UI in `app/components/`, logic/data access in `lib/`.
- Server Components by default; add `"use client"` only when needed (state,
  effects, WebGL, browser APIs).
- Prefer static generation; keep client bundles lean: schemas receive the slice of generated data
  they draw as props from a server component, never the whole JSON.
- i18n via `app/components/I18nProvider` where text is user-facing.

- Links to the running Orochia go through `OROCHIA_APP_URL` (`lib/site.ts`), set by
  `NEXT_PUBLIC_OROCHIA_APP_URL` (dev today, production later; read at build time). `llms.txt` and
  `llms-full.txt` are rendered from `content/` with that URL — never hard-code the app's address.
- The contact form posts to `app/api/contact` (validation in `lib/contact.ts`). Delivery is
  configured by environment and fails closed (503) when nothing is set:
  `MAILGUN_API_KEY` + `MAILGUN_DOMAIN` + `CONTACT_TO_EMAIL` (+ `MAILGUN_API_URL`, `CONTACT_FROM_EMAIL`)
  and/or `CONTACT_WEBHOOK_URL`. Template: `.env.example`.

## 5.1 PR captures — never committed

- Screenshots, recordings and metrics of a PR (before/after, Lighthouse…) are **never committed**, in
  any `krizaka` repository, nor pushed to a `pr-assets/*` branch. They go to Bunny Storage under
  `pr-assets/<repo>/<pr-or-topic>/` and the PR body links their CDN URLs:

  ```bash
  node scripts/pr-assets.mjs upload <dir> --repo <repo> --key <pr-or-topic> --env-file <path/to/.env>  # --dry-run to preview
  ```

  It prints each CDN URL and a Markdown block to paste in the PR. Credentials come from the
  environment or `--env-file`: `BUNNY_STORAGE_API_KEY`, `BUNNY_STORAGE_ZONE`,
  `BUNNY_STORAGE_ENDPOINT` (default `storage.bunnycdn.com`), `BUNNY_PULL_ZONE_HOSTNAME` — never
  printed, never committed. The upload fails if the pull zone does not serve the first file publicly.
- `node scripts/pr-assets.mjs rewrite <file> --repo <repo> [--write]` turns links to a committed
  `docs/screenshots/<key>/…` folder into the CDN URLs of the same key (migration of old PR bodies).
- `docs/screenshots/`, `.github/pr-assets/` and `.github/screenshots/` are git-ignored (the old committed captures
  were moved to Bunny with their PR bodies rewritten); keep captures in a scratch folder.

## 6. Definition of done

1. `npm run build` is green and the route is statically generated.
2. `npm run lint` is clean.
3. The change reads correctly in **dark and light** mode.
4. No hand-edited generated content; no hard-coded colors.

*Agent-neutral contract for `krizaka-com`. The Orazaka engine contract lives at
`products/orazaka/AGENTS.md`.*

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

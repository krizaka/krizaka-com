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
- The 3D architecture scene renders `app/data/architecture.json`; treat it as
  read-only generated data.
- The Orazaka repository map (`RepositoryMap`, architecture page `#repositories`) renders
  `repositories` from the same generated file — never hard-code a repository list in a component.

## 2.1 Products are presented the same way

- `lib/nav.ts` is the single source of the product navigation: the desktop mega-menu, the mobile
  panel, the footer and the home spotlights all render it. Every product exposes the same five
  entries in the same order (overview · how it works · demo · documentation · signature).
- Brand marks come from [`@krizaka/ui`](https://github.com/krizaka/krizaka-ui) on npm (`KrizakaLogo`,
  `OrazakaLogo`, `OrochiaLogo`, `ProductLogo`) — the same package the products use, never a copy in this repo.
  Never a placeholder icon. A change to a mark is made in `krizaka-ui`, released, then adopted here.
- Product recordings live in `public/assets/<product>/tour/<clip>.{webm,mp4,jpg}`, recorded on the
  real application; endpoints named by the Orochia journeys are verified against the generated
  architecture data at build time (`lib/orochia-journeys.ts`).
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
  the same ids (e.g. `site.nav.<product>.links.<id>`, `site.orochia.arch.journeys.<id>`). Long,
  structured content collections (`lib/use-cases-data.ts`, `lib/packages-data.ts`) may hold
  `{ fr, en }` fields read with the locale key — never with a ternary.

## 2.3 Documentation — one engine (Fumadocs)

- `/docs/{ui,java,orazaka,orochia}` render four Fumadocs collections (`source.config.ts`, `lib/docs-source.ts`).
  Product docs stay synced and manifest-gated (§2); `content/docs/ui` and `content/docs/java` are written here.
- UI pages render the primitives **from the published `@krizaka/ui` registry** (`ComponentPreview`, `PropsTable`):
  never copy a demo, a prop table or a component into this repository. `npm run docs:ui` regenerates `lib/ui-demos.ts`
  and scaffolds missing pages (an existing page is never overwritten).
- Titles and descriptions of written pages: `messages/*.json` → `docs.pages.<section>.<page>`.

## 3. Theming — dark **and** light are first-class

- One token system: `@krizaka/tokens` through the `@krizaka/tailwind` preset (imported by `app/globals.css`) —
  dark on `:root`, light on `html.light`, toggled by `app/components/ThemeProvider.tsx` (persisted as `kz-theme`).
  `app/globals.css` only adds the site's own tokens (font, grid, sheen, transitions) and maps Fumadocs' colours to them.
- **Components use `var(--kz-*)` only.** No hard-coded hex/rgb/zinc colors, no
  Tailwind literal color utilities (`bg-zinc-900`, `text-blue-400`, …) for
  surfaces/text/borders. Semantic accents (e.g. per-phase/per-layer identity)
  may use fixed mid-tone colors that read on both themes.
- `color-scheme` is pinned to the active theme (`:root` dark / `html.light`
  light) so scrollbars, controls and third-party CSS (React Flow) follow it.
- Every new view must be verified in **both** themes before it is considered done.

## 4. Visualizations

- 3D scenes load client-only: `dynamic(() => import(...), { ssr: false })` with a
  themed loading fallback (WebGL has no SSR).
- All schemas are **theme-aware** and **reduced-motion safe**
  (`prefers-reduced-motion` disables idle/entrance motion), keyed off
  `--kz-accent`. Keep the visual language homogeneous across the site
  (ArchitectureScene3D · InterceptorMesh/HexNode · PipelineMesh).
- Mermaid is a **print/fallback only** — main schemas are the interactive
  components.

## 5. Code conventions

- TypeScript, App Router. UI in `app/components/`, logic/data access in `lib/`.
- Server Components by default; add `"use client"` only when needed (state,
  effects, WebGL, browser APIs).
- Prefer static generation; keep client bundles lean (the 3D libs are the only
  heavy deps and are code-split behind `ssr: false`).
- i18n via `app/components/I18nProvider` where text is user-facing.

- Links to the running Orochia go through `OROCHIA_APP_URL` (`lib/site.ts`), set by
  `NEXT_PUBLIC_OROCHIA_APP_URL` (dev today, production later; read at build time). `llms.txt` and
  `llms-full.txt` are rendered from `content/` with that URL — never hard-code the app's address.
- The contact form posts to `app/api/contact` (validation in `lib/contact.ts`). Delivery is
  configured by environment and fails closed (503) when nothing is set:
  `MAILGUN_API_KEY` + `MAILGUN_DOMAIN` + `CONTACT_TO_EMAIL` (+ `MAILGUN_API_URL`, `CONTACT_FROM_EMAIL`)
  and/or `CONTACT_WEBHOOK_URL`. Template: `.env.example`.

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

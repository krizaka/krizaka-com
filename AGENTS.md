# 🥷 KRIZAKA — Site Governance (agent-neutral)

> Governance contract for **`krizaka-com`**, the public Next.js site for Krizaka
> and its flagship product Orazaka. This file is the single source of truth for
> how the site is built, themed, and kept in sync with the Orazaka engine.
> The product engine has its **own** contract at `products/orazaka/AGENTS.md` —
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

## 3. Theming — dark **and** light are first-class

- One token system in `app/globals.css`: dark on `:root`, light on `html.light`,
  toggled by `app/components/ThemeProvider.tsx` (persisted as `kz-theme`).
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

## 6. Definition of done

1. `npm run build` is green and the route is statically generated.
2. `npm run lint` is clean.
3. The change reads correctly in **dark and light** mode.
4. No hand-edited generated content; no hard-coded colors.

*Agent-neutral contract for `krizaka-com`. The Orazaka engine contract lives at
`products/orazaka/AGENTS.md`.*

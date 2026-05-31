<p align="center">
  <img src="public/krizaka.svg" alt="KRIZAKA" width="96" height="96" />
</p>

<h1 align="center">krizaka-com</h1>

<p align="center"><strong>Public Next.js site for Krizaka &amp; its flagship engine Orazaka.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-blueviolet?style=flat-square" alt="Next.js 16" />
  <a href="https://github.com/krizaka/orazaka"><img src="https://img.shields.io/badge/Engine-Orazaka-blue?style=flat-square" alt="Orazaka" /></a>
  <img src="https://img.shields.io/badge/Loi%2025%20%2F%20GDPR-success?style=flat-square" alt="Compliance" />
</p>

---

Static-first marketing + documentation site (Next.js App Router, React 19, TypeScript).
The **read side**: architecture/doc facts are generated from the Orazaka engine, never
hand-authored here. Governance contract: [`AGENTS.md`](AGENTS.md).

## Stack

Next.js 16 (App Router, SSG) · React 19 · TypeScript · Tailwind v4 + a `var(--kz-*)`
token system · React Three Fiber/Three.js (3D) · `@xyflow/react` (pipeline graphs) ·
`next-mdx-remote` (docs) · `framer-motion`.

## Where things live

| Path | Role |
|---|---|
| `app/[locale]/` | All routes; `[locale]` is `fr` (Québec) or `en`. `layout.tsx` wires fonts, theme, i18n, the sitewide JSON-LD graph and base metadata. |
| `app/components/` | UI. Big ones: `TopNavBar`, `EngineShowcaseSection`, `ArchitectureScene3D` (3D), `Mermaid`, `MdxComponents`, `DemosGallery`. |
| `app/robots.ts` · `app/sitemap.ts` · `app/manifest.ts` | SEO route handlers. |
| `app/data/architecture.json` | **Generated** 3D module graph (read-only). |
| `proxy.ts` | Edge middleware (Next 16 name): no-locale URL → `/fr` or `/en` by `Accept-Language`, sticky `NEXT_LOCALE` cookie. |
| `next.config.ts` | Security headers, AVIF/WebP, cache policy. |
| `lib/seo.ts` | `localizedMetadata()` + `buildAlternates()` — per-page title/description/canonical/hreflang. |
| `lib/structured-data.ts` | JSON-LD `@graph` builders (Organization · WebSite · SoftwareApplication, Breadcrumb, FAQ). |
| `lib/site.ts` | External identity (SITE_URL, GitHub, version) — single source. |
| `lib/i18n.ts` | Translation dictionary (large; FR/EN). |
| `lib/docs.ts` · `lib/docs-manifest.ts` | Reads `orazaka-content/docs`, gated by the publish allow-list. |
| `lib/{use-cases,packages,architecture-mesh,pipeline-mesh}-data.ts` | Page/visualization data. |
| `orazaka-content/docs/` | **Synced** markdown from Orazaka (read-only). |

## Content sync (read-only data)

```
products/orazaka  ──  orazaka docs sync  ──▶  orazaka-content/docs/   (markdown)
                                          └▶  app/data/architecture.json (3D model)
```

Never hand-edit `orazaka-content/` or `app/data/`. To publish a synced doc, add an entry
to [`lib/docs-manifest.ts`](lib/docs-manifest.ts) (curated title/category/order/audience).

## Conventions

- **SEO**: every page sets `alternates`/title/description via `localizedMetadata(locale, { path, en, fr })` from `lib/seo`. The bare `/` and any unprefixed path 307-redirect (via `proxy.ts`), so canonicals are always the localized self URL.
- **Theming**: `var(--kz-*)` tokens only — dark on `:root`, light on `html.light`, persisted as `kz-theme`. **Verify every new view in both themes.** No hard-coded hex / Tailwind color literals for surfaces.
- **Reduced motion**: honor `prefers-reduced-motion` (disable 3D orbits, entrance animations).
- **3D scenes**: client-only — `dynamic(() => import(...), { ssr: false })` with a themed fallback.

## ⚠️ Gotcha: the unlayered CSS reset

`app/globals.css` has an **unlayered** `* { margin: 0; padding: 0 }` reset that overrides
Tailwind's *layered* spacing utilities (`mx-auto`, `px-*`, `pt-*` silently do nothing for
layout). That's why inner pages use **inline `style`** for container width/padding. Use
inline styles (or non-spacing classes) for page layout until the reset is moved into a
`@layer`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000  (→ redirects to /fr or /en)
npm run lint
npm run build    # SSG build — run before pushing
npm run start
```

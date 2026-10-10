<p align="center">
  <img src="public/krizaka.svg" alt="KRIZAKA" width="96" height="96" />
</p>

<h1 align="center">krizaka-com</h1>

<p align="center"><strong>Public Next.js site for Krizaka &amp; its flagship products Orazaka &amp; Orochia.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-blueviolet?style=flat-square" alt="Next.js 16" />
  <a href="https://github.com/krizaka/orazaka"><img src="https://img.shields.io/badge/AI_Engine-Orazaka-blue?style=flat-square" alt="Orazaka" /></a>
  <a href="https://github.com/krizaka/orochia"><img src="https://img.shields.io/badge/Streaming-Orochia-magenta?style=flat-square" alt="Orochia" /></a>
  <a href="https://github.com/krizaka"><img src="https://img.shields.io/badge/GitHub_Org-krizaka-informational?style=flat-square" alt="Krizaka Organization" /></a>
  <img src="https://img.shields.io/badge/Loi%2025%20%2F%20GDPR%20%2F%202257-success?style=flat-square" alt="Compliance" />
</p>

---

Static-first marketing + documentation site (Next.js App Router, React 19, TypeScript).
The **read side**: architecture/doc facts are generated from the Orazaka engine, never
hand-authored here. Governance contract: [`AGENTS.md`](AGENTS.md).

## Stack

Next.js 16 (App Router, SSG) · React 19 · TypeScript · Tailwind v4 with the Krizaka preset
([`@krizaka/tailwind`](https://www.npmjs.com/package/@krizaka/tailwind): the `--kz-*` tokens of `@krizaka/tokens`) ·
[`@krizaka/ui`](https://www.npmjs.com/package/@krizaka/ui) · Fumadocs (docs) · React Three Fiber/Three.js (3D) ·
`@xyflow/react` (pipeline graphs) · `framer-motion`.

## Where things live

| Path | Role |
|---|---|
| `app/[locale]/` | All routes; `[locale]` is `fr` (Québec) or `en`. `layout.tsx` wires fonts, theme, i18n, the sitewide JSON-LD graph and base metadata. |
| `app/components/` | UI. Big ones: `TopNavBar`, `EngineShowcaseSection`, `ArchitectureScene3D` (3D), `Mermaid`, `MdxComponents`, `DemosGallery`. |
| `app/robots.ts` · `app/sitemap.ts` · `app/manifest.ts` | SEO route handlers. |
| `app/data/architecture.json` | **Generated** module graph + Orazaka repository map (read-only). |
| `proxy.ts` | Edge middleware (Next 16 name): no-locale URL → `/fr` or `/en` by `Accept-Language`, sticky `NEXT_LOCALE` cookie. |
| `next.config.ts` | Security headers, AVIF/WebP, cache policy. |
| `lib/seo.ts` | `localizedMetadata()` + `buildAlternates()` — per-page title/description/canonical/hreflang. |
| `lib/structured-data.ts` | JSON-LD `@graph` builders (Organization · WebSite · SoftwareApplication, Breadcrumb, FAQ). |
| `lib/site.ts` | External identity (SITE_URL, GitHub, version) — single source. |
| `lib/i18n.ts` | Binds [`@krizaka/i18n`](https://www.npmjs.com/package/@krizaka/i18n) to `messages/en.json` + `messages/fr.json` (`getDictionary`, `asLocale`, `format`). |
| `app/[locale]/docs/` | The documentation (Fumadocs): hub, then `[section]` = `ui`, `java`, `orazaka`, `orochia`. |
| `source.config.ts` · `lib/docs-source.ts` | The four Fumadocs collections and their loaders, sidebars, titles (messages or manifest). |
| `content/docs/ui/` · `content/docs/java/` | Written docs (MDX). `content/docs/ui/components/<name>.mdx` are scaffolded by `npm run docs:ui`. |
| `app/components/docs/` | MDX components: `ComponentPreview`, `PropsTable`, `StoryFrame`, `EventSchema`, `ComingSoon`. |
| `lib/docs-manifest.ts` · `lib/orochia-docs-manifest.ts` | Publication allow-lists of the synced product docs (only listed files are even compiled). |
| `lib/{use-cases,packages,architecture-mesh,pipeline-mesh}-data.ts` | Page/visualization data. |
| `orazaka-content/docs/` | **Synced** markdown from Orazaka (read-only). |

## Content sync (read-only data)

```
products/orazaka (workspace)  ──  orazaka docs sync  ──▶  orazaka-content/docs/   (markdown)
                                                      └▶  app/data/architecture.json (3D model + repository map)
```

`products/orazaka` is a local clone of the **Orazaka workspace** ([`krizaka/orazaka`](https://github.com/krizaka/orazaka))
with every component repository cloned inside it (`node scripts/workspace.mjs clone`). It is ignored
by this repository's git.

## Orazaka repositories

Orazaka is published as **one repository per component** in the [krizaka](https://github.com/krizaka)
organisation; the site renders the list from the generated `architecture.json`
(`/products/orazaka/architecture#repositories`).

| Layer | Repositories |
|---|---|
| Workspace | [orazaka](https://github.com/krizaka/orazaka) — governance, manifest, infra, e2e, docs |
| Foundation | [orazaka-build](https://github.com/krizaka/orazaka-build) · [orazaka-contracts](https://github.com/krizaka/orazaka-contracts) · [orazaka-edge](https://github.com/krizaka/orazaka-edge) · [orazaka-ui-kit](https://github.com/krizaka/orazaka-ui-kit) |
| Domain services | [orazaka-users](https://github.com/krizaka/orazaka-users) · [orazaka-notifications](https://github.com/krizaka/orazaka-notifications) · [orazaka-billing](https://github.com/krizaka/orazaka-billing) |
| AI engine | [orazaka-ai-engine](https://github.com/krizaka/orazaka-ai-engine) · [orazaka-studio](https://github.com/krizaka/orazaka-studio) · [orazaka-conversation-service](https://github.com/krizaka/orazaka-conversation-service) · [orazaka-job-service](https://github.com/krizaka/orazaka-job-service) · [orazaka-knowledge-service](https://github.com/krizaka/orazaka-knowledge-service) · [orazaka-automation-service](https://github.com/krizaka/orazaka-automation-service) · [orazaka-worker-media](https://github.com/krizaka/orazaka-worker-media) |
| Apps & content | [orazaka-web-client](https://github.com/krizaka/orazaka-web-client) · [orazaka-web-admin](https://github.com/krizaka/orazaka-web-admin) · [orazaka-mobile-client](https://github.com/krizaka/orazaka-mobile-client) · [orazaka-cli](https://github.com/krizaka/orazaka-cli) · [orazaka-packs](https://github.com/krizaka/orazaka-packs) |

## Orochia repositories

Orochia is published as a dedicated 3-tier creator & streaming platform in the [krizaka](https://github.com/krizaka) organisation; the architecture is code-generated in `app/data/orochia-architecture.json` and presented at `/products/orochia`.

| Layer / App | Repository | Port | Description |
|---|---|---|---|
| Consumer Web | [orochia](https://github.com/krizaka/orochia) | `3000` | 4K HLS player, direct Bunny Tus ingest, PostgreSQL scrypt auth, paywalls |
| Control Plane | [orochia-admin](https://github.com/krizaka/orochia-admin) | `3001` | 18 U.S.C. § 2257 federal compliance vault, instant CDN purge, treasury rake |
| Design System | [orochia-design-system](https://github.com/krizaka/orochia-design-system) | `3002` | Obsidian Velvet Noir tokens, interactive components & live showcase |

Never hand-edit `orazaka-content/` or `app/data/`. To publish a synced doc, add an entry
to [`lib/docs-manifest.ts`](lib/docs-manifest.ts) (curated title/category/order/audience).

## Conventions

- **SEO**: every page sets `alternates`/title/description via `localizedMetadata(locale, { path, en, fr })` from `lib/seo`. The bare `/` and any unprefixed path 307-redirect (via `proxy.ts`), so canonicals are always the localized self URL.
- **Theming**: `var(--kz-*)` tokens only — dark on `:root`, light on `html.light`, persisted as `kz-theme`. **Verify every new view in both themes.** No hard-coded hex / Tailwind color literals for surfaces.
- **Reduced motion**: honor `prefers-reduced-motion` (disable 3D orbits, entrance animations).
- **3D scenes**: client-only — `dynamic(() => import(...), { ssr: false })` with a themed fallback.

## Documentation (`/docs`)

One engine, [Fumadocs](https://fumadocs.dev), for four sets: **Krizaka UI** (`content/docs/ui`), **Krizaka Java**
(`content/docs/java`), and the synced **Orazaka** / **Orochia** docs (`orazaka-content/docs`, `orochia-content/docs`,
gated by their manifests). The old article URLs (`/products/orazaka/<category>/<slug>`,
`/products/orochia/docs/<slug>`) answer **301** to `/docs/<product>/<slug>`; the product overview pages stay where
they were.

- **Components, driven by their code** — every component of the installed `@krizaka/ui` has a page, generated at
  each build from its registry (`lib/docs-source.ts` adds one virtual page per component; `ComponentDoc` renders it):
  what it is, Web / Mobile / both, stable or beta, when to use it and when not, installation (web and React Native),
  each named example — live with its code on the web, the screenshot of its story and its code for React Native —
  the props of its web and native components, its accessibility and the related components. All of it is written in
  [krizaka-ui](https://github.com/krizaka/krizaka-ui) (`meta.ts`, `registry/examples`, the props' JSDoc), so the code
  and the documentation cannot drift. `/docs/ui` is the catalogue, filtered by platform. `scripts/gen-ui-docs.mjs`
  runs on `postinstall`, `dev` and `build` (`--strict`) and writes the git-ignored `lib/ui-examples.ts` (the import
  map of the live examples) and `public/ui-examples/` (the native screenshots); `npm run lint` checks the registry is
  complete. An optional `content/docs/ui/components/<name>.mdx` adds notes to a generated page (`card.mdx`).
- **Upgrading `@krizaka/ui`** — Dependabot (`.github/dependabot.yml`, daily, `@krizaka/*`, pre-releases followed)
  opens the bump; CI regenerates every page from the new registry. Nothing else to do: merge when green. (Chosen over a
  `repository_dispatch` from krizaka-ui's release: no cross-repository token to keep, and the bump stays a reviewable
  pull request.)
- **Texts** — titles and descriptions of the written pages live in `messages/{en,fr}.json` (`docs.pages.<section>.<page>`);
  the bodies are English developer documentation, like the synced product docs. A component page's chrome is in
  `docs.component.*`; its content is the English its code carries.
- **Search** — a static index (`/api/search`, built at build time), opened with `/` (⌘K stays the site's palette).

## Layout and the CSS reset

The `* { margin: 0; padding: 0 }` reset is in `@layer base`, so Tailwind's spacing utilities work. Older pages still
set their container width and padding with inline `style`: they render correctly and were left as they are; new
views (docs) use classes.

## Contact form

`/contact`, the home page and every product page end with a contact form that posts to
`app/api/contact`. Configure at least one delivery channel through environment variables — `.env.local` in
development (copy `.env.example`), the hosting environment in production (Vercel → Settings →
Environment Variables). Without one the endpoint answers `503` instead of pretending:

| Variable | Purpose |
| :--- | :--- |
| `MAILGUN_API_KEY` | private API key ([Mailgun](https://documentation.mailgun.com) → API Security); sent as Basic auth `api:<key>` |
| `MAILGUN_DOMAIN` | sending domain verified in Mailgun (`mg.krizaka.com`) |
| `MAILGUN_API_URL` | optional, `https://api.mailgun.net` by default; `https://api.eu.mailgun.net` for an EU-region domain |
| `CONTACT_TO_EMAIL` | where the messages land (comma-separated recipients) |
| `CONTACT_FROM_EMAIL` | optional sender, on `MAILGUN_DOMAIN` (default `Krizaka <contact@<MAILGUN_DOMAIN>>`) |
| `CONTACT_WEBHOOK_URL` | optional JSON POST to Slack, Discord or any relay (`text`, `content` and structured `contact` fields) |

The e-mail goes out via `POST {MAILGUN_API_URL}/v3/{MAILGUN_DOMAIN}/messages` (`lib/contact.ts`)
with `Reply-To` set to the visitor, so answering the e-mail answers them. A Mailgun refusal is
logged (`contact: mailgun refused (…)`) and the visitor gets a `502`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000  (→ redirects to /fr or /en)
npm run lint     # ESLint + messages + every @krizaka/ui primitive has a docs page
npm test         # node:test — tests/*.test.mjs
npm run docs:ui  # after a @krizaka/ui upgrade: demo map + scaffolds of the new primitives
npm run build    # SSG build — run before pushing
npm run start
```

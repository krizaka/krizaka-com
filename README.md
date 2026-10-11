<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka-dark.svg">
    <img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka-light.svg" alt="Krizaka" width="96">
  </picture>
</p>

<h1 align="center">krizaka-com</h1>

<p align="center"><strong>Public Next.js site for Krizaka &amp; its flagship products Orazaka &amp; Orochia.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-blueviolet?style=flat-square" alt="Next.js 16" />
  <a href="https://github.com/krizaka/orazaka"><img src="https://img.shields.io/badge/AI_Engine-Orazaka-f67e23?style=flat-square" alt="Orazaka" /></a>
  <a href="https://github.com/krizaka/orochia"><img src="https://img.shields.io/badge/Streaming-Orochia-7c3aed?style=flat-square" alt="Orochia" /></a>
  <a href="https://github.com/krizaka"><img src="https://img.shields.io/badge/GitHub_Org-krizaka-196df5?style=flat-square" alt="Krizaka Organization" /></a>
  <img src="https://img.shields.io/badge/Loi%2025%20%2F%20GDPR%20%2F%202257-success?style=flat-square" alt="Compliance" />
</p>

<p align="center">
  <a href="https://www.krizaka.com">Website</a> · <a href="https://www.krizaka.com/docs">Docs</a> · <a href="https://www.krizaka.com/en/products">Products</a> · <a href="https://www.krizaka.com/en/open-source">Open source</a>
</p>

<table>
<tr>
<td width="50%" valign="top"><a href="https://www.krizaka.com/en/products/orazaka/demos"><img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/orazaka-tour.gif" alt="Orazaka's web client, signed in as Eric: a customer's return request answered from his own returns policy, then a product photo generated locally"></a></td>
<td width="50%" valign="top"><a href="https://www.krizaka.com/en/products/orochia/demos"><img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/orochia-tour.gif" alt="Orochia, signed in as Alex: Elena's story opened from the ring on her profile, sound on, a like, a private reply and a $10 tip"></a></td>
</tr>
<tr>
<td align="center"><sub>Orazaka — Eric answers a customer from his own documents, then generates the product photo. Everything ran on one Mac.</sub></td>
<td align="center"><sub>Orochia — Alex opens Elena's story, likes it, replies privately and tips her; Elena keeps 90 %.</sub></td>
</tr>
</table>

<p align="center"><sub>The two products this site presents, recorded on the real applications — the same clips play on krizaka.com.</sub></p>

---

Static-first marketing + documentation site (Next.js App Router, React 19, TypeScript).
The **read side**: architecture/doc facts are generated from the Orazaka engine, never
hand-authored here. Governance contract: [`AGENTS.md`](AGENTS.md).

## Stack

Next.js 16 (App Router, SSG) · React 19 · TypeScript · Tailwind v4 with the Krizaka preset
([`@krizaka/tailwind`](https://www.npmjs.com/package/@krizaka/tailwind): the `--kz-*` tokens of `@krizaka/tokens`) ·
[`@krizaka/ui`](https://www.npmjs.com/package/@krizaka/ui) · Fumadocs (docs) ·
`@xyflow/react` (pipeline graphs) · one motion system in CSS (`app/motion.css`, no animation library for new work).

## Where things live

| Path | Role |
|---|---|
| `app/[locale]/` | All routes; `[locale]` is `en` (default) or `fr` (Québec). `layout.tsx` wires fonts, theme, i18n, the sitewide JSON-LD graph and base metadata. |
| `app/components/` | UI. Big ones: `TopNavBar`, `EngineShowcaseSection`, `diagrams/` (module map, pipeline, messaging), `Mermaid`, `MdxComponents`, `DemosGallery`. |
| `app/robots.ts` · `app/sitemap.ts` · `app/manifest.ts` | SEO route handlers. |
| `app/data/architecture.json` | **Generated** module graph + Orazaka repository map (read-only). |
| `proxy.ts` | Edge middleware (Next 16 name): no-locale URL → `/en` by default, `/fr` when the `NEXT_LOCALE` cookie says so; a `/fr` or `/en` page sets that cookie. |
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
                                                      └▶  app/data/architecture.json (schemas + repository map)
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
| Krizaka building blocks (Maven Central, `com.krizaka` 0.2.0) | [krizaka-build](https://github.com/krizaka/krizaka-build) · [krizaka-platform-kit](https://github.com/krizaka/krizaka-platform-kit) · [krizaka-users](https://github.com/krizaka/krizaka-users) · [krizaka-notifications](https://github.com/krizaka/krizaka-notifications) · [krizaka-billing](https://github.com/krizaka/krizaka-billing) — documented at [/docs/java](https://www.krizaka.com/docs/java) |
| AI engine | [orazaka-ai-engine](https://github.com/krizaka/orazaka-ai-engine) · [orazaka-studio](https://github.com/krizaka/orazaka-studio) · [orazaka-conversation-service](https://github.com/krizaka/orazaka-conversation-service) · [orazaka-job-service](https://github.com/krizaka/orazaka-job-service) · [orazaka-knowledge-service](https://github.com/krizaka/orazaka-knowledge-service) · [orazaka-automation-service](https://github.com/krizaka/orazaka-automation-service) · [orazaka-worker-media](https://github.com/krizaka/orazaka-worker-media) |
| Apps & content | [orazaka-web-client](https://github.com/krizaka/orazaka-web-client) · [orazaka-web-admin](https://github.com/krizaka/orazaka-web-admin) · [orazaka-mobile-client](https://github.com/krizaka/orazaka-mobile-client) · [orazaka-cli](https://github.com/krizaka/orazaka-cli) · [orazaka-packs](https://github.com/krizaka/orazaka-packs) |

## Orochia repositories

Orochia, the creator video platform, lives in four repositories of the [krizaka](https://github.com/krizaka)
organisation; its architecture is generated in `app/data/orochia-architecture.json` and presented at
`/products/orochia`, its docs at [/docs/orochia](https://www.krizaka.com/docs/orochia).

| Repository | What it is |
|---|---|
| [orochia](https://github.com/krizaka/orochia) | The web app: 4K HLS playback from Bunny Stream, the Explorer, stories, unlocks, auctions and challenges in escrowed credits, 90 % to the creator on a double-entry ledger |
| [orochia-admin](https://github.com/krizaka/orochia-admin) | The operator console: 18 U.S.C. § 2257 creator verification, content-report triage, catalogue, auctions, treasury and payouts — its own database, one operator account |
| [orochia-design-system](https://github.com/krizaka/orochia-design-system) | [`@krizaka/orochia-design-system`](https://www.npmjs.com/package/@krizaka/orochia-design-system): the Orochia theme on `@krizaka/ui` and its product composites |
| [orochia-mobile](https://github.com/krizaka/orochia-mobile) | Orochia for iOS and Android (Expo), on the same API and rules as the web |

Never hand-edit `orazaka-content/` or `app/data/`. To publish a synced doc, add an entry
to [`lib/docs-manifest.ts`](lib/docs-manifest.ts) (curated title/category/order/audience).

## Conventions

- **SEO**: every page sets `alternates`/title/description via `localizedMetadata(locale, { path, en, fr })` from `lib/seo`. The bare `/` and any unprefixed path 307-redirect (via `proxy.ts`), so canonicals are always the localized self URL.
- **Theming**: `var(--kz-*)` tokens only — dark on `:root`, light on `html.light`, persisted as `kz-theme`. **Verify every new view in both themes.** No hard-coded hex / Tailwind color literals for surfaces.
- **Reduced motion**: honor `prefers-reduced-motion` (no entrance or idle animation).
- **Schemas**: 2D, labels in full, a text version of what they draw (AGENTS.md §4).

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

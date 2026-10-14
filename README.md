<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka-dark.svg">
    <img src="https://raw.githubusercontent.com/krizaka/.github/main/profile/assets/krizaka-light.svg" alt="Krizaka" width="96">
  </picture>
</p>

<h1 align="center">krizaka-com</h1>

<p align="center"><strong>Public Next.js site for Krizaka &amp; its products: Orazaka, Orochia, Yasakia (coming soon) and Yororis (under construction).</strong></p>

<p align="center">
  <a href="https://scorecard.dev/viewer/?uri=github.com/krizaka/krizaka-com"><img src="https://api.scorecard.dev/projects/github.com/krizaka/krizaka-com/badge?style=flat-square" alt="OpenSSF Scorecard" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-blueviolet?style=flat-square" alt="Next.js 16" />
  <a href="https://github.com/krizaka/orazaka"><img src="https://img.shields.io/badge/AI_Engine-Orazaka-f67e23?style=flat-square" alt="Orazaka" /></a>
  <a href="https://github.com/krizaka/orochia"><img src="https://img.shields.io/badge/Streaming-Orochia-7c3aed?style=flat-square" alt="Orochia" /></a>
  <a href="https://github.com/krizaka/yasakia"><img src="https://img.shields.io/badge/Dating_(soon)-Yasakia-10b981?style=flat-square" alt="Yasakia (coming soon)" /></a>
  <a href="https://github.com/krizaka/yororis"><img src="https://img.shields.io/badge/Listening_(under_construction)-Yororis-5d894d?style=flat-square" alt="Yororis (under construction)" /></a>
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

<p align="center"><sub>The two released products, recorded on the real applications — the same clips play on krizaka.com. The third, <a href="https://dev.yasakia.com">Yasakia</a> (the dating app where you talk first), is announced on the site and gets its clip when the app ships; the fourth, <a href="https://www.krizaka.com/en/products/yororis">Yororis</a> (a listening space with a face and a voice), is under construction — not deployed, not offered, no date.</sub></p>

| Product | What it is | Status | Page |
|---|---|---|---|
| [Orazaka](https://github.com/krizaka/orazaka) | Sovereign, on-premise AI orchestration engine | Released | [/products/orazaka](https://www.krizaka.com/en/products/orazaka) |
| [Orochia](https://github.com/krizaka/orochia) | The video platform for independent creators | Released | [/products/orochia](https://www.krizaka.com/en/products/orochia) |
| [Yasakia](https://github.com/krizaka/yasakia) | The dating app where you talk first | Coming soon | [dev.yasakia.com](https://dev.yasakia.com) |
| [Yororis](https://github.com/krizaka/yororis) | A listening space with a face and a voice, powered by Orazaka's wellbeing pack | Under construction (not offered; its words checked by `npm run lexicon`) | [/products/yororis](https://www.krizaka.com/en/products/yororis) |

---

Static-first marketing + documentation site (Next.js App Router, React 19, TypeScript).
The **read side**: architecture/doc facts are generated from the Orazaka engine, never
hand-authored here. Governance contract: [`AGENTS.md`](AGENTS.md).

## Stack

Next.js 16 (App Router, SSG) · React 19 · TypeScript · Tailwind v4 with the Krizaka preset
([`@krizaka/tailwind`](https://www.npmjs.com/package/@krizaka/tailwind): the `--kz-*` tokens of `@krizaka/tokens`) ·
[`@krizaka/ui`](https://www.npmjs.com/package/@krizaka/ui) · Fumadocs (docs) ·
one schema component for every product (`app/components/diagrams/`, no diagram library, no Mermaid) · one motion system, @krizaka/ui's (`MotionObserver`, `NumberTicker`, `[data-reveal]`; no animation library for new work).

## Where things live

| Path | Role |
|---|---|
| `app/[locale]/` | All routes; `[locale]` is `en` (default) or `fr` (Québec). `layout.tsx` wires fonts, theme, i18n, the sitewide JSON-LD graph and base metadata. |
| `app/components/` | UI. Big ones: `TopNavBar`, `home/ProductCards` (one card per product), `diagrams/` (the module map of Krizaka Java), `docs/`. |
| `app/robots.ts` · `app/sitemap.ts` · `app/manifest.ts` | SEO route handlers. |
| `app/data/architecture.json` · `orochia-architecture.json` | **Generated** module graphs + repository maps (read-only): Krizaka Java's building blocks and the open-source repository lists. |
| `proxy.ts` | Edge middleware (Next 16 name): no-locale URL → `/en` by default, `/fr` when the `NEXT_LOCALE` cookie says so; a `/fr` or `/en` page sets that cookie. |
| `next.config.ts` | Security headers, WebP, cache policy, and the 308 redirects of the old product addresses (`lib/product-redirects.ts`). |
| `lib/seo.ts` | `localizedMetadata()` + `buildAlternates()` — per-page title/description/canonical/hreflang. |
| `lib/structured-data.ts` | JSON-LD `@graph` builders (Organization · WebSite, Breadcrumb, FAQ, TechArticle). |
| `lib/products.ts` | The products (name, status, dev site, source) — `/products`, the nav, the footer. |
| `lib/site.ts` | External identity (SITE_URL, GitHub, version) — single source. |
| `lib/i18n.ts` | Binds [`@krizaka/i18n`](https://www.npmjs.com/package/@krizaka/i18n) to `messages/en.json` + `messages/fr.json` (`getDictionary`, `asLocale`, `format`). |
| `app/[locale]/docs/` | The documentation (Fumadocs): hub, then `[section]` = `ui`. |
| `source.config.ts` · `lib/docs-source.ts` | The Fumadocs collection and its loader, sidebars, titles (messages or code). |
| `content/docs/ui/` | Written docs (MDX). `content/docs/ui/components/<name>.mdx` are scaffolded by `npm run docs:ui`. |
| `app/components/docs/` | MDX components: `ComponentPreview`, `PropsTable`, `StoryFrame`. |

## Products

krizaka.com is the company's showcase. Each product has its own site — [dev.orazaka.com](https://dev.orazaka.com),
[dev.orochia.com](https://dev.orochia.com), [dev.yasakia.com](https://dev.yasakia.com) (Yasakia, being renamed),
[dev.yororis.com](https://dev.yororis.com) — and `/products` is the one page here that leads to them, with each
product's source. The old `/products/<product>/…` and `/docs/<product>/…` addresses answer **308** with the product's
site (`lib/product-redirects.ts`). The generated `app/data/*.json` are never hand-edited.

## Conventions

- **SEO**: every page sets `alternates`/title/description via `localizedMetadata(locale, { path, en, fr })` from `lib/seo`. The bare `/` and any unprefixed path 307-redirect (via `proxy.ts`), so canonicals are always the localized self URL.
- **Theming**: `var(--kz-*)` tokens only — dark on `:root`, light on `html.light`, persisted as `kz-theme`. **Verify every new view in both themes.** No hard-coded hex / Tailwind color literals for surfaces.
- **Reduced motion**: honor `prefers-reduced-motion` (no entrance or idle animation).
- **Schemas**: 2D, labels in full, a text version of what they draw (AGENTS.md §4).

## Documentation (`/docs`)

One engine, [Fumadocs](https://fumadocs.dev), for **Krizaka UI** (`content/docs/ui`). Krizaka Java is documented on
[java.krizaka.com](https://java.krizaka.com) (built from `krizaka/krizaka-build`, `/docs/java` redirects there); the products
document themselves on their own sites.

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
Environment Variables; on DigitalOcean App Platform, the app's secrets — `deploy/digitalocean/app.yaml`). Without one the endpoint answers `503` instead of pretending:

Every variable of the site is named by its bounded context (krizaka/.github#46) and declared once in
[`lib/env.ts`](lib/env.ts) (zod); this table is generated from it (`npm run docs:env`, checked by `npm test`):

<!-- env -->
#### Application — `APP_`

| Variable | Production | Secret | Default | What it does |
| :--- | :---: | :---: | :--- | :--- |
| `NEXT_PUBLIC_APP_DEMO_URL` *(build)* | recommended |  | `https://dev.orochia.com` | Where the running product demo is: every "open the app" link, the structured data and llms.txt (`lib/site.ts`). |
| `APP_GITHUB_TOKEN` *(build)* | — | ✓ |  | A read-only token so the organisation figures (`scripts/gen-org-stats.mjs`) are not rate-limited at build; the build never fails without it. |

#### Media — `MEDIA_`

| Variable | Production | Secret | Default | What it does |
| :--- | :---: | :---: | :--- | :--- |
| `NEXT_PUBLIC_MEDIA_CDN_URL` *(build)* | — |  | `https://krizaka-assets.b-cdn.net` | Where the media (tours, gallery, home backdrop) are served from (`lib/cdn.ts`). |
| `MEDIA_STORAGE_API_KEY` *(scripts)* | — | ✓ |  | Storage zone password — PR captures and site media (`scripts/pr-assets.mjs`, `scripts/cdn-assets.mjs`). |
| `MEDIA_STORAGE_ZONE` *(scripts)* | — |  |  | Storage zone name of the asset scripts. |
| `MEDIA_STORAGE_ENDPOINT` *(scripts)* | — |  | `storage.bunnycdn.com` | Storage API host of the zone's region. |
| `MEDIA_CDN_HOSTNAME` *(scripts)* | — |  |  | Pull zone hostname serving the zone (the scripts check the first file answers publicly). |

#### E-mail — `MAIL_`

| Variable | Production | Secret | Default | What it does |
| :--- | :---: | :---: | :--- | :--- |
| `MAIL_PROVIDER` | recommended |  |  | The contact form's e-mail service: `mailgun`. Unset, the e-mail channel is off. |
| `MAIL_API_KEY` | recommended | ✓ |  | The provider's private API key (Basic auth `api:<key>`). |
| `MAIL_DOMAIN` | recommended |  | `mg.krizaka.com` | Sending domain verified at the provider. |
| `MAIL_API_URL` | — |  | `https://api.mailgun.net` | API base (`https://api.eu.mailgun.net` for an EU-region domain). |
| `MAIL_FROM` | — |  | `Krizaka <contact@<MAIL_DOMAIN>>` | Sender, on `MAIL_DOMAIN`. |
| `MAIL_CONTACT_TO` | recommended | ✓ |  | Where the contact messages land (comma-separated recipients). |
| `MAIL_CONTACT_WEBHOOK_URL` | — | ✓ |  | A second channel: JSON POST to Slack, Discord or any relay (`text`, `content` and structured `contact` fields). |
<!-- /env -->

The e-mail goes out via `POST {MAIL_API_URL}/v3/{MAIL_DOMAIN}/messages` (`lib/contact.ts`)
with `Reply-To` set to the visitor, so answering the e-mail answers them. A Mailgun refusal is
logged (`contact: mailgun refused (…)`) and the visitor gets a `502`.

## Container image (DigitalOcean App Platform)

The site also builds as a container: `Dockerfile` (Next.js `output: "standalone"`, Node 24 Alpine, sharp for
`next/image`, health check `GET /api/health`) and `deploy/digitalocean/app.yaml` (App Platform spec: `www` primary,
apex redirected, auto-deploy on `main`). CI builds the image and smoke-tests it on every pull request.

```bash
docker build -t krizaka-com . && docker run --rm -p 3000:3000 krizaka-com   # add --env-file .env.local for the contact form
```

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

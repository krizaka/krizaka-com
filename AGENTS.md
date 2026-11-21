# krizaka-com — agent contract

<!-- krizaka-agents-template v2: rendered from krizaka/.github docs/standards/agents-template.md (scripts/agents-md.mjs). The one AGENTS.md standard: six sections in this order, at most 150 lines, bullets and imperatives. The conformance check « agents-template » reads the headings, the length and CLAUDE.md. Detail goes to docs/ via References, not here. -->

## Project context

- krizaka.com: the company's public Next.js (App Router, static-first) showcase: home (products as rows), Docs, Services, `/story`, changelog, contact, legal. French is the default language, EN/FR.
- It is the read side: product, version and architecture facts come from published packages and generated data, never hand-written. No product page, demo or documentation lives here.
- Kind: `site` · team: `krizaka` · registry entry: [repos.json](https://github.com/krizaka/.github/blob/main/repos.json).
- Read this file first, then the section of [docs/agents.md](docs/agents.md) for what you touch.
- `CLAUDE.md` is the one line `@AGENTS.md` (or a symlink to this file): never a second copy of it.
- This is not the Next.js you know: read the guide in `node_modules/next/dist/docs/` before writing code; heed deprecation notices.

## Essential commands

```bash
npm ci                 # install (postinstall generates lib/*.json, reused < 6 h)
npm run dev:check      # fast loop (~10 s): eslint on changed files, tsc --noEmit, unit tests
npm test               # unit tests (node:test, tests/*.test.mjs)
npm run lint           # eslint, ast-grep + ratchets, i18n, page templates, depcruise
npm run format:check   # prettier (npm run format to fix)
npm run build          # full build; generators fetch fresh data, checks fail the build
npm run seo:check      # seo-family audit against a running container (CI)
```

- Run them on what you changed before every push; CI runs the rest (a11y, container smoke).

## Architecture & conventions

- Follow the [krizaka-engineering skill](https://github.com/krizaka/krizaka-agents/blob/main/plugins/krizaka-engineering/skills/krizaka-engineering/SKILL.md); search its [packages reference](https://github.com/krizaka/krizaka-agents/blob/main/plugins/krizaka-engineering/skills/krizaka-engineering/references/packages.md) before writing anything generic.
- Take libraries first: `@krizaka/*`; a missing function goes into the package first, never a local copy.
- Keep UI in `app/components/`, logic and data access in `lib/`; Server Components by default, `"use client"` only for state, effects or browser APIs; prefer static generation; send a client only its slice of data.
- Build every page from `@krizaka/ui` blocks and declare its template in `lib/page-templates.ts`; one shell (`Page`); every action is the `@krizaka/ui` `Button` (`ButtonLink` for links). A missing block goes to krizaka-ui first.
- Use `var(--kz-*)` tokens only: no hex/rgb, no Tailwind literal colors. Dark and light are both first-class; check both. Cahier register: never `data-surface="product"` or `.brand-<product>` on `<html>`/`<body>`.
- Keep every user-facing string in `messages/en.json` and `messages/fr.json` (`lib/i18n.ts`); never choose a text with `locale === "fr" ? …`; variables via `format`, emphasis via `<Rich>`.
- Read facts from data: product names and addresses from `@krizaka/org` (`displayName`, `siteUrlOf`), versions from `lib/registry-versions.json`, media through `lib/cdn.ts`. Never type them.
- Link a product only by its commercial www address (`siteUrl`), never a `www.<code>.com` or `dev.<code>.com` host, never a retired code name. Never add a product page back: change the product's site.
- Link documentation by absolute URL on its own site (ui., java., ts.krizaka.com); never render docs here, never link a Storybook.
- Motion is `@krizaka/ui`'s; nothing moves under the pointer; the home mounts no `<video>`, timer or carousel.
- Name env variables `<CONTEXT>_<THING>` (`APP_`, `MAIL_`, `MEDIA_`…), declared once in `lib/env.ts`; the README table is generated (`npm run docs:env`).
- Keep the stack rules: no client `fetch` in `useEffect`, no `@tanstack/*` import, no hand-written `<table>` or multi-field `<form>`.
- No Krizaka e-mail address is public: « Contact » and « Support » link to the form via `contactHref(source, kind?, product?)`.
- Hierarchy: this root file holds the rules of the whole repository; a sub-folder with its own rules adds a local `AGENTS.md`. The nearest file wins.

## Guard-rails & known pitfalls (read before coding)

- The checks are the judge ([ADR-015](https://github.com/krizaka/krizaka-internal/blob/main/docs/adr/.github/ADR-015-ai-code-audit-measured-and-enforced.md), [guards](https://github.com/krizaka/.github/blob/main/docs/standards/guards.md)): never `--no-verify`, never a new `eslint-disable`, never a raised ratchet or baseline (`lint-ratchet.json`, `sg-ratchet.json`, `a11y-baseline.json`); never silence a rule to get green.
- Never hand-edit generated files (`lib/*.json` from scripts, `lib/services.signed.json`, README env table, `CHANGELOG.md`, the version); never push to `production`; releases go through release-please.
- Changing `lib/services.ts` means `npm run services:sign` (vault key, never printed), then publish the Bunny copy after deploy; `issuedAt` only grows.
- Never commit media, screenshots or captures: site media go to Bunny with `cdn-assets upload` and `lib/cdn-manifest.json` is committed; PR captures go through `scripts/pr-assets.mjs`.
- Never hard-code a default avatar/banner/logo URL; read `@krizaka/org`.
- Never write prices, « on quote », founder or personal names, or an em dash in public text (services, changelog); `/story` never links the founder's blog.
- A Departed product is named nowhere (`no-departed-product`); a code name in messages or `content/` fails lint and build.
- Use `?.` and `??`, not `&&` chains; a closed set is an `as const` object, never `enum`, never a string compared by hand.
- Start a fix with a failing test; every bug gets its guard; a feature ships with its tests in the same PR; never skip, weaken or delete a test.
- Never invent a URL, a law article, a price or a figure you did not read; write `TO VALIDATE` and say who decides.
- Never commit a secret, a capture or a log; no production data in a session, only the dev data.
- Keep the edit hook in `.claude/settings.json`: `npx --no-install krizaka-edit-check` on `Edit|Write`.

## Expected validation workflow

- [ ] Compile, format, lint and test what changed (`npm run dev:check`, `format:check`); fix the cause of a red, never the guard.
- [ ] `npm run build` is green and the route is statically generated; `npm run lint` and `npm test` are clean.
- [ ] A new view reads correctly in dark and light, and at 360 px.
- [ ] A feature or fix PR names its journey (`Journey: <name>` or `Journey: n/a — <reason>`).
- [ ] README and generated docs still say what the code does; no hand-edited generated content.
- [ ] One issue, one small PR (`Closes #<n>`); merge only with green CI, through the train.

## References

- [docs/agents.md](docs/agents.md): the full site contract (generated vs written, home order, docs hub, services, footer, discovery, SEO, theming, page language, media layout, PR captures, tests, ast-grep rules, anti-slop), read by section.
- [docs/design](docs/design): design notes (home media, Bunny org library).
- [Org standards](https://github.com/krizaka/.github/tree/main/docs/standards) of krizaka/.github; the [engineering charter](https://github.com/krizaka/.github/blob/main/AGENTS.template.md).
- [krizaka-engineering skill](https://github.com/krizaka/krizaka-agents/blob/main/plugins/krizaka-engineering/skills/krizaka-engineering/SKILL.md).

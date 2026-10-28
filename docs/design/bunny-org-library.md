# Bunny: an org-level media library, and the target tree of the zone

Status: **superseded** by krizaka/.github ADR-014 (2026-10-28: `org/v<n>/` is the org's CDN, `apps/<app>/` per app; the `krizaka/v1/` prefix below was never built). Kept for its inventory. Former status: **proposal (phase 1)**. Nothing changes on Bunny and `scripts/bunny-layout.mjs` is untouched until Claude (CTO) comments « validé ».
Issues: krizaka/krizaka-com#381, #387. Reads: AGENTS.md §5.2, `scripts/bunny-layout.mjs`, `scripts/cdn-assets.mjs`, `lib/cdn-manifest.json`, `lib/cdn.ts`, krizaka-ui `tools/export-brand.mjs`.

## 1. Inventory (from `lib/cdn-manifest.json` and the layout)

| Where | Files | Kind | Org reuse? |
| :--- | :--- | :--- | :--- |
| `site/people/orochia/` | 7 personas (alex, elena, lina, mia, operator, sam, theo) × `-256`/`-512` `.webp` (14) | avatars: portraits of people | **No.** People carry the product's context. |
| `site/products/orochia/tour/{en,fr}/` | 72 files: `.jpg` poster, `.mp4`, `.webm` per take | product recordings (scenes of the app) | **No.** Product scenes, personas and outfits. Stays Orochia's. |
| `site/products/orochia/demo-stories/` | 4 `.mp4` (bagels, picnic-olive-grove, skating-pond, spice-alley) | illustrated story clips | **No** as is: product content. Their neutral subjects (food, landscape) could be re-shot as org *cover* art, not reused. |
| `site/brand-films/orochia/` | 8 files (`orochia-la-premiere-livraison-*` films, captions) | brand film | **No.** A product film. |
| `people/personas/orochia/` | none: never mirrored (`libraryPath` returns null for Orochia) | - | - |
| Backgrounds, icon-like art | **none exist** for Orochia in the manifest | - | - |

Conclusion: **no Orochia image is reusable at the org level.** Every one is a person, a scene or a film of an adult-adjacent creator platform. Orochia's media move to its zone `orochia-dev` (krizaka/orochia#153) and are never mirrored here. The org library is therefore built from what Krizaka already *generates from code* — the marks and `defaultAvatarSvg` of `@krizaka/ui` — and not from Orochia's art. Non-Orochia candidates already in the manifest and eligible for reuse: `people/ui/*` (8 neutral personas of ui.krizaka.com, as demo portraits only) and `brand-films/loops/*` (birds).

### 1.1 The default media set supplied on 2026-10-24: the first org-level candidates

Oussama supplied a reference set on 2026-10-24: **12 default avatars** (illustrated, 1024², PNG + WebP) and **12 default banners** (1920×640), plus one photo of the Krizaka spirit (krizaka-com#387). The files live in his private company folder: they are **not in any repository, and none is added by this PR**. They are the **first org-level candidates**, ahead of anything generated, and each folder of §2 takes one of two sources:

| Logical folder | Takes | Source |
| :--- | :--- | :--- |
| `krizaka/v1/avatars/default-<01-12>` | the 12 supplied avatars (WebP; PNG only where a product needs lossless) | **Supplied**, reviewed upload under `site/org/avatars/` |
| `krizaka/v1/covers/default-<01-12>` | the 12 supplied banners | **Supplied**, reviewed upload under `site/org/covers/` |
| `krizaka/v1/avatars/<brand>/` | one default avatar per brand, drawn by the code | **Generated** from `@krizaka/ui` `defaultAvatarSvg` |
| `krizaka/v1/covers/<brand>/` | brand covers | **Generated** from the brand tokens and marks |
| `krizaka/v1/icons/`, `illustrations/`, `placeholders/` | empty-state art | **Generated** |
| the culture photo | not a default: it is used as a page photo, not as a library entry | out of this library |

The supplied files keep the rule « one writer per prefix »: the exporter still owns `krizaka/v1/` (§2); the supplied set is written only by `scripts/cdn-assets.mjs` under `site/org/` and resolved from the `krizaka/v1/avatars/default-NN` logical path by `lib/cdn.ts`. Issue #387 proposed a `library/krizaka-defaults/` prefix: it is **replaced** by this layout (one org prefix, not two), to be confirmed at « validé ».

**The published manifest is sanitised.** Whatever manifest is published for the supplied set (id, kind, FR/EN alt, tags, product affinity, CDN URLs, size, hash) holds **no company identifier** (no company number, registration or tax number, legal or internal name) and **no personal data** (no person's name, email, phone, address, file path of the private folder, or EXIF/metadata of a photo). Only the whitelisted fields above are written; anything else is dropped, not copied. `tests/bunny-org-library.test.mjs` asserts that this document says so, and the manifest builder will carry its own test that refuses any non-whitelisted field. Alt texts come from the manifest, never hard-coded; the café banner is decoration only.

## 2. The org level: `krizaka/`

Name: **`krizaka/`** (as asked; it says « shared by the whole organisation », unlike `brand/`, which is the identity of each brand, and `people/`, which is only portraits). Versioned by folder, like `people/defaults/v1/`: a changed picture is a new `v2/`, never an overwrite.

`krizaka/v1/` is **generated-only**. Krizaka UI's `tools/export-brand.mjs` is its sole writer and owns every file there, including `manifest.json`. No hand upload or `cdn-assets` operation writes under this prefix.

```
krizaka/v1/
  avatars/<brand>/{person,plain}-<1-6>{.svg,-256.webp,-512.webp}   default avatars per product
  covers/<brand>/cover-<1-6>{.svg,-1280.webp}                      default cover / banner per product
  icons/empty/<name>.svg                                            empty-state icons (inbox, search, list, error, offline…)
  illustrations/empty/<name>{.svg,-light.svg}                       empty-state illustrations, dark and light
  placeholders/{image,video,avatar,cover}-{16x9,1x1,4x5}.svg + blurhash in manifest.json
  manifest.json                                                      names, sizes, hashes, version
```

| Kind | Source | Why |
| :--- | :--- | :--- |
| Default avatars | **Generated** from `@krizaka/ui` `defaultAvatarSvg` | already the source of `Avatar`'s `defaultAvatar`; moves from `people/defaults/v1/` |
| Covers | **Generated** from the brand tokens and marks (gradients, one bird mark small) | no photo, so nothing carries a context |
| Empty-state icons and illustrations | **Generated** from the icon set / flock SVGs of `@krizaka/ui` | one source, both themes |
| Placeholders | **Generated** (flat SVG on tokens; blurhash recorded in the manifest) | tiny, deterministic |
| Anything drawn by hand, if ever | **Reviewed upload** under `site/org/<kind>/`, using `cdn-assets upload --to site/org/<kind>/…`; hash recorded in `lib/cdn-manifest.json` | only when no code can render it; reviewed for context-free content |

Names: generated files keep **stable names under a versioned folder** (the folder is the version, as `people/defaults/v1/`). Reviewed uploads take `<name>.<10 hex SHA-256>.<ext>` and are immutable (as `site/`). `site/org/` is managed only by `scripts/cdn-assets.mjs` and its entries in `lib/cdn-manifest.json`; it is disjoint from the exporter's `krizaka/v1/` tree and manifest. Nothing is generated from Orochia's art.

## 3. Target tree of the zone, one writer per prefix

```
brand/<brand>/…                        tools/export-brand.mjs (krizaka-ui)  — unchanged
krizaka/v1/…                           tools/export-brand.mjs (krizaka-ui), exclusive writer including manifest.json
site/org/…                             scripts/cdn-assets.mjs upload; hashes in lib/cdn-manifest.json
people/defaults/v1/<brand>/…           kept as an alias of krizaka/v1/avatars/<brand>/ (published @krizaka/ui uses it); then frozen
people/personas/<product>/…            scripts/cdn-assets.mjs library (mirror) — never orochia
products/<product>/<kind>/…            scripts/cdn-assets.mjs library (mirror)
site/…                                 scripts/cdn-assets.mjs (hashed); FOREIGN_WRITERS keep their prefixes (products/<p>/, blog/)
discovery/services.json                scripts/sign-services.mjs --publish
ui/  maps/  pr-assets/                 unchanged writers
```

What moves: only `people/defaults/v1/<brand>/` → `krizaka/v1/avatars/<brand>/` (same generator, new destination). Everything else stays: `site/products/orochia` and `site/people/orochia` leave for `orochia-dev` (#153), outside this proposal. `FOREIGN_WRITERS` is unchanged; `krizaka/` is added to `ZONE` with its writer.

Migration (each step its own PR, nothing deleted before the end):
1. **Copy**: the export writes `krizaka/v1/…`; `people/defaults/v1/` is still written.
2. **Update the manifest and pages**: `lib/cdn.ts` learns the `krizaka/` logical prefix (fails the build on an unknown path, as today); pages and apps switch to it.
3. **Keep old URLs**: `people/defaults/v1/…` stays served (published `@krizaka/ui` examples use it); the `/assets/…` legacy redirects in `lib/cdn.ts` (`LEGACY`) are kept and, if a path moves, one line is added there.
4. **Prune**: `cdn-assets prune` removes only what no manifest of main or of an unmerged branch names. `people/defaults/v1/` is never pruned while a published package version references it.
5. **README.txt** at the zone root stays generated from `LAYOUT_README` (`cdn-assets readme`), which gains the `krizaka/` entry and its rule « generated only by `tools/export-brand.mjs`, including its manifest; no hand uploads ». It also documents `site/org/` as the home for reviewed uploads, tracked by `lib/cdn-manifest.json`.

## 4. How apps load them

- `@krizaka/ui`'s `Avatar` default set and the empty-state icons resolve a **logical path** (`krizaka/v1/avatars/<brand>/person-3`, `krizaka/v1/icons/empty/inbox`) through the media host (`NEXT_PUBLIC_MEDIA_CDN_URL`), never a hard-coded URL; `lib/cdn.ts` is the resolver here and fails the build on an unknown path. Generated avatars can still render inline from `defaultAvatarSvg` (no network) — the CDN copy is for non-React surfaces (mail, mobile, OG images).
- A product picks its brand folder (`<brand>`); a brand with no cover gets `krizaka`'s.
- Products with their own zone (Orochia) keep reading their own; they may read `krizaka/` for generic empty states only.

## 5. The cut: issues, in order

1. **krizaka-com — layout**: add `krizaka` to `ZONE` as generated-only with `tools/export-brand.mjs` owning the entire prefix and its `manifest.json`; document reviewed uploads under `site/org/` in `bunny-layout.mjs`, audit, and tests.
2. **krizaka-com — `cdn-assets`**: support logical paths in `lib/cdn.ts` for the generated `krizaka/` files, keep reviewed uploads at `site/org/` in `lib/cdn-manifest.json`, and add the legacy redirect for `people/defaults/v1/`. Never enable uploads to `krizaka/v1/`.
3. **krizaka-ui — export**: `tools/export-brand.mjs` exclusively renders avatars, covers, empty icons and illustrations, placeholders, and its `manifest.json` under `krizaka/v1/`; `Avatar` and empty states resolve logical paths.
4. **Product adoptions**: each product repo reads its brand folder for defaults (one small PR each; Orochia last, after #153).
5. **Prune and freeze**: once adopted and the packages released, freeze `people/defaults/v1/` (kept, aliased).

Open questions for review: the name `krizaka/` vs `shared/`; whether covers are wanted in v1; whether `people/ui/*` should join the org library.

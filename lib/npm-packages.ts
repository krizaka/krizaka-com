/* The @krizaka packages published on npm — structure only (ids, names, repositories, layer, product); their words live
   in messages/<locale>.json under site.packages.items.<id>. Shown on /open-source; the story (chapter 05, "the
   pattern in the steel") shows STORY_PACKAGES, its four original layers. */

export type PackageId =
  | "tokens"
  | "tailwind"
  | "config"
  | "ui"
  | "icons"
  | "intl"
  | "i18n"
  | "orochiaDs"
  | "orazakaDs"
  | "orazakaShared";

/** The layers of the stack, bottom to top: foundations → primitives → language → the products' kits. */
export type PackageLayer = "foundations" | "primitives" | "language" | "products";

export interface NpmPackage {
  id: PackageId;
  name: string;
  repo: string;
  /** Path inside the repository, when it holds several packages. */
  dir?: string;
  layer: PackageLayer;
  product: "krizaka" | "orochia" | "orazaka";
}

export const NPM_PACKAGES: readonly NpmPackage[] = [
  { id: "tokens", name: "@krizaka/tokens", repo: "krizaka-ui", dir: "packages/tokens", layer: "foundations", product: "krizaka" },
  { id: "tailwind", name: "@krizaka/tailwind", repo: "krizaka-ui", dir: "packages/tailwind", layer: "foundations", product: "krizaka" },
  { id: "config", name: "@krizaka/config", repo: "krizaka-ui", dir: "packages/config", layer: "foundations", product: "krizaka" },
  { id: "ui", name: "@krizaka/ui", repo: "krizaka-ui", dir: "packages/ui", layer: "primitives", product: "krizaka" },
  { id: "icons", name: "@krizaka/icons", repo: "krizaka-ui", dir: "packages/icons", layer: "primitives", product: "krizaka" },
  { id: "intl", name: "@krizaka/intl", repo: "krizaka-ui", dir: "packages/intl", layer: "language", product: "krizaka" },
  { id: "i18n", name: "@krizaka/i18n", repo: "krizaka-ui", dir: "packages/i18n", layer: "language", product: "krizaka" },
  { id: "orochiaDs", name: "@krizaka/orochia-design-system", repo: "orochia-design-system", layer: "products", product: "orochia" },
  { id: "orazakaDs", name: "@krizaka/orazaka-design-system", repo: "orazaka-ui-kit", dir: "orazaka-design-system", layer: "products", product: "orazaka" },
  { id: "orazakaShared", name: "@krizaka/orazaka-shared", repo: "orazaka-ui-kit", dir: "orazaka-shared", layer: "products", product: "orazaka" },
];

/** The story (chapter 05) still shows its four original layers: an explicit filter until it is redesigned (PY3). */
export type StoryPackageId = "ui" | "orochiaDs" | "orazakaDs" | "orazakaShared";
const STORY_IDS: readonly PackageId[] = ["ui", "orochiaDs", "orazakaDs", "orazakaShared"];
export const STORY_PACKAGES = NPM_PACKAGES.filter((p): p is NpmPackage & { id: StoryPackageId } => STORY_IDS.includes(p.id));

export const npmUrl = (p: NpmPackage) => `https://www.npmjs.com/package/${p.name}`;
export const repoUrl = (p: NpmPackage) => `https://github.com/krizaka/${p.repo}${p.dir ? `/tree/main/${p.dir}` : ""}`;

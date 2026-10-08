/* The @krizaka packages published on npm — structure only (ids, names, repositories, product); their words live in
   messages/<locale>.json under site.packages.<id>. Shown on /open-source and in the story ("the pattern in the steel"). */

export type PackageId = "ui" | "orochiaDs" | "orazakaDs" | "orazakaShared";

export interface NpmPackage {
  id: PackageId;
  name: string;
  repo: string;
  /** Path inside the repository, when it holds several packages. */
  dir?: string;
  product: "krizaka" | "orochia" | "orazaka";
}

export const NPM_PACKAGES: readonly NpmPackage[] = [
  { id: "ui", name: "@krizaka/ui", repo: "krizaka-ui", product: "krizaka" },
  { id: "orochiaDs", name: "@krizaka/orochia-design-system", repo: "orochia-design-system", product: "orochia" },
  { id: "orazakaDs", name: "@krizaka/orazaka-design-system", repo: "orazaka-ui-kit", dir: "orazaka-design-system", product: "orazaka" },
  { id: "orazakaShared", name: "@krizaka/orazaka-shared", repo: "orazaka-ui-kit", dir: "orazaka-shared", product: "orazaka" },
];

export const npmUrl = (p: NpmPackage) => `https://www.npmjs.com/package/${p.name}`;
export const repoUrl = (p: NpmPackage) => `https://github.com/krizaka/${p.repo}${p.dir ? `/tree/main/${p.dir}` : ""}`;

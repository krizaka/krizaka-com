/* The repositories of the organisation, sorted by product and kind — pure rules over the data read from GitHub at build
   (scripts/gen-org-stats.mjs → lib/org-stats.json, loaded by lib/org-stats.ts). No list of repositories here: a
   repository created in the org appears on /open-source at the next build, under its product. Tested by
   tests/open-source.test.mjs (no import alias: Node strips the types and runs it as is). */

export interface GithubRepository {
  name: string;
  description: string;
  url: string;
  topics: string[];
  language: string | null;
  archived: boolean;
  /** When the repository last received a push (ISO), as GitHub said at build; absent offline. */
  pushedAt?: string | null;
}

/** What a repository is, read from its GitHub topics — the chip on its line and the order inside a product. */
export const REPOSITORY_KINDS = ["main", "web", "mobile", "service", "library", "tooling", "other"] as const;
export type RepositoryKind = (typeof REPOSITORY_KINDS)[number];

/** The product a repository belongs to: its name is the product's or starts with it (`orazaka-cli`); anything else
    is the platform (`krizaka`: krizaka-ui, the Java building blocks, the site, the org profile). */
export function productOfRepository<P extends string>(name: string, products: readonly P[]): P | "krizaka" {
  return products.find((p) => name === p || name.startsWith(`${p}-`)) ?? "krizaka";
}

const has = (topics: readonly string[], ...any: string[]) => any.some((t) => topics.includes(t));

/** The kind of a repository, from its name and topics (first rule that matches). */
export function kindOfRepository(repo: Pick<GithubRepository, "name" | "topics">, product: string): RepositoryKind {
  const { name, topics } = repo;
  if (name === product) return "main";
  if (has(topics, "expo", "react-native", "android", "ios") && !has(topics, "design-system", "npm-package"))
    return "mobile";
  if (has(topics, "design-system", "npm-package", "maven-central", "contracts", "design-tokens")) return "library";
  if (has(topics, "cli", "bom", "archunit", "community-health", "packs", "website", "agent-skills")) return "tooling";
  if (has(topics, "spring-boot", "worker", "rabbitmq", "spring-ai")) return "service";
  if (has(topics, "nextjs", "react")) return "web";
  return "other";
}

/** The repositories of one product, archived ones left out: the main repository first, then by kind, then by name. */
export function repositoriesOf<P extends string>(
  repositories: readonly GithubRepository[],
  product: P | "krizaka",
  products: readonly P[],
) {
  return repositories
    .filter((r) => !r.archived && productOfRepository(r.name, products) === product)
    .map((r) => ({ ...r, kind: kindOfRepository(r, product) }))
    .sort(
      (a, b) => REPOSITORY_KINDS.indexOf(a.kind) - REPOSITORY_KINDS.indexOf(b.kind) || a.name.localeCompare(b.name),
    );
}

/** What Krizaka open-sources, as /open-source lists it: the platform's repositories (libraries, kits, tooling, sites), never a
    product's. The products are operated by Krizaka (2026-10-26): their repositories are not offered here as open source, and
    nothing on /open-source says anything about their licence. */
export function openSourceRepositories<R extends Pick<GithubRepository, "name" | "archived">>(
  repositories: readonly R[],
  products: readonly string[],
): R[] {
  return repositories.filter((r) => !r.archived && productOfRepository(r.name, products) === "krizaka");
}

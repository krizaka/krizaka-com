/* The architecture of Krizaka Java, as the module map draws it — one model, one component (ModuleMap).
   Everything here is read from generated data, never written by hand (AGENTS.md §2):
   - java      app/data/architecture.json · buildingBlocks   `orazaka docs sync` (products/orazaka/scripts/generate-docs.mjs),
                                                             reading the Krizaka POMs; the runtime calls are its `flows`
   This module only reshapes the data for the component and checks, at build time, that the shape the map relies on
   is there: a model that lost a role, a module or a relation fails the build instead of drawing a wrong picture.
   Server-side: the client component receives the slice it draws. (The Orazaka and Orochia maps, their journeys, the
   interceptor pipeline and the messaging topology are on the products' own sites.) */

import architecture from "@/app/data/architecture.json";
import en from "@/messages/en.json";
import { MAVEN_ARTIFACTS } from "@/lib/maven-packages";

export const PRODUCTS = ["java"] as const;
export type Product = (typeof PRODUCTS)[number];
export const isProduct = (value: string): value is Product => (PRODUCTS as readonly string[]).includes(value);

export type Mode = "build" | "runtime";
export type RoleId = "service" | "adapter" | "domain" | "contract" | "platform" | "starter" | "build";
export type Owner = "krizaka";
export type FlowKind = "http" | "sql" | "amqp" | "webhook" | "sse" | "notify" | "push";
/** Request/response is drawn solid; an event (a message, a callback, a stream, a notification) dashed. */
export const ASYNC_KINDS: readonly FlowKind[] = ["amqp", "webhook", "sse", "notify", "push"];

export interface MapModule {
  id: string;
  role: RoleId;
  owner: Owner;
  repository: string | null;
  repositoryUrl: string | null;
  path: string | null;
  runtime: string;
  version: string | null;
  /** The version printed on the chip: only where it means something (a published artifact). */
  badge: string | null;
  /** The version published on Maven Central, when the site lists the artifact (lib/maven-packages.ts). */
  central: string | null;
  description: string | null;
}

export interface MapDependency {
  from: string;
  to: string;
  /** What the relation is when it is not a plain dependency: a parent POM, a BOM import, a test scope, a version. */
  via: string | null;
  /** Drawn dashed: not on the compile path (parent, import, test). */
  dashed: boolean;
}

export interface MapFlow {
  from: string;
  to: string;
  kind: FlowKind;
  via: string;
  routingKey?: string;
}

export interface ModuleMapData {
  product: Product;
  roles: RoleId[];
  /** The bands each mode shows (runtime: what runs; build: what is compiled). */
  modeRoles: Record<Mode, RoleId[]>;
  modes: Mode[];
  owners: Owner[];
  /** The module selected when a mode opens. */
  defaults: Record<Mode, string | null>;
  modules: MapModule[];
  dependencies: MapDependency[];
  flows: MapFlow[];
}

const JAVA_ROLES: RoleId[] = ["service", "adapter", "domain", "contract", "starter", "platform", "build"];

function fail(product: Product | "model", message: string): never {
  throw new Error(`architecture-model (${product}): ${message} — regenerate the data with \`orazaka docs sync\``);
}

/** Every role a product draws has its words in the messages (diagrams.roles.<product>.<role>). */
function checkRoleText(product: Product, roles: RoleId[]) {
  const text = (en.diagrams.roles as Record<string, Record<string, unknown>>)[product] ?? {};
  const missing = roles.filter((r) => !(r in text));
  if (missing.length) throw new Error(`architecture-model (${product}): no text for the roles ${missing.join(", ")} in messages diagrams.roles.${product}`);
}

const cache = new Map<Product, ModuleMapData>();

/** The Krizaka Java building blocks: the artifacts of the Krizaka repositories, the build included, from their POMs. */
function javaMap(): ModuleMapData {
  const bb = (architecture as { buildingBlocks?: typeof architecture.buildingBlocks }).buildingBlocks ?? fail("java", "no buildingBlocks");
  const roles = bb.roles.map((r) => r.id as RoleId);
  if (roles.join() !== JAVA_ROLES.join()) fail("java", `roles are ${roles.join(", ")}, the map draws ${JAVA_ROLES.join(", ")}`);
  checkRoleText("java", roles);
  const repoUrl = new Map(architecture.repositories.map((r) => [r.name, r.url]));
  const central = new Map(MAVEN_ARTIFACTS.map((a) => [a.artifactId, a.version]));
  const modules: MapModule[] = bb.modules.map((m) => ({
    id: m.id,
    role: m.role as RoleId,
    owner: "krizaka",
    repository: m.repository,
    repositoryUrl: repoUrl.get(m.repository) ?? fail("java", `artifact ${m.id} names an unknown repository ${m.repository}`),
    path: m.path,
    runtime: m.packaging === "pom" ? "pom" : "jvm",
    version: m.version,
    badge: m.version,
    central: central.get(m.id) ?? null,
    description: m.description,
  }));
  const known = new Set(modules.map((m) => m.id));
  // Every artifact the site lists as published exists in the code (a renamed module fails here, not on /open-source).
  const gone = MAVEN_ARTIFACTS.filter((a) => !known.has(a.artifactId)).map((a) => a.artifactId);
  if (gone.length) fail("java", `lib/maven-packages.ts lists artifacts the POMs no longer have: ${gone.join(", ")}`);
  const dependencies: MapDependency[] = bb.dependencies.map((d) => {
    if (!known.has(d.from) || !known.has(d.to)) fail("java", `a dependency names an unknown artifact ${known.has(d.from) ? d.to : d.from}`);
    const plain = d.kind === "compile" || d.kind === "runtime" || d.kind === "provided";
    return { from: d.from, to: d.to, via: d.kind === "compile" ? null : d.kind, dashed: !plain };
  });
  // At run time: the calls between the Krizaka services, as the Orazaka model found them.
  const flows: MapFlow[] = architecture.flows
    .filter((f) => known.has(f.from) && known.has(f.to))
    .map((f) => ({ from: f.from, to: f.to, kind: f.kind as FlowKind, via: f.via, ...(f.routingKey ? { routingKey: f.routingKey } : {}) }));
  return {
    product: "java",
    roles,
    modeRoles: { build: roles, runtime: ["service"] },
    modes: flows.length ? ["build", "runtime"] : ["build"],
    owners: ["krizaka"],
    defaults: { build: "krizaka-security", runtime: "krizaka-users-service" },
    modules,
    dependencies,
    flows,
  };
}

/** The module map of a product: modules by role, build dependencies, runtime flows. */
export function moduleMapData(product: Product = "java"): ModuleMapData {
  if (!cache.has(product)) {
    const data = javaMap();
    for (const [mode, id] of Object.entries(data.defaults)) {
      if (id && !data.modules.some((m) => m.id === id)) fail(product, `the default ${mode} selection ${id} is not a module`);
    }
    cache.set(product, data);
  }
  return cache.get(product)!;
}

/** The modules named by a schema, checked against the model of the product (a renamed module fails the build). */
export function checkModules(ids: readonly string[], where: string, product: Product = "java"): void {
  const known = new Set(moduleMapData(product).modules.map((m) => m.id));
  const missing = ids.filter((id) => !known.has(id));
  if (missing.length) fail(product, `${where} names modules that no longer exist: ${missing.join(", ")}`);
}

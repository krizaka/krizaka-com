/* The architecture of every product, as the schemas draw it — one model, one component (ModuleMap).
   Everything here is read from generated data, never written by hand (AGENTS.md §2):
   - orazaka   app/data/architecture.json              `orazaka docs sync` (products/orazaka/scripts/generate-docs.mjs)
   - java      app/data/architecture.json · buildingBlocks   the same generator, reading the Krizaka POMs
   - orochia   app/data/orochia-architecture.json · map      `npm run docs:generate` (products/orochia/scripts/architecture-map.mjs)
   This module only reshapes the data for the components and checks, at build time, that the shape the schemas rely on
   is there: a model that lost a role, a module or a relation fails the build instead of drawing a wrong picture.
   Server-side: the client components receive the slices they draw. */

import architecture from "@/app/data/architecture.json";
import orochia from "@/app/data/orochia-architecture.json";
import en from "@/messages/en.json";
import { MAVEN_ARTIFACTS } from "@/lib/maven-packages";

export const PRODUCTS = ["orazaka", "orochia", "java"] as const;
export type Product = (typeof PRODUCTS)[number];
export const isProduct = (value: string): value is Product => (PRODUCTS as readonly string[]).includes(value);

export type Mode = "build" | "runtime";
export type RoleId =
  | "client"
  | "service"
  | "adapter"
  | "application"
  | "domain"
  | "contract"
  | "platform"
  | "starter"
  | "build"
  | "library"
  | "design"
  | "data"
  | "external";
export type Owner = "orazaka" | "orochia" | "krizaka" | "external";
export type FlowKind = "http" | "sql" | "amqp" | "webhook" | "sse" | "notify" | "push";
/** Request/response is drawn solid; an event (a message, a callback, a stream, a notification) dashed. */
export const ASYNC_KINDS: readonly FlowKind[] = ["amqp", "webhook", "sse", "notify", "push"];

export interface MapModule {
  id: string;
  /** The package or artifact name when it differs from the id (@orochia/db). */
  name: string | null;
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
  inboundPorts: number;
  outboundPorts: number;
}

export interface MapDependency {
  from: string;
  to: string;
  /** Orazaka: the edge points away from the core (AGENTS.md §2 says it must not). */
  outward: boolean;
  /** What the relation is when it is not a plain dependency: a parent POM, a BOM import, a test scope, a version. */
  via: string | null;
  /** Drawn dashed: not on the compile path (parent, import, test) — or outward. */
  dashed: boolean;
}

export interface MapFlow {
  from: string;
  to: string;
  kind: FlowKind;
  via: string;
  routingKey?: string;
}

export interface JourneyStep {
  title: string;
  detail: string;
  /** The modules this step lights. */
  modules: string[];
  /** The links this step draws (from → to). */
  links: { from: string; to: string; kind: FlowKind }[];
  /** "METHOD /path" — checked against the generated endpoints. */
  endpoint: string | null;
}

export interface Journey {
  id: string;
  name: string;
  summary: string;
  /** The bands the journey is read on. */
  mode: Mode;
  steps: JourneyStep[];
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

export interface PipelineStep {
  interceptor: string;
  /** Core chain: its rank in code. Configured chain: its DB order (two rows may share one). */
  order: number;
  phase: "core" | "dynamic";
  enabled: boolean;
  implemented: boolean;
  concern: string | null;
  summary: string | null;
}

export interface MessagingQueue {
  name: string;
  exchange: string;
  bindings: string[];
  dlq: string | null;
  declaredBy: string;
  consumers: { module: string; kitRetry: boolean }[];
}

export interface MessagingData {
  exchanges: { name: string; type: string }[];
  queues: MessagingQueue[];
  producers: { module: string; exchange: string; routingKey: string }[];
  capabilityRoutes: { feature: string; handler: string | null; routingKey: string }[];
  retry: { maxAttempts: number; initialMs: number; multiplier: number; maxMs: number; property: string; module: string };
}

const ORAZAKA_ROLES: RoleId[] = ["client", "service", "adapter", "application", "domain", "contract", "platform"];
const JAVA_ROLES: RoleId[] = ["service", "adapter", "domain", "contract", "starter", "platform", "build"];
const OROCHIA_ROLES: RoleId[] = ["client", "service", "library", "design", "data", "external"];
const FLOW_KINDS: FlowKind[] = ["http", "sql", "amqp", "webhook", "sse", "notify", "push"];

function fail(product: Product | "model", message: string): never {
  const how = product === "orochia" ? "`npm run docs:generate` in products/orochia" : "`orazaka docs sync`";
  throw new Error(`architecture-model (${product}): ${message} — regenerate the data with ${how}`);
}

/** Every role a product draws has its words in the messages (diagrams.roles.<product>.<role>). */
function checkRoleText(product: Product, roles: RoleId[]) {
  const text = (en.diagrams.roles as Record<string, Record<string, unknown>>)[product] ?? {};
  const missing = roles.filter((r) => !(r in text));
  if (missing.length) throw new Error(`architecture-model (${product}): no text for the roles ${missing.join(", ")} in messages diagrams.roles.${product}`);
}

function checkFlows(product: Product, flows: MapFlow[], known: Set<string>) {
  for (const f of flows) {
    if (!FLOW_KINDS.includes(f.kind)) fail(product, `a flow has an unknown kind ${f.kind}`);
    if (!known.has(f.from) || !known.has(f.to)) fail(product, `a flow names an unknown module ${known.has(f.from) ? f.to : f.from}`);
  }
}

const cache = new Map<Product, ModuleMapData>();

function orazakaMap(): ModuleMapData {
  const roles = (architecture.roles ?? fail("orazaka", "no roles")).map((r) => r.id as RoleId);
  if (roles.join() !== ORAZAKA_ROLES.join()) fail("orazaka", `roles are ${roles.join(", ")}, the map draws ${ORAZAKA_ROLES.join(", ")}`);
  checkRoleText("orazaka", roles);
  const repoUrl = new Map(architecture.repositories.map((r) => [r.name, r.url]));
  const modules: MapModule[] = architecture.modules.map((m) => {
    if (!ORAZAKA_ROLES.includes(m.role as RoleId)) fail("orazaka", `module ${m.id} has an unknown role ${m.role}`);
    return {
      id: m.id,
      name: null,
      role: m.role as RoleId,
      owner: m.owner as Owner,
      repository: m.repository,
      repositoryUrl: repoUrl.get(m.repository) ?? fail("orazaka", `module ${m.id} names an unknown repository ${m.repository}`),
      path: m.path,
      runtime: m.runtime,
      version: m.version,
      badge: m.owner === "krizaka" ? m.version : null,
      central: null,
      description: m.description,
      inboundPorts: m.ports.inbound.length,
      outboundPorts: m.ports.outbound.length,
    };
  });
  const roleOf = new Map(modules.map((m) => [m.id, m.role]));
  const rank = (id: string) => ORAZAKA_ROLES.indexOf(roleOf.get(id) ?? fail("orazaka", `a dependency names an unknown module ${id}`));
  const dependencies: MapDependency[] = architecture.dependencies.map((d) => {
    const outward = rank(d.to) < rank(d.from);
    return { from: d.from, to: d.to, outward, via: null, dashed: outward };
  });
  const flows: MapFlow[] = architecture.flows.map((f) => ({
    from: f.from,
    to: f.to,
    kind: f.kind as FlowKind,
    via: f.via,
    ...(f.routingKey ? { routingKey: f.routingKey } : {}),
  }));
  checkFlows("orazaka", flows, new Set(roleOf.keys()));
  return {
    product: "orazaka",
    roles,
    modeRoles: { build: roles, runtime: ["client", "service"] },
    modes: ["build", "runtime"],
    owners: ["orazaka", "krizaka"],
    defaults: { build: "orazaka-core", runtime: "orazaka-edge" },
    modules,
    dependencies,
    flows,
  };
}

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
    name: null,
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
    inboundPorts: 0,
    outboundPorts: 0,
  }));
  const known = new Set(modules.map((m) => m.id));
  // Every artifact the site lists as published exists in the code (a renamed module fails here, not on /open-source).
  const gone = MAVEN_ARTIFACTS.filter((a) => !known.has(a.artifactId)).map((a) => a.artifactId);
  if (gone.length) fail("java", `lib/maven-packages.ts lists artifacts the POMs no longer have: ${gone.join(", ")}`);
  const dependencies: MapDependency[] = bb.dependencies.map((d) => {
    if (!known.has(d.from) || !known.has(d.to)) fail("java", `a dependency names an unknown artifact ${known.has(d.from) ? d.to : d.from}`);
    const plain = d.kind === "compile" || d.kind === "runtime" || d.kind === "provided";
    return { from: d.from, to: d.to, outward: false, via: d.kind === "compile" ? null : d.kind, dashed: !plain };
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

function orochiaMap(): ModuleMapData {
  const map = (orochia as { map?: typeof orochia.map }).map ?? fail("orochia", "no map");
  const roles = map.roles.map((r) => r.id as RoleId);
  if (roles.join() !== OROCHIA_ROLES.join()) fail("orochia", `roles are ${roles.join(", ")}, the map draws ${OROCHIA_ROLES.join(", ")}`);
  checkRoleText("orochia", roles);
  const repoUrl = new Map(map.repositories.map((r) => [r.name, r.url]));
  const modules: MapModule[] = map.modules.map((m) => {
    if (!OROCHIA_ROLES.includes(m.role as RoleId)) fail("orochia", `module ${m.id} has an unknown role ${m.role}`);
    return {
      id: m.id,
      name: m.name && m.name !== m.id ? m.name : null,
      role: m.role as RoleId,
      owner: m.owner as Owner,
      repository: m.repository,
      repositoryUrl: m.repository ? repoUrl.get(m.repository) ?? (m.owner === "krizaka" ? `https://github.com/krizaka/${m.repository}` : fail("orochia", `module ${m.id} names an unknown repository ${m.repository}`)) : null,
      path: m.path,
      runtime: m.runtime,
      version: m.version,
      badge: m.published ? m.version : null,
      central: null,
      description: m.description,
      inboundPorts: 0,
      outboundPorts: 0,
    };
  });
  const known = new Set(modules.map((m) => m.id));
  const dependencies: MapDependency[] = map.dependencies.map((d) => {
    if (!known.has(d.from) || !known.has(d.to)) fail("orochia", `a dependency names an unknown module ${known.has(d.from) ? d.to : d.from}`);
    return { from: d.from, to: d.to, outward: false, via: "version" in d && d.version ? String(d.version) : null, dashed: false };
  });
  const flows: MapFlow[] = map.flows.map((f) => ({ from: f.from, to: f.to, kind: f.kind as FlowKind, via: f.via }));
  checkFlows("orochia", flows, known);
  return {
    product: "orochia",
    roles,
    modeRoles: { build: ["client", "service", "library", "design"], runtime: ["client", "service", "data", "external"] },
    modes: ["build", "runtime"],
    owners: ["orochia", "krizaka", "external"],
    defaults: { build: "orochia-api", runtime: "orochia-api" },
    modules,
    dependencies,
    flows,
  };
}

/** The module map of a product: modules by role, build dependencies, runtime flows. */
export function moduleMapData(product: Product = "orazaka"): ModuleMapData {
  if (!cache.has(product)) {
    const data = product === "orazaka" ? orazakaMap() : product === "java" ? javaMap() : orochiaMap();
    for (const [mode, id] of Object.entries(data.defaults)) {
      if (id && !data.modules.some((m) => m.id === id)) fail(product, `the default ${mode} selection ${id} is not a module`);
    }
    cache.set(product, data);
  }
  return cache.get(product)!;
}

/** The PostgreSQL enums of Orochia (the ```states``` blocks of its docs are checked against them). */
export function orochiaEnums(): Record<string, string[]> {
  return (orochia as { enums?: Record<string, string[]> }).enums ?? fail("orochia", "no enums");
}

/** The endpoints Orochia's code serves, as "METHOD /path". */
export function orochiaEndpoints(): Set<string> {
  return new Set(orochia.apiEndpoints.map((e) => `${e.method} ${e.path}`));
}

/** The interceptor pipeline: the core chain (code order, non-bypassable) then the configured rows (DB order). */
export function pipelineSteps(): PipelineStep[] {
  const core: PipelineStep[] = architecture.coreChain.map((c) => ({
    interceptor: c.interceptor,
    order: c.rank,
    phase: "core",
    enabled: true,
    implemented: true,
    concern: c.concern ?? null,
    summary: c.summary ?? null,
  }));
  const dynamic: PipelineStep[] = architecture.pipeline
    .filter((p) => p.phase === "dynamic")
    .map((p) => ({
      interceptor: p.interceptor,
      order: p.order,
      phase: "dynamic",
      enabled: p.enabled,
      implemented: p.implemented,
      concern: "concern" in p ? (p.concern as string) : null,
      summary: "summary" in p ? (p.summary as string) : null,
    }));
  if (!core.length || !dynamic.length) fail("orazaka", "the interceptor pipeline is empty");
  return [...core, ...dynamic];
}

/** The AMQP topology: exchanges, queues with their bindings, DLQ and consumers, producers, the kit's retry policy. */
export function messagingData(): MessagingData {
  const m = architecture.messaging;
  if (!m.exchanges.length || !m.queues.length) fail("orazaka", "the messaging topology is empty");
  const queues: MessagingQueue[] = m.queues.map((q) => ({
    name: q.name,
    exchange: q.exchange,
    bindings: q.binding ? q.binding.split(", ") : [],
    dlq: q.dlq,
    declaredBy: q.declaredBy,
    consumers: m.consumers.filter((c) => c.queue === q.name).map((c) => ({ module: c.module, kitRetry: c.retry === "kit" })),
  }));
  return { exchanges: m.exchanges, queues, producers: m.producers, capabilityRoutes: m.capabilityRoutes, retry: m.retry };
}

/** The modules named by a schema, checked against the model of the product (a renamed module fails the build). */
export function checkModules(ids: readonly string[], where: string, product: Product = "orazaka"): void {
  const known = new Set(moduleMapData(product).modules.map((m) => m.id));
  const missing = ids.filter((id) => !known.has(id));
  if (missing.length) fail(product, `${where} names modules that no longer exist: ${missing.join(", ")}`);
}

/** Counts quoted in prose, read from the model so the text cannot drift from the code. */
export function architectureCounts() {
  const steps = pipelineSteps();
  return {
    modules: architecture.modules.length,
    services: architecture.modules.filter((m) => m.role === "service").length,
    coreInterceptors: steps.filter((s) => s.phase === "core").length,
    configuredInterceptors: steps.filter((s) => s.phase === "dynamic" && s.implemented).length,
    queues: architecture.messaging.queues.length,
  };
}

/* The Orazaka architecture, as the schemas draw it.
   Everything here is read from app/data/architecture.json — generated from the Orazaka code by
   `orazaka docs build` (scripts/generate-docs.mjs) and copied by `orazaka docs sync` — never written by
   hand (AGENTS.md §2). This module only reshapes it for the components and checks, at build time, that
   the shape the schemas rely on is there: a model that lost a role, a module or a queue fails the build
   instead of drawing a wrong picture. Server-side: the client components receive the slices they draw. */

import architecture from "@/app/data/architecture.json";

export type RoleId = "client" | "service" | "adapter" | "application" | "domain" | "contract" | "platform";
export type Owner = "krizaka" | "orazaka";

export interface MapModule {
  id: string;
  role: RoleId;
  owner: Owner;
  repository: string;
  repositoryUrl: string;
  path: string;
  runtime: string;
  version: string | null;
  description: string | null;
  inboundPorts: number;
  outboundPorts: number;
}

export interface MapDependency {
  from: string;
  to: string;
  /** The edge points away from the core: the target sits on an outer ring (AGENTS.md §2 says it must not). */
  outward: boolean;
}

export interface MapFlow {
  from: string;
  to: string;
  kind: "http" | "amqp";
  via: string;
  routingKey?: string;
}

export interface ModuleMapData {
  roles: RoleId[];
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

const ROLE_ORDER: RoleId[] = ["client", "service", "adapter", "application", "domain", "contract", "platform"];

function fail(message: string): never {
  throw new Error(`architecture-model: ${message} — regenerate app/data/architecture.json with \`orazaka docs sync\``);
}

/** The module map: modules by role, build dependencies (with the ones pointing outward flagged) and runtime flows. */
export function moduleMapData(): ModuleMapData {
  const roles = (architecture.roles ?? fail("no roles")).map((r) => r.id as RoleId);
  if (roles.join() !== ROLE_ORDER.join()) fail(`roles are ${roles.join(", ")}, the map draws ${ROLE_ORDER.join(", ")}`);

  const repoUrl = new Map(architecture.repositories.map((r) => [r.name, r.url]));
  const modules: MapModule[] = architecture.modules.map((m) => {
    if (!ROLE_ORDER.includes(m.role as RoleId)) fail(`module ${m.id} has an unknown role ${m.role}`);
    return {
      id: m.id,
      role: m.role as RoleId,
      owner: m.owner as Owner,
      repository: m.repository,
      repositoryUrl: repoUrl.get(m.repository) ?? fail(`module ${m.id} names an unknown repository ${m.repository}`),
      path: m.path,
      runtime: m.runtime,
      version: m.version,
      description: m.description,
      inboundPorts: m.ports.inbound.length,
      outboundPorts: m.ports.outbound.length,
    };
  });
  const roleOf = new Map(modules.map((m) => [m.id, m.role]));
  const rank = (id: string) => ROLE_ORDER.indexOf(roleOf.get(id) ?? fail(`dependency names an unknown module ${id}`));

  const dependencies: MapDependency[] = architecture.dependencies.map((d) => ({
    from: d.from,
    to: d.to,
    outward: rank(d.to) < rank(d.from),
  }));
  const flows: MapFlow[] = architecture.flows.map((f) => {
    rank(f.from);
    rank(f.to);
    return { from: f.from, to: f.to, kind: f.kind as MapFlow["kind"], via: f.via, ...(f.routingKey ? { routingKey: f.routingKey } : {}) };
  });
  return { roles, modules, dependencies, flows };
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
  if (!core.length || !dynamic.length) fail("the interceptor pipeline is empty");
  return [...core, ...dynamic];
}

/** The AMQP topology: exchanges, queues with their bindings, DLQ and consumers, producers, the kit's retry policy. */
export function messagingData(): MessagingData {
  const m = architecture.messaging;
  if (!m.exchanges.length || !m.queues.length) fail("the messaging topology is empty");
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

/** The modules named by a schema, checked against the model (a renamed module fails the build). */
export function checkModules(ids: readonly string[], where: string): void {
  const known = new Set(architecture.modules.map((m) => m.id));
  const missing = ids.filter((id) => !known.has(id));
  if (missing.length) fail(`${where} names modules that no longer exist: ${missing.join(", ")}`);
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

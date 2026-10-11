/* The journeys of the module maps — a real request followed through the modules, step by step.
   Structure here (which modules each step lights, which links it draws, the endpoint it names), words in the messages
   (diagrams.journeys.<product>.<id>, and the Orazaka request's pages.howOrazakaWorks.steps). Everything is checked
   at build time against the generated model: an unknown module, a link that is neither a runtime flow nor a build
   dependency of the code, or an endpoint the code no longer serves fails the build instead of leaving the page wrong. */

import { format } from "@krizaka/i18n";
import type { TranslationDictionary } from "@/lib/i18n";
import { ASYNC_KINDS, moduleMapData, orochiaEndpoints, type FlowKind, type Journey, type Mode, type Product } from "@/lib/architecture-model";

/** A link: from, to, and — for an answer travelling back the way a request came — the kind of that request. */
type Link = [string, string] | [string, string, FlowKind];
interface StepShape {
  modules: string[];
  links?: Link[];
  endpoint?: string;
}
interface JourneyShape {
  id: string;
  mode: Mode;
  steps: StepShape[];
}

const CLIENTS = ["orazaka-web-client", "orazaka-web-admin", "orazaka-mobile-client", "orazaka-cli"];
const GATEWAYS = ["ccbill", "segpay", "nowpayments", "stripe"];

/** The Orazaka request: the six stages of HowOrazakaWorks, on the modules that carry them. */
const ORAZAKA: JourneyShape[] = [
  {
    id: "request",
    mode: "build",
    steps: [
      { modules: CLIENTS },
      { modules: ["orazaka-edge", "orazaka-conversation-service"], links: [...CLIENTS.filter((c) => c !== "orazaka-cli").map((c): [string, string] => [c, "orazaka-edge"]), ["orazaka-cli", "orazaka-edge"], ["orazaka-edge", "orazaka-conversation-service"]] },
      { modules: ["krizaka-security", "krizaka-users-service", "orazaka-interceptors"], links: [["orazaka-edge", "krizaka-users-service"], ["orazaka-conversation-service", "orazaka-interceptors"], ["orazaka-core", "krizaka-security"]] },
      { modules: ["orazaka-business", "orazaka-core"], links: [["orazaka-conversation-service", "orazaka-business"], ["orazaka-business", "orazaka-core"]] },
      { modules: ["orazaka-interceptors", "orazaka-job-service", "orazaka-worker-media"], links: [["orazaka-interceptors", "orazaka-core"], ["orazaka-conversation-service", "orazaka-job-service"], ["orazaka-conversation-service", "orazaka-worker-media"]] },
      { modules: ["orazaka-persistence-app", "krizaka-users-persistence"], links: [["orazaka-conversation-service", "orazaka-persistence-app"]] },
    ],
  },
];

/** The three Orochia journeys: what a viewer, a buyer and a creator set in motion. */
const OROCHIA: JourneyShape[] = [
  {
    id: "playback",
    mode: "runtime",
    steps: [
      { modules: ["orochia-web", "orochia-api"], links: [["orochia-web", "orochia-api"]], endpoint: "GET /api/videos/[id]/stream" },
      { modules: ["orochia-api", "postgresql"], links: [["orochia-api", "postgresql"]] },
      { modules: ["orochia-api"], links: [["postgresql", "orochia-api", "sql"]] },
      { modules: ["orochia-api", "orochia-web"], links: [["orochia-api", "orochia-web", "http"]] },
      { modules: ["orochia-web", "bunny-stream"], links: [["orochia-web", "bunny-stream"]] },
    ],
  },
  {
    id: "unlock",
    mode: "runtime",
    steps: [
      { modules: ["orochia-web", "orochia-api"], links: [["orochia-web", "orochia-api"]], endpoint: "POST /api/videos/unlock-video" },
      { modules: ["orochia-api", "postgresql"], links: [["orochia-api", "postgresql"]] },
      { modules: ["orochia-api", "orochia-web"], links: [["orochia-api", "orochia-web", "http"]] },
      { modules: ["orochia-web", ...GATEWAYS], links: GATEWAYS.map((g): [string, string] => ["orochia-web", g]) },
      { modules: [...GATEWAYS, "orochia-api"], links: GATEWAYS.map((g): [string, string] => [g, "orochia-api"]), endpoint: "POST /api/webhooks/payments/[gateway]" },
      { modules: ["orochia-api", "postgresql"], links: [["orochia-api", "postgresql"]] },
    ],
  },
  {
    id: "upload",
    mode: "runtime",
    steps: [
      { modules: ["orochia-web", "orochia-api"], links: [["orochia-web", "orochia-api"]], endpoint: "POST /api/videos/create-upload-session" },
      { modules: ["orochia-api", "bunny-stream"], links: [["orochia-api", "bunny-stream"]] },
      { modules: ["orochia-api", "orochia-web"], links: [["orochia-api", "orochia-web", "http"]] },
      { modules: ["orochia-web", "bunny-stream"], links: [["orochia-web", "bunny-stream"]] },
      { modules: ["bunny-stream", "orochia-api"], links: [["bunny-stream", "orochia-api"]], endpoint: "POST /api/webhooks/bunny" },
      { modules: ["orochia-api", "postgresql"], links: [["orochia-api", "postgresql"]] },
    ],
  },
];

const SHAPES: Record<Product, JourneyShape[]> = { orazaka: ORAZAKA, orochia: OROCHIA, java: [] };

/** The modules each stage of the Orazaka request names (HowOrazakaWorks prints them under "In the code"). */
export function orazakaStageModules(): string[][] {
  return verified("orazaka").find((j) => j.id === "request")!.steps.map((s) => s.modules);
}

const checked = new Set<Product>();

/** The journeys of a product after checking every module, link and endpoint they name against the generated model. */
function verified(product: Product): JourneyShape[] {
  const shapes = SHAPES[product];
  if (checked.has(product)) return shapes;
  const data = moduleMapData(product);
  const known = new Set(data.modules.map((m) => m.id));
  const related = (a: string, b: string, kind?: FlowKind) =>
    data.flows.some((f) => ((f.from === a && f.to === b) || (f.from === b && f.to === a)) && (!kind || f.kind === kind)) ||
    (!kind && data.dependencies.some((d) => (d.from === a && d.to === b) || (d.from === b && d.to === a)));
  const endpoints = product === "orochia" ? orochiaEndpoints() : null;
  const problems: string[] = [];
  for (const j of shapes) {
    j.steps.forEach((s, i) => {
      const where = `${product} journey ${j.id}, step ${i + 1}`;
      for (const id of [...s.modules, ...(s.links ?? []).flatMap(([a, b]) => [a, b])]) if (!known.has(id)) problems.push(`${where}: unknown module ${id}`);
      for (const [a, b, kind] of s.links ?? []) if (known.has(a) && known.has(b) && !related(a, b, kind)) problems.push(`${where}: ${a} → ${b}${kind ? ` (${kind})` : ""} is neither a call nor a dependency in the code`);
      if (s.endpoint && endpoints && !endpoints.has(s.endpoint)) problems.push(`${where}: the endpoint ${s.endpoint} is not served by the code`);
    });
  }
  if (problems.length) throw new Error(`journeys: ${problems.join("; ")} (lib/journeys.ts)`);
  checked.add(product);
  return shapes;
}

/** The kind of the link a → b, read from the model: the flow between them (either way), else a build dependency. */
function linkKind(product: Product, a: string, b: string): FlowKind {
  const data = moduleMapData(product);
  const flow = data.flows.find((f) => f.from === a && f.to === b) ?? data.flows.find((f) => f.from === b && f.to === a);
  return flow?.kind ?? "http";
}

/** The journeys of a product with their words, ready for ModuleMap. */
export function journeysFor(product: Product, t: TranslationDictionary, counts?: { core: number; configured: number }): Journey[] {
  return verified(product).map((j) => {
    const words =
      product === "orazaka"
        ? {
            ...t.diagrams.journeys.orazaka.request,
            steps: t.pages.howOrazakaWorks.steps.map((s) => ({ title: s.title, detail: counts ? format(s.what, counts) : s.what })),
          }
        : (t.diagrams.journeys.orochia as Record<string, { name: string; summary: string; steps: { title: string; detail: string }[] }>)[j.id];
    if (!words || words.steps.length !== j.steps.length) throw new Error(`journeys: the ${product} journey ${j.id} has ${j.steps.length} steps, its messages ${words?.steps.length ?? 0}`);
    return {
      id: j.id,
      name: words.name,
      summary: words.summary,
      mode: j.mode,
      steps: j.steps.map((s, i) => ({
        title: words.steps[i].title,
        detail: words.steps[i].detail,
        modules: s.modules,
        links: (s.links ?? []).map(([from, to, kind]) => ({ from, to, kind: kind ?? linkKind(product, from, to) })),
        endpoint: s.endpoint ?? null,
      })),
    };
  });
}

export const isAsync = (kind: FlowKind) => ASYNC_KINDS.includes(kind);

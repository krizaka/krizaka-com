/* The schema a synced Orazaka doc opens with, drawn from the same generated model as its tables:
   the module map on "Architecture Overview", the pipeline on "Interceptor Registry". The tables of the
   doc below remain the reference; the schema is how to read them at a glance. */

import ModuleMap from "@/app/components/diagrams/ModuleMap";
import InterceptorPipeline from "@/app/components/diagrams/InterceptorPipeline";
import MessagingTopology from "@/app/components/diagrams/MessagingTopology";
import { messagingData, moduleMapData, pipelineSteps } from "@/lib/architecture-model";
import type { TranslationDictionary } from "@/lib/i18n";

export const DOC_DIAGRAMS = ["architecture", "interceptors"] as const;

export default function ArchitectureDocDiagram({ page, t }: { page: string; t: TranslationDictionary }) {
  if (page === "architecture") {
    return (
      <div className="not-prose" style={{ display: "flex", flexDirection: "column", gap: 40, margin: "0 0 40px" }}>
        <ModuleMap data={moduleMapData()} compact />
        <MessagingTopology data={messagingData()} />
      </div>
    );
  }
  if (page === "interceptors") {
    return (
      <div className="not-prose" style={{ margin: "0 0 40px" }}>
        <InterceptorPipeline steps={pipelineSteps()} text={t.diagrams.pipeline} />
      </div>
    );
  }
  return null;
}

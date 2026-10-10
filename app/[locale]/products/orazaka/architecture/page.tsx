import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";
import architecture from "@/app/data/architecture.json";
import HowOrazakaWorks from "../../../../components/HowOrazakaWorks";
import ModuleMap from "@/app/components/diagrams/ModuleMap";
import InterceptorPipeline from "@/app/components/diagrams/InterceptorPipeline";
import MessagingTopology from "@/app/components/diagrams/MessagingTopology";
import DiagramSection from "@/app/components/diagrams/DiagramSection";
import { architectureCounts, messagingData, moduleMapData, pipelineSteps } from "@/lib/architecture-model";
import { verifiedJourneyModules } from "@/lib/orazaka-journey";
import TopNavBar from "../../../../components/TopNavBar";
import SiteFooter from "../../../../components/SiteFooter";
import RepositoryMap, { type RepositoryEntry } from "../../../../components/RepositoryMap";
import { format, getDictionary } from "@/lib/i18n";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const text = getDictionary(locale).pages.orazakaArchitecture;
  const title = text.howOrazakaWorksKrizaka;
  const description = text.interactiveSchemaOfTheOperational;
  return {
    title,
    description,
    alternates: buildAlternates(locale, `/products/orazaka/architecture`),
  };
}

/* The six-stage journey — the stage colours of HowOrazakaWorks, so the header hints at the story below. */
const STAGE_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#6366f1", "#10b981", "#f43f5e"];
// Names: messages → pages.orazakaArchitecture.stageHints[i].

export default async function ArchitecturePage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const text = t.pages.orazakaArchitecture;
  const counts = architectureCounts();
  const sections = t.diagrams.sections;

  return (
    <main style={{ background: "var(--kz-surface-0)", color: "var(--kz-text-primary)", minHeight: "100vh" }}>
      <TopNavBar />

      {/* ─── Premium, calm hero header ─── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(104px, 12vw, 148px) 20px 40px",
          textAlign: "center",
          maxWidth: "1120px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* soft accent glow */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(720px, 92vw)",
            height: "360px",
            background: "radial-gradient(60% 60% at 50% 30%, color-mix(in srgb, var(--kz-accent) 14%, transparent) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* faint blueprint grid, masked to fade at the edges */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(var(--kz-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--kz-grid-color) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(80% 70% at 50% 30%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(80% 70% at 50% 30%, black 40%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--kz-accent)",
              margin: 0,
            }}
          >
            {text.howItWorks}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 5.5vw, 2.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--kz-text-primary)",
              margin: "14px 0 0",
            }}
          >
            {text.theJourneyOfARequest}
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.7, color: "var(--kz-text-secondary)", margin: "16px 0 0" }}>
            {text.orazakaOrchestratesAModularSecure}
          </p>

          {/* six-stage hint chips */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px",
              margin: "24px auto 0",
              maxWidth: "620px",
            }}
          >
            {STAGE_COLORS.map((color, i) => (
              <span
                key={color}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "5px 11px 5px 9px",
                  borderRadius: "999px",
                  fontSize: "11.5px",
                  fontWeight: 600,
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  color: "var(--kz-text-secondary)",
                  background: "color-mix(in srgb, var(--kz-surface-2) 55%, transparent)",
                  border: "1px solid var(--kz-border-subtle)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "var(--kz-text-muted)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" style={{ width: "7px", height: "7px", borderRadius: "50%", background: color }} />
                {text.stageHints[i]}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Evangelist teaching layer — the mental model + a narrated request, its modules checked against the code ─── */}
      <HowOrazakaWorks counts={{ core: counts.coreInterceptors, configured: counts.configuredInterceptors }} stepModules={verifiedJourneyModules()} />

      {/* ─── The real map: every module in its ring (generated) ─── */}
      <DiagramSection id="map" kicker={sections.map.kicker} title={sections.map.title} sub={format(sections.map.sub, { modules: counts.modules })}>
        <ModuleMap data={moduleMapData()} />
      </DiagramSection>

      {/* ─── The interceptor pipeline, in order (generated) ─── */}
      <DiagramSection
        id="pipeline"
        kicker={sections.pipeline.kicker}
        title={sections.pipeline.title}
        sub={format(sections.pipeline.sub, { core: counts.coreInterceptors, configured: counts.configuredInterceptors })}
      >
        <InterceptorPipeline steps={pipelineSteps()} text={t.diagrams.pipeline} />
      </DiagramSection>

      {/* ─── The messaging topology (generated) ─── */}
      <DiagramSection id="messaging" kicker={sections.messaging.kicker} title={sections.messaging.title} sub={format(sections.messaging.sub, { queues: counts.queues })}>
        <MessagingTopology data={messagingData()} />
      </DiagramSection>

      {/* ─── Where each component lives: one GitHub repository per component (generated) ─── */}
      <RepositoryMap
        repositories={(architecture as { repositories?: RepositoryEntry[] }).repositories ?? []}
        locale={locale}
      />

      <SiteFooter />
    </main>
  );
}

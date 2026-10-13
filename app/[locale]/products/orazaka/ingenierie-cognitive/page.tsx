import type { Metadata } from "next";
import { localizedMetadata } from "@/lib/seo";
import Link from "next/link";
import { AiIcon, AutomationIcon, ForwardIcon, KnowledgeIcon, LockIcon, ShieldIcon } from "@krizaka/icons";
import { ArgumentCard } from "@krizaka/ui/argument-card";
import { CardGrid } from "@krizaka/ui/card-grid";
import { CtaPanel } from "@krizaka/ui/cta-panel";
import { MascotQuote } from "@krizaka/ui/mascot-quote";
import { Mascot } from "@krizaka/ui/mascots";
import { Facts, Section } from "@krizaka/ui/page";
import { PageHero } from "@krizaka/ui/page-hero";
import TopNavBar from "@/app/components/TopNavBar";
import SiteFooter from "@/app/components/SiteFooter";
import ButtonLink from "@/app/components/ButtonLink";
import { architectureCounts } from "@/lib/architecture-model";
import { format, getDictionary } from "@/lib/i18n";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...localizedMetadata(locale, {
      path: "/products/orazaka/ingenierie-cognitive",
      en: {
        title: "Cognitive Engineering in AI — Sovereign Reasoning",
        description:
          "Beyond the prompt: Orazaka's 9-step deterministic pipeline enriches, refines, routes, and validates every AI interaction locally.",
        og: {
          title: "Cognitive Engineering in AI | Krizaka",
          description:
            "Beyond the prompt: a 9-step pipeline that enriches, refines, routes, and validates every AI interaction. Sovereign, open source, Law 25 compliant.",
        },
      },
      fr: {
        title: "Ingénierie Cognitive & IA Souveraine — Raisonnement Localisé",
        description:
          "Au-delà du prompt : découvrez l'ingénierie cognitive d'Orazaka. Un pipeline déterministe d'intercepteurs qui enrichit et valide chaque requête en local.",
        og: {
          title: "Ingénierie cognitive — Pipeline cognitif IA | Krizaka Montréal",
          description:
            "Au-delà du prompt : un pipeline à 9 étapes qui enrichit, route et valide chaque interaction IA en local. Conforme Loi 25.",
        },
      },
    }),
    keywords: [
      "ingénierie cognitive",
      "cognitive engineering",
      "pipeline cognitif",
      "enrichissement contextuel IA",
      "orchestration IA",
      "routage intentionnel",
      "mémoire conversationnelle IA",
      "RAG pipeline",
      "MCP protocol",
      "validation multi-agents",
      "IA on-premise",
      "Orazaka",
      "Krizaka",
    ],
  };
}

const PILLAR_ICONS = [AiIcon, KnowledgeIcon, ShieldIcon] as const;

/* /products/orazaka/ingenierie-cognitive — what cognitive engineering means in Orazaka, told with the page blocks of
   @krizaka/ui (AGENTS.md §4.1): the hero and the owl that reads, the vision as the owl's quote, the three pillars, the
   three stages of the pipeline, the two phases of the executor, the modes and the effort, then the stateless API
   against the reasoning engine and the way to the packs. The interceptor counts come from the generated model
   (app/data/architecture.json), never typed. No animation library: blocks rise with [data-reveal]. */
export default async function CognitiveEngineeringPage({ params }: Props) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const p = t.cognitiveEngineeringPage;
  const c = t.pages.cognitive;
  const counts = architectureCounts();
  const total = counts.coreInterceptors + counts.configuredInterceptors;
  const stages = [
    { title: c.perceptionIngestion, text: c.theQueryIsCleanedSystem, Icon: AiIcon },
    { title: c.reasoningContext, text: c.orazakaQueriesLongTermContext, Icon: KnowledgeIcon },
    { title: c.validationMetacognition, text: c.theFinalOutputIsAudited, Icon: ShieldIcon },
  ];
  const effort = [
    { level: c.low, sub: c.directResponse, interceptors: c.t35Interceptors, tokens: c.minimalTokens },
    { level: c.medium, sub: c.standardAnalysis, interceptors: c.t710Interceptors, tokens: c.balancedBudget },
    { level: c.high, sub: c.deepDeliberation, interceptors: format(c.t1215Interceptors, { interceptors: total }), tokens: c.maximumBudget },
  ];
  const right = p.diffRightFeatures.map((f) => ({ ...f, desc: format(f.desc, { core: counts.coreInterceptors, configured: counts.configuredInterceptors }) }));

  return (
    <main style={{ background: "var(--kz-surface-0)", minHeight: "100vh", color: "var(--kz-text-primary)" }}>
      <TopNavBar />
      <PageHero
        back={{ href: "/products/orazaka", label: p.backProduct }}
        linkAs={Link}
        eyebrow={p.eyebrow}
        title={p.introTitle}
        lead={p.introText.split("\n\n")[0]}
        aside={<Mascot bird="owl" mood="thinking" size={112} />}
      />

      {/* The first section is on a phone's first screen: painted at once (LCP). */}
      <Section aria-label={p.visionTitle} spacing="sm">
        <div className="rd-two">
          <p className="rd-prose">{p.introText.split("\n\n").slice(1).join(" ")}</p>
          <MascotQuote variant="inline" bird="owl" label={p.visionTitle}>
            {p.visionText.split("\n\n")[1] ?? p.visionText}
          </MascotQuote>
        </div>
      </Section>

      <Section id="pillars" eyebrow={c.fullCognition} title={p.neuromorphicTitle} lead={p.neuromorphicDesc} reveal divider>
        <CardGrid min={280}>
          {p.neuromorphicCards.map((card, i) => {
            const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
            return (
              <ArgumentCard
                key={card.title}
                id={`pillar-${i}`}
                icon={<Icon size={20} nodeColor="var(--kz-accent)" />}
                title={card.title}
                meta={card.moduleName}
                facts={[{ label: card.brainRegion }]}
                hook={{ label: card.moduleName, text: card.desc }}
              />
            );
          })}
        </CardGrid>
      </Section>

      <Section id="pipeline" eyebrow={c.controlArchitecture} title={p.pipelineTitle} lead={p.pipelineDesc} reveal divider>
        <CardGrid as="ol" min={260} fit="fit">
          {stages.map(({ title, text, Icon }, i) => (
            <ArgumentCard
              key={title}
              id={`stage-${i}`}
              icon={<Icon size={20} nodeColor="var(--kz-accent)" />}
              title={title}
              meta={String(i + 1).padStart(2, "0")}
              hook={{ label: title, text }}
            />
          ))}
        </CardGrid>
      </Section>

      <Section id="executor" eyebrow={c.inferenceProcessor} title={p.executorTitle} lead={p.executorDesc} reveal divider>
        <CardGrid min={320} fit="fit">
          <ArgumentCard
            id="phase-1"
            icon={<KnowledgeIcon size={20} nodeColor="var(--kz-accent)" />}
            title={p.executorPhases[0].title}
            hook={{ label: p.executorPhases[0].title, text: p.executorPhases[0].desc }}
            facts={[{ label: c.memory }, { label: c.knowledge }, { label: c.rules }, { label: c.enrichedContext, tone: "ok" }]}
          />
          <ArgumentCard
            id="phase-2"
            icon={<LockIcon size={20} nodeColor="var(--kz-accent)" />}
            title={p.executorPhases[1].title}
            hook={{ label: p.executorPhases[1].title, text: p.executorPhases[1].desc }}
            facts={[{ label: c.secureSandbox }, { label: c.complianceChecks }, { label: c.secureDelivery, tone: "ok" }]}
          />
        </CardGrid>
      </Section>

      <Section id="modes" eyebrow={c.operatingModes} title={p.modesTitle} lead={p.modesDesc} reveal divider>
        <div className="rd-stack">
          <CardGrid min={320} fit="fit">
            {p.modes.map((mode, i) => (
              <ArgumentCard
                key={mode.title}
                id={`mode-${i}`}
                icon={<AutomationIcon size={20} nodeColor="var(--kz-accent)" />}
                title={mode.title}
                facts={[{ label: c.defaultMode, tone: "ok" }]}
                hook={{ label: mode.title, text: mode.desc }}
              />
            ))}
          </CardGrid>
          <h3 className="kz-heading-title rd-h2">{p.effortTitle}</h3>
          <p className="rd-prose">{p.effortDesc}</p>
          <CardGrid as="ol" min={220} fit="fit">
            {effort.map((lv, i) => (
              <ArgumentCard key={lv.level} id={`effort-${i}`} title={lv.level} level={4} meta={lv.sub} hook={{ label: lv.level, text: lv.interceptors }} facts={[{ label: lv.tokens }]} />
            ))}
          </CardGrid>
          <h3 className="kz-heading-title rd-h2">{p.extensibilityTitle}</h3>
          <p className="rd-prose">{format(p.extensibilityDesc, { interceptors: total })}</p>
          <Facts
            aria-label={c.chooseYourInterceptors}
            items={[c.audit, c.memory, c.security, c.metrics, c.routing, c.cache].map((label, i) => ({ label, tone: i === 0 ? "ok" : "neutral" }))}
          />
        </div>
      </Section>

      <Section id="compare" eyebrow={c.reasoning} title={p.diffTitle} reveal divider>
        <div className="rd-two">
          <div className="rd-stack">
            <h3 className="kz-heading-title rd-h2">{p.diffLeftTitle}</h3>
            <p className="kz-label">{p.diffLeftSub}</p>
            <ul className="kz-list rd-no">
              {p.diffLeftFeatures.map((f) => (
                <li key={f.title}>
                  <strong>{f.title}</strong> — {f.desc}
                </li>
              ))}
            </ul>
          </div>
          <div className="rd-stack">
            <h3 className="kz-heading-title rd-h2">{p.diffRightTitle}</h3>
            <p className="kz-label">{p.diffRightSub}</p>
            <ul className="kz-list rd-large">
              {right.map((f) => (
                <li key={f.title}>
                  <strong>{f.title}</strong> — {f.desc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section spacing="sm" aria-labelledby="cognitive-cta">
        <CtaPanel id="cognitive-cta" title={p.ctaTitle} body={p.ctaDesc} reveal>
          <ButtonLink href="/products/orazaka/packages" variant="primary" size="lg" shimmer>
            {p.ctaButton} <ForwardIcon size={15} aria-hidden />
          </ButtonLink>
        </CtaPanel>
      </Section>
      <SiteFooter />
    </main>
  );
}

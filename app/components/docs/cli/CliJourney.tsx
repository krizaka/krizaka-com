import {
  AiIcon,
  ChatIcon,
  CheckIcon,
  DownloadIcon,
  GlobeIcon,
  HomeIcon,
  ImageIcon,
  PlayIcon,
  ServerIcon,
  SettingsIcon,
  VideoIcon,
} from "@krizaka/icons";
import { cliModel } from "@/lib/cli-model";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { CodeBlock } from "@krizaka/ui/code-block";

/* What the quick start does (```cli-journey in the synced CLI.md): the three commands in order, each with the phases it
   announces — read from the CLI's code by the generator (architecture.json · cli.journey) — and, for `dev`, the
   processes it launches with their ports. Ordered lists: it is its own text version. Server Component. */

type Icon = typeof CheckIcon;
/** The picture of a step and of its phases — structure only, keyed by the ids the generator reads from the CLI. */
const STEP_ICON: Record<string, Icon> = { install: DownloadIcon, start: ServerIcon, dev: PlayIcon };
const PHASE_ICON: Record<string, Icon> = {
  "install:1": CheckIcon,
  "install:2": DownloadIcon,
  "install:workspace": GlobeIcon,
  "install:3": VideoIcon,
  "install:4": SettingsIcon,
  "start:1": ServerIcon,
  "start:2": AiIcon,
  "start:3": ImageIcon,
  "start:3b": ImageIcon,
  "start:4": VideoIcon,
  "start:5a": ChatIcon,
  "start:5b": HomeIcon,
};

export function CliJourney({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs.cli;
  const cli = cliModel();
  const runner = `npx ${cli.alias ?? cli.package}`;
  return (
    <ol className="kz-cli-journey not-prose" aria-label={t.journeyLabel}>
      {cli.journey.map((step, i) => {
        const StepIcon = STEP_ICON[step.command] ?? PlayIcon;
        const command = `${runner} ${step.command}`;
        return (
          <li key={step.command} className="kz-cli-step">
            <div className="kz-cli-step-head">
              <span className="kz-cli-step-icon" aria-hidden>
                <StepIcon size={18} aria-hidden />
              </span>
              <span className="kz-cli-step-n">{format(t.step, { n: i + 1 })}</span>
            </div>
            <CodeBlock className="kz-cli-step-run" code={command} language="bash" copyLabel={t.copyCommand} copiedLabel={t.copied} />
            <p className="kz-cli-step-text" lang="en">
              {step.description}
            </p>
            {step.phases && (
              <ol className="kz-cli-phases">
                {step.phases.map((phase) => {
                  const PhaseIcon = PHASE_ICON[`${step.command}:${phase.id}`] ?? CheckIcon;
                  const numbered = /^\d/.test(phase.id);
                  return (
                    <li key={phase.id} data-optional={phase.detail === "--mode full" ? "" : undefined}>
                      <PhaseIcon size={15} aria-hidden />
                      <span className="kz-cli-phase-id">{numbered ? phase.id : "·"}</span>
                      <span lang="en">{phase.title}</span>
                      {phase.detail && <span className="kz-cli-phase-detail">{phase.detail === "--mode full" ? t.full : <span lang="en">{phase.detail}</span>}</span>}
                    </li>
                  );
                })}
              </ol>
            )}
            {step.processes && (
              <>
                <p className="kz-cli-launched">{t.launched}</p>
                <ul className="kz-cli-processes">
                  {step.processes.map((p) => (
                    <li key={p.key}>
                      <span className="kz-cli-process-name">{p.key === "workers" ? t.workers : p.label}</span>
                      <span className="kz-cli-process-port">{p.port ? format(t.port, { port: p.port }) : t.noPort}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

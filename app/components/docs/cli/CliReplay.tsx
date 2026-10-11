import { TerminalReplay, type TerminalLine, type TerminalStep } from "@krizaka/ui/terminal-replay";
import { cliSession } from "@/lib/cli-model";
import { format, getDictionary, type Locale } from "@/lib/i18n";

/* The quick start of /docs/orazaka/cli played back (```cli-replay in the synced CLI.md): `install`, `start`, `dev` as the
   published CLI printed them on a fresh machine (scripts/record-cli.mjs). Its colours are the lines' tones; what the
   recording left out says so, in the reader's language. TerminalReplay (@krizaka/ui) types it when it scrolls into view,
   shows it whole under reduced motion, and holds the transcript for assistive technology. Server Component. */
export function CliReplay({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs.cli;
  const session = cliSession();
  const steps: TerminalStep[] = session.steps.map((step) => {
    const output: TerminalLine[] = step.output.map((line) =>
      line.elided ? { text: format(t.elided, { count: line.elided }), tone: "muted" } : { text: line.text, tone: line.tone },
    );
    if (step.trimmed === "ai-engines") output.push({ text: t.trimmedEngines, tone: "muted" });
    if (step.trimmed === "interrupted") output.push({ text: t.trimmedInterrupted, tone: "muted" });
    return { command: step.command, output };
  });
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(session.recordedAt));
  return (
    <div className="kz-cli-replay not-prose">
      <TerminalReplay
        steps={steps}
        label={format(t.replayLabel, { commands: session.steps.map((s) => s.command).join(" · ") })}
        title={t.replayTitle}
        playLabel={t.play}
        pauseLabel={t.pause}
        replayLabel={t.replay}
        copyLabel={t.copy}
        copiedLabel={t.copied}
        rows={20}
        typingSpeed={42}
        lineDelay={38}
        stepDelay={1100}
      />
      <p className="kz-cli-caption">
        {format(t.caption, { package: session.package, version: session.version, machine: session.machine ?? "", date })}
      </p>
    </div>
  );
}

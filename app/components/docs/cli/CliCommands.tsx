import { cliModel } from "@/lib/cli-model";
import { format, getDictionary, type Locale } from "@/lib/i18n";
import { CliExplorer, type ExplorerCommand } from "./CliExplorer";

/* The command explorer of /docs/orazaka/cli (```cli-commands in the synced CLI.md): every command of the CLI with its
   subcommands, arguments and options — architecture.json · cli.commands, read from the CLI's code by the generator.
   The table under it in the doc is its text version. Server Component: the explorer receives only the commands. */
export function CliCommands({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).docs.cli;
  const cli = cliModel();
  const commands: ExplorerCommand[] = cli.commands
    .filter((c) => c.isTop)
    .map((top) => ({
      ...top,
      subcommands: cli.commands.filter((c) => !c.isTop && c.top === top.name),
    }));
  return (
    <div className="not-prose">
      <CliExplorer bin={cli.bin} commands={commands} />
      <p className="kz-component-source">
        <span>{format(t.source, { package: cli.package, version: cli.version })}</span>
      </p>
    </div>
  );
}

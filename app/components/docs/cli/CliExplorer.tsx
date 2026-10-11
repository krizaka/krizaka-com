"use client";

import { useId, useState } from "react";
import { format } from "@krizaka/i18n";
import { SearchIcon } from "@krizaka/icons";
import CopyButton from "@/app/components/sections/CopyButton";
import type { CliCommand } from "@/lib/cli-model";
import { useI18n } from "../../I18nProvider";

export type ExplorerCommand = CliCommand & { subcommands: CliCommand[] };

/** The words a reader may look for in a command: its names, what it does, its arguments and options. */
const haystack = (c: CliCommand) => [c.name, ...c.aliases, c.description, ...c.args.map((a) => a.name), ...c.options.map((o) => `${o.flag} ${o.desc}`)].join(" ").toLowerCase();

/** One command or subcommand: its usage to copy, what it does, its arguments and options. */
function CommandDetail({ bin, command, nested }: { bin: string; command: CliCommand; nested?: boolean }) {
  const { t } = useI18n();
  const c = t.docs.cli;
  const usage = [bin, command.name, ...command.args.map((a) => a.name)].join(" ");
  const args = command.args.filter((a) => a.desc);
  return (
    <div className="kz-cli-cmd" data-nested={nested ? "" : undefined}>
      <div className="kz-cli-cmd-usage">
        <code>{usage}</code>
        <CopyButton code={usage} label={c.copyCommand} done={c.copied} />
      </div>
      {command.description && (
        <p className="kz-cli-cmd-text" lang="en">
          {command.description}
        </p>
      )}
      {command.aliases.length > 0 && <p className="kz-cli-cmd-meta">{format(c.alias, { names: command.aliases.join(", ") })}</p>}
      {(args.length > 0 || command.options.length > 0) && (
        <dl className="kz-cli-flags" lang="en">
          {args.map((a) => (
            <div key={a.name}>
              <dt>
                <code>{a.name}</code>
              </dt>
              <dd>{a.desc}</dd>
            </div>
          ))}
          {command.options.map((o) => (
            <div key={o.flag}>
              <dt>
                <code>{o.flag}</code>
              </dt>
              <dd>
                {o.desc}
                {o.default !== null && <span className="kz-cli-default">{format(c.default, { value: o.default })}</span>}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* The commands as chips — filtered as one types — and the chosen one in full below, with its subcommands. Client: the
   filter and the choice are state. */
export function CliExplorer({ bin, commands }: { bin: string; commands: ExplorerCommand[] }) {
  const { t } = useI18n();
  const c = t.docs.cli;
  const id = useId();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(commands.find((cmd) => cmd.name === "install")?.name ?? commands[0]?.name);
  const q = query.trim().toLowerCase();
  const shown = q ? commands.filter((cmd) => [cmd, ...cmd.subcommands].some((x) => haystack(x).includes(q))) : commands;
  const current = shown.find((cmd) => cmd.name === selected) ?? shown[0];

  return (
    <section className="kz-cli-explorer" aria-label={c.explorerLabel}>
      <div className="kz-cli-explorer-bar">
        <label className="kz-cli-search">
          <SearchIcon size={15} aria-hidden />
          <span className="sr-only">{c.filter}</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={c.filterPlaceholder} />
        </label>
        <p className="kz-catalog-count" aria-live="polite">
          {format(c.count, { count: shown.length })}
        </p>
      </div>
      {shown.length === 0 ? (
        <p className="kz-cli-none">{format(c.none, { query })}</p>
      ) : (
        <>
          <div role="group" aria-label={c.explorerLabel} className="kz-cli-chips">
            {shown.map((cmd) => (
              <button key={cmd.name} type="button" aria-pressed={cmd.name === current?.name} aria-controls={id} onClick={() => setSelected(cmd.name)}>
                {cmd.name}
                {cmd.subcommands.length > 0 && <span className="kz-cli-chip-count">{cmd.subcommands.length}</span>}
              </button>
            ))}
          </div>
          {current && (
            <div id={id} className="kz-cli-panel">
              <CommandDetail bin={bin} command={current} />
              {current.subcommands.length > 0 && (
                <>
                  <p className="kz-cli-launched">{c.subcommands}</p>
                  {current.subcommands.map((sub) => (
                    <CommandDetail key={sub.name} bin={bin} command={sub} nested />
                  ))}
                </>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

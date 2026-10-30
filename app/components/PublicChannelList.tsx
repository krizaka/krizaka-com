import { ProductLogo } from "@krizaka/ui";
import { ForwardIcon } from "@krizaka/icons";
import { format } from "@/lib/i18n";
import type { ChannelGroup, ChannelKind } from "@/lib/public-channels";
import "./public-channels.css";

export interface PublicChannelWords {
  groupProducts: string;
  groupStack: string;
  viaIssue: string;
  discussionsAria: string;
  issuesAria: string;
}

/** A compact, scannable list — Products · Open source — one line per repository: its mark, its name, one link to the
 *  conversation of `kind`. Discussions off there: the line says « via an issue » and links the labelled new issue. */
export default function PublicChannelList({
  groups,
  kind,
  words,
}: {
  groups: ChannelGroup[];
  kind: ChannelKind;
  words: PublicChannelWords;
}) {
  return (
    <div className="pc-list">
      {groups.map((g) => (
        <section key={g.group} aria-label={g.group === "products" ? words.groupProducts : words.groupStack}>
          <h3 className="pc-group">{g.group === "products" ? words.groupProducts : words.groupStack}</h3>
          <ul className="pc-rows">
            {g.entries.map((e) => {
              const link = e[kind];
              const aria = format(kind === "discussions" ? words.discussionsAria : words.issuesAria, { name: e.name });
              return (
                <li key={e.id}>
                  <a
                    className="pc-row"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.viaIssue ? `${aria} (${words.viaIssue})` : aria}
                  >
                    <ProductLogo id={e.mark as never} size={22} animated={false} />
                    <span className="pc-name">{e.name}</span>
                    {link.viaIssue ? <span className="pc-via">{words.viaIssue}</span> : null}
                    <ForwardIcon size={13} aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

import type { ReactNode } from "react";
import { ExternalIcon } from "@krizaka/icons";
import { CardGrid } from "@krizaka/ui/card-grid";
import { LinkCard } from "@krizaka/ui/link-card";
import { Section } from "@krizaka/ui/page";
import ButtonLink from "@/app/components/ButtonLink";
import { CI_STANDARD, parseInline, STANDARDS_BLOB, type StandardsSnapshot } from "@/lib/standards";

/* The two sections that open /open-source: the intro of krizaka/.github's CI and deploy standard (between its
   `intro` markers) and a card per standard of docs/standards — both read at build (scripts/gen-standards.mjs). The
   standards are written in English: in French the heading and the note are French, the text says « (en anglais) ». */

export interface StandardsWords {
  ci: { eyebrow: string; title: string; source: string; full: string; listLabel: string };
  standards: { eyebrow: string; title: string; lead: string; open: string; listLabel: string };
}

function Inline({ text }: { text: string }): ReactNode {
  return parseInline(text).map((tok, i) => {
    if (tok.kind === "code") return <code key={i}>{tok.text}</code>;
    if (tok.kind === "bold") return <strong key={i}>{tok.text}</strong>;
    if (tok.kind === "link")
      return (
        <a key={i} href={tok.href} target="_blank" rel="noopener noreferrer">
          {tok.text}
        </a>
      );
    return tok.text;
  });
}

export function CiIntroSection({ data, w }: { data: StandardsSnapshot; w: StandardsWords["ci"] }) {
  const { paragraphs, bullets } = data.intro;
  return (
    <Section id="ci" eyebrow={w.eyebrow} title={w.title} lead={w.source}>
      <div className="rd-stack" lang="en">
        {paragraphs.map((p) => (
          <p key={p} className="rd-prose">
            <Inline text={p} />
          </p>
        ))}
        {bullets.length > 0 && (
          <ul className="rd-prose" aria-label={w.listLabel}>
            {bullets.map((b) => (
              <li key={b}>
                <Inline text={b} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <p>
        <ButtonLink href={`${STANDARDS_BLOB}/${CI_STANDARD}.md`} variant="primary" size="md">
          {w.full} <ExternalIcon size={13} aria-hidden />
        </ButtonLink>
      </p>
    </Section>
  );
}

export function StandardsSection({ data, w }: { data: StandardsSnapshot; w: StandardsWords["standards"] }) {
  return (
    <Section id="standards" eyebrow={w.eyebrow} title={w.title} lead={w.lead} divider>
      <CardGrid as="ul" min={260} columns={3} aria-label={w.listLabel}>
        {data.standards.map((s) => (
          <LinkCard
            key={s.id}
            href={s.url}
            title={<span lang="en">{s.title}</span>}
            titleAs="span"
            description={<span lang="en">{s.summary}</span>}
            cta={w.open}
          />
        ))}
      </CardGrid>
    </Section>
  );
}

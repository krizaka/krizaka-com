/* HOME — "Build with Krizaka", right under the products (#109): the same blocks build all four products. Krizaka UI
   live and switchable by brand (KitShowcase), the native versions in a phone (a loop per identity), and the
   CLI played back by @krizaka/ui's TerminalReplay. Every figure is read at build: the components from the published
   registries (lib/ui-registry.ts), the packages and versions from npm (lib/registry-versions.ts). */

import { Section, SectionHeading } from "@krizaka/ui/page";
import { NumberTicker } from "@krizaka/ui/number-ticker";
import { TerminalReplay } from "@krizaka/ui/terminal-replay";
import { cliSession as recordedSession } from "@/lib/cli-model";
import { ForwardIcon } from "@krizaka/icons";
import ButtonLink from "../ButtonLink";
import KitShowcase from "./KitShowcase";
import { kitMedia, kitPhones } from "@/lib/kit-media";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locales";
import { getRegistryItems } from "@/lib/ui-registry";
import { npmPackages, npmVersion } from "@/lib/registry-versions";
import { CREATE_PACKAGE, cliSession } from "@/lib/build-with";
import { reveal } from "@/lib/motion";

export default function BuildWithKrizaka({ locale }: { locale: string }) {
  const b = getDictionary(locale).site.home.build;
  const lang = isLocale(locale) ? locale : "en";
  const items = getRegistryItems("ui");
  const figures = [
    { id: "components", value: items.length, label: b.facts.components },
    { id: "native", value: items.filter((i) => i.platforms !== "web").length, label: b.facts.native },
    { id: "packages", value: npmPackages().length, label: b.facts.packages },
  ].filter((f) => f.value > 0);
  const uiVersion = npmVersion("@krizaka/ui");

  return (
    <Section className="bk" aria-labelledby="bk-title" divider>
      <SectionHeading id="bk-title" eyebrow={b.eyebrow} title={b.title} lead={b.lead} reveal />

      <dl className="bk-figures" {...reveal(1)}>
        {figures.map((f) => (
          <div key={f.id}>
            <dt>{f.label}</dt>
            <dd>
              <NumberTicker value={f.value} locale={lang} />
            </dd>
          </div>
        ))}
        {uiVersion && (
          <div>
            <dt>{b.facts.version}</dt>
            <dd className="bk-version">{uiVersion}</dd>
          </div>
        )}
      </dl>

      <div {...reveal(2, "soft")}>
        <KitShowcase media={kitMedia()} phones={kitPhones()} terminal={cliSession(recordedSession(), Boolean(npmVersion(CREATE_PACKAGE))).slice(0, 2)} />
      </div>

      <div className="bk-cli" {...reveal(0, "soft")}>
        <div className="bk-cli-copy">
          <h3>{b.cli.title}</h3>
          <p>{b.cli.lead}</p>
          <div className="bk-links">
            <ButtonLink href="/docs/orazaka/cli" variant="primary">
              {b.docsCli} <ForwardIcon size={14} aria-hidden />
            </ButtonLink>
            <ButtonLink href="/docs/ui">{b.docsUi}</ButtonLink>
          </div>
        </div>
        <TerminalReplay
          className="bk-terminal"
          steps={cliSession(recordedSession(), Boolean(npmVersion(CREATE_PACKAGE)))}
          label={b.cli.label}
          title="~/projects — zsh"
          playLabel={b.cli.play}
          pauseLabel={b.cli.pause}
          replayLabel={b.cli.replay}
          copyLabel={b.cli.copy}
          copiedLabel={b.cli.copied}
          rows={16}
        />
      </div>

      <style>{`
        .bk-figures { display: flex; flex-wrap: wrap; gap: 12px 40px; margin: 24px 0 0; }
        .bk-figures > div { display: flex; flex-direction: column-reverse; }
        .bk-figures dt { font-size: 13px; color: var(--kz-text-secondary); }
        .bk-figures dd { margin: 0; font-family: var(--kz-font-display); font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 800; letter-spacing: -0.03em; color: var(--kz-text-primary); }
        .bk-figures .bk-version { font-family: var(--font-mono); font-size: clamp(1.3rem, 3vw, 1.7rem); font-weight: 700; padding-top: .3rem; }

        .bk-grid { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 28px; align-items: start; margin-top: 32px; }
        @media (max-width: 960px) { .bk-grid { grid-template-columns: minmax(0, 1fr); } }

        .bk-kit { border: 1px solid var(--kz-border-subtle); border-radius: 22px; background: var(--kz-surface-1); overflow: hidden; }
        .bk-kit-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px 16px; padding: 14px 18px; border-bottom: 1px solid var(--kz-border-subtle); }
        .bk-kit-bar h3 { margin: 0; font-size: 14px; font-weight: 700; }
        .bk-brands { flex-wrap: wrap; }
        .bk-brands button { gap: 6px; }

        .bk-phone-wrap { margin: 0; display: grid; justify-items: center; gap: 12px; }
        .bk-phone { position: relative; width: 260px; padding: 12px; border-radius: 40px; background: var(--kz-surface-2); border: 1px solid var(--kz-border-strong);
          box-shadow: 0 24px 60px -30px color-mix(in srgb, var(--kz-accent) 45%, transparent); }
        .bk-phone-notch { position: absolute; top: 18px; left: 50%; width: 76px; height: 20px; margin-left: -38px; border-radius: 999px; background: var(--kz-surface-0); z-index: 1; }
        .bk-phone-screen { height: 500px; overflow: hidden; padding-top: 0; border-radius: 30px; background: var(--kz-surface-0); display: grid; align-content: start; gap: 4px; }
        .bk-phone-wrap figcaption { display: grid; gap: 2px; text-align: center; max-width: 280px; }
        .bk-phone-wrap figcaption strong { font-size: 14px; }
        .bk-phone-wrap figcaption span { font-size: 12.5px; line-height: 1.5; color: var(--kz-text-secondary); }

        .bk-cli { display: grid; grid-template-columns: minmax(0, 340px) minmax(0, 1fr); gap: 28px; align-items: center; margin-top: 40px; }
        @media (max-width: 860px) { .bk-cli { grid-template-columns: minmax(0, 1fr); } }
        .bk-cli h3 { margin: 0; font-family: var(--kz-font-display); font-size: clamp(1.3rem, 2.6vw, 1.6rem); font-weight: 800; letter-spacing: -0.02em; }
        .bk-cli-copy p { margin: 10px 0 0; font-size: 15px; line-height: 1.65; color: var(--kz-text-secondary); }
        .bk-links { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
        .bk-terminal { min-width: 0; }
      `}</style>
    </Section>
  );
}

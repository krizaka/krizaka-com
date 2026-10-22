"use client";

/* « Film generated with Orazaka · credits »: the models and tools in one short list, in a @krizaka/ui Dialog.
   The captions live in the film's <track> only. */

import { Dialog } from "@krizaka/ui/dialog";
import { useI18n } from "@/app/components/I18nProvider";

export default function FilmCredits() {
  const { t } = useI18n();
  const w = t.site.story.who;
  return (
    <p className="st-film-note">
      {w.filmCredit} ·{" "}
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button" className="st-film-credits">{w.filmCredits}</button>
        </Dialog.Trigger>
        <Dialog.Content size="sm" closeLabel={w.creditsClose}>
          <Dialog.Title>{w.creditsTitle}</Dialog.Title>
          <ul className="st-credits-list">
            {w.creditsList.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Root>
    </p>
  );
}

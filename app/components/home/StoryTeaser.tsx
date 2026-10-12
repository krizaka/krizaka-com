"use client";

/* A quiet pause between the products and the know-how: the flock, one sentence, the way to /story. */

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { useI18n } from "../I18nProvider";
import { BirdPortrait, FlockStyles } from "../story/Flock";
import { FLOCK } from "@/lib/story";
import { reveal } from "@/lib/motion";
import { Section, SectionHeading } from "@krizaka/ui/page";

export default function StoryTeaser() {
  const { t } = useI18n();
  const st = t.site.story;
  const teaser = t.site.home.storyTeaser;
  return (
    <Section className="kz-teaser" aria-labelledby="teaser-title">
      <FlockStyles />
      <div className="kz-teaser-flock" aria-hidden {...reveal()}>
        {FLOCK.map((id) => (
          <BirdPortrait key={id} id={id} size={64} />
        ))}
      </div>
      <div {...reveal(1)}>
        <SectionHeading id="teaser-title" eyebrow={st.intro.eyebrow} title={st.intro.title} lead={teaser.sub} align="center" />
        <Link href="/story" prefetch={false} className="kz-link-strong">
          {teaser.cta} <ForwardIcon size={15} />
        </Link>
      </div>
      <style>{`
        .kz-teaser { text-align: center; }
        .kz-teaser-flock { display: flex; justify-content: center; align-items: flex-end; gap: clamp(4px, 2vw, 18px); flex-wrap: wrap; margin-bottom: 28px; }
      `}</style>
    </Section>
  );
}

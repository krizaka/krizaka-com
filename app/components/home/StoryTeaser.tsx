"use client";

/* A quiet pause between the products and the know-how: the flock, one sentence, the way to /story. */

import Link from "next/link";
import { ForwardIcon } from "@krizaka/icons";
import { useI18n } from "../I18nProvider";
import { BirdPortrait, FlockStyles } from "../story/Flock";
import { FLOCK } from "@/lib/story";

export default function StoryTeaser() {
  const { t } = useI18n();
  const st = t.site.story;
  const teaser = t.site.home.storyTeaser;
  return (
    <section className="kz-section kz-teaser" aria-labelledby="teaser-title">
      <FlockStyles />
      <div className="kz-teaser-flock" aria-hidden>
        {FLOCK.map((id) => (
          <BirdPortrait key={id} id={id} size={64} />
        ))}
      </div>
      <p className="kz-eyebrow">{st.intro.eyebrow}</p>
      <h2 id="teaser-title" className="kz-teaser-title">{st.intro.title}</h2>
      <p className="kz-teaser-sub">
        {teaser.sub}
      </p>
      <Link href="/story" prefetch={false} className="kz-link-strong">
        {teaser.cta} <ForwardIcon size={15} />
      </Link>
      <style>{`
        .kz-teaser { text-align: center; }
        .kz-teaser-flock { display: flex; justify-content: center; align-items: flex-end; gap: clamp(4px, 2vw, 18px); flex-wrap: wrap; margin-bottom: 28px; }
        .kz-teaser-title { font-family: var(--font-display), system-ui, sans-serif; font-size: clamp(1.5rem, 3.6vw, 2.2rem); font-weight: 800; letter-spacing: -.025em;
          line-height: 1.2; max-width: 720px; margin: 0 auto; color: var(--kz-text-primary); }
        .kz-teaser-sub { max-width: 560px; margin: 16px auto 20px; font-size: 15.5px; line-height: 1.75; color: var(--kz-text-secondary); }
      `}</style>
    </section>
  );
}

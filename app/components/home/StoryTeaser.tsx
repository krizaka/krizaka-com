"use client";

/* A quiet pause between the products and the know-how: the flock, one sentence, the way to /story. */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "../I18nProvider";
import { BirdPortrait, FlockStyles } from "../story/Flock";
import { FLOCK, STORY_INTRO } from "@/lib/story";

export default function StoryTeaser() {
  const { locale } = useI18n();
  const loc = locale === "fr" ? "fr" : "en";
  return (
    <section className="kz-section kz-teaser" aria-labelledby="teaser-title">
      <FlockStyles />
      <div className="kz-teaser-flock" aria-hidden>
        {FLOCK.map((b) => (
          <BirdPortrait key={b.id} id={b.id} size={64} />
        ))}
      </div>
      <p className="kz-eyebrow">{STORY_INTRO.eyebrow[loc]}</p>
      <h2 id="teaser-title" className="kz-teaser-title">{STORY_INTRO.title[loc]}</h2>
      <p className="kz-teaser-sub">
        {loc === "fr"
          ? "Une forge à mi-pente, un oracle qui ne quitte pas la maison, un serpent à huit têtes — et la volée qui veille."
          : "A forge halfway up a slope, an oracle that stays home, an eight-headed serpent — and the flock that keeps watch."}
      </p>
      <Link href="/story" className="kz-link-strong">
        {loc === "fr" ? "Lire l'histoire" : "Read the story"} <ArrowRight size={14} />
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

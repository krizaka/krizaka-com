/* Images Orazaka generated on one Mac, through its own art-direction Studios, signed in as Eric (the demo persona):
   each with the exact prompt sent, its seed (the same prompt, size, model and seed make the same image again), the
   model and the time it took. Data: lib/orazaka-gallery.ts; words: site.orazakaDemo.gallery. A server component —
   images, captions and an open/close prompt (<details>) need no script. */

import Image from "next/image";
import { format } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { GALLERY, GALLERY_MODEL, gallerySrc, type GalleryItem } from "@/lib/orazaka-gallery";

export interface MadeHereGalleryText {
  promptLabel: string;
  seedLabel: string;
  local: string;
  styles: Record<GalleryItem["style"], string>;
  items: Record<GalleryItem["id"], { alt: string }>;
}

export default function MadeHereGallery({
  t,
  only,
  compact = false,
}: {
  t: MadeHereGalleryText;
  /** A selection, in this order; the whole series when absent. */
  only?: readonly GalleryItem["id"][];
  /** Images and a one-line caption only — for a teaser that links to the full gallery. */
  compact?: boolean;
}) {
  const items = only ? only.map((id) => GALLERY.find((item) => item.id === id)).filter((item): item is GalleryItem => !!item) : GALLERY;
  return (
    <>
      <ul className={compact ? "mh-gallery mh-compact" : "mh-gallery"}>
        {items.map((item, i) => (
          <li key={item.id} {...reveal(Math.min(i + 1, 6))}>
            <figure>
              <Image
                src={gallerySrc(item.id)}
                alt={t.items[item.id].alt}
                width={item.width}
                height={item.height}
                sizes={compact ? "(max-width: 640px) 100vw, 33vw" : "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px"}
              />
              <figcaption>
                <span className="mh-style">{t.styles[item.style]}</span>
                <span className="mh-local">{format(t.local, { seconds: item.seconds })}</span>
                {!compact && (
                  <>
                    <details>
                      <summary>{t.promptLabel}</summary>
                      <q lang="en">{item.prompt}</q>
                    </details>
                    <span className="mh-meta">
                      {t.seedLabel} {item.seed} · {GALLERY_MODEL.name} · {item.width}×{item.height}
                    </span>
                  </>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <style>{`
        .mh-gallery { margin: 28px 0 0; padding: 0; list-style: none; columns: 3 300px; column-gap: 16px; }
        .mh-gallery li { break-inside: avoid; margin: 0 0 16px; }
        .mh-gallery figure { margin: 0; border-radius: 16px; overflow: hidden; border: 1px solid var(--kz-border-subtle); background: var(--kz-surface-1); }
        .mh-gallery img { display: block; width: 100%; height: auto; background: var(--kz-media); }
        .mh-gallery figcaption { display: flex; flex-direction: column; gap: 6px; padding: 12px 14px 14px; }
        .mh-style { font-size: 14px; font-weight: 650; color: var(--kz-text-primary); }
        .mh-local { font-size: 12.5px; line-height: 1.5; color: var(--kz-text-secondary); }
        .mh-gallery details { font-size: 12.5px; line-height: 1.55; color: var(--kz-text-secondary); }
        .mh-gallery summary { cursor: pointer; width: fit-content; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--kz-accent-text); }
        .mh-gallery summary:focus-visible { outline: 2px solid var(--kz-accent); outline-offset: 3px; border-radius: 4px; }
        .mh-gallery q { display: block; margin-top: 6px; quotes: "“" "”"; }
        .mh-meta { font-family: var(--font-mono); font-size: 11px; color: var(--kz-text-secondary); }
        .mh-compact { columns: unset; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 16px; }
        .mh-compact li { margin: 0; }
        .mh-compact img { aspect-ratio: 4 / 5; object-fit: cover; }
      `}</style>
    </>
  );
}

/* A recording in a synced doc. The product repositories write it as plain Markdown, which also reads on GitHub:
     [![What the clip shows](https://…/clip-poster.<hash>.webp)](https://…/clip.<hash>.mp4)
   — a poster linking to the clip. On the site that link becomes the clip itself, its poster first and the alt text as
   its caption. It never plays by itself: the docs stay still until the reader asks (AGENTS.md §4). */

export function DocVideo({ src, poster, caption }: { src: string; poster: string; caption: string }) {
  const type = src.toLowerCase().includes(".webm") ? "video/webm" : "video/mp4";
  return (
    <figure className="kz-doc-video not-prose">
      <video controls muted playsInline preload="none" poster={poster} aria-label={caption || undefined}>
        <source src={src} type={type} />
      </video>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

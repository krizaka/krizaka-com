import CopyButton from "./CopyButton";

/** A code sample: its file name, the code (scrolls sideways, never shrinks), a copy button. */
export default function CodeSample({ sample, copy, copied }: { sample: { file: string; lang: string; code: string }; copy: string; copied: string }) {
  return (
    <figure className="ps-code">
      <figcaption>
        <span>{sample.file}</span>
        <CopyButton code={sample.code} label={copy} done={copied} />
      </figcaption>
      <pre tabIndex={0}>
        <code data-lang={sample.lang}>{sample.code}</code>
      </pre>
    </figure>
  );
}

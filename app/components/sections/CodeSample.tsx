import CopyButton from "./CopyButton";
import { highlight } from "./highlight";

/** A code sample: its language and file name, the code highlighted on the server (scrolls sideways, never shrinks), a
    copy button. `bare` drops the frame's top corners when tabs sit above it (CodeTabs). */
export default function CodeSample({ sample, copy, copied, bare = false }: { sample: { file: string; lang: string; code: string }; copy: string; copied: string; bare?: boolean }) {
  return (
    <figure className={bare ? "ps-code is-bare" : "ps-code"}>
      <figcaption>
        <span className="ps-code-file">
          <span className="ps-code-lang">{sample.lang}</span>
          {sample.file}
        </span>
        <CopyButton code={sample.code} label={copy} done={copied} />
      </figcaption>
      <pre tabIndex={0}>
        <code data-lang={sample.lang}>{highlight(sample.code, sample.lang)}</code>
      </pre>
    </figure>
  );
}

import { Fragment } from "react";

/** Renders a message with <b>…</b> emphasis (the only markup messages may carry). */
export default function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(<b>.*?<\/b>)/g).map((part, i) =>
        part.startsWith("<b>") ? <strong key={i}>{part.slice(3, -4)}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

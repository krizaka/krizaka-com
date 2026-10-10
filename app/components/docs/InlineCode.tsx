import { Fragment } from "react";

/* The documentation written in @krizaka/ui's code (meta.ts, the props' JSDoc) marks code with backticks: `asChild`.
   Rendered as <code>; everything else stays text. That documentation is English, whatever the page's language:
   `lang="en"` tells assistive technology how to read it. Server-safe. */
export function InlineCode({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return (
    <span lang="en">
      {parts.map((part, i) => (i % 2 === 1 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>))}
    </span>
  );
}

/** A sentence of the page language: words between backticks in the message (`requestId`, `.dlq`) read as code — the
    technical keyword stands out of the sentence, in mono, without any markup in the catalogue. */
export default function Inline({ text }: { text: string }) {
  const parts = text.split("`");
  return <>{parts.map((part, i) => (i % 2 ? <code key={i} className="ps-ic">{part}</code> : part))}</>;
}

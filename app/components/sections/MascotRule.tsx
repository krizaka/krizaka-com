import type { MascotBird } from "@krizaka/ui/mascots";
import PageMascot from "./PageMascot";

/** A rule, a promise or a decision told by a bird: the bird, a small label ("The falcon's rule"), one sentence.
    `inline` sits inside a card; `callout` stands alone in a section. */
export default function MascotRule({ bird, label, text, variant = "inline" }: { bird: MascotBird; label: string; text: string; variant?: "inline" | "callout" }) {
  return (
    <figure className={variant === "callout" ? "ps-callout" : "ps-rule"}>
      <PageMascot bird={bird} size={variant === "callout" ? 80 : 56} />
      <blockquote>
        <p className="ps-rule-label">{label}</p>
        <p>{text}</p>
      </blockquote>
    </figure>
  );
}

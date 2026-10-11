import type { MascotBird, MascotMood } from "@krizaka/ui/mascots";
import Inline from "./Inline";
import PageMascot from "./PageMascot";

/** A rule, a promise or a decision told by a bird — a quote: the sentence in a speech bubble (opening quote mark, the
    hue around it), and under its tail the bird and who speaks ("The falcon's rule"). `inline` sits inside a card (the
    bird answers the pointer, else still); `callout` stands alone in a section, larger, the bird alive. */
export default function MascotRule({
  bird,
  mood = "thinking",
  label,
  text,
  variant = "inline",
}: {
  bird: MascotBird;
  mood?: MascotMood;
  label: string;
  text: string;
  variant?: "inline" | "callout";
}) {
  const callout = variant === "callout";
  return (
    <figure className={callout ? "ps-quote is-callout" : "ps-quote"}>
      <blockquote>
        <p>
          <Inline text={text} />
        </p>
      </blockquote>
      <figcaption>
        <PageMascot bird={bird} mood={mood} size={callout ? 72 : 46} animated={callout} />
        <span>{label}</span>
      </figcaption>
    </figure>
  );
}

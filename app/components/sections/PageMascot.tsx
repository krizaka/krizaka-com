import { Mascot, type MascotBird, type MascotMood } from "@krizaka/ui/mascots";

/** A Krizaka bird (@krizaka/ui/mascots) in the colours around it: the page's brand accent, or the hue of the block it
    stands for (`[data-hue]`, sections.css). Decorative: the words beside it carry the meaning. Its idle loop pauses off
    screen (SiteMotion) and stops under reduced motion; `animated={false}` keeps it still (cards: it only answers the
    pointer). One bird per idea — the falcon watches (security), the owl reads and knows every face (documents,
    identity), the duck builds (code), the flamingo answers or gets paid, the pigeon delivers. */
export default function PageMascot({ bird, mood = "thinking", size = 72, animated = true }: { bird: MascotBird; mood?: MascotMood; size?: number; animated?: boolean }) {
  return <Mascot bird={bird} mood={mood} size={size} animated={animated} className="ps-bird" />;
}

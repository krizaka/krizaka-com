import { Mascot, type MascotBird, type MascotMood } from "@krizaka/ui/mascots";

/** A Krizaka bird (@krizaka/ui/mascots) in the page's brand colours. Decorative: the words beside it carry the
    meaning. Its idle loop pauses off screen (SiteMotion) and stops under reduced motion. One bird per idea —
    the falcon watches (security), the owl reads (documents), the duck builds (code), the flamingo answers or gets
    paid, the pigeon delivers. */
export default function PageMascot({ bird, mood = "thinking", size = 72 }: { bird: MascotBird; mood?: MascotMood; size?: number }) {
  return <Mascot bird={bird} mood={mood} size={size} className="ps-bird" />;
}

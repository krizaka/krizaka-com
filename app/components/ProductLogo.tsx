import OrazakaLogo from "./OrazakaLogo";
import OrochiaLogo from "./OrochiaLogo";

/** The animated mark of a Krizaka product. */
export default function ProductLogo({ id, size = 28, animated = true }: { id: "orazaka" | "orochia"; size?: number; animated?: boolean }) {
  return id === "orazaka" ? <OrazakaLogo size={size} animated={animated} /> : <OrochiaLogo size={size} animated={animated} />;
}

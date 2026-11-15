import { pageShareImage } from "@/lib/og-page-image";

/* The share image of this page, in the Cahier, from its own section and title (lib/og-card.tsx, krizaka-internal#2833). */
export { OG_SIZE as size, OG_TYPE as contentType } from "@/lib/og-card";
export const alt = "Krizaka";

export default pageShareImage("contact");

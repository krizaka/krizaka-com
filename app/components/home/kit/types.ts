import type { TerminalStep } from "@krizaka/ui/terminal-replay";
import type { KitTileId } from "@/lib/kit-live";
import type { KitMedia } from "@/lib/kit-media";

/** What a tile receives: which one, and the media resolved on the server. */
export type KitTileProps = { id: KitTileId; media: KitMedia; terminal: readonly TerminalStep[]; brand: string };

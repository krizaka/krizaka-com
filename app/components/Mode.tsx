/* One sentence, one number, worded for each state of the notebook (lib/focus.ts): `focus` while only the three products
   show, `full` once it is open whole. Both are in the page; focus.css shows the one that applies. */

import type { ReactNode } from "react";

export default function Mode({ focus, full }: { focus: ReactNode; full: ReactNode }) {
  return (
    <>
      <span data-mode="focus">{focus}</span>
      <span data-mode="full">{full}</span>
    </>
  );
}

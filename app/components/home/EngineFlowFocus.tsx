"use client";

/* The engine flow, drawn with the products the notebook shows: the three of the focus (lib/focus.ts), or all of them once
   it is open whole. The nodes are built on the server (EngineFlowView) and filtered here, so the page stays static. */

import type { ComponentProps } from "react";
import { EngineFlow } from "@krizaka/ui/engine-flow";
import { inFocus } from "@/lib/focus";
import { useCarnet } from "../useCarnet";

export default function EngineFlowFocus({ nodes, ...props }: ComponentProps<typeof EngineFlow>) {
  const open = useCarnet();
  return <EngineFlow {...props} nodes={inFocus(nodes, open)} />;
}

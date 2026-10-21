/* The public channels as the site shows them: the products and the open-source stack, with what GitHub says of each
   repository (lib/github-channels.json, written at build by scripts/gen-github-channels.mjs, git-ignored). Server-only:
   pages read it and pass the result down. Without the snapshot, no Discussions link is claimed. */

import { readFileSync } from "node:fs";
import path from "node:path";
import { parseChannelState } from "../scripts/github-channels-lib.mjs";
import { buildPublicChannels, type ChannelGroup, type ChannelState } from "./public-channels";
import { PRODUCTS } from "./products";
import { MOTION_LAB, STACK } from "./stack";

function snapshot(): ChannelState {
  try {
    return parseChannelState(JSON.parse(readFileSync(path.join(process.cwd(), "lib", "github-channels.json"), "utf8"))) as ChannelState;
  } catch {
    return parseChannelState(undefined) as ChannelState;
  }
}

export function publicChannels(): ChannelGroup[] {
  const stack = [
    ...STACK.map(({ id, name, repoUrl }) => ({ id, name, repoUrl })),
    { id: "motion", name: MOTION_LAB.name, repoUrl: MOTION_LAB.repoUrl },
  ];
  return buildPublicChannels(
    PRODUCTS.map(({ id, name, repoUrl }) => ({ id, name, repoUrl })),
    stack,
    snapshot(),
  );
}

// The signed manifest of the mobile apps (ADR-003): build the body from lib/services.ts, sign it only when the data
// changed, and check that the committed document is the data's signature. Pure functions; the CLI is sign-services.mjs.

import { KRIZAKA_PUBLIC_KEYS, verifyManifest } from "@krizaka/discovery";
import { signManifest } from "@krizaka/discovery/sign";

export const SCHEMA_VERSION = 1;

/** The body of a manifest: the data as published, without the signing instant and the signature. */
export function bodyOf(services, { keyId, issuedAt }) {
  const out = {};
  for (const [product, environments] of Object.entries(services)) {
    out[product] = {};
    for (const [environment, entry] of Object.entries(environments)) out[product][environment] = structuredClone(entry);
  }
  return { schemaVersion: SCHEMA_VERSION, keyId, issuedAt, services: out };
}

/** What identifies the data of a document: everything but when it was signed and the signature. */
export const dataOf = (manifest) => JSON.stringify({ keyId: manifest.keyId, services: manifest.services });

/**
 * The document to commit for `services`: the previous one when its data is unchanged (a signature is not renewed for
 * nothing: the file stays byte-identical), otherwise a new one issued at `now` and signed with `seed`. `issuedAt` only grows.
 */
export function signServices(services, { previous, seed, keyId, now = new Date() }) {
  const issuedAt = now.toISOString().replace(/\.\d{3}Z$/, "Z");
  const next = bodyOf(services, { keyId, issuedAt });
  if (previous && dataOf(previous) === dataOf(next)) return { manifest: previous, changed: false };
  if (previous && Date.parse(issuedAt) <= Date.parse(previous.issuedAt)) {
    throw new Error(`issuedAt ${issuedAt} is not after the committed ${previous.issuedAt}: a manifest may never go back in time`);
  }
  return { manifest: signManifest(next, seed), changed: true };
}

/** What is wrong with a committed document, as sentences (empty = fine). */
export function checkSigned(raw, services, keys = KRIZAKA_PUBLIC_KEYS) {
  const verdict = verifyManifest(raw, keys);
  if (!verdict.ok) return [`the committed manifest does not verify (${verdict.reason}): run npm run services:sign`];
  const expected = bodyOf(services, { keyId: verdict.manifest.keyId, issuedAt: verdict.manifest.issuedAt });
  return dataOf(verdict.manifest) === dataOf(expected) ? [] : ["lib/services.ts changed since the manifest was signed: run npm run services:sign"];
}

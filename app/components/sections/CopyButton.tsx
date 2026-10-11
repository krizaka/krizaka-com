"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@krizaka/icons";

/** Copies a code sample; the labels arrive translated from the server page. */
export default function CopyButton({ code, label, done }: { code: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="ps-copy"
      onClick={() =>
        navigator.clipboard?.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        })
      }
    >
      {copied ? <CheckIcon size={13} aria-hidden /> : <CopyIcon size={13} aria-hidden />}
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  );
}

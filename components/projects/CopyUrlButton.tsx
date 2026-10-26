'use client';

import { useState } from 'react';
import { Check, ChevronDown, Link2 } from 'lucide-react';

/** Copies the case-study URL. The control matches the reference header. */
export function CopyUrlButton() {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        const url = window.location.href;
        void navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        });
      }}
      className="inline-flex shrink-0 items-center gap-1.5 text-sm text-accent-blue"
    >
      {copied ? <Check size={15} strokeWidth={1.75} aria-hidden="true" /> : <Link2 size={15} strokeWidth={1.75} aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy URL'}
      <ChevronDown size={14} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

'use client';

import { useState } from 'react';

export default function CopyLinkButton({ sessionId }: { sessionId: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = `${window.location.origin}/responder/${sessionId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 mt-3 bg-white/15 border border-white/20 text-xs font-medium px-4 py-1.5 rounded-full hover:bg-white/25 transition-colors"
    >
      {copied ? '✓ Link copiado!' : '🔗 Copiar link público'}
    </button>
  );
}

'use client';

import { useState } from 'react';

export default function CopyLinkButton({ sessionId }: { sessionId: string }) {
  const [copied, setCopied] = useState(false);

  const url = `/responder/${sessionId}`;

  function handleCopy() {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="flex items-center gap-2 mt-3 flex-wrap">
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-xs font-medium px-4 py-1.5 rounded-full hover:bg-white/25 transition-colors"
      >
        {copied ? '✓ Link copiado!' : '🔗 Copiar link público'}
      </button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-xs font-medium px-4 py-1.5 rounded-full hover:bg-white/25 transition-colors"
      >
        🌐 Ir para link público
      </a>
    </div>
  );
}

'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
      style={{ background: '#E67E22' }}
    >
      🖨️ Imprimir / PDF
    </button>
  );
}

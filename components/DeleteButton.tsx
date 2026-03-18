'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (pin.length < 1) return;
    setLoading(true);
    setError('');

    // Verify PIN first
    const verifyRes = await fetch('/api/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    if (!verifyRes.ok) {
      setError('PIN incorreto. Tente novamente.');
      setLoading(false);
      return;
    }

    // Soft delete
    await fetch(`/api/sessoes/${sessionId}`, { method: 'DELETE' });
    setShowModal(false);
    setPin('');
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => { setShowModal(true); setPin(''); setError(''); }}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
        title="Excluir entrevista"
      >
        🗑️
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">🗑️</div>
              <h3 className="text-lg font-bold text-gray-800">Excluir Entrevista</h3>
              <p className="text-sm text-gray-500 mt-1">
                O registro será movido para a Lixeira. Insira o PIN para confirmar.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                PIN de Administrador
              </label>
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
                placeholder="••••••••"
                autoFocus
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-center text-lg tracking-widest focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
              {error && (
                <p className="text-red-500 text-xs mt-1.5 text-center">{error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowModal(false); setPin(''); setError(''); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || pin.length < 1}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? 'Excluindo...' : 'Confirmar Exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

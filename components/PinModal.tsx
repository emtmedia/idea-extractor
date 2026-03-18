'use client';

import { useState } from 'react';

interface PinModalProps {
  onSuccess: () => void;
  title: string;
}

export default function PinModal({ onSuccess, title }: PinModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.ok) {
        sessionStorage.setItem('pin_verified', 'true');
        onSuccess();
      } else {
        setError('PIN incorreto');
        setPin('');
      }
    } catch {
      setError('Erro ao verificar PIN. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-[#14344A]">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Digite o PIN de acesso para continuar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              PIN (8 caracteres)
            </label>
            <input
              type="password"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center mb-4 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length === 0}
            className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity disabled:opacity-60"
            style={{ background: 'var(--c-primary, #14344A)' }}
          >
            {loading ? 'Verificando...' : 'Acessar'}
          </button>
        </form>
      </div>
    </div>
  );
}

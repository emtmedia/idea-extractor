'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Session {
  id: string;
  area: string;
  interviewee: string | null;
  interviewDate: string | null;
  answers: Record<string, string>;
  canvas: Record<string, string>;
  status: string;
  deletedAt: string | null;
  createdAt: string;
}

interface Area {
  label: string;
  icon: string;
  color: string;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function escapeCsv(val: unknown): string {
  const str = val === null || val === undefined ? '' : String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function exportCsv(sessions: Session[], areaMap: Record<string, Area>) {
  const headers = [
    'ID', 'Área', 'Entrevistado', 'Data Entrevista',
    'Status', 'Criado em', 'Excluído em', 'Respostas (JSON)', 'Canvas (JSON)',
  ];
  const rows = sessions.map((s) => [
    s.id,
    areaMap[s.area]?.label || s.area,
    s.interviewee || '',
    s.interviewDate || '',
    s.status,
    formatDateTime(s.createdAt),
    s.deletedAt ? formatDateTime(s.deletedAt) : '',
    JSON.stringify(s.answers),
    JSON.stringify(s.canvas),
  ]);

  const csv = [headers, ...rows].map((r) => r.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lixeira_entrevistas_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LixeiraClient({
  sessions: initialSessions,
  areaMap,
}: {
  sessions: Session[];
  areaMap: Record<string, Area>;
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState(initialSessions);
  const [confirmPerm, setConfirmPerm] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRestore(id: string) {
    await fetch(`/api/lixeira/${id}`, { method: 'PUT' });
    setSessions((prev) => prev.filter((s) => s.id !== id));
    router.refresh();
  }

  async function handlePermanentDelete() {
    if (!confirmPerm) return;
    setLoading(true);
    setPinError('');

    const verifyRes = await fetch('/api/verify-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    if (!verifyRes.ok) {
      setPinError('PIN incorreto. Tente novamente.');
      setLoading(false);
      return;
    }

    await fetch(`/api/lixeira/${confirmPerm}`, { method: 'DELETE' });
    setSessions((prev) => prev.filter((s) => s.id !== confirmPerm));
    setConfirmPerm(null);
    setPin('');
    setLoading(false);
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
        <div className="text-4xl mb-4">✅</div>
        <h4 className="text-lg font-semibold text-gray-700 mb-2">Lixeira vazia</h4>
        <p className="text-gray-400 text-sm">Nenhuma entrevista excluída até o momento.</p>
      </div>
    );
  }

  return (
    <>
      {/* Actions bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{sessions.length}</span> entrevista{sessions.length !== 1 ? 's' : ''} na lixeira
        </p>
        <button
          onClick={() => exportCsv(sessions, areaMap)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
        >
          📥 Exportar CSV
        </button>
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {sessions.map((s) => {
          const area = areaMap[s.area];
          return (
            <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden opacity-80">
              <div className="h-1" style={{ background: area?.color || '#999' }} />
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-2xl flex-shrink-0">{area?.icon || '📋'}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-700 truncate">
                      {s.interviewee || 'Entrevistado não informado'}
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      {area?.label || s.area} · {s.interviewDate || '—'}
                    </div>
                    <div className="text-xs text-red-400 mt-0.5">
                      🗑️ Excluído em {s.deletedAt ? formatDateTime(s.deletedAt) : '—'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleRestore(s.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    ↩️ Restaurar
                  </button>
                  <button
                    onClick={() => { setConfirmPerm(s.id); setPin(''); setPinError(''); }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    🗑️ Excluir definitivamente
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permanent delete PIN modal */}
      {confirmPerm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-bold text-gray-800">Exclusão Permanente</h3>
              <p className="text-sm text-gray-500 mt-1">
                Esta ação é <strong>irreversível</strong>. O registro será apagado definitivamente do banco de dados.
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
                onKeyDown={(e) => e.key === 'Enter' && handlePermanentDelete()}
                placeholder="••••••••"
                autoFocus
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-center text-lg tracking-widest focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
              {pinError && (
                <p className="text-red-500 text-xs mt-1.5 text-center">{pinError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmPerm(null); setPin(''); setPinError(''); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handlePermanentDelete}
                disabled={loading || pin.length < 1}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Excluindo...' : 'Excluir Permanentemente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

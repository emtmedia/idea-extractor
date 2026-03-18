'use client';

import AppShell from '@/components/AppShell';
import PinGuard from '@/components/PinGuard';
import { useEffect, useState } from 'react';

interface Cargo {
  id: string;
  label: string;
  order: number;
}

export default function CargosPage() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/cargos');
    setCargos(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!newLabel.trim()) return;
    setLoading(true);
    await fetch('/api/cargos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: newLabel.trim() }),
    });
    setNewLabel('');
    await load();
    setLoading(false);
  }

  async function handleEdit(id: string) {
    if (!editLabel.trim()) return;
    await fetch(`/api/cargos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: editLabel.trim() }),
    });
    setEditId(null);
    setEditLabel('');
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este cargo?')) return;
    await fetch(`/api/cargos/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <AppShell>
      <div
        className="text-white px-8 py-10"
        style={{ background: 'linear-gradient(135deg, #1A2D5A 0%, #2471A3 100%)' }}
      >
        <h2 className="text-3xl font-bold tracking-tight">🏢 Cargos / Funções</h2>
        <p className="text-white/75 mt-2 text-sm">Gerencie a lista de cargos disponíveis no formulário de Nova Entrevista</p>
      </div>

      <PinGuard>
        <div className="px-8 py-8 max-w-2xl">
          {/* Add new */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="font-bold text-[#14344A] mb-4">Adicionar Cargo</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Ex.: Gerente de Contratos"
                className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                onClick={handleAdd}
                disabled={loading || !newLabel.trim()}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                + Adicionar
              </button>
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {cargos.length} cargo{cargos.length !== 1 ? 's' : ''} cadastrado{cargos.length !== 1 ? 's' : ''}
              </span>
            </div>
            {cargos.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                Nenhum cargo cadastrado. Use o formulário acima para adicionar.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {cargos.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                    {editId === c.id ? (
                      <>
                        <input
                          autoFocus
                          type="text"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEdit(c.id);
                            if (e.key === 'Escape') setEditId(null);
                          }}
                          className="flex-1 border-2 border-blue-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                        />
                        <button onClick={() => handleEdit(c.id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 text-green-700 hover:bg-green-100">✓ Salvar</button>
                        <button onClick={() => setEditId(null)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">✕</button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm text-gray-700">{c.label}</span>
                        <button
                          onClick={() => { setEditId(c.id); setEditLabel(c.label); }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >✏️ Editar</button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >🗑️</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </PinGuard>
    </AppShell>
  );
}

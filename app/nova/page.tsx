'use client';

import AppShell from '@/components/AppShell';
import { AREAS } from '@/lib/areas';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Cargo {
  id: string;
  label: string;
  order: number;
}

function formatDateInput(raw: string): string {
  // Strip non-digits
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function NovaEntrevistaPage() {
  const router = useRouter();
  const [area, setArea] = useState('eng');
  const [interviewee, setInterviewee] = useState('');
  const [cargo, setCargo] = useState('');
  const [date, setDate] = useState('');
  const [nota, setNota] = useState('');
  const [loading, setLoading] = useState(false);
  const [cargos, setCargos] = useState<Cargo[]>([]);

  useEffect(() => {
    fetch('/api/cargos').then((r) => r.json()).then(setCargos).catch(() => {});
  }, []);

  async function handleCreate() {
    if (!interviewee.trim()) {
      alert('Por favor, informe o nome do entrevistado.');
      return;
    }
    if (!cargo) {
      alert('Por favor, selecione o cargo/função do entrevistado.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/sessoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ area, interviewee, cargo, interviewDate: date, nota }),
    });
    if (res.ok) {
      const data = await res.json();
      fetch('/api/seed', { method: 'POST' }).catch(() => {});
      router.push(`/sessao/${data.id}`);
    } else {
      alert('Erro ao criar sessão. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div style={{ background: 'linear-gradient(135deg, #0D3B4F 0%, #1A8A6E 100%)' }} className="text-white px-8 py-10">
        <h2 className="text-3xl font-bold tracking-tight">🎙️ Nova Entrevista</h2>
        <p className="text-white/75 mt-2 text-sm">Selecione a área e informe os dados do entrevistado para iniciar a sessão.</p>
      </div>
      <div className="px-8 py-8 max-w-3xl">

        {/* Area selector */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-[#14344A] mb-4">1. Selecione a Diretoria / Comitê</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {AREAS.map((a) => (
              <button
                key={a.key}
                onClick={() => setArea(a.key)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  area === a.key ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-sm font-semibold text-[#14344A] leading-tight">{a.label.replace('Diretoria de ', '').replace('Comitê de ', '').replace('Diretoria ', '')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-[#14344A] mb-4">2. Dados da Entrevista</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Entrevistado(a) *</label>
              <input
                type="text"
                value={interviewee}
                onChange={(e) => setInterviewee(e.target.value)}
                placeholder="Nome do entrevistado"
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Cargo / Função *</label>
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="">Selecione o cargo...</option>
                {cargos.map((c) => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Data da Entrevista</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(formatDateInput(e.target.value))}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nota / Observação</label>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Observações sobre a entrevista (opcional)"
              rows={3}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity disabled:opacity-60"
          style={{ background: 'var(--c-primary)' }}
        >
          {loading ? 'Criando...' : '→ Iniciar Entrevista'}
        </button>
      </div>
    </AppShell>
  );
}

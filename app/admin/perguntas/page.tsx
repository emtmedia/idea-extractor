'use client';

import AppShell from '@/components/AppShell';
import PinGuard from '@/components/PinGuard';
import { useEffect, useState, useCallback } from 'react';

interface Question {
  id: string;
  area: string;
  type: string;
  phase: string;
  phaseLabel: string | null;
  phaseColor: string | null;
  order: number;
  text: string;
  note: string | null;
  tip: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const AREA_TABS = [
  { key: 'all', label: 'Padrão (P1-P8)', color: '#14344A' },
  { key: 'eng', label: 'Engenharia', color: '#2980B9' },
  { key: 'ger', label: 'Gerenciamento', color: '#E67E22' },
  { key: 'esg', label: 'ESG', color: '#1E8449' },
  { key: 'oeg', label: 'Óleo & Gás', color: '#6C3483' },
  { key: 'com', label: 'Comercial', color: '#1A5276' },
];

interface NewQuestionForm {
  text: string;
  note: string;
  tip: string;
  phase: string;
  phaseLabel: string;
  phaseColor: string;
  order: number;
}

const DEFAULT_NEW_FORM: NewQuestionForm = {
  text: '',
  note: '',
  tip: '',
  phase: 'probe',
  phaseLabel: 'Sonda',
  phaseColor: '#2980B9',
  order: 0,
};

export default function AdminPerguntasPage() {
  return (
    <AppShell>
      <PinGuard title="Acesso à Área de Administração">
        <PerguntasContent />
      </PinGuard>
    </AppShell>
  );
}

function PerguntasContent() {
  const [activeTab, setActiveTab] = useState('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState<NewQuestionForm>(DEFAULT_NEW_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const currentTab = AREA_TABS.find((t) => t.key === activeTab)!;

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/perguntas?area=${activeTab}`);
      const data = await res.json();
      setQuestions(data);
    } catch {
      setError('Erro ao carregar perguntas.');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  async function handleToggleActive(q: Question) {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/perguntas/${q.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !q.active }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Erro ao atualizar pergunta.');
    } else {
      await loadQuestions();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return;
    setSaving(true);
    await fetch(`/api/perguntas/${id}`, { method: 'DELETE' });
    await loadQuestions();
    setSaving(false);
  }

  async function handleSaveEdit(id: string) {
    setSaving(true);
    setError('');
    const res = await fetch(`/api/perguntas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Erro ao salvar.');
    } else {
      setEditingId(null);
      await loadQuestions();
    }
    setSaving(false);
  }

  async function handleCreate() {
    if (!newForm.text.trim()) {
      setError('O texto da pergunta é obrigatório.');
      return;
    }
    setSaving(true);
    setError('');
    const body = {
      area: activeTab,
      type: activeTab === 'all' ? 'standard' : 'probe',
      phase: newForm.phase,
      phaseLabel: newForm.phaseLabel,
      phaseColor: newForm.phaseColor,
      order: newForm.order,
      text: newForm.text,
      note: newForm.note || null,
      tip: newForm.tip || null,
      active: true,
    };
    const res = await fetch('/api/perguntas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Erro ao criar pergunta.');
    } else {
      setShowNewForm(false);
      setNewForm(DEFAULT_NEW_FORM);
      await loadQuestions();
    }
    setSaving(false);
  }

  const probeQuestions = questions.filter((q) => q.type === 'probe');
  const activeProbeCount = probeQuestions.filter((q) => q.active).length;

  return (
    <div>
      {/* Header */}
      <div
        className="text-white px-8 py-10"
        style={{ background: 'linear-gradient(135deg, #14344A 0%, #1A5276 100%)' }}
      >
        <h2 className="text-3xl font-bold tracking-tight">⚙️ Banco de Perguntas</h2>
        <p className="text-white/75 mt-2 text-sm">Gerencie as perguntas padrão e sondas específicas por área.</p>
      </div>

      <div className="px-8 py-6 max-w-5xl">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">
            {error}
          </div>
        )}

        {/* Area Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {AREA_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setShowNewForm(false);
                setEditingId(null);
                setError('');
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                activeTab === tab.key
                  ? 'text-white border-transparent'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
              }`}
              style={activeTab === tab.key ? { background: tab.color, borderColor: tab.color } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-[#14344A]">{currentTab.label}</h3>
            {activeTab !== 'all' && (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ background: activeProbeCount >= 10 ? '#E74C3C' : currentTab.color }}
              >
                {activeProbeCount}/10 ativas
              </span>
            )}
          </div>
          <button
            onClick={() => { setShowNewForm(true); setEditingId(null); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: currentTab.color }}
          >
            + Nova Pergunta
          </button>
        </div>

        {/* New question form */}
        {showNewForm && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-4">
            <h4 className="font-semibold text-[#14344A] mb-3">Nova Pergunta</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Texto da Pergunta *</label>
                <textarea
                  value={newForm.text}
                  onChange={(e) => setNewForm((f) => ({ ...f, text: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-400 bg-white"
                  rows={3}
                  placeholder="Escreva a pergunta..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nota / Instrução</label>
                  <input
                    value={newForm.note}
                    onChange={(e) => setNewForm((f) => ({ ...f, note: e.target.value }))}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
                    placeholder="Orientação para o entrevistador..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Ordem</label>
                  <input
                    type="number"
                    value={newForm.order}
                    onChange={(e) => setNewForm((f) => ({ ...f, order: Number(e.target.value) }))}
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Dica / Exemplo (opcional)</label>
                <textarea
                  value={newForm.tip}
                  onChange={(e) => setNewForm((f) => ({ ...f, tip: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-400 bg-white"
                  rows={2}
                  placeholder="Exemplo prático ou dica adicional..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowNewForm(false); setNewForm(DEFAULT_NEW_FORM); setError(''); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                  style={{ background: currentTab.color }}
                >
                  {saving ? 'Salvando...' : 'Criar Pergunta'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions list */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Carregando...</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">Nenhuma pergunta cadastrada.</p>
            <p className="text-sm">Clique em "Nova Pergunta" para adicionar ou acesse <code>/api/seed</code> para popular o banco.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-opacity ${!q.active ? 'opacity-50' : ''}`}
              >
                <div
                  className="px-5 py-1.5 flex items-center justify-between"
                  style={{ background: q.phaseColor || currentTab.color }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white">
                    #{q.order || idx + 1} · {q.phaseLabel || q.phase}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${q.active ? 'bg-white/20 text-white' : 'bg-black/20 text-white/60'}`}>
                    {q.active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <div className="p-4">
                  {editingId === q.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full border-2 border-blue-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-400 bg-blue-50"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setEditingId(null); setError(''); }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSaveEdit(q.id)}
                          disabled={saving}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-60"
                          style={{ background: currentTab.color }}
                        >
                          {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-800 leading-relaxed mb-2">{q.text}</p>
                      {q.note && (
                        <p className="text-xs text-gray-500 italic mb-2">{q.note}</p>
                      )}
                    </>
                  )}

                  {editingId !== q.id && (
                    <div className="flex items-center gap-2 mt-3 border-t border-gray-100 pt-3">
                      <button
                        onClick={() => { setEditingId(q.id); setEditText(q.text); setError(''); }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleToggleActive(q)}
                        disabled={saving}
                        className="text-xs font-medium px-2 py-1 rounded disabled:opacity-60"
                        style={{ color: q.active ? '#E74C3C' : '#1E8449' }}
                      >
                        {q.active ? '⬛ Desativar' : '✅ Ativar'}
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
                        disabled={saving}
                        className="text-xs font-medium text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 ml-auto disabled:opacity-60"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { Area } from '@/lib/areas';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Session {
  id: string;
  canvas: Record<string, string>;
}

const CANVAS_FIELDS = [
  { id: 'hmw', icon: '🎯', title: 'Declaração do Desafio (How Might We...)', hint: 'Frase-desafio no formato "Como poderíamos [verbo] [contexto] de modo que [resultado desejado]?"', example: 'Exemplo (Engenharia): "Como poderíamos reduzir o tempo de compatibilização entre disciplinas de modo que os ciclos de revisão caiam pela metade?"', full: true },
  { id: 'context', icon: '📍', title: 'Contexto Atual', hint: 'Situação hoje: como o processo funciona, quem está envolvido, quais ferramentas são usadas.', example: 'Ex.: As 4 disciplinas revisam projetos sequencialmente via e-mail. Cada ciclo leva 7–10 dias.', full: false },
  { id: 'pains', icon: '😤', title: 'Dores e Sintomas', hint: 'O que é observável? O que frustra as equipes no dia a dia?', example: 'Ex.: Interferências entre tubulação e elétrica só detectadas na obra.', full: false },
  { id: 'root', icon: '🔍', title: 'Causa-Raiz', hint: 'Resultado da análise dos 5 Porquês. Qual é a causa profunda?', example: 'Ex.: Fluxo de revisão não prevê checkpoint interdisciplinar.', full: false },
  { id: 'impact', icon: '💰', title: 'Impacto Quantificado', hint: 'Números: horas perdidas, custo de retrabalho, atrasos, riscos.', example: 'Ex.: ~120h/mês em retrabalho; ~R$ 300k/ano em aditivos.', full: false },
  { id: 'stakeholders', icon: '👥', title: 'Stakeholders Afetados', hint: 'Quem sofre com o problema? Quem se beneficiaria?', example: 'Ex.: Projetistas, coordenadores, gerentes de contrato, equipe de campo.', full: false },
  { id: 'constraints', icon: '🚧', title: 'Restrições e Tentativas Anteriores', hint: 'O que já foi tentado? Limites técnicos, orçamentários ou culturais?', example: 'Ex.: Já tentaram BIM em 2020, sem adesão das equipes.', full: false },
  { id: 'vision', icon: '🌟', title: 'Visão de Sucesso', hint: 'Como seria o mundo ideal se o desafio fosse resolvido?', example: 'Ex.: Revisões simultâneas em modelo compartilhado, ciclo de 10 para 3 dias.', full: false },
];

export default function CanvasForm({ session, area }: { session: Session; area: Area }) {
  const [canvas, setCanvas] = useState<Record<string, string>>(
    (session.canvas as Record<string, string>) || {}
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  function setField(id: string, value: string) {
    setCanvas((prev) => ({ ...prev, [id]: value }));
    setSaved(false);
  }

  async function autoSave() {
    setSaving(true);
    await fetch(`/api/sessoes/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canvas }),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Link href={`/sessao/${session.id}`} className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700">
            ← Voltar à Entrevista
          </Link>
          <Link href={`/relatorio/${session.id}`} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--c-primary)' }}>
            📄 Ver Relatório
          </Link>
        </div>
        <span className="text-xs text-gray-400">
          {saving ? '💾 Salvando...' : saved ? '✓ Salvo automaticamente' : ''}
        </span>
      </div>

      {/* Formula box */}
      <div className="rounded-xl p-6 text-center text-white mb-6" style={{ background: 'linear-gradient(135deg, #14344A 0%, #2980B9 100%)' }}>
        <div className="text-xs uppercase tracking-widest opacity-70 mb-3 font-semibold">Fórmula da Declaração do Desafio</div>
        <div className="text-lg font-light leading-relaxed">
          &quot;Como poderíamos <strong className="font-bold text-amber-300">[ação/verbo]</strong> no contexto de <strong className="font-bold text-amber-300">[processo/área]</strong><br />
          de modo que <strong className="font-bold text-amber-300">[resultado mensurável]</strong>?&quot;
        </div>
      </div>

      {/* Canvas grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {CANVAS_FIELDS.map((f) => (
          <div
            key={f.id}
            className={`bg-white border-2 border-dashed border-gray-200 rounded-xl p-5 hover:border-blue-400 focus-within:border-blue-400 focus-within:border-solid transition-colors ${f.full ? 'col-span-2' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{f.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wide text-[#14344A]">{f.title}</span>
            </div>
            <p className="text-xs text-gray-400 mb-2 leading-relaxed">{f.hint}</p>
            <div className="bg-orange-50 pl-3 py-2 text-xs text-gray-600 mb-3 leading-relaxed rounded-r-lg" style={{ borderLeftWidth: 3, borderLeftColor: '#E67E22' }}>
              {f.example}
            </div>
            <textarea
              value={canvas[f.id] || ''}
              onChange={(e) => setField(f.id, e.target.value)}
              placeholder="Preencha aqui..."
              className="w-full border-2 border-gray-100 rounded-lg p-3 text-sm resize-y focus:outline-none focus:border-blue-400 bg-gray-50 placeholder:italic placeholder:text-gray-400"
              style={{ minHeight: f.full ? '90px' : '70px' }}
            />
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="flex justify-between">
        <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
          ← Dashboard
        </Link>
        <Link href={`/relatorio/${session.id}`} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--c-primary)' }}>
          📄 Ver Relatório Completo →
        </Link>
      </div>
    </div>
  );
}

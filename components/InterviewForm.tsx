'use client';

import { Area } from '@/lib/areas';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import MicButton from '@/components/MicButton';

interface Session {
  id: string;
  area: string;
  interviewee: string | null;
  interviewDate: string | null;
  answers: Record<string, string>;
  canvas: Record<string, string>;
  status: string;
}

const PHASES = [
  {
    title: 'Fase 1 — Aquecimento',
    subtitle: 'Objetivo: criar contexto e evitar respostas prontas.',
    duration: '10 min',
    color: '#1ABC9C',
    tag: 'Aquecimento',
    questions: [
      {
        id: 'q1',
        label: 'P1: "Me conte sobre o fluxo típico de um projeto/demanda na sua diretoria, do início ao fim."',
        note: 'Deixe o diretor narrar. Anote os pontos onde ele demonstra frustração ou pausa.',
        placeholder: 'Registre a resposta do entrevistado...',
        tall: false,
        tip: '',
      },
      {
        id: 'q2',
        label: 'P2: "Se eu acompanhasse sua equipe por uma semana, o que eu veria que te incomoda em termos de produtividade?"',
        note: 'Força uma resposta concreta e observável, não abstrata.',
        placeholder: 'Registre a resposta do entrevistado...',
        tall: false,
        tip: '',
      },
    ],
  },
  {
    title: 'Fase 2 — Aprofundamento',
    subtitle: 'Objetivo: chegar à raiz do problema usando a técnica dos "5 Porquês".',
    duration: '20 min',
    color: '#E67E22',
    tag: 'Aprofundamento',
    questions: [
      {
        id: 'q3',
        label: 'P3: "Você mencionou [gargalo X]. Me ajude a entender: por que isso acontece?"',
        note: 'Repita "e por que isso?" até 5 vezes, anotando cada camada.',
        placeholder: 'Porquê 1:\nPorquê 2:\nPorquê 3:\nPorquê 4:\nPorquê 5:\nCausa-raiz identificada:',
        tall: true,
        tip: 'Exemplo prático dos 5 Porquês:\n① "Prazos atrasam." → Por quê?\n② "Porque as revisões de projeto demoram." → Por quê?\n③ "Porque as disciplinas trabalham em silos." → Por quê?\n④ "Porque não há checkpoint interdisciplinar." → Por quê?\n⑤ "Porque o processo foi desenhado quando tínhamos só 2 disciplinas."\n→ Raiz real: processo de revisão desatualizado para a complexidade atual.',
      },
      {
        id: 'q4',
        label: 'P4: "Quem mais é afetado por isso? Quais equipes ou processos a jusante sofrem?"',
        note: 'Mapeia o impacto sistêmico — essencial para o Challenge Canvas.',
        placeholder: 'Registre a resposta do entrevistado...',
        tall: false,
        tip: '',
      },
      {
        id: 'q5',
        label: 'P5: "Vocês já tentaram resolver isso antes? O que aconteceu?"',
        note: 'Revela restrições e tentativas anteriores. Evita que os grupos reinventem o que já falhou.',
        placeholder: 'Registre a resposta do entrevistado...',
        tall: false,
        tip: '',
      },
    ],
  },
  {
    title: 'Fase 3 — Impacto e Dimensionamento',
    subtitle: 'Objetivo: quantificar o problema para que os grupos priorizem.',
    duration: '10 min',
    color: '#E74C3C',
    tag: 'Impacto',
    questions: [
      {
        id: 'q6',
        label: 'P6: "Se eu pudesse resolver esse problema amanhã, qual seria o impacto concreto? Em horas, dinheiro, retrabalho, risco?"',
        note: 'Busque números, mesmo que aproximados. "~40h/mês" é melhor que "melhoraria muito".',
        placeholder: 'Registre a resposta do entrevistado...',
        tall: false,
        tip: '',
      },
      {
        id: 'q7',
        label: 'P7: "Em uma escala, quanto esse problema impacta: a entrega ao cliente, o custo operacional e a satisfação da equipe?"',
        note: 'Escala sugerida: 1 (baixo) a 5 (crítico). Ajuda a triangular a prioridade.',
        placeholder: 'Entrega ao cliente: _/5\nCusto operacional: _/5\nSatisfação da equipe: _/5',
        tall: false,
        tip: '',
      },
    ],
  },
  {
    title: 'Fase 4 — Enquadramento',
    subtitle: 'Objetivo: validar com o diretor o enquadramento do desafio.',
    duration: '5 min',
    color: '#2980B9',
    tag: 'Enquadramento',
    questions: [
      {
        id: 'q8',
        label: 'P8: "Então, se eu entendi bem, o desafio central seria [sua síntese em uma frase]. Isso captura a essência?"',
        note: 'Leia em voz alta sua frase-síntese e deixe o diretor ajustar. Momento crucial para o alinhamento.',
        placeholder: 'Registre a frase-síntese validada...',
        tall: false,
        tip: '',
      },
    ],
  },
];

export default function InterviewForm({ session, area }: { session: Session; area: Area }) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    (session.answers as Record<string, string>) || {}
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Auto-save debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      autoSave();
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setSaved(false);
  }

  function appendTranscript(id: string, text: string) {
    const current = answers[id] || '';
    setAnswer(id, current ? `${current}\n${text}` : text);
  }

  async function autoSave() {
    setSaving(true);
    await fetch(`/api/sessoes/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    setSaving(false);
    setSaved(true);
  }

  async function handleComplete() {
    setCompleting(true);
    await fetch(`/api/sessoes/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, status: 'completed' }),
    });
    setCompleting(false);
    setSaved(true);
    alert('Entrevista marcada como concluída!');
  }

  return (
    <div className="px-8 py-8 max-w-4xl">
      {/* Save indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Link href={`/canvas/${session.id}`} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: '#E67E22' }}>
            📋 Ir para Canvas
          </Link>
          <Link href={`/relatorio/${session.id}`} className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700">
            📄 Ver Relatório
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {saving ? '💾 Salvando...' : saved ? '✓ Salvo automaticamente' : ''}
          </span>
          <button
            onClick={handleComplete}
            disabled={completing}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: '#1E8449' }}
          >
            {completing ? 'Salvando...' : '✓ Marcar como Concluída'}
          </button>
        </div>
      </div>

      {/* Dica de preparação */}
      <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-lg p-4 mb-6 flex gap-3">
        <span className="text-lg">💡</span>
        <div className="text-sm text-emerald-800">
          <strong>Dica de preparação:</strong> Envie ao diretor, 3 dias antes, um e-mail breve explicando que você quer entender os gargalos de produtividade da área — sem pedir que ele traga um desafio pronto. Peça que ele pense em 2–3 situações recentes que o frustraram.
        </div>
      </div>

      {/* Standard questions by phase */}
      {PHASES.map((phase) => (
        <div key={phase.title} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-[#14344A]">{phase.title}</h3>
            <span className="text-xs text-gray-400 font-mono">{phase.duration}</span>
          </div>
          <p className="text-sm text-gray-500 italic mb-4">{phase.subtitle}</p>

          {phase.questions.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
              <div className="px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white" style={{ background: phase.color }}>
                {phase.tag}
              </div>
              <div className="p-5">
                <div className="text-sm font-semibold text-gray-800 mb-1 leading-relaxed">{q.label}</div>
                <div className="text-xs text-gray-500 italic mb-3">{q.note}</div>
                {q.tip && (
                  <div className="bg-orange-50 rounded-lg p-3 mb-3 text-xs text-orange-700 leading-relaxed whitespace-pre-line">
                    <strong className="block mb-1">Exemplo dos 5 Porquês:</strong>
                    {q.tip}
                  </div>
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Resposta:</p>
                  <MicButton onTranscript={(text) => appendTranscript(q.id, text)} />
                </div>
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm resize-y focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 placeholder:italic placeholder:text-gray-400"
                  style={{ minHeight: q.tall ? '130px' : '80px' }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Area-specific probes */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{area.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-[#14344A]">Sondas Específicas — {area.label}</h3>
            <p className="text-sm text-gray-500 italic">Perguntas adaptadas para a linguagem e dinâmica desta área</p>
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-4 text-sm text-blue-800">
          <strong>Foco da área:</strong> {area.focus}<br/>
          <span className="text-blue-600 text-xs mt-1 block">{area.intro}</span>
        </div>

        {area.probes.map((probe, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
            <div className="px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white" style={{ background: area.color }}>
              Sonda {i + 1} · {area.label.replace('Diretoria de ', '').replace('Comitê de ', '').replace('Diretoria ', '')}
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold text-gray-800 mb-3 leading-relaxed">▸ {probe}</div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Resposta:</p>
                <MicButton onTranscript={(text) => appendTranscript(`probe_${i}`, text)} />
              </div>
              <textarea
                value={answers[`probe_${i}`] || ''}
                onChange={(e) => setAnswer(`probe_${i}`, e.target.value)}
                placeholder="Registre a resposta do entrevistado..."
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm resize-y focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 placeholder:italic placeholder:text-gray-400"
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Additional comments */}
      <div className="bg-white rounded-xl border border-l-4 shadow-sm p-6 mb-8" style={{ borderLeftColor: '#E67E22' }}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-[#14344A]">📝 Comentários Adicionais</h4>
          <MicButton onTranscript={(text) => appendTranscript('comments', text)} />
        </div>
        <p className="text-sm text-gray-500 mb-3">Registre observações, percepções de linguagem corporal, temas laterais mencionados, ou qualquer informação adicional.</p>
        <textarea
          value={answers['comments'] || ''}
          onChange={(e) => setAnswer('comments', e.target.value)}
          placeholder="Impressões gerais, pontos de atenção, observações não-verbais, temas emergentes..."
          className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm resize-y focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 placeholder:italic placeholder:text-gray-400"
          style={{ minHeight: '120px' }}
        />
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between">
        <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
          ← Voltar ao Dashboard
        </Link>
        <div className="flex gap-3">
          <Link href={`/canvas/${session.id}`} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: '#E67E22' }}>
            📋 Preencher Canvas →
          </Link>
          <button
            onClick={handleComplete}
            disabled={completing}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: '#1E8449' }}
          >
            ✓ Concluir Entrevista
          </button>
        </div>
      </div>
    </div>
  );
}

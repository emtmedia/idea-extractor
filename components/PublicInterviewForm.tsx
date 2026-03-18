'use client';

import { Area } from '@/lib/areas';
import { useState, useEffect } from 'react';

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
        placeholder: 'Registre sua resposta...',
        tall: false,
        tip: '',
      },
      {
        id: 'q2',
        label: 'P2: "Se eu acompanhasse sua equipe por uma semana, o que eu veria que te incomoda em termos de produtividade?"',
        note: 'Força uma resposta concreta e observável, não abstrata.',
        placeholder: 'Registre sua resposta...',
        tall: false,
        tip: '',
      },
    ],
  },
  {
    title: 'Fase 2 — Aprofundamento',
    subtitle: 'Objetivo: chegar à raiz do problema.',
    duration: '20 min',
    color: '#E67E22',
    tag: 'Aprofundamento',
    questions: [
      {
        id: 'q3',
        label: 'P3: "Você mencionou [gargalo X]. Me ajude a entender: por que isso acontece?"',
        note: 'Descreva as camadas do problema.',
        placeholder: 'Porquê 1:\nPorquê 2:\nPorquê 3:\nPorquê 4:\nPorquê 5:\nCausa-raiz identificada:',
        tall: true,
        tip: '',
      },
      {
        id: 'q4',
        label: 'P4: "Quem mais é afetado por isso? Quais equipes ou processos a jusante sofrem?"',
        note: 'Mapeia o impacto sistêmico.',
        placeholder: 'Registre sua resposta...',
        tall: false,
        tip: '',
      },
      {
        id: 'q5',
        label: 'P5: "Vocês já tentaram resolver isso antes? O que aconteceu?"',
        note: 'Revela restrições e tentativas anteriores.',
        placeholder: 'Registre sua resposta...',
        tall: false,
        tip: '',
      },
    ],
  },
  {
    title: 'Fase 3 — Impacto e Dimensionamento',
    subtitle: 'Objetivo: quantificar o problema.',
    duration: '10 min',
    color: '#E74C3C',
    tag: 'Impacto',
    questions: [
      {
        id: 'q6',
        label: 'P6: "Se eu pudesse resolver esse problema amanhã, qual seria o impacto concreto? Em horas, dinheiro, retrabalho, risco?"',
        note: 'Busque números, mesmo que aproximados.',
        placeholder: 'Registre sua resposta...',
        tall: false,
        tip: '',
      },
      {
        id: 'q7',
        label: 'P7: "Em uma escala, quanto esse problema impacta: a entrega ao cliente, o custo operacional e a satisfação da equipe?"',
        note: 'Escala sugerida: 1 (baixo) a 5 (crítico).',
        placeholder: 'Entrega ao cliente: _/5\nCusto operacional: _/5\nSatisfação da equipe: _/5',
        tall: false,
        tip: '',
      },
    ],
  },
  {
    title: 'Fase 4 — Enquadramento',
    subtitle: 'Objetivo: validar o enquadramento do desafio.',
    duration: '5 min',
    color: '#2980B9',
    tag: 'Enquadramento',
    questions: [
      {
        id: 'q8',
        label: 'P8: "Então, se eu entendi bem, o desafio central seria [sua síntese em uma frase]. Isso captura a essência?"',
        note: 'Descreva o desafio em uma frase-síntese.',
        placeholder: 'Registre a frase-síntese validada...',
        tall: false,
        tip: '',
      },
    ],
  },
];

export default function PublicInterviewForm({ session, area }: { session: Session; area: Area }) {
  const [answers, setAnswers] = useState<Record<string, string>>(
    (session.answers as Record<string, string>) || {}
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auto-save debounce
  useEffect(() => {
    if (submitted) return;
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

  async function handleSubmit() {
    setSubmitting(true);
    await fetch(`/api/sessoes/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, status: 'completed' }),
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-[#14344A] mb-3">Obrigado!</h2>
          <p className="text-gray-600 text-lg">Suas respostas foram registradas.</p>
          <p className="text-gray-400 text-sm mt-2">Você pode fechar esta janela.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      {/* Save indicator */}
      <div className="flex items-center justify-end mb-4">
        <span className="text-xs text-gray-400">
          {saving ? '💾 Salvando...' : saved ? '✓ Salvo automaticamente' : ''}
        </span>
      </div>

      {/* Standard questions by phase */}
      {PHASES.map((phase) => (
        <div key={phase.title} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-bold text-[#14344A]">{phase.title}</h3>
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
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Sua resposta:</p>
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
            <h3 className="text-base font-bold text-[#14344A]">Perguntas Específicas — {area.label}</h3>
            <p className="text-sm text-gray-500 italic">Perguntas adaptadas para a linguagem e dinâmica desta área</p>
          </div>
        </div>

        {area.probes.map((probe, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
            <div className="px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white" style={{ background: area.color }}>
              Pergunta {i + 1}
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold text-gray-800 mb-3 leading-relaxed">▸ {probe}</div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Sua resposta:</p>
              <textarea
                value={answers[`probe_${i}`] || ''}
                onChange={(e) => setAnswer(`probe_${i}`, e.target.value)}
                placeholder="Escreva sua resposta aqui..."
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm resize-y focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 placeholder:italic placeholder:text-gray-400"
                style={{ minHeight: '80px' }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Additional comments */}
      <div className="bg-white rounded-xl border border-l-4 shadow-sm p-6 mb-8" style={{ borderLeftColor: '#E67E22' }}>
        <h4 className="font-bold text-[#14344A] mb-2">Comentários Adicionais</h4>
        <p className="text-sm text-gray-500 mb-3">Adicione observações, pontos importantes ou qualquer informação complementar.</p>
        <textarea
          value={answers['comments'] || ''}
          onChange={(e) => setAnswer('comments', e.target.value)}
          placeholder="Observações gerais, pontos de atenção, temas emergentes..."
          className="w-full border-2 border-gray-200 rounded-lg p-3 text-sm resize-y focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 placeholder:italic placeholder:text-gray-400"
          style={{ minHeight: '120px' }}
        />
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-8 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
          style={{ background: '#1E8449' }}
        >
          {submitting ? 'Enviando...' : '✓ Enviar Respostas'}
        </button>
      </div>
    </div>
  );
}

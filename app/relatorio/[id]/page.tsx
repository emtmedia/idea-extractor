import AppShell from '@/components/AppShell';
import ReportPageClient from '@/components/ReportPageClient';
import { prisma } from '@/lib/db';
import { AREA_MAP } from '@/lib/areas';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';

export const dynamic = 'force-dynamic';

const Q_LABELS: Record<string, { phase: string; color: string; label: string }> = {
  q1: { phase: 'Aquecimento', color: '#1ABC9C', label: 'P1 — Fluxo típico de um projeto/demanda' },
  q2: { phase: 'Aquecimento', color: '#1ABC9C', label: 'P2 — O que incomoda em termos de produtividade' },
  q3: { phase: 'Aprofundamento', color: '#E67E22', label: 'P3 — Análise dos 5 Porquês' },
  q4: { phase: 'Aprofundamento', color: '#E67E22', label: 'P4 — Quem mais é afetado (impacto sistêmico)' },
  q5: { phase: 'Aprofundamento', color: '#E67E22', label: 'P5 — Tentativas anteriores de resolução' },
  q6: { phase: 'Impacto', color: '#E74C3C', label: 'P6 — Impacto concreto quantificado' },
  q7: { phase: 'Impacto', color: '#E74C3C', label: 'P7 — Escala de impacto (cliente, custo, equipe)' },
  q8: { phase: 'Enquadramento', color: '#2980B9', label: 'P8 — Síntese validada pelo diretor' },
  comments: { phase: 'Observações', color: '#8E44AD', label: 'Comentários Adicionais' },
};

const CANVAS_LABELS: Record<string, { icon: string; title: string }> = {
  hmw: { icon: '🎯', title: 'Declaração do Desafio (How Might We...)' },
  context: { icon: '📍', title: 'Contexto Atual' },
  pains: { icon: '😤', title: 'Dores e Sintomas' },
  root: { icon: '🔍', title: 'Causa-Raiz' },
  impact: { icon: '💰', title: 'Impacto Quantificado' },
  stakeholders: { icon: '👥', title: 'Stakeholders Afetados' },
  constraints: { icon: '🚧', title: 'Restrições e Tentativas Anteriores' },
  vision: { icon: '🌟', title: 'Visão de Sucesso' },
};

export default async function RelatorioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) notFound();

  const area = AREA_MAP[session.area as keyof typeof AREA_MAP];
  const answers = (session.answers as Record<string, string>) || {};
  const canvas = (session.canvas as Record<string, string>) || {};

  const standardQKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'comments'];
  const probeKeys = area ? area.probes.map((_, i) => `probe_${i}`) : [];

  return (
    <AppShell>
      <div
        className="text-white px-8 py-10 no-print"
        style={{ background: 'linear-gradient(135deg, #1A2A3A 0%, #2C3E50 100%)' }}
      >
        <h2 className="text-3xl font-bold tracking-tight">📄 Relatório da Entrevista</h2>
        <p className="text-white/75 mt-2 text-sm">{area?.label} · {session.interviewee || '—'} · {session.interviewDate || '—'}</p>
        <div className="flex gap-3 mt-4 no-print">
          <Link href={`/sessao/${session.id}`} className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/15 text-white hover:bg-white/25">
            ← Entrevista
          </Link>
          <Link href={`/canvas/${session.id}`} className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/15 text-white hover:bg-white/25">
            📋 Canvas
          </Link>
          <PrintButton />
        </div>
      </div>

      <ReportPageClient>
        <div className="px-8 py-8 max-w-4xl" id="report-content">
          {/* Meta */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="font-bold text-[#14344A] mb-4 text-lg">Identificação da Sessão</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Área / Diretoria', area?.label || session.area],
                ['Entrevistado(a)', session.interviewee || '—'],
                ['Data', session.interviewDate || '—'],
                ['Status', session.status === 'completed' ? 'Concluída' : 'Rascunho'],
                ['Criado em', new Date(session.createdAt).toLocaleDateString('pt-BR')],
              ].map(([k, v]) => (
                <div key={k}>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{k}</span>
                  <p className="font-medium text-gray-800 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interview answers */}
          <h3 className="font-bold text-[#14344A] text-lg mb-4">Respostas da Entrevista</h3>
          {standardQKeys.filter((k) => answers[k]).map((key) => {
            const meta = Q_LABELS[key];
            if (!meta) return null;
            return (
              <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
                <div className="px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white" style={{ background: meta.color }}>
                  {meta.phase}
                </div>
                <div className="p-5">
                  <div className="text-sm font-semibold text-gray-700 mb-2">{meta.label}</div>
                  <div className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 leading-relaxed border-l-4" style={{ borderLeftColor: meta.color }}>
                    {answers[key]}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Area probes */}
          {probeKeys.some((k) => answers[k]) && (
            <>
              <h3 className="font-bold text-[#14344A] text-lg mb-4 mt-8">
                {area?.icon} Sondas Específicas — {area?.label}
              </h3>
              {probeKeys.filter((k) => answers[k]).map((key, i) => (
                <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
                  <div className="px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white" style={{ background: area?.color || '#2980B9' }}>
                    Sonda {i + 1}
                  </div>
                  <div className="p-5">
                    <div className="text-sm font-semibold text-gray-700 mb-2">▸ {area?.probes[i]}</div>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 leading-relaxed border-l-4" style={{ borderLeftColor: area?.color || '#2980B9' }}>
                      {answers[key]}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Canvas */}
          {Object.keys(canvas).some((k) => canvas[k]) && (
            <>
              <h3 className="font-bold text-[#14344A] text-lg mb-4 mt-8">📋 Challenge Canvas</h3>
              {canvas['hmw'] && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-[#1A5276] mb-2">🎯 Declaração do Desafio (How Might We...)</div>
                  <div className="text-base font-medium text-[#14344A] whitespace-pre-wrap">{canvas['hmw']}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(CANVAS_LABELS)
                  .filter(([k]) => k !== 'hmw' && canvas[k])
                  .map(([k, meta]) => (
                    <div key={k} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <div className="text-xs font-bold uppercase tracking-wide text-[#1A5276] mb-2">{meta.icon} {meta.title}</div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{canvas[k]}</div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </ReportPageClient>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .sidebar { display: none !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </AppShell>
  );
}

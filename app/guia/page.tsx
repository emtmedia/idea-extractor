import AppShell from '@/components/AppShell';
import Link from 'next/link';

export default function GuiaPage() {
  return (
    <AppShell>
      <div style={{ background: 'linear-gradient(135deg, #14344A 0%, #2980B9 100%)' }} className="text-white px-8 py-10">
        <h2 className="text-3xl font-bold tracking-tight">📘 Material Instrutivo</h2>
        <p className="text-white/75 mt-2 text-sm max-w-lg">Guia completo de extração de desafios de produtividade para a Campanha de Inovação IDG</p>
        <span className="inline-block mt-4 bg-white/15 border border-white/20 text-xs font-medium px-4 py-1 rounded-full">Challenge Canvas + Entrevista Estruturada</span>
      </div>
      <div className="px-8 py-8 max-w-4xl">

        {/* Why not ask directly */}
        <div className="bg-white rounded-xl border-l-4 border-red-500 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-[#14344A] text-lg mb-3">⚠️ Por que não perguntar o desafio diretamente?</h3>
          <p className="text-sm text-gray-600 mb-4">Quando um diretor é convidado a &quot;apresentar seu desafio de produtividade&quot;, há três riscos recorrentes:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
              <thead><tr style={{ background: '#14344A' }}>
                <th className="text-white text-left p-3 font-semibold">Armadilha</th>
                <th className="text-white text-left p-3 font-semibold">Exemplo Ruim</th>
                <th className="text-white text-left p-3 font-semibold">Resultado Desejado</th>
              </tr></thead>
              <tbody>
                {[
                  ['Solução disfarçada', '"Precisamos comprar o software X para controlar prazos."', '"Perdemos 15% dos prazos por falta de visibilidade em tempo real sobre o avanço físico."'],
                  ['Generalismo', '"O problema é comunicação entre equipes."', '"Informações críticas de campo levam 48h para chegar à engenharia, causando retrabalho em 20% das RDOs."'],
                  ['Sintoma, não causa', '"Nossos relatórios de ESG atrasam sempre."', '"A coleta de dados ambientais é manual e descentralizada, exigindo 3 semanas de consolidação."'],
                ].map(([trap, bad, good], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 font-medium">{trap}</td>
                    <td className="p-3 text-red-600">{bad}</td>
                    <td className="p-3 text-green-700 font-medium">{good}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interview script summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-bold text-[#14344A] text-lg mb-4">🎙️ Roteiro de Entrevista (45 min)</h3>
          {[
            { phase: 'Fase 1 — Aquecimento', time: '10 min', color: '#1ABC9C', items: ['P1: Fluxo típico do projeto/demanda', 'P2: O que incomoda em termos de produtividade'] },
            { phase: 'Fase 2 — Aprofundamento', time: '20 min', color: '#E67E22', items: ['P3: 5 Porquês (causa-raiz)', 'P4: Quem mais é afetado', 'P5: Tentativas anteriores'] },
            { phase: 'Fase 3 — Impacto', time: '10 min', color: '#E74C3C', items: ['P6: Impacto concreto quantificado', 'P7: Escala de impacto'] },
            { phase: 'Fase 4 — Enquadramento', time: '5 min', color: '#2980B9', items: ['P8: Síntese validada pelo diretor'] },
          ].map((p) => (
            <div key={p.phase} className="flex gap-4 mb-4 last:mb-0">
              <div className="w-1 rounded-full flex-shrink-0" style={{ background: p.color }} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-[#14344A]">{p.phase}</span>
                  <span className="text-xs text-gray-400 font-mono">{p.time}</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-0.5">
                  {p.items.map((item) => <li key={item} className="before:content-['▸'] before:text-orange-400 before:mr-1">{item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Formula */}
        <div className="rounded-xl p-6 text-center text-white mb-6" style={{ background: 'linear-gradient(135deg, #14344A 0%, #2980B9 100%)' }}>
          <div className="text-xs uppercase tracking-widest opacity-70 mb-3 font-semibold">Fórmula da Declaração do Desafio</div>
          <div className="text-lg font-light leading-relaxed">
            &quot;Como poderíamos <strong className="font-bold text-amber-300">[ação/verbo]</strong> no contexto de <strong className="font-bold text-amber-300">[processo/área]</strong><br />
            de modo que <strong className="font-bold text-amber-300">[resultado mensurável]</strong>?&quot;
          </div>
        </div>

        <div className="text-center">
          <Link href="/nova" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm" style={{ background: 'var(--c-primary)' }}>
            🎙️ Iniciar Nova Entrevista
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

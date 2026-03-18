import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { AREA_MAP } from '@/lib/areas';
import DeleteButton from '@/components/DeleteButton';

export const dynamic = 'force-dynamic';

function formatDateTime(date: Date): string {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

export default async function DashboardPage() {
  const sessions = await prisma.session.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  const total = sessions.length;
  const completed = sessions.filter((s) => s.status === 'completed').length;
  const draft = sessions.filter((s) => s.status === 'draft').length;

  return (
    <AppShell>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #14344A 0%, #2980B9 100%)' }} className="text-white px-8 py-10 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full bg-white/5 -translate-x-8 translate-y-8" />
        <h2 className="text-3xl font-bold tracking-tight relative">Dashboard</h2>
        <p className="text-white/75 mt-2 max-w-lg text-sm relative">
          Gerencie as sessões de entrevista e os Challenge Canvas da Campanha de Inovação IDG
        </p>
        <span className="inline-block mt-4 bg-white/15 border border-white/20 text-xs font-medium px-4 py-1 rounded-full">
          Challenge Canvas + Entrevista Estruturada
        </span>
      </div>

      <div className="px-8 py-8 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total de Sessões', value: total, color: '#2980B9' },
            { label: 'Concluídas', value: completed, color: '#1E8449' },
            { label: 'Em Rascunho', value: draft, color: '#E67E22' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm" style={{ borderLeftColor: color, borderLeftWidth: 4 }}>
              <div className="text-3xl font-bold" style={{ color }}>{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#14344A]">Sessões de Entrevista</h3>
          <Link
            href="/nova"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--c-primary)' }}
          >
            <span>➕</span> Nova Entrevista
          </Link>
        </div>

        {/* Sessions list */}
        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="text-4xl mb-4">🎙️</div>
            <h4 className="text-lg font-semibold text-[#14344A] mb-2">Nenhuma sessão ainda</h4>
            <p className="text-gray-500 text-sm mb-6">Comece criando uma nova entrevista com uma das diretorias ou comitês.</p>
            <Link href="/nova" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ background: 'var(--c-primary)' }}>
              ➕ Criar primeira entrevista
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => {
              const area = AREA_MAP[s.area as keyof typeof AREA_MAP];
              return (
                <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-1" style={{ background: area?.color || '#2980B9' }} />
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{area?.icon || '📋'}</span>
                      <div>
                        <div className="font-semibold text-[#14344A]">
                          {s.interviewee || 'Entrevistado não informado'}
                        </div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {area?.label || s.area} · {s.interviewDate || 'Data não informada'}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Criado em {formatDateTime(s.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{
                          background: s.status === 'completed' ? '#D5F5E3' : '#FEF9E7',
                          color: s.status === 'completed' ? '#1E8449' : '#935116',
                        }}
                      >
                        {s.status === 'completed' ? '✓ Concluída' : '⏳ Rascunho'}
                      </span>
                      <Link href={`/sessao/${s.id}`} className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white" style={{ background: 'var(--c-primary-mid)' }}>
                        Entrevista →
                      </Link>
                      <Link href={`/canvas/${s.id}`} className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white" style={{ background: 'var(--c-accent)' }}>
                        Canvas →
                      </Link>
                      <Link href={`/relatorio/${s.id}`} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700">
                        Relatório →
                      </Link>
                      <DeleteButton sessionId={s.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

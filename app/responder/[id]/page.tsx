import PublicInterviewForm from '@/components/PublicInterviewForm';
import { prisma } from '@/lib/db';
import { AREA_MAP } from '@/lib/areas';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ResponderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) notFound();

  const area = AREA_MAP[session.area as keyof typeof AREA_MAP];

  const totalQuestions = 8 + (area?.probes?.length || 0) + 1; // standard + probes + comments
  const answers = (session.answers as Record<string, string>) || {};
  const answeredCount = Object.values(answers).filter((v) => v && v.trim().length > 0).length;
  const progressPct = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{area?.icon}</span>
              <div>
                <h1 className="text-sm font-bold text-[#14344A] leading-tight">{area?.label}</h1>
                {session.interviewee && (
                  <p className="text-xs text-gray-500">{session.interviewee}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-gray-600">{progressPct}% preenchido</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: area?.color || '#2980B9' }}
            />
          </div>
        </div>
      </header>

      {/* Intro banner */}
      <div className="text-white px-4 py-8" style={{ background: `linear-gradient(135deg, #14344A 0%, ${area?.color || '#2980B9'} 100%)` }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">Entrevista de Extração de Desafios</h2>
          <p className="text-white/75 text-sm">
            Responda as perguntas abaixo. Suas respostas são salvas automaticamente.
          </p>
        </div>
      </div>

      {/* Form */}
      <PublicInterviewForm session={JSON.parse(JSON.stringify(session))} area={area} />

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        Campanha de Inovação IDG · Gerência de Inovação
      </footer>
    </div>
  );
}

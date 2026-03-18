import AppShell from '@/components/AppShell';
import InterviewForm from '@/components/InterviewForm';
import CopyLinkButton from '@/components/CopyLinkButton';
import { prisma } from '@/lib/db';
import { AREA_MAP } from '@/lib/areas';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SessaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) notFound();

  const area = AREA_MAP[session.area as keyof typeof AREA_MAP];

  return (
    <AppShell>
      <div
        className="text-white px-8 py-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D3B4F 0%, #1A8A6E 100%)' }}
      >
        <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full bg-white/5 -translate-x-8 translate-y-8" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{area?.icon}</span>
          <h2 className="text-3xl font-bold tracking-tight relative">Roteiro de Entrevista</h2>
        </div>
        <p className="text-white/75 text-sm relative">
          {area?.label} · {session.interviewee || 'Entrevistado não informado'} · {session.interviewDate || '—'}
        </p>
        <div className="flex items-center gap-3 flex-wrap mt-2">
          <span className="inline-block bg-white/15 border border-white/20 text-xs font-medium px-4 py-1 rounded-full">
            Entrevista estruturada de 45 minutos
          </span>
          <CopyLinkButton sessionId={id} />
        </div>
      </div>
      <InterviewForm session={JSON.parse(JSON.stringify(session))} area={area} />
    </AppShell>
  );
}

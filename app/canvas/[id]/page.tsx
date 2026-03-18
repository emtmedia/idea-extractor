import AppShell from '@/components/AppShell';
import CanvasPageClient from '@/components/CanvasPageClient';
import { prisma } from '@/lib/db';
import { AREA_MAP } from '@/lib/areas';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) notFound();
  const area = AREA_MAP[session.area as keyof typeof AREA_MAP];

  return (
    <AppShell>
      <div
        className="text-white px-8 py-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4A235A 0%, #7D3C98 100%)' }}
      >
        <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full bg-white/5 -translate-x-8 translate-y-8" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{area?.icon}</span>
          <h2 className="text-3xl font-bold tracking-tight relative">Challenge Canvas</h2>
        </div>
        <p className="text-white/75 text-sm relative">
          {area?.label} · {session.interviewee || 'Entrevistado não informado'}
        </p>
      </div>
      <CanvasPageClient session={JSON.parse(JSON.stringify(session))} area={area} />
    </AppShell>
  );
}

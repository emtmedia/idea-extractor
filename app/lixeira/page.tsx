import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/db';
import { AREA_MAP } from '@/lib/areas';
import LixeiraClient from '@/components/LixeiraClient';

export const dynamic = 'force-dynamic';

export default async function LixeiraPage() {
  const deleted = await prisma.session.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
  });

  return (
    <AppShell>
      <div
        className="text-white px-8 py-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4A1942 0%, #922B21 100%)' }}
      >
        <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full bg-white/5 -translate-x-8 translate-y-8" />
        <h2 className="text-3xl font-bold tracking-tight relative">🗑️ Lixeira</h2>
        <p className="text-white/75 mt-2 text-sm relative">
          Entrevistas excluídas — restaure ou exclua permanentemente
        </p>
      </div>
      <div className="px-8 py-8 max-w-5xl">
        <LixeiraClient
          sessions={JSON.parse(JSON.stringify(deleted))}
          areaMap={JSON.parse(JSON.stringify(AREA_MAP))}
        />
      </div>
    </AppShell>
  );
}

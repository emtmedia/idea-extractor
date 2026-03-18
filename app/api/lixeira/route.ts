import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sessions = await prisma.session.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
  });
  return Response.json(sessions);
}

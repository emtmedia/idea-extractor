import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  // Enforce max 10 active probes per area when activating
  if (body.active === true) {
    const current = await prisma.question.findUnique({ where: { id } });
    if (current && current.type === 'probe' && !current.active) {
      const activeCount = await prisma.question.count({
        where: { area: current.area, type: 'probe', active: true },
      });
      if (activeCount >= 10) {
        return Response.json(
          { error: 'Máximo de 10 sondas ativas por área atingido.' },
          { status: 400 }
        );
      }
    }
  }

  const question = await prisma.question.update({ where: { id }, data: body });
  return Response.json(question);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.question.delete({ where: { id } });
  return Response.json({ success: true });
}

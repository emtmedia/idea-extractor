import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const area = req.nextUrl.searchParams.get('area');
  const where = area ? { area } : {};
  const questions = await prisma.question.findMany({
    where,
    orderBy: [{ area: 'asc' }, { order: 'asc' }],
  });
  return Response.json(questions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Enforce max 10 active probes per area
  if (body.type === 'probe' && body.active !== false) {
    const activeCount = await prisma.question.count({
      where: { area: body.area, type: 'probe', active: true },
    });
    if (activeCount >= 10) {
      return Response.json(
        { error: 'Máximo de 10 sondas ativas por área atingido.' },
        { status: 400 }
      );
    }
  }

  const question = await prisma.question.create({ data: body });
  return Response.json(question, { status: 201 });
}

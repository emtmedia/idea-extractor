import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET() {
  const sessions = await prisma.session.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(sessions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { area, interviewee, cargo, interviewDate, nota } = body;

  if (!area) {
    return Response.json({ error: 'Area is required' }, { status: 400 });
  }

  const session = await prisma.session.create({
    data: {
      area,
      interviewee: interviewee || null,
      cargo: cargo || null,
      interviewDate: interviewDate || null,
      nota: nota || null,
      answers: {},
      canvas: {},
    },
  });

  return Response.json(session, { status: 201 });
}

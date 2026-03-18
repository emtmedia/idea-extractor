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
  const { area, interviewee, interviewDate } = body;

  if (!area) {
    return Response.json({ error: 'Area is required' }, { status: 400 });
  }

  const session = await prisma.session.create({
    data: {
      area,
      interviewee: interviewee || null,
      interviewDate: interviewDate || null,
      answers: {},
      canvas: {},
    },
  });

  return Response.json(session, { status: 201 });
}

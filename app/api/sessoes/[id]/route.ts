import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(session);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { answers, canvas, status, interviewee, interviewDate } = body;

  const existing = await prisma.session.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 });

  const updateData: Record<string, unknown> = {};
  if (answers !== undefined) updateData.answers = answers;
  if (canvas !== undefined) updateData.canvas = canvas;
  if (status !== undefined) updateData.status = status;
  if (interviewee !== undefined) updateData.interviewee = interviewee;
  if (interviewDate !== undefined) updateData.interviewDate = interviewDate;

  const session = await prisma.session.update({
    where: { id },
    data: updateData,
  });

  return Response.json(session);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.session.delete({ where: { id } });
  return Response.json({ success: true });
}

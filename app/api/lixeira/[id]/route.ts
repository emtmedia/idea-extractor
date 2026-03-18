import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

// Restore session (remove deletedAt)
export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await prisma.session.update({
    where: { id },
    data: { deletedAt: null },
  });
  return Response.json(session);
}

// Permanent delete
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.session.delete({ where: { id } });
  return Response.json({ success: true });
}

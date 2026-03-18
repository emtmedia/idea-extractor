import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { label } = await req.json();
  if (!label?.trim()) {
    return Response.json({ error: 'Label is required' }, { status: 400 });
  }
  const cargo = await prisma.cargo.update({
    where: { id },
    data: { label: label.trim() },
  });
  return Response.json(cargo);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.cargo.delete({ where: { id } });
  return Response.json({ success: true });
}

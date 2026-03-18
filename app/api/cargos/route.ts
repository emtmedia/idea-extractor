import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cargos = await prisma.cargo.findMany({ orderBy: { order: 'asc' } });
  return Response.json(cargos);
}

export async function POST(req: NextRequest) {
  const { label } = await req.json();
  if (!label?.trim()) {
    return Response.json({ error: 'Label is required' }, { status: 400 });
  }
  const last = await prisma.cargo.findFirst({ orderBy: { order: 'desc' } });
  const cargo = await prisma.cargo.create({
    data: { label: label.trim(), order: (last?.order ?? 0) + 1 },
  });
  return Response.json(cargo, { status: 201 });
}

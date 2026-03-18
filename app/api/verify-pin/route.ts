import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  const adminPin = process.env.ADMIN_PIN || 'IDG2025X';
  if (pin === adminPin) {
    return Response.json({ ok: true });
  }
  return Response.json({ ok: false }, { status: 401 });
}

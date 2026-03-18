'use client';

import PinGuard from './PinGuard';
import CanvasForm from './CanvasForm';
import { Area } from '@/lib/areas';

interface CanvasSession {
  id: string;
  canvas: Record<string, string>;
}

interface CanvasPageClientProps {
  session: CanvasSession;
  area: Area;
}

export default function CanvasPageClient({ session, area }: CanvasPageClientProps) {
  return (
    <PinGuard title="Acesso ao Challenge Canvas">
      <CanvasForm session={session} area={area} />
    </PinGuard>
  );
}

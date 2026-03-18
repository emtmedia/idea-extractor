'use client';

import PinGuard from './PinGuard';

interface ReportPageClientProps {
  children: React.ReactNode;
}

export default function ReportPageClient({ children }: ReportPageClientProps) {
  return (
    <PinGuard title="Acesso ao Relatório">
      {children}
    </PinGuard>
  );
}

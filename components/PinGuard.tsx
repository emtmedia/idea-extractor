'use client';

import { useEffect, useState } from 'react';
import PinModal from './PinModal';

interface PinGuardProps {
  children: React.ReactNode;
  title?: string;
}

export default function PinGuard({ children, title = 'Área Protegida' }: PinGuardProps) {
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('pin_verified');
    setVerified(stored === 'true');
  }, []);

  // Still checking (SSR hydration guard)
  if (verified === null) {
    return null;
  }

  if (!verified) {
    return (
      <PinModal
        title={title}
        onSuccess={() => setVerified(true)}
      />
    );
  }

  return <>{children}</>;
}

'use client';

import type { ReactNode } from 'react';

import JoinForm from '@/components/form/join-form';
import { usePageContext } from '@/components/providers/page-provider';

function RoomGuard({ children }: { children: ReactNode }) {
  const { identity } = usePageContext();
  if (identity) {
    return <>{children}</>; // Просто пускаємо всередину
  }

  return (
    <>
      {/* Контент рендериться, але він заблокований */}
      <div className="pointer-events-none select-none opacity-50 blur-sm">
        {children}
      </div>

      {/* Оверлей з формою */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <JoinForm />
      </div>
    </>
  );
}

export default RoomGuard;

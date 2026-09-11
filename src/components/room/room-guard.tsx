'use client';

import { useContext } from 'react';

import JoinForm from '@/components/form/join-form';
import { PageContext } from '@/components/providers/page-provider';

function RoomGuard({ children }) {
  const { identity } = useContext(PageContext);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-background/20">
        <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
          <JoinForm />
        </div>
      </div>
    </>
  );
}

export default RoomGuard;

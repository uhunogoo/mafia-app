'use client';

import React from 'react';

import { PageContext } from '@/components/Providers/PageProvider';
import JoinForm from '@/components/Form/JoinForm';

function RoomGuard({ children }: { children: React.ReactNode }) {
  const page = React.useContext(PageContext);
  if (!page) {
    throw new Error('PageContext доступний лише всередині PageProvider');
  }
  const { identity } = page;

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

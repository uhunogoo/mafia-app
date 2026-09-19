'use client';

import React from 'react';

import { RoomMembershipContext } from '@/components/Providers/RoomMembershipProvider';
import JoinForm from '@/components/Form/JoinForm';

function RoomGuard({ children }: { children: React.ReactNode }) {
  const membership = React.useContext(RoomMembershipContext);
  if (!membership) {
    throw new Error(
      'RoomMembershipContext доступний лише всередині RoomMembershipProvider',
    );
  }
  const { identity } = membership;

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

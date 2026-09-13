'use client';

import React from 'react';

import { RoomContext } from '@/components/Providers/RoomConnectionProvider';
import StatusMessage from '@/components/UI/StatusMessage';

/** Status: connection and error messages. */
function RoomStatus() {
  const { room, error, isConnecting } = RoomContext.useRoom();
  const [serverError, setServerError] = React.useState<string | null>(null);

  RoomContext.useRoomMessage('*', (type: string | number, payload: unknown) => {
    if (type === 'error') setServerError(String(payload));
  });

  // New connection - reset serverError
  React.useEffect(() => {
    setServerError(null);
  }, [room?.roomId]);

  if (isConnecting) {
    return <StatusMessage variant="loading">Підключення до кімнати…</StatusMessage>;
  }

  // Error message
  const message = error ? `Помилка: ${error.message}` : serverError;
  if (message) {
    return <StatusMessage variant="error">{message}</StatusMessage>;
  }

  return null;
}

export default RoomStatus;

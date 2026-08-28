'use client';

import React, { useEffect, useState } from 'react';
import { loadGuest } from '@/lib/guest';
import JoinForm from '@/components/form/join-form';
import RoomLobby from '@/components/room-lobby'; // Або шлях до нового файлу
import StatusMessage from '@/components/ui/status-message';

interface JoinGateProps {
  roomId: string;
}

export interface Guest {
  name: string;
  guestId?: string;
}

export default function JoinGate({ roomId }: JoinGateProps) {
  const [isReady, setIsReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const hashString = window.location.hash.slice(1);
    const params = new URLSearchParams(hashString);
    const extractedToken = sessionStorage.getItem(`room_${roomId}_token`);

    setToken(params.get('token') || extractedToken);
    setGuest(loadGuest(roomId));

    setIsReady(true);
  }, [roomId]);

  if (!isReady) return null; // Уникаємо Hydration Error

  if (!token) {
    return (
      <StatusMessage isError>
        Invalid or missing invite link. Please ask the host to share a valid invite URL.
      </StatusMessage>
    );
  }

  if (!guest) {
    return (
      <JoinForm
        roomId={roomId}
        token={token}
        onJoined={() => setGuest(loadGuest(roomId))}
      />
    );
  }

  return <RoomLobby roomId={roomId} token={token} guest={guest} />;
}

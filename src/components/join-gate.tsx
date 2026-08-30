'use client';

import { useEffect, useState } from 'react';
import { loadGuest, type GuestIdentity } from '@/lib/guest';
import JoinForm from '@/components/form/join-form';
import RoomLobby from '@/components/room-lobby';
import { StatusMessage } from '@/components/ui/status-message';

interface JoinGateProps {
  roomId: string;
}

function useRoomToken(roomId: string): { token: string | null; isReady: boolean } {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fromHash = new URLSearchParams(window.location.hash.slice(1)).get('token');
    const fromSession = sessionStorage.getItem(`room_${roomId}_token`);
    setToken(fromHash ?? fromSession);
    setIsReady(true);
  }, [roomId]);

  return { token, isReady };
}

export default function JoinGate({ roomId }: JoinGateProps) {
  const { token, isReady } = useRoomToken(roomId);
  const [guest, setGuest] = useState<GuestIdentity | null>(null);

  useEffect(() => {
    if (isReady) setGuest(loadGuest(roomId));
  }, [isReady, roomId]);

  // Avoid hydration mismatch — all state reads happen client-side only
  if (!isReady) return null;

  if (!token) {
    return (
      <StatusMessage variant="error">
        Invalid or missing invite link. Please ask the host to share a valid invite URL.
      </StatusMessage>
    );
  }

  if (!guest) {
    return (
      <JoinForm
        roomId={roomId}
        onJoined={(identity) => setGuest(identity)}
      />
    );
  }

  return <RoomLobby roomId={roomId} token={token} guest={guest} />;
}

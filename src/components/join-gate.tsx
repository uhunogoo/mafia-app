'use client';

import { useEffect, useState } from 'react';
import { loadIdentity, type PlayerIdentity } from '@/lib/identity';
import JoinForm from '@/components/form/join-form';
import RoomLobby from '@/components/room-lobby';
import { StatusMessage } from '@/components/ui/status-message';

interface JoinGateProps {
  roomId: string;
  /** Supabase UID of the authenticated host, resolved server-side. */
  hostUserId: string;
}

function useRoomToken(roomId: string): string | null | undefined {
  const [token, setToken] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const fromHash = new URLSearchParams(window.location.hash.slice(1)).get('token');
    const fromSession = sessionStorage.getItem(`room_${roomId}_token`);
    setToken(fromHash ?? fromSession ?? null);
  }, [roomId]);

  return token;
}

export default function JoinGate({ roomId, hostUserId }: JoinGateProps) {
  const token = useRoomToken(roomId);
  const [identity, setIdentity] = useState<PlayerIdentity | null>(() => loadIdentity(roomId));

  // undefined = still reading storage; null = no token found
  if (token === undefined) return null;

  if (token === null) {
    return (
      <StatusMessage variant="error">
        Invalid or missing invite link. Please ask the host to share a valid invite URL.
      </StatusMessage>
    );
  }

  if (!identity) {
    return (
      <JoinForm
        roomId={roomId}
        hostUserId={hostUserId}
        onJoined={setIdentity}
      />
    );
  }

  return <RoomLobby roomId={roomId} token={token} identity={identity} />;
}

'use client';

import { useCallback } from 'react';
import { useRoom } from '@colyseus/react';
import { client } from '@/lib/colyseus/client';
import InviteLink from '@/components/invite-link';
import PlayerList from '@/components/player-list';
import { StatusMessage } from '@/components/ui/status-message';
import type { GuestIdentity } from '@/lib/guest';

interface RoomLobbyProps {
  roomId: string;
  token: string;
  guest: GuestIdentity;
}

export default function RoomLobby({ roomId, token, guest }: RoomLobbyProps) {
  const connectToRoom = useCallback(
    () =>
      client.joinById(roomId, {
        name: guest.name,
        guestId: guest.guestId,
        token,
      }),
    [roomId, token, guest.name, guest.guestId],
  );

  const { room, error, isConnecting } = useRoom(connectToRoom);

  if (isConnecting) {
    return <StatusMessage variant="loading">Connecting to room…</StatusMessage>;
  }

  if (error) {
    return <StatusMessage variant="error">Error: {error.message}</StatusMessage>;
  }

  if (!room) return null;

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <InviteLink roomId={roomId} token={token} />
      <PlayerList room={room} />
    </div>
  );
}

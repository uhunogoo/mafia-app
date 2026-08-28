'use client';

import { useCallback } from 'react';
import { useRoom } from '@colyseus/react';
import { client } from '@/lib/colyseus/client';
import InviteLink from '@/components/invite-link';
import PlayerList from '@/components/player-list';
import type { Guest } from '@/components/join-gate';
import StatusMessage from '@/components/ui/status-message';

interface RoomLobbyProps {
  roomId: string;
  token: string;
  guest: Guest;
}

export default function RoomLobby({ roomId, token, guest }: RoomLobbyProps) {
  const connectToRoom = useCallback(() => {
    return client.joinById(roomId, {
      name: guest.name ?? 'Guest',
      guestId: guest.guestId,
      token,
    });
  }, [roomId, token, guest.name, guest.guestId]);

  const { room, error, isConnecting } = useRoom(connectToRoom);

  if (isConnecting) {
    return (
      <StatusMessage>
        Connecting to room…
      </StatusMessage>
    );
  }

  if (error) {
    return (
      <StatusMessage isError>
        Error: {error.message}
      </StatusMessage>
    );
  }

  if (!room) return null;

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <InviteLink roomId={roomId} token={token} />
      <PlayerList room={room} />
    </div>
  );
}

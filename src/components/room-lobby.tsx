'use client';

import { useCallback, useContext } from 'react';
import { useRoom } from '@colyseus/react';
import { client } from '@/lib/colyseus/client';
import InviteLink from '@/components/invite-link';
import PlayerList from '@/components/player-list';
import { StatusMessage } from '@/components/ui/status-message';
import { PageContext } from '@/components/providers/page-provider';

export default function RoomLobby() {
  const { roomId, token, identity } = useContext(PageContext)!;

  const connectToRoom = useCallback(
    () =>
      client.joinById(roomId, {
        name: identity!.name,
        token,
        guestId: identity!.hostUserId || identity!.guestId,
      }),
    [roomId, token, identity],
  );

  const { room, error, isConnecting } = useRoom(connectToRoom);

  if (!token || !identity) return null;

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

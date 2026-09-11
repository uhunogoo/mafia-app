'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { useRoom } from '@colyseus/react';
import { client } from '@/lib/colyseus/client';
import InviteLink from '@/components/invite-link';
import PlayerList from '@/components/player-list';
import { StatusMessage } from '@/components/ui/status-message';
import { PageContext } from '@/components/providers/page-provider';

export default function RoomLobby() {
  const { roomId, token, identity } = useContext(PageContext)!;
  const [hasJoined, setHasJoined] = useState(false);

  // Connect as spectator
  const connectToRoom = useCallback(
    () =>
      client.joinById(roomId, {
        token,
        guestId: `temp-${Math.random()}`,
        spectator: true,
      }),
    [roomId, token],
  );

  const { room, error, isConnecting } = useRoom(connectToRoom);

  //When identity connect as player
  useEffect(() => {
    if (!room || !identity?.name || hasJoined) return;

    room.send('joinAsPlayer', {
      name: identity.name,
      guestId: identity.guestId,
    });
    setHasJoined(true);
  }, [room, identity, hasJoined]);

  if (!token) return null;

  if (isConnecting) {
    return <StatusMessage variant="loading">Connecting to room…</StatusMessage>;
  }

  if (error) {
    return <StatusMessage variant="error">Error: {error.message}</StatusMessage>;
  }

  if (!room) return null;

  return (
    <>
      <div className="flex flex-col gap-6 max-w-lg">
        <InviteLink roomId={roomId} token={token} />
        <PlayerList room={room} />
      </div>
    </>
  );
}

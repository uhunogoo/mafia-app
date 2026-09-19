'use client';

import React from 'react';
import { createRoomContext } from '@colyseus/react';

import { client } from '@/lib/colyseus/client';
import { RoomMembershipContext } from '@/components/Providers/RoomMembershipProvider';
import StatusMessage from '@/components/UI/StatusMessage';
import RoomStatus from '@/components/Room/RoomStatus';

/**
 * Клиентське уявлення про MafiaState (mafia-server/src/rooms/schema/MafiaState.ts).
 * MapSchema трансформується у Snapshot у Record за ключем guestId.
 */
export interface RoomPlayerView {
  sessionId: string;
  seatIndex: number;
  name: string;
  role: string;
  isAlive: boolean;
  isHost: boolean;
}

export interface MafiaStateView {
  phase: string;
  dayCount: number;
  maxPlayers: number;
  hostId: string;
  players: Record<string, RoomPlayerView>;
}

export const RoomContext = createRoomContext<MafiaStateView>();

/** Підключає кімнату лише коли гравець має токен та identity (нікнейм). */
function RoomConnectionProvider({ children }: { children?: React.ReactNode }) {
  const membership = React.useContext(RoomMembershipContext);
  if (!membership) {
    throw new Error(
      'RoomMembershipContext доступний лише всередині RoomMembershipProvider',
    );
  }
  const { roomId, token, identity } = membership;

  const connect = React.useCallback(() => {
    // Викликається лише коли ready; fallback-и ніколи не використовуються
    return client.joinById(roomId, {
      token: token ?? '',
      name: identity?.name ?? '',
      guestId: identity?.guestId ?? '',
    });
  }, [roomId, token, identity]);

  const ready = Boolean(token && identity?.guestId);

  if (!token) {
    return (
      <StatusMessage variant="error">
        Посилання недійсне: відсутній токен кімнати. Скористайся запрошенням хоста.
      </StatusMessage>
    );
  }

  return (
    <RoomContext.RoomProvider
      connect={ready ? connect : null}
      deps={[roomId, token, identity?.name, identity?.guestId]}
    >
      <RoomStatus />
      {children}
    </RoomContext.RoomProvider>
  );
}

export default RoomConnectionProvider;

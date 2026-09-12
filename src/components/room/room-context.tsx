'use client';

import React, { useContext } from 'react';
import { createRoomContext, type Snapshot } from '@colyseus/react';

import { client } from '@/lib/colyseus/client';
import { PageContext } from '@/components/providers/page-provider';
import { StatusMessage } from '@/components/ui/status-message';

/**
 * Клиентське уявлення про MafiaState (mafia-server/src/rooms/schema/MyRoomState.ts).
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

export const RoomContext = createRoomContext();

export function useMafiaState<U>(selector: (state: MafiaStateView) => U): Snapshot<U> | undefined {
  return RoomContext.useRoomState((state) => selector(state as MafiaStateView));
}

/** Підключає кімнату лише коли гравець має токен та identity (нікнейм). */
export function RoomConnectionProvider({ children }: { children?: React.ReactNode }) {
  const { roomId, token, identity } = useContext(PageContext)!;

  const connect = React.useCallback(() => {
    return client.joinById(roomId, {
      token: token!,
      name: identity!.name,
      guestId: identity!.guestId!,
    });
  }, [roomId, token, identity]);

  if (!token) {
    return (
      <StatusMessage variant="error">
        Посилання недійсне: відсутній токен кімнати. Скористайся запрошенням хоста.
      </StatusMessage>
    );
  }

  const ready = Boolean(identity?.guestId);

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

/** Смуга стану: підключення, помилки приєднання та серверні "error" повідомлення. */
function RoomStatus() {
  const { room, error, isConnecting } = RoomContext.useRoom();
  const [serverError, setServerError] = React.useState<string | null>(null);

  RoomContext.useRoomMessage('*', (type: string | number, payload: unknown) => {
    if (type === 'error') setServerError(String(payload));
  });

  // Нове підключення — скидаємо останню серверну помилку
  React.useEffect(() => {
    setServerError(null);
  }, [room?.roomId]);

  if (error) {
    return <StatusMessage variant="error">Помилка: {error.message}</StatusMessage>;
  }
  if (isConnecting) {
    return <StatusMessage variant="loading">Підключення до кімнати…</StatusMessage>;
  }
  if (serverError) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-4 md:px-6 md:pt-6">
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {serverError}
        </div>
      </div>
    );
  }
  return null;
}

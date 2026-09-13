'use client';

import React from 'react';
import { UserRound } from 'lucide-react';

import { DEFAULT_MAX_PLAYERS } from '@/constants';
import { range } from '@/lib/utils';
import {
  RoomContext,
  type RoomPlayerView,
} from '@/components/Providers/RoomConnectionProvider';
import { PageContext } from '@/components/Providers/PageProvider';
import PlayerSlot from '@/components/Room/PlayerSlot';

function EmptySlot() {
  return (
    <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground/50">
      <UserRound className="size-8" aria-hidden />
    </div>
  );
}

interface SeatedPlayer {
  player: RoomPlayerView;
  isYou: boolean;
}

/** Гравець, що сидить на вказаному місці — розсадку визначає сервер. */
function findSeatedPlayer(
  players: Record<string, RoomPlayerView> | undefined,
  seatIndex: number,
  myGuestId: string | undefined,
): SeatedPlayer | undefined {
  for (const [guestId, player] of Object.entries(players ?? {})) {
    if (player.seatIndex === seatIndex) {
      return { player, isYou: guestId === myGuestId };
    }
  }
  return undefined;
}

function PlayerGrid() {
  const players = RoomContext.useRoomState((s) => s.players);
  const maxPlayers = RoomContext.useRoomState((s) => s.maxPlayers);
  const page = React.useContext(PageContext);
  if (!page) {
    throw new Error('PageContext доступний лише всередині PageProvider');
  }
  const { identity } = page;

  const capacity = Math.max(1, maxPlayers ?? DEFAULT_MAX_PLAYERS);
  const myGuestId = identity?.guestId;

  return (
    <section className="w-full rounded-xl border bg-background p-3 sm:p-4">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {range(capacity).map((seatIndex) => {
          const seated = findSeatedPlayer(players, seatIndex, myGuestId);
          return seated ? (
            <PlayerSlot key={seatIndex} player={seated.player} isYou={seated.isYou} />
          ) : (
            <EmptySlot key={seatIndex} />
          );
        })}
      </div>
    </section>
  );
}

export default PlayerGrid;

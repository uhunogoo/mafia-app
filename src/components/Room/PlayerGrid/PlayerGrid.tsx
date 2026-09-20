'use client';

import React from 'react';
import { UserRound } from 'lucide-react';

import { DEFAULT_MAX_PLAYERS } from '@/constants';
import { range } from '@/lib/utils';
import { RoomMembershipContext } from '@/components/Providers/RoomMembershipProvider';
import {
  RoomContext,
  type RoomPlayerView,
} from '@/components/Providers/RoomConnectionProvider';
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
  mypassword: string | undefined,
): SeatedPlayer | undefined {
  for (const [password, player] of Object.entries(players ?? {})) {
    if (player.seatIndex === seatIndex) {
      return { player, isYou: password === mypassword };
    }
  }
  return undefined;
}

function PlayerGrid() {
  const players = RoomContext.useRoomState((s) => s.players);
  const maxPlayers = RoomContext.useRoomState((s) => s.maxPlayers);
  const membership = React.useContext(RoomMembershipContext);
  if (!membership) {
    throw new Error(
      'RoomMembershipContext доступний лише всередині RoomMembershipProvider',
    );
  }
  const { identity } = membership;

  const capacity = Math.max(1, maxPlayers ?? DEFAULT_MAX_PLAYERS);
  const mypassword = identity?.password;

  return (
    <section className="grid w-full grid-cols-4 gap-2 rounded-xl border bg-background p-3 sm:gap-3 sm:p-4">
      {range(capacity).map((seatIndex) => {
        const seated = findSeatedPlayer(players, seatIndex, mypassword);
        return seated ? (
          <PlayerSlot
            key={seatIndex}
            player={seated.player}
            isYou={seated.isYou}
          />
        ) : (
          <EmptySlot key={seatIndex} />
        );
      })}
    </section>
  );
}

export default PlayerGrid;

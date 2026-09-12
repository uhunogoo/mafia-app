'use client';

import React from 'react';
import { Crown, UserRound } from 'lucide-react';

import { useMafiaState, type RoomPlayerView } from '@/components/room/room-context';
import { PageContext } from '@/components/providers/page-provider';

function PlayerSlot({ player, isYou }: { player: RoomPlayerView; isYou: boolean }) {
  const initial = (player.name || '?').charAt(0).toUpperCase();

  return (
    <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border bg-card p-2">
      <div className="relative">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground sm:size-16">
          {initial}
        </div>
        {player.isHost && (
          <Crown
            className="absolute -top-2 -right-2 size-5 text-amber-500"
            aria-label="Хост"
          />
        )}
      </div>
      <span
        className={
          'max-w-full truncate px-1 text-sm font-medium' +
          (isYou ? ' text-primary underline underline-offset-2' : '')
        }
      >
        {player.name}
      </span>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground/50">
      <UserRound className="size-8" aria-hidden />
    </div>
  );
}

export default function PlayerGrid() {
  const players = useMafiaState((s) => s.players);
  const maxPlayers = useMafiaState((s) => s.maxPlayers);
  const { identity } = React.useContext(PageContext)!;
  const myGuestId = identity?.guestId ?? null;

  const capacity = Math.max(1, maxPlayers ?? 12);

  const bySeat = new Map<number, { player: RoomPlayerView; isYou: boolean }>();
  for (const [guestId, player] of Object.entries(players ?? {})) {
    const seat = Number.isInteger(player.seatIndex) ? player.seatIndex : bySeat.size;
    bySeat.set(seat, { player, isYou: guestId === myGuestId });
  }

  return (
    <section className="w-full rounded-xl border bg-background p-3 sm:p-4">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {Array.from({ length: capacity }, (_, seat) => {
          const occupied = bySeat.get(seat);
          return occupied ? (
            <PlayerSlot key={seat} player={occupied.player} isYou={occupied.isYou} />
          ) : (
            <EmptySlot key={seat} />
          );
        })}
      </div>
    </section>
  );
}

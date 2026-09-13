'use client';

import { Mic, Settings, Video } from 'lucide-react';

import { DEFAULT_MAX_PLAYERS } from '@/constants';
import { phaseLabel } from '@/lib/phase';
import { RoomContext } from '@/components/Providers/RoomConnectionProvider';
import Button from '@/components/UI/Button';

function RoomTopBar() {
  const phase = RoomContext.useRoomState((s) => s.phase);
  const players = RoomContext.useRoomState((s) => s.players);
  const maxPlayers = RoomContext.useRoomState((s) => s.maxPlayers);

  const count = players ? Object.keys(players).length : 0;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 rounded-xl border bg-card px-4">
      <div aria-live="polite" className="flex min-w-0 items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-green-500" aria-hidden />
        <span className="truncate text-sm font-medium">{phaseLabel(phase)}</span>
      </div>

      <p className="shrink-0 text-sm text-muted-foreground">
        Гравці:{' '}
        <span className="font-medium text-foreground">
          {count}/{maxPlayers ?? DEFAULT_MAX_PLAYERS}
        </span>
      </p>

      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Мікрофон" title="Скоро">
          <Mic />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Камера" title="Скоро">
          <Video />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Налаштування" title="Скоро">
          <Settings />
        </Button>
      </div>
    </header>
  );
}

export default RoomTopBar;

'use client';

import { Mic, Settings, Video } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useMafiaState } from '@/components/room/room-context';
import { phaseLabel } from '@/lib/phase';

export default function RoomTopBar() {
  const phase = useMafiaState((s) => s.phase);
  const players = useMafiaState((s) => s.players);
  const maxPlayers = useMafiaState((s) => s.maxPlayers);

  const count = players ? Object.keys(players).length : 0;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 rounded-xl border bg-card px-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-green-500" aria-hidden />
        <span className="truncate text-sm font-medium">{phaseLabel(phase)}</span>
      </div>

      <p className="shrink-0 text-sm text-muted-foreground">
        Гравці:{' '}
        <span className="font-medium text-foreground">
          {count}/{maxPlayers ?? 12}
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

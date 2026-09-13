import { Crown } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { RoomPlayerView } from '@/components/Providers/RoomConnectionProvider';

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
        className={cn(
          'max-w-full truncate px-1 text-sm font-medium',
          isYou && 'text-primary underline underline-offset-2',
        )}
      >
        {player.name}
      </span>
    </div>
  );
}

export default PlayerSlot;

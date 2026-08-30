'use client';

import { useCallback } from 'react';
import { useRoomState } from '@colyseus/react';
import type { Room } from '@colyseus/sdk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon, ShuffleIcon, UsersIcon } from 'lucide-react';

interface Player {
  sessionId: string;
  name: string;
  isAlive: boolean;
}

interface PlayerListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  room: Room<any>;
}

export default function PlayerList({ room }: PlayerListProps) {
  const playersMap = useRoomState(
    room,
    (state) => state?.players as Record<string, Player> | undefined,
  );

  const playerList = playersMap ? Object.values(playersMap) : [];

  const shufflePlayers = useCallback(() => {
    room.send('shuffle_players');
  }, [room]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon size={18} />
          Players
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {playerList.length} joined
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Player actions">
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={shufflePlayers}>
                <ShuffleIcon />
                Shuffle players
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {playerList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Waiting for players to join…
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {playerList.map((player) => (
              <div
                key={player.sessionId}
                className="flex flex-col items-center justify-center gap-1 rounded-md border px-2 py-3 text-center"
              >
                <span className="text-sm font-medium leading-tight break-all">
                  {player.name}
                </span>
                <span
                  className={`text-xs ${
                    player.isAlive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground line-through'
                  }`}
                >
                  {player.isAlive ? 'Alive' : 'Dead'}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

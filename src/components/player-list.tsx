'use client';

import { useRoomState } from '@colyseus/react';
import type { Room } from '@colyseus/sdk';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon } from 'lucide-react';

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
    (state) => state?.players as Record<string, Player> | undefined
  );

  const playerList = playersMap ? Object.values(playersMap) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersIcon size={18} />
          Players
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {playerList.length} joined
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {playerList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Waiting for players to join…
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {playerList.map((player) => (
              <li
                key={player.sessionId}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span>{player.name}</span>
                <span
                  className={
                    player.isAlive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground line-through'
                  }
                >
                  {player.isAlive ? 'Alive' : 'Dead'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

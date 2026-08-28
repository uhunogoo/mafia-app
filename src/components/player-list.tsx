'use client';

import { useMemo } from 'react';
import { useRoomState } from '@colyseus/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersIcon } from 'lucide-react';

// Заміни Type на `any`, якщо ти не маєш типізації схеми, або імпортуй свій Room type
interface Player {
  sessionId: string;
  name: string;
  isAlive: boolean;
}

interface PlayerListProps {
  room: any;
}

export default function PlayerList({ room }: PlayerListProps) {
  // Підписуємося виключно на об'єкт гравців
  const playersMap = useRoomState(
    room,
    (state) => state?.players as Record<string, Player> | undefined
  );

  // Кешуємо масив, щоб не робити Object.values на кожному мікро-рендері кімнати
  const playerList = useMemo(() => {
    return playersMap ? Object.values(playersMap) : [];
  }, [playersMap]);

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

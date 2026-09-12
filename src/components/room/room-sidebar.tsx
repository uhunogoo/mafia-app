'use client';

import { Shuffle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InviteLink from '@/components/invite-link';
import { RoomContext, useMafiaState } from '@/components/room/room-context';
import { usePageContext } from '@/components/providers/page-provider';
import { roleComposition } from '@/lib/role-composition';
import { cn } from '@/lib/utils';

const PLAYER_OPTIONS = [10, 11, 12];

function playersWord(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'гравців';
  if (mod10 === 1) return 'гравець';
  if (mod10 >= 2 && mod10 <= 4) return 'гравці';
  return 'гравців';
}

export default function RoomSidebar() {
  const { room } = RoomContext.useRoom();
  const players = useMafiaState((s) => s.players);
  const maxPlayersState = useMafiaState((s) => s.maxPlayers);
  const { roomId, token, identity } = usePageContext();

  const maxPlayers = maxPlayersState ?? 12;
  const count = players ? Object.keys(players).length : 0;
  const missing = Math.max(0, maxPlayers - count);

  // Хост — це гравець, чиїй guestId збігається з нашим identity
  const me = identity?.guestId ? players?.[identity.guestId] : undefined;
  const isHost = me?.isHost ?? false;
  const isFull = missing === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Кімната:
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <InviteLink roomId={roomId} token={token ?? ''} />

        {isHost ? (
          <>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Кількість гравців</Label>
              <div
                className="grid grid-cols-3 gap-1 rounded-lg border p-1"
                role="radiogroup"
                aria-label="Кількість гравців"
              >
                {PLAYER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={maxPlayers === option}
                    disabled={!room}
                    onClick={() => room?.send('setMaxPlayers', { maxPlayers: option })}
                    className={cn(
                      'h-8 rounded-md text-sm font-medium transition-colors',
                      maxPlayers === option
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent',
                      !room && 'cursor-not-allowed opacity-60',
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Склад ролей</Label>
              <p className="text-sm text-muted-foreground">{roleComposition(maxPlayers)}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={!room}
                onClick={() => room?.send('shuffle_players')}
              >
                <Shuffle />
                Перемішати
              </Button>
              <Button
                className="flex-1"
                disabled={!isFull}
                onClick={() => room?.send('startGame')}
              >
                {isFull ? 'Почати гру' : `Ще ${missing} ${playersWord(missing)}`}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Кількість гравців</Label>
              <p className="text-sm text-muted-foreground">
                Гравців: {count} з {maxPlayers}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">Склад ролей</Label>
              <p className="text-sm text-muted-foreground">{roleComposition(maxPlayers)}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm">
                {isFull
                  ? 'Кімната повна, хост може розпочати гру'
                  : `Ще ${missing} ${playersWord(missing)}`}
              </p>
              <p className="text-xs text-muted-foreground">Налаштуваннями керує хост</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

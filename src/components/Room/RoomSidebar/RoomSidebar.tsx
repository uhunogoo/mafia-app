'use client';

import React from 'react';
import { Shuffle } from 'lucide-react';

import { DEFAULT_MAX_PLAYERS } from '@/constants';

import { roleComposition } from '@/lib/role-composition';
import { playersWord } from '@/lib/utils';

import { RoomMembershipContext } from '@/components/Providers/RoomMembershipProvider';
import { RoomContext } from '@/components/Providers/RoomConnectionProvider';
import InviteLink from '@/components/InviteLink';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/Card';
import { ToggleGroup, ToggleGroupItem } from '@/components/UI/ToggleGroup';
import Label from '@/components/UI/Label';
import Button from '@/components/UI/Button';

const PLAYER_OPTIONS = [10, 11, 12] as const;

function RoomSidebar() {
  const { room } = RoomContext.useRoom();
  const players = RoomContext.useRoomState((s) => s.players);
  const maxPlayersState = RoomContext.useRoomState((s) => s.maxPlayers);
  const membership = React.useContext(RoomMembershipContext);
  if (!membership) {
    throw new Error(
      'RoomMembershipContext доступний лише всередині RoomMembershipProvider',
    );
  }
  const { roomId, token, identity } = membership;

  const maxPlayers = maxPlayersState ?? DEFAULT_MAX_PLAYERS;
  const count = players ? Object.keys(players).length : 0;
  const missing = Math.max(0, maxPlayers - count);

  // Хост — це гравець, чиїй guestId збігається з нашим identity
  const me = identity?.guestId ? players?.[identity.guestId] : undefined;
  const isHost = me?.isHost ?? false;
  const isFull = missing === 0;

  function handlePlayerCountChange(value: string) {
    const option = Number(value);
    if (!Number.isFinite(option)) return;
    room?.send('setMaxPlayers', { maxPlayers: option });
  }

  function handleShufflePlayers() {
    room?.send('shuffle_players');
  }

  function handleStartGame() {
    room?.send('startGame');
  }

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
              <ToggleGroup
                type="single"
                value={String(maxPlayers)}
                onValueChange={handlePlayerCountChange}
                disabled={!room}
                aria-label="Кількість гравців"
                className="grid grid-cols-3 gap-1 rounded-lg border p-1"
              >
                {PLAYER_OPTIONS.map((option) => (
                  <ToggleGroupItem
                    key={option}
                    value={String(option)}
                    className="h-8 rounded-md text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {option}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
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
                onClick={handleShufflePlayers}
              >
                <Shuffle />
                Перемішати
              </Button>
              <Button
                className="flex-1"
                disabled={!isFull}
                onClick={handleStartGame}
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
              <p role="status" className="text-sm">
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

export default RoomSidebar;

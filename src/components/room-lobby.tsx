'use client';

import { useEffect, useState } from 'react';
import { useRoom, useRoomState } from '@colyseus/react';
import { client } from '@/lib/colyseus/client';
import { loadGuest } from '@/lib/guest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon, ClipboardIcon, UsersIcon } from 'lucide-react';

interface Player {
  sessionId: string;
  name: string;
  isAlive: boolean;
}

interface RoomLobbyProps {
  roomId: string;
  token: string;
}

export default function RoomLobby({ roomId, token }: RoomLobbyProps) {
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');

  useEffect(() => {
    setInviteUrl(`${window.location.origin}/room/${roomId}#token=${token}`);
  }, [roomId, token]);

  // Load the guest identity that was persisted when the user filled in their nickname.
  const guest = typeof window !== 'undefined' ? loadGuest(roomId) : null;

  const { room, error, isConnecting } = useRoom(() =>
    client.joinById(roomId, {
      name: guest?.name ?? 'Guest',
      guestId: guest?.guestId,
      token,
    }),
  );

  const players = useRoomState(
    room,
    (state) => state?.players as Record<string, Player> | undefined,
  );

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Connecting to room…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    );
  }

  const playerList = players ? Object.values(players) : [];

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            Invite link
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm truncate">
            {inviteUrl}
          </code>
          <Button
            variant="outline"
            size="icon"
            onClick={copyInviteLink}
            aria-label="Copy invite link"
          >
            {copied ? (
              <CheckIcon className="text-green-500" />
            ) : (
              <ClipboardIcon />
            )}
          </Button>
        </CardContent>
      </Card>

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
    </div>
  );
}

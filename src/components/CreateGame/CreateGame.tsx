'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { JwtPayload } from '@supabase/auth-js';

import { client } from '@/lib/colyseus/client';
import { generateToken } from '@/lib/generateToken';
import Button from '@/components/UI/Button';

interface CreateGameProps {
  user: JwtPayload;
}

function CreateGame({ user }: CreateGameProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreate() {
    setIsLoading(true);
    setError(null);

    try {
      const token = generateToken();
      // Сервер очікує guestId творця кімнати — саме він стає хостом (state.hostId).
      // sessionStorage: claim діє лише у вкладці, де кімнату створили,
      // щоб гість з іншої вкладки не перехопив host-ідентичність.
      const room = await client.create('mafia_room', { token, guestId: user.sub });
      sessionStorage.setItem(`room_${room.roomId}_token`, token);
      sessionStorage.setItem(`room_${room.roomId}_hostClaim`, user.sub);
      router.push(`/room/${room.roomId}#token=${token}`);
    } catch (err: unknown) {
      console.error('Failed to create room:', err);
      setError('Не вдалося створити кімнату. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {error && (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      )}
      <Button size="lg" className="w-full" onClick={handleCreate} disabled={isLoading}>
        {isLoading ? 'Створення…' : 'Створити кімнату'}
      </Button>
    </>
  );
}

export default CreateGame;

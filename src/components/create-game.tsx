'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JwtPayload } from '@supabase/auth-js';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/colyseus/client';
import { generateToken } from '@/lib/generateToken';

interface CreateGameProps {
  user: JwtPayload;
}

export default function CreateGame({ user }: CreateGameProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
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
      setError('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button size="lg" className="w-full" onClick={handleCreate} disabled={isLoading}>
        {isLoading ? 'Creating…' : 'Створити кімнату'}
      </Button>
    </>
  );
}

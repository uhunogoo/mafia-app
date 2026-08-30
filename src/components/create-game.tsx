'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JwtPayload } from '@supabase/auth-js';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/colyseus/client';
import { generateToken } from '@/lib/generateToken';

interface CreateGameProps {
  user: JwtPayload;
  children?: React.ReactNode;
}

export default function CreateGame({ user, children }: CreateGameProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = generateToken();
      const room = await client.create('mafia_room', { token, hostUserId: user.sub });
      sessionStorage.setItem(`room_${room.roomId}_token`, token);
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
        {isLoading ? 'Creating…' : (children ?? 'Create Room')}
      </Button>
    </>
  );
}

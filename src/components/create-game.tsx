'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { client } from '@/lib/colyseus/client';
import { generateToken } from '@/lib/generateToken';

interface CreateGameProps {
  children?: React.ReactNode;
}

export default function CreateGame({ children }: CreateGameProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const secret = generateToken();
      const room = await client.create('mafia_room', { token: secret });
      sessionStorage.setItem(`room_${room.roomId}_token`, secret);
      router.push(`/room/${room.roomId}#token=${secret}`);
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

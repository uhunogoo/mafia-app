'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { client } from '@/lib/colyseus/client';
import { generateToken } from '@/lib/generateToken';

function CreateGame({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
      setError('Не вдалося створити кімнату. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Button
        size="lg"
        className="w-full"
        onClick={handleCreate}
        disabled={isLoading}
      >
        {isLoading ? 'Створення…' : children || 'Створити кімнату'}
      </Button>
    </>
  );
}

export default CreateGame;

'use client';

import React from 'react';
import { client } from '@/lib/colyseus/client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

function CreateGame({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Generate a secret token that will be embedded in the invite URL.
      // Only link holders who have this token can access the room.
      const secret = crypto.randomUUID();

      const room = await client.create('mafia_room', {
        hostName: 'Гравець',
        secret,
      });

      // Redirect the host to the room with the token in the URL.
      // Share this URL with other players to invite them.
      router.push(`/room/${room.roomId}?token=${secret}`);
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

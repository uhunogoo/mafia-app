'use client';

import { useState } from 'react';
import {
  createGuestIdentity,
  createHostIdentity,
  type PlayerIdentity,
} from '@/lib/identity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JoinFormProps {
  roomId: string;
  /** Supabase Auth UID — present only for the authenticated host. */
  hostUserId?: string;
  /** Called with the resolved identity after the form is submitted. */
  onJoined: (identity: PlayerIdentity) => void;
}

export default function JoinForm({ roomId, hostUserId, onJoined }: JoinFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a nickname.');
      return;
    }
    const identity = hostUserId
      ? createHostIdentity(roomId, trimmed, hostUserId)
      : createGuestIdentity(roomId, trimmed);
    onJoined(identity);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Join the game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nickname">Your nickname</Label>
              <Input
                id="nickname"
                placeholder="Enter a nickname…"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                autoFocus
                maxLength={32}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              Join
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

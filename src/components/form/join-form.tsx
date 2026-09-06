'use client';

import { useContext, useState } from 'react';
import { createGuestIdentity } from '@/lib/identity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContext } from '@/components/providers/page-provider';

export default function JoinForm() {
  const { roomId, token, identity, setIdentity } = useContext(PageContext)!;
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (token === undefined || token === null || identity) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a nickname.');
      return;
    }
    const identity = createGuestIdentity(roomId, trimmed);
    setIdentity(identity);
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

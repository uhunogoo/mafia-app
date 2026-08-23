'use client';

import React, { useState } from 'react';
import { createGuest } from '@/lib/guest';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JoinFormProps {
  roomId: string;
  token: string;
  /** Called after identity is saved so the parent can show the lobby inline. */
  onJoined: () => void;
}

export default function JoinForm({ roomId, onJoined }: JoinFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.SubmitEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a nickname.');
      return;
    }
    createGuest(roomId, trimmed);
    onJoined();
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Join the game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
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

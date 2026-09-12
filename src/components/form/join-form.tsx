'use client';

import React, { useState } from 'react';
import { createIdentity } from '@/lib/identity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { usePageContext } from '@/components/providers/page-provider';

export default function JoinForm() {
  const { roomId, identity, setIdentity } = usePageContext();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (identity) return null;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Уведіть нікнейм.');
      return;
    }
    // Хост кімнати приєднується тим самим guestId, з яким створив кімнату
    // (claim живе у sessionStorage вкладки, де кімнату створили)
    const hostClaim = sessionStorage.getItem(`room_${roomId}_hostClaim`);
    setIdentity(createIdentity(roomId, trimmed, hostClaim ?? undefined));
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Приєднатися до гри</CardTitle>
        <CardDescription>Як вас бачитимуть інші гравці?</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nickname">Ваш нікнейм</Label>
            <Input
              id="nickname"
              placeholder="Уведіть нікнейм…"
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
            Приєднатися
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

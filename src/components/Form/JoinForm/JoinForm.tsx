'use client';

import React from 'react';

import { createIdentity, roomHostClaimKey } from '@/lib/identity';
import { PageContext } from '@/components/Providers/PageProvider';
import Button from '@/components/UI/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/UI/Card';
import Input from '@/components/UI/Input';
import Label from '@/components/UI/Label';
import Title from '@/components/UI/Title';

function JoinForm() {
  const page = React.useContext(PageContext);
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  if (!page) {
    throw new Error('PageContext доступний лише всередині PageProvider');
  }
  const { roomId, identity, setIdentity } = page;

  if (identity) return null;

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Уведіть нікнейм.');
      return;
    }
    // Хост кімнати приєднується тим самим guestId, з яким створив кімнату
    // (claim живе у sessionStorage вкладки, де кімнату створили)
    const hostClaim = sessionStorage.getItem(roomHostClaimKey(roomId));
    setIdentity(createIdentity(roomId, trimmed, hostClaim ?? undefined));
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    setError('');
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle asChild>
          <Title as="h2" className="text-base">Приєднатися до гри</Title>
        </CardTitle>
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
              onChange={handleNameChange}
              autoFocus
              maxLength={32}
            />
            {error && (
              <p role="alert" className="text-sm text-destructive">{error}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Приєднатися
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default JoinForm;

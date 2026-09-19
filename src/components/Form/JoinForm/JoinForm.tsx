'use client';

import React from 'react';

import { RoomMembershipContext } from '@/components/Providers/RoomMembershipProvider';
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
  const membership = React.useContext(RoomMembershipContext);
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  if (!membership) {
    throw new Error(
      'RoomMembershipContext доступний лише всередині RoomMembershipProvider',
    );
  }
  const { roomId, identity, claim } = membership;

  if (identity) return null;

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Уведіть нікнейм.');
      return;
    }
    claim({ roomId, name: trimmed });
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

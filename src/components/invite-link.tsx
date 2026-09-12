'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { CheckIcon, ClipboardIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface InviteLinkProps {
  roomId: string;
  token: string | null | undefined;
}

export default function InviteLink({ roomId, token }: InviteLinkProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const inviteUrl = origin && token ? `${origin}/room/${roomId}#token=${token}` : '';

  const copyInviteLink = useCallback(async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteUrl]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm">Посилання на кімнату</Label>
      <div className="flex gap-2">
        <code className="flex-1 truncate rounded-md border bg-muted px-3 py-2 text-xs leading-5">
          {inviteUrl || '…'}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={copyInviteLink}
          disabled={!inviteUrl}
          aria-label="Скопіювати посилання"
        >
          {copied ? <CheckIcon className="text-green-500" /> : <ClipboardIcon />}
        </Button>
      </div>
    </div>
  );
}

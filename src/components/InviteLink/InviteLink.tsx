'use client';

import React from 'react';
import { CheckIcon, ClipboardIcon } from 'lucide-react';

import Button from '@/components/UI/Button';
import Label from '@/components/UI/Label';

interface InviteLinkProps {
  roomId: string;
  token: string | null | undefined;
}

function InviteLink({ roomId, token }: InviteLinkProps) {
  const [copied, setCopied] = React.useState(false);
  const [origin, setOrigin] = React.useState('');

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const inviteUrl = origin && token ? `${origin}/room/${roomId}#token=${token}` : '';

  async function handleCopyInviteLink() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
          onClick={handleCopyInviteLink}
          disabled={!inviteUrl}
          aria-label="Скопіювати посилання"
        >
          {copied ? <CheckIcon className="text-green-500" /> : <ClipboardIcon />}
        </Button>
      </div>
    </div>
  );
}

export default InviteLink;

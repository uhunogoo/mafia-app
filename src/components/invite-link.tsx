'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon, ClipboardIcon } from 'lucide-react';

interface InviteLinkProps {
  roomId: string;
  token: string;
}

export default function InviteLink({ roomId, token }: InviteLinkProps) {
  const [copied, setCopied] = useState(false);

  const inviteUrl = `${window.location.origin}/room/${roomId}#token=${token}`;

  const copyInviteLink = useCallback(async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [inviteUrl]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          Invite link
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <code className="flex-1 rounded-md bg-muted px-3 py-2 text-sm truncate">
          {inviteUrl}
        </code>
        <Button
          variant="outline"
          size="icon"
          onClick={copyInviteLink}
          aria-label="Copy invite link"
        >
          {copied ? <CheckIcon className="text-green-500" /> : <ClipboardIcon />}
        </Button>
      </CardContent>
    </Card>
  );
}

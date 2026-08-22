'use client';

import { useEffect, useState } from 'react';
import { loadGuest } from '@/lib/guest';
import JoinForm from '@/components/join-form';
import RoomLobby from '@/components/room-lobby';

interface JoinGateProps {
  roomId: string;
  /** The secret token extracted from the invite URL. Empty string means no token. */
  token: string;
}

/**
 * Client-side gate that:
 *  1. Rejects access if no token is present in the URL.
 *  2. Shows the nickname form if the guest hasn't identified yet for this room.
 *  3. Renders the lobby once identity is established.
 */
export default function JoinGate({ roomId, token }: JoinGateProps) {
  // Avoid hydration mismatch — read localStorage only after mount.
  const [ready, setReady] = useState(false);
  const [hasIdentity, setHasIdentity] = useState(false);

  useEffect(() => {
    setHasIdentity(loadGuest(roomId) !== null);
    setReady(true);
  }, [roomId]);

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-destructive font-medium">
          Invalid or missing invite link. Please ask the host to share a valid
          invite URL.
        </p>
      </div>
    );
  }

  if (!ready) {
    // Waiting for localStorage check — render nothing to avoid flash.
    return null;
  }

  if (!hasIdentity) {
    return (
      <JoinForm
        roomId={roomId}
        token={token}
        onJoined={() => setHasIdentity(true)}
      />
    );
  }

  return <RoomLobby roomId={roomId} token={token} />;
}

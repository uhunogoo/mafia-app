'use client';

import React from 'react';
import { loadGuest } from '@/lib/guest';
import JoinForm from '@/components/join-form';
import RoomLobby from '@/components/room-lobby';

interface JoinGateProps {
  roomId: string;
}

/**
 * Client-side gate that:
 *  1. Rejects access if no token is present in the URL.
 *  2. Shows the nickname form if the guest hasn't identified yet for this room.
 *  3. Renders the lobby once identity is established.
 */
export default function JoinGate({ roomId }: JoinGateProps) {
  const [token, setToken] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  const [hasIdentity, setHasIdentity] = React.useState(false);

  React.useEffect(() => {
    if (!roomId) return;

    // Get room token
    const hashString = window.location.hash;
    const params = new URLSearchParams(hashString.slice(1));
    let extractedToken = params.get("token");
    if (extractedToken) {
      sessionStorage.setItem(`room_${roomId}_token`, extractedToken);
    } if (!extractedToken) {
      extractedToken = sessionStorage.getItem(`room_${roomId}_token`);
    }
    console.log( extractedToken )

    setToken(extractedToken);
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

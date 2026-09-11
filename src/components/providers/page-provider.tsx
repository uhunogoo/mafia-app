'use client';

import React from 'react';
import { loadIdentity, type PlayerIdentity } from '@/lib/identity';
import { useParams } from 'next/navigation';

interface PageContextValue {
  roomId: string;
  token: string | null | undefined;
  identity: PlayerIdentity | null;
  setIdentity: React.Dispatch<React.SetStateAction<PlayerIdentity | null>>;
}

export const PageContext = React.createContext<PageContextValue | null>(null);

function PageProvider({ children }: { children?: React.ReactNode; }) {
  const { roomId } = useParams<{ roomId: string }>();
  const [token, setToken] = React.useState<string | null | undefined>(undefined);
  const [identity, setIdentity] = React.useState<PlayerIdentity | null>(null);

  React.useEffect(() => {
    const fromHash = new URLSearchParams(window.location.hash.slice(1)).get('token');
    const fromSession = sessionStorage.getItem(`room_${roomId}_token`);
    const identity = loadIdentity(roomId);

    setIdentity(identity);
    setToken(fromHash ?? fromSession ?? null);
  }, [roomId]);

  const value = React.useMemo(() => {
    return {
      roomId,
      token,
      identity,
      setIdentity,
    };
  }, [roomId, token, identity]);

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
}

export default PageProvider;

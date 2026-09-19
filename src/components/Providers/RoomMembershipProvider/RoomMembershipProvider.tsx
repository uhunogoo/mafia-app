'use client';

import React from 'react';
import { useParams } from 'next/navigation';

import {
  type ClaimInput,
  type Membership,
  type SetHostClaimInput,
  createBrowserSources,
  performClaim,
  performSetHostClaim,
  resolveMembership,
} from '@/lib/membership';

export interface RoomMembershipContextValue extends Membership {
  roomId: string;
  claim(input: ClaimInput): void;
  setHostClaim(input: SetHostClaimInput): void;
}

export const RoomMembershipContext =
  React.createContext<RoomMembershipContextValue | null>(null);

const EMPTY_MEMBERSHIP: Membership = {
  identity: null,
  token: null,
  hostClaim: null,
  sources: {
    token: null,
    identity: null,
    hostClaim: null,
  },
};

function RoomMembershipProvider({ children }: { children?: React.ReactNode }) {
  const { roomId } = useParams<{ roomId: string }>();
  const [membership, setMembership] = React.useState<Membership>(EMPTY_MEMBERSHIP);

  React.useEffect(() => {
    setMembership(resolveMembership(roomId, createBrowserSources()));
  }, [roomId]);

  function claim(input: ClaimInput) {
    setMembership(performClaim(input, createBrowserSources()));
  }

  function setHostClaim(input: SetHostClaimInput) {
    setMembership(performSetHostClaim(input, createBrowserSources()));
  }

  const value = React.useMemo<RoomMembershipContextValue>(
    () => ({ ...membership, roomId, claim, setHostClaim }),
    [membership, roomId],
  );

  return (
    <RoomMembershipContext.Provider value={value}>
      {children}
    </RoomMembershipContext.Provider>
  );
}

export default RoomMembershipProvider;
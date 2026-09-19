import { generateToken } from '@/lib/generateToken';

import { playerKey, roomHostClaimKey, roomTokenKey } from './keys';
import type {
  ClaimInput,
  Membership,
  SetHostClaimInput,
  SetTokenInput,
  Sources,
} from './types';

/**
 * Read-only join of the three pieces of room-membership state, with `sources`
 * tracking where each piece came from. Token precedence: hash > session >
 * null. Identity and hostClaim each have a single source.
 */
export function resolveMembership(roomId: string, sources: Sources): Membership {
  const fromHash = sources.readHashParam('token');
  const fromSession = sources.readSession(roomTokenKey(roomId));
  const identityRaw = sources.readLocal(playerKey(roomId));
  const hostClaim = sources.readSession(roomHostClaimKey(roomId));

  let identity: Membership['identity'] = null;
  if (identityRaw) {
    try {
      identity = JSON.parse(identityRaw) as Membership['identity'];
    } catch {
      identity = null;
    }
  }

  const token = fromHash ?? fromSession ?? null;
  const tokenSource: Membership['sources']['token'] = fromHash
    ? 'hash'
    : fromSession
      ? 'session'
      : null;

  return {
    identity,
    token,
    hostClaim,
    sources: {
      token: tokenSource,
      identity: identity ? 'storage' : null,
      hostClaim: hostClaim ? 'session' : null,
    },
  };
}

/**
 * Writes identity to localStorage. Reads the current `hostClaim` from the
 * same {@link Sources} instance and uses it as the preset `guestId` when
 * present; otherwise generates a fresh one. If `input.name.trim()` is `''`,
 * returns the current membership unchanged and performs no writes.
 */
export function performClaim(input: ClaimInput, sources: Sources): Membership {
  const trimmed = input.name.trim();
  const current = resolveMembership(input.roomId, sources);
  if (trimmed === '') {
    return current;
  }
  const guestId = current.hostClaim ?? generateToken();
  const identity = { name: trimmed, guestId };
  sources.writeLocal(playerKey(input.roomId), JSON.stringify(identity));
  return {
    ...current,
    identity,
    sources: { ...current.sources, identity: 'storage' },
  };
}

/**
 * Writes the hostClaim to sessionStorage and returns the updated membership.
 * Used by `CreateGame` after `client.create` resolves so the host's tab is
 * pinned even if the URL hash is later refreshed.
 */
export function performSetHostClaim(
  input: SetHostClaimInput,
  sources: Sources,
): Membership {
  sources.writeSession(roomHostClaimKey(input.roomId), input.guestId);
  const current = resolveMembership(input.roomId, sources);
  return {
    ...current,
    hostClaim: input.guestId,
    sources: { ...current.sources, hostClaim: 'session' },
  };
}

/**
 * Writes the invite token to sessionStorage and returns the updated
 * membership. Used by `CreateGame` after `client.create` resolves so the
 * host's tab survives a reload before the URL hash is in scope.
 */
export function performSetToken(input: SetTokenInput, sources: Sources): Membership {
  sources.writeSession(roomTokenKey(input.roomId), input.token);
  const current = resolveMembership(input.roomId, sources);
  return {
    ...current,
    token: input.token,
    sources: { ...current.sources, token: 'session' },
  };
}
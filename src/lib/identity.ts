import { generateToken } from '@/lib/generateToken';

/**
 * Identifies a player in a room.
 *
 * - Authenticated host: `hostUserId` is set, `guestId` is undefined.
 * - Anonymous guest:    `guestId` is set,    `hostUserId` is undefined.
 */
export interface PlayerIdentity {
  name: string;
  guestId?: string;
  hostUserId?: string;
}

function storageKey(roomId: string) {
  return `player:${roomId}`;
}

export function loadIdentity(roomId: string): PlayerIdentity | null {
  try {
    const raw = localStorage.getItem(storageKey(roomId));
    if (!raw) return null;
    return JSON.parse(raw) as PlayerIdentity;
  } catch {
    return null;
  }
}

function saveIdentity(roomId: string, identity: PlayerIdentity): void {
  localStorage.setItem(storageKey(roomId), JSON.stringify(identity));
}

export function createGuestIdentity(
  roomId: string,
  name: string,
  presetGuestId?: string,
): PlayerIdentity {
  const identity: PlayerIdentity = {
    name: name.trim(),
    guestId: presetGuestId ?? generateToken(),
  };
  saveIdentity(roomId, identity);
  return identity;
}

export function createHostIdentity(roomId: string, name: string, hostUserId: string): PlayerIdentity {
  const identity: PlayerIdentity = { name: name.trim(), hostUserId };
  saveIdentity(roomId, identity);
  return identity;
}

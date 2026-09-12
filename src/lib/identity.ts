import { generateToken } from '@/lib/generateToken';

/**
 * Ідентифікує гравця у кімнаті.
 * - Хост: guestId = Supabase user.sub (збігається з hostId на сервері).
 * - Гість: випадковий guestId.
 */
export interface PlayerIdentity {
  name: string;
  guestId: string;
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

export function createIdentity(
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

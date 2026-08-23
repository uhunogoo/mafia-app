import { generateToken } from '@/lib/generateToken';

export interface GuestIdentity {
  guestId: string;
  name: string;
}

function storageKey(roomId: string) {
  return `guest:${roomId}`;
}

export function loadGuest(roomId: string): GuestIdentity | null {
  try {
    const raw = localStorage.getItem(storageKey(roomId));
    if (!raw) return null;
    return JSON.parse(raw) as GuestIdentity;
  } catch {
    return null;
  }
}

export function saveGuest(roomId: string, identity: GuestIdentity): void {
  localStorage.setItem(storageKey(roomId), JSON.stringify(identity));
}

export function createGuest(roomId: string, name: string): GuestIdentity {
  const identity: GuestIdentity = {
    guestId: generateToken(),
    name: name.trim(),
  };
  saveGuest(roomId, identity);
  return identity;
}

/**
 * Storage key shapes match the legacy `src/lib/identity.ts` module exactly so
 * open tabs survive the migration without a forced reload.
 */
export function playerKey(roomId: string): string {
  return `player:${roomId}`;
}

export function roomTokenKey(roomId: string): string {
  return `room_${roomId}_token`;
}

export function roomHostClaimKey(roomId: string): string {
  return `room_${roomId}_hostClaim`;
}
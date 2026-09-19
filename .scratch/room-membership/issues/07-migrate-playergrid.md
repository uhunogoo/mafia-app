# 07: Migrate PlayerGrid to RoomMembershipContext

**What to build:** `PlayerGrid` reads from `RoomMembershipContext` instead of `PageContext`. Behaviourally identical: renders `capacity` slots, marking the seat whose `seatIndex` matches the seated player whose `guestId` equals `myGuestId` (read from `identity.guestId`) as `isYou`.

**Blocked by:** 02 (needs `RoomMembershipProvider` mounted in the room layout).

**Status:** ready-for-agent

- [ ] `src/components/Room/PlayerGrid/PlayerGrid.tsx` imports `RoomMembershipContext` from `@/components/Providers/RoomMembershipProvider`.
- [ ] The empty-context throw-guard message references `RoomMembershipProvider` (not `PageProvider`).
- [ ] `identity` is read from the new context value; `myGuestId` derivation (`identity?.guestId`) is preserved.
- [ ] `import { PageContext } from '@/components/Providers/PageProvider'` is removed from this file.
- [ ] `npm run lint` passes.
- [ ] Manual smoke: the local player's slot is highlighted as `isYou`; seating logic driven by `seatIndex` is unchanged.
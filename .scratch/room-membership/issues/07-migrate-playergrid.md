# 07: Migrate PlayerGrid to RoomMembershipContext

**What to build:** `PlayerGrid` reads from `RoomMembershipContext` instead of `PageContext`. Behaviourally identical: renders `capacity` slots, marking the seat whose `seatIndex` matches the seated player whose `password` equals `mypassword` (read from `identity.password`) as `isYou`.

**Blocked by:** 02 (needs `RoomMembershipProvider` mounted in the room layout).

**Status:** ready-for-agent

- [x] `src/components/Room/PlayerGrid/PlayerGrid.tsx` imports `RoomMembershipContext` from `@/components/Providers/RoomMembershipProvider`.
- [x] The empty-context throw-guard message references `RoomMembershipProvider` (not `PageProvider`).
- [x] `identity` is read from the new context value; `mypassword` derivation (`identity?.password`) is preserved.
- [x] `import { PageContext } from '@/components/Providers/PageProvider'` is removed from this file.
- [x] `npm run lint` passes.
- [ ] Manual smoke: the local player's slot is highlighted as `isYou`; seating logic driven by `seatIndex` is unchanged.

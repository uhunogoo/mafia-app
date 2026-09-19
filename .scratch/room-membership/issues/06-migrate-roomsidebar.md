# 06: Migrate RoomSidebar to RoomMembershipContext

**What to build:** `RoomSidebar` reads from `RoomMembershipContext` instead of `PageContext`. Behaviourally identical: renders the host control panel when `me?.isHost` is true (derived from Colyseus state via `identity.guestId`), or the guest view otherwise. `roomId` is passed through to `<InviteLink>`; `token` feeds `InviteLink`'s URL.

**Blocked by:** 02 (needs `RoomMembershipProvider` mounted in the room layout).

**Status:** ready-for-agent

- [ ] `src/components/Room/RoomSidebar/RoomSidebar.tsx` imports `RoomMembershipContext` from `@/components/Providers/RoomMembershipProvider`.
- [ ] The empty-context throw-guard message references `RoomMembershipProvider` (not `PageProvider`).
- [ ] `roomId`, `token`, and `identity` are read from the new context value (per ticket 02's deviation, `roomId` is on the context value so no separate `useParams` call is required).
- [ ] `import { PageContext } from '@/components/Providers/PageProvider'` is removed from this file.
- [ ] The `me?.isHost` derivation from `players[identity.guestId]` is preserved.
- [ ] `npm run lint` passes.
- [ ] Manual smoke: host sees the player-count selector, role composition, "Перемішати" and "Почати гру" buttons; guest sees the read-only panel; invite link is rendered in both cases.
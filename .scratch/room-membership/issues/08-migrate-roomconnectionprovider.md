# 08: Migrate RoomConnectionProvider to RoomMembershipContext

**What to build:** `RoomConnectionProvider` reads from `RoomMembershipContext` instead of `PageContext`. Behaviourally identical: shows the "invalid invite" `<StatusMessage>` when `token` is missing; otherwise wraps children in `RoomContext.RoomProvider` with a `connect` callback that joins by `roomId` using `{ token, name: identity.name, guestId: identity.guestId }`.

**Blocked by:** 02 (needs `RoomMembershipProvider` mounted in the room layout).

**Status:** ready-for-agent

- [ ] `src/components/Providers/RoomConnectionProvider/RoomConnectionProvider.tsx` imports `RoomMembershipContext` from `@/components/Providers/RoomMembershipProvider`.
- [ ] The empty-context throw-guard message references `RoomMembershipProvider` (not `PageProvider`).
- [ ] `roomId`, `token`, and `identity` are read from the new context value (per ticket 02's deviation, `roomId` is on the context value).
- [ ] The `connect` callback signature (`client.joinById(roomId, { token, name, guestId })`) and the `ready = Boolean(token && identity?.guestId)` check are preserved.
- [ ] The "Посилання недійсне: відсутній токен кімнати. Скористайся запрошенням хоста." error message is preserved verbatim.
- [ ] `import { PageContext } from '@/components/Providers/PageProvider'` is removed from this file.
- [ ] `npm run lint` passes.
- [ ] Manual smoke: opening `/room/<id>#token=<t>` in a fresh tab establishes a Colyseus connection; opening the same URL with no token shows the invalid-invite error; opening the same URL in a second tab joins as a separate player.
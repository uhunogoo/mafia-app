# 04: Migrate JoinForm to context claim()

**What to build:** `JoinForm` stops reading `roomHostClaimKey` directly from `sessionStorage` and stops importing `createIdentity`. It reads the membership context and on submit calls `claim({ roomId, name: trimmed })` on the context value. Host-tab recognition continues to work because `performClaim` (called inside `claim()`) reads `hostClaim` from the same `Sources` that ticket 03 wrote. The empty-name UI guard stays in the component (it surfaces a user-facing message); the function-level total-return guard inside `performClaim` becomes belt-and-braces.

**Blocked by:** 02 (needs `RoomMembershipProvider` mounted in the room layout).

**Status:** ready-for-agent

- [ ] `src/components/Form/JoinForm/JoinForm.tsx` imports `RoomMembershipContext` from `@/components/Providers/RoomMembershipProvider`.
- [ ] The submit handler calls `claim({ roomId, name: trimmed })` on the context value (NOT `createIdentity` and NOT `setIdentity`).
- [ ] `import { createIdentity, roomHostClaimKey } from '@/lib/identity'` is removed from this file.
- [ ] No direct `sessionStorage.getItem` calls remain in `JoinForm.tsx`.
- [ ] The `if (!trimmed) { setError(...); return; }` guard is preserved before the `claim` call.
- [ ] `npm run lint` passes.
- [ ] Manual smoke: as a guest, submitting a name creates the identity; as a host in the same tab that created the room, submitting a name yields an identity whose `guestId` equals `user.sub`.
# 02: RoomMembershipProvider + room-layout mount

**What to build:** A new provider+context pair at `src/components/Providers/RoomMembershipProvider/` and a mount at `src/app/room/[roomId]/layout.tsx`. After this lands, any component inside the room tree can `React.useContext(RoomMembershipContext)` to read the membership state, call `claim()` to set identity, or call `setHostClaim()` to set the hostClaim key. `PageProvider` is left in place (mounted alongside) so the migration in tickets 04–08 stays safe.

**Blocked by:** 01 (membership module + tests must exist first).

**Status:** ready-for-agent

- [x] `src/components/Providers/RoomMembershipProvider/RoomMembershipProvider.tsx` exists with `RoomMembershipContext` as a named export and `RoomMembershipProvider` as the default export (matches `docs/architecture.md` provider convention: provider + context in ONE file, no wrapper hook).
- [x] `src/components/Providers/RoomMembershipProvider/index.ts` barrel exists.
- [x] Context value type is `{ ...Membership, roomId: string, claim(input: ClaimInput): void, setHostClaim(input: SetHostClaimInput): void }`.
- [x] **Spec deviation note:** the spec's API shape does NOT carry `roomId` on the context value. The user-approved deviation is to include `roomId` so consumers (e.g. `RoomSidebar` feeding `InviteLink`) do not each need a separate `useParams()` call. Future spec revisions should reflect this.
- [x] On mount and on `roomId` change, the provider calls `resolveMembership(roomId, sources)` with a fresh `createBrowserSources()` and stores the result in state.
- [x] `claim(input)` invokes `performClaim(input, sources)` and writes the returned `Membership` back into state (so consumers re-render without a remount).
- [x] `setHostClaim(input)` invokes `performSetHostClaim(input, sources)` and writes the returned `Membership` back into state.
- [x] `src/app/room/[roomId]/layout.tsx` mounts `RoomMembershipProvider` (the legacy `PageProvider` stays mounted in the same layout — keep it as an inner/outer wrapper, whichever keeps the layout change purely additive).
- [x] `npm run lint` and `npm run build` pass; smoke: visiting `/room/abc#token=xyz` populates the context value on first render.

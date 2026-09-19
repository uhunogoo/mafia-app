# 05: Migrate RoomGuard to RoomMembershipContext

**What to build:** `RoomGuard` reads from `RoomMembershipContext` instead of `PageContext`. Behaviourally identical: when `identity` is present, render children unobscured; when absent, render children behind a blurred overlay with `<JoinForm />` on top.

**Blocked by:** 02 (needs `RoomMembershipProvider` mounted in the room layout).

**Status:** ready-for-agent

- [x] `src/components/Room/RoomGuard/RoomGuard.tsx` imports `RoomMembershipContext` from `@/components/Providers/RoomMembershipProvider`.
- [x] The empty-context throw-guard message references `RoomMembershipProvider` (not `PageProvider`).
- [x] `identity` is read from the new context value; `roomId` is read either from the context value (per ticket 02's deviation) or via `useParams` — whichever the file needs.
- [x] `import { PageContext } from '@/components/Providers/PageProvider'` is removed from this file.
- [x] `npm run lint` passes.
- [x] Manual smoke: visiting `/room/<id>#token=…` without a stored identity triggers the overlay with `JoinForm`; submitting a name dismisses the overlay and reveals the room contents.

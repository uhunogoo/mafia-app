# 03: Migrate CreateGame to pure membership functions

**What to build:** `CreateGame` stops reaching into `sessionStorage` directly. After `client.create('mafia_room', { token, guestId: user.sub })` returns, it calls the pure module functions `performSetToken({ roomId, token }, sources)` and `performSetHostClaim({ roomId, guestId: user.sub }, sources)` with a fresh `createBrowserSources()`. The user-visible flow is unchanged: clicking "Сворити кімнату" still navigates to `/room/<id>#token=<t>` with the host's tab pinned as the host.

**Blocked by:** 01 (needs the pure module).

**Status:** ready-for-agent

- [ ] `src/components/CreateGame/CreateGame.tsx` imports `performSetToken`, `performSetHostClaim`, `createBrowserSources` from `@/lib/membership`.
- [ ] Both pure functions are called after `client.create` resolves successfully, before `router.push`.
- [ ] `import { roomHostClaimKey, roomTokenKey } from '@/lib/identity'` is removed from this file.
- [ ] No direct `sessionStorage.setItem` calls remain in `CreateGame.tsx`.
- [ ] `npm run lint` passes.
- [ ] Manual smoke: create a room in the dashboard → tab navigates to `/room/<id>#token=<t>` → host claim is set in session → reloading the room page in the same tab still recognises the host.
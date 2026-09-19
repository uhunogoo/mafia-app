# 09: Delete legacy identity module and PageProvider

**What to build:** The contract step of the expand–contract migration. Once no consumer in `src/` reads `@/lib/identity` or `PageContext`, the legacy files are deleted. After this lands, no file in the source tree reaches into `localStorage` / `sessionStorage` / URL hash directly — the membership story lives entirely in `@/lib/membership` and `@/components/Providers/RoomMembershipProvider`.

**Blocked by:** 03, 04, 05, 06, 07, 08 (every caller of `@/lib/identity` and `PageContext` must have migrated first).

**Status:** ready-for-agent

- [ ] `src/lib/identity.ts` is deleted.
- [ ] `src/components/Providers/PageProvider/` (the folder and both files: `PageProvider.tsx`, `index.ts`) is deleted.
- [ ] `src/app/room/[roomId]/layout.tsx` no longer mounts `PageProvider`; only `RoomMembershipProvider` remains.
- [ ] Repo-wide search for `@/lib/identity` returns no source-tree matches (only the spec and this issue's blocking references are allowed).
- [ ] Repo-wide search for `PageContext` and `PageProvider` returns no source-tree matches.
- [ ] `npm run build`, `npm run lint`, and `npm test` all pass.
- [ ] End-to-end smoke: create room in dashboard → host joins as host in the same tab → open the invite link in a second tab → second player joins as guest → both players visible in `PlayerGrid`, host controls visible in `RoomSidebar`.
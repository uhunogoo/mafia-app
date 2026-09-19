Status: ready-for-agent

# Spec · Room Membership module

## Problem Statement

A player attaching to a Mafia game room — host or guest — needs three things to land in the same place: an **identity** (display name + stable `guestId`), a **token** (the invite-link secret proving the link is valid), and, for the host only, a **hostClaim** (a per-tab pin proving the tab that created the room is the one that should connect as the host). Today those three are scattered across five files, two storage backends (`localStorage` and `sessionStorage`), and the URL hash. The host-claim impersonation invariant — "the host's `guestId` must match the `hostId` on the server" — is duplicated in `CreateGame` and `JoinForm`, and there is no single module that owns the rule "this player is attached to this room." Any change to identity, invite, or host rules today means editing a half-dozen files and re-deriving the invariant by hand.

## Solution

Collapse the room-membership concept into one module: **`RoomMembership`**. The module owns the three pieces of state (identity, token, hostClaim), the storage keys for each, the rules that decide which sources take precedence, and the pure functions that write each one. A single provider mounts at the room-route layout, rehydrates from storage on mount and on `roomId` change, and exposes the state plus two imperative actions (`claim`, `setHostClaim`) through context. Consumers read state via `React.useContext(RoomMembershipContext)` and call actions the same way; no component reaches into storage directly. The host still goes through the same `JoinForm` as a guest — the only difference is that `CreateGame` first calls the pure `performSetToken` and `performSetHostClaim` so the form has the invite token and knows which `guestId` to use. Because `CreateGame` lives on the dashboard route, where the provider is not mounted, it calls the pure function directly (with a freshly-built `Sources` instance), not the context actions: `performSetToken({ roomId, token }, sources)` and `performSetHostClaim({ roomId, guestId: user.sub }, sources)`.

## User Stories

1. As a guest player, I want to click an invite link and join a room, so that I can play with friends.
2. As a host player, I want to create a room and share an invite link, so that friends can join my game.
3. As a guest, I want my name to be remembered after I refresh, so that I don't have to re-enter it.
4. As a host, I want my identity on the room page to use the same `guestId` I created the room with, so that the server recognises me as the host.
5. As a returning player, I want the system to remember me if I refresh or briefly disconnect from the room, so that the host doesn't see me as a new player.
6. As a player who navigates between two rooms, I want my identity, token, and host-claim to reset for the new room, so that secrets from one room don't leak into another.
7. As a guest joining with a malformed invite link, I want to see a clear "invalid invite" message, so that I know to ask the host for a new link.
8. As a host opening my own room in the same tab I created it in, I want to be identified automatically once I submit a name, so that I don't have to type my email or any other identifier.
9. As a host opening my own room, I want a different tab on the same browser to be unable to impersonate me as host, so that the host seat can't be hijacked by a stolen invite link.
10. As a developer, I want all room-membership state and rules in one module, so that any change to identity, host-claim, or invite logic has a single, testable home.
11. As a developer, I want the storage layer abstracted behind an interface, so that switching between browser storage and an in-memory adapter for tests requires no changes to business logic.
12. As a developer, I want room-membership unit tests that don't need a browser, React, or Colyseus, so that CI is fast and deterministic.
13. As a developer, I want the existing convention "providers expose their context directly, no wrapper hooks" to be honoured, so that the new module fits the codebase's house style.
14. As a developer, I want existing open tabs not to break when this ships, so that users mid-game aren't kicked out.

## Implementation Decisions

### Modules

- **NEW `src/lib/membership/`** — pure logic. Exports:
  - `Sources` interface (storage adapter)
  - `ClaimInput`, `SetHostClaimInput`, `SetTokenInput`, `Membership` types
  - `resolveMembership(roomId, sources)` — read-only, used by the provider on mount and on `roomId` change
  - `performClaim(input, sources)` — writes identity; reads `hostClaim` from `sources` and uses it as preset `guestId` when present, otherwise generates a fresh one
  - `performSetHostClaim(input, sources)` — writes `hostClaim` only
  - `performSetToken(input, sources)` — writes `token` only (parallel to `performSetHostClaim`; used by `CreateGame` on the dashboard, where the provider is not mounted)
  - A `createBrowserSources()` factory that adapts `window.localStorage`, `window.sessionStorage`, and `window.location.hash`
  - A `createMemorySources()` factory for tests
- **NEW `src/components/Providers/RoomMembershipProvider/`** — provider + context in one file (per `docs/architecture.md`). `RoomMembershipContext` is a named export. `RoomMembershipProvider` is the default export. Context value carries data plus the two action methods (`claim`, `setHostClaim`); no separate `useFoo` wrapper hook.
- **DELETED `src/lib/identity.ts`** — all logic migrated to `lib/membership`.
- **DELETED `src/components/Providers/PageProvider/`** — replaced by `RoomMembershipProvider`.
- **MODIFIED `src/app/room/[roomId]/layout.tsx`** — mounts `RoomMembershipProvider` instead of `PageProvider`. Room-scoped, not app-scoped.
- **MODIFIED `src/components/CreateGame/CreateGame.tsx`** — calls the pure functions `performSetToken({ roomId, token }, sources)` and `performSetHostClaim({ roomId, guestId: user.sub }, sources)` after `client.create` succeeds. These are **direct calls to the pure functions**, not calls through the context, because the provider is not mounted on the dashboard route. `sources` is a fresh `createBrowserSources()`.
- **MODIFIED `src/components/Form/JoinForm/JoinForm.tsx`** — calls `claim({ roomId, name })` on the context value; the underlying `performClaim` reads `hostClaim` internally and uses it as preset `guestId` when present.
- **MODIFIED `src/components/Room/RoomGuard/RoomGuard.tsx`** — imports `RoomMembershipContext` instead of `PageContext`.
- **MODIFIED `src/components/Room/RoomSidebar/RoomSidebar.tsx`** — same.
- **MODIFIED `src/components/Room/PlayerGrid/PlayerGrid.tsx`** — same.
- **MODIFIED `src/components/Providers/RoomConnectionProvider/RoomConnectionProvider.tsx`** — same.

### Seam

- **One seam: `Sources`.** The membership module reads and writes `localStorage` / `sessionStorage` / URL hash exclusively through a `Sources` instance. Production uses `createBrowserSources()`; tests use `createMemorySources()`. No browser, React, or Colyseus is required to exercise any membership function. The seam is the only place in the codebase that knows about storage backends.

### Provider behaviour

- Mounted at `src/app/room/[roomId]/layout.tsx`. Token and host-claim are room-scoped; mounting at `app/layout.tsx` would leak across rooms.
- On mount, calls `resolveMembership(roomId, sources)` and stores the result in state.
- On `roomId` change, resets state and re-rehydrates (App Router does not remount the layout on dynamic-param change).
- `claim(input)` and `setHostClaim(input)` call the corresponding pure function (`performClaim` / `performSetHostClaim`) and write the returned `Membership` into context state, so consumers re-render with the new identity without requiring a remount or navigation. Without this, an implementer could plausibly make the actions storage-write-only and leave the form stuck waiting for state that never updates.

### API shape

```ts
// Pure functions over a Sources instance.
export interface Sources {
  readLocal(key: string): string | null;
  writeLocal(key: string, value: string): void;
  readSession(key: string): string | null;
  writeSession(key: string, value: string): void;
  readHashParam(name: string): string | null;
}

export interface Membership {
  identity: PlayerIdentity | null;
  token: string | null;
  hostClaim: string | null;
  sources: {
    token: 'hash' | 'session' | null;
    identity: 'storage' | null;
    hostClaim: 'session' | null;
  };
}

export interface ClaimInput       { roomId: string; name: string }
export interface SetHostClaimInput { roomId: string; guestId: string }
export interface SetTokenInput     { roomId: string; token: string }

export function resolveMembership(roomId: string, sources: Sources): Membership;
export function performClaim(input: ClaimInput, sources: Sources): Membership;
export function performSetHostClaim(input: SetHostClaimInput, sources: Sources): Membership;
export function performSetToken(input: SetTokenInput, sources: Sources): Membership;
```

The context value is `{ ...Membership, claim(input: ClaimInput): void, setHostClaim(input: SetHostClaimInput): void }`. There is no `clear()` in v1 — it had no UI consumer, and the `Sources` interface does not need `remove*` methods on its account.

`performClaim` returns the current `Membership` unchanged when `input.name.trim()` is `''` — no write to `Sources`, no new identity. Callers are expected to validate the name (Zod schema on `JoinForm`) before calling; the guard exists only to make the function total, not to surface user errors.

### Why a pure `performSetToken` exists

`CreateGame` writes the invite token to `sessionStorage` after `client.create` so the host's tab survives a reload. The same logic that forces `performSetHostClaim` to be a pure function also forces `performSetToken` to be one: `CreateGame` is on the dashboard, where the provider is not mounted. Adding `performSetToken` keeps the seam intact (no component reaches into storage directly) and gives the function its own home in the module.

### Rollback note

The earlier proposal of `claim({ asHost: true })` was a misframe and is explicitly rejected: the host enters their display name through the same `JoinForm` as any other player. `setHostClaim` is a separate function with its own action, not a flag on `claim`. The earlier inclusion of `clear()` on the context value was similarly speculative (no UI consumer in v1) and is removed.

### Migration compatibility

Existing storage key shapes (`player:<roomId>` in `localStorage`; `room_<roomId>_token`, `room_<roomId>_hostClaim` in `sessionStorage`) are preserved by the new module. Existing open tabs continue to work without a forced reload.

## Testing Decisions

- **What makes a good test:** external behaviour at the `Sources` seam. The test asserts what was written to (or read from) the `Sources` instance and what `Membership` value was returned. Tests do not poke at internal helpers or branch on storage-impl details.
- **Modules tested:** `src/lib/membership/` — `resolveMembership`, `performClaim`, `performSetHostClaim`, `performSetToken`, the `Sources` factories, and the storage-key derivation that lives inside the module.
- **Modules NOT tested here:** the React provider itself. The provider is a thin wrapper over the pure functions; adding a React testing setup for one component is out of scope. The pure-function coverage gives the same guarantee with much less machinery.
- **Test seam:** `Sources`. A `createMemorySources()` returns an object that records every read and write; tests assert on those records.
- **Prior art:** `mafia-server/test/mafia-room.test.ts` (mocha + `@colyseus/testing`). The new test file lives at `src/lib/membership/membership.test.ts` and uses mocha for vocabulary consistency. Adding mocha as a dev dependency to `mafia-app` is part of the implementation.
- **Coverage targets:** every branch of every pure function — including the host-claim present / absent paths, the hash-token / session-token / no-token paths, and the empty-name guard (no `Sources` write, unchanged `Membership` returned).

## Out of Scope

- The test runner itself (mocha dev-dep + config) is part of the implementation but isn't specced here.
- A `clear()` context action and any "leave room" / "forget me" UI. Not in v1; if a future spec needs it, the `Sources` interface can grow `removeLocal` / `removeSession` then.
- **Host-status derivation.** Whether `RoomSidebar` decides "this player is the host" by checking `hostClaim !== null` (local tab pin) or by comparing `identity.guestId` to `room.state.hostId` (server-authoritative) is **explicitly out of scope for A1**. A1 only exposes the raw `hostClaim` and `identity`; the comparison stays where it is today (`RoomSidebar` reads `players[identity.guestId].isHost` from Colyseus state). Reopening this question belongs to A2 (split lobby commands).
- Any change to A2 (lobby commands) or A3 (shared contracts). Those are separate specs blocked on A1.
- Any change to `SignUpForm`, `CreateGame`'s dashboard copy, or the email-derived-name pattern that the rejected options would have required.
- Moving `PlayerIdentity` to a shared `@mafia-game/contracts` package (deferred to A3).
- Changing the Colyseus client singleton (`src/lib/colyseus/client.ts`) or the `NEXT_PUBLIC_COLYEUS_URL` env var.

## Further Notes

- This spec is grounded in the design tree for candidate **A1** in `docs/architecture/candidates.md`. The HTML report at `%TEMP%/architecture-review-20260918-210759.html` is the visual entry point.
- Once A1 lands, A2 (split lobby commands) and A3 (shared contracts) both become cheaper — A2 because `RoomSidebar` can read `me` from one place, A3 because the new module is the first natural consumer of a typed `Player`.
- The typo `NEXT_PUBLIC_COLYEUS_URL` (should be `COLYSEUS`) is visible in `src/lib/colyseus/client.ts` and is **not** fixed by this spec — leave it alone unless asked.

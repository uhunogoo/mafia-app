# Architecture deepening candidates

Working queue for the deepening review surfaced on 2026-09-18. Each card has
the same shape: **files** · **problem** · **solution** · **seam** ·
**dependencies**. Source report:
`%TEMP%/architecture-review-20260918-210759.html` (also linked from the
review session).

Recommendation vocabulary: **Strong** = pay off on the next change in this
area · **Worth exploring** = leverage exists, evidence not yet strong enough
to start · **Speculative** = might pay off, evidence thin.

Dependency vocabulary: **blocks** = cannot start without this settling ·
**leverages** = once this lands, the other becomes cheaper · **independent**
= no shared state.

---

## A1 · Collapse the room-membership pipeline — `Strong`

**Status:** ready for deepening · picked in review session · Round 1
settled · Round 2 open (host display name).

**Files**

- `src/lib/identity.ts` (delete)
- `src/components/Providers/PageProvider/PageProvider.tsx` (delete)
- `src/components/CreateGame/CreateGame.tsx`
- `src/components/Form/JoinForm/JoinForm.tsx`
- `src/components/Room/RoomGuard/RoomGuard.tsx`
- `src/components/Providers/RoomConnectionProvider/RoomConnectionProvider.tsx`
- **new:** `src/lib/membership/` — pure logic (resolve, claim, sources interface, in-memory adapter)
- **new:** `src/components/Providers/RoomMembershipProvider/RoomMembershipProvider.tsx`

**Problem.** The concept "a player attaching to a room" — token, identity,
host-claim — is implemented across five files. The host-claim impersonation
guard is duplicated in `CreateGame` and `JoinForm`; storage is split across
`localStorage` (identity) and `sessionStorage` (token, host-claim) with no
shared mental model; `PageContext` exposes the union but no module owns it.

**Solution.** One `RoomMembership` module: a provider that rehydrates on
mount and on `roomId` change, an imperative `claim()` action exposed on the
context value, a separate `setHostClaim(roomId, guestId)` action for the
host-claim write, and a single storage adapter behind a seam. Consumers
read context directly (no wrapper hooks, per [architecture.md](../architecture.md)).
The host-claim invariant lives in one function (`setHostClaim`); the
identity invariant lives in one function (`claim`). Both functions live in
the same module and share the `Sources` adapter.

**Seam.** The seam sits between the membership module and **storage**
(`localStorage`, `sessionStorage`, URL hash). The membership module defines a
small `Sources` interface; an in-memory adapter makes the pure logic testable
without a browser. Colyseus stays outside the seam — it is the consumer, not
the abstraction.

**Interfaces (draft).**

```ts
// src/lib/membership/types.ts
export interface Sources {
  readLocal(key: string): string | null;
  writeLocal(key: string, value: string): void;
  readSession(key: string): string | null;
  writeSession(key: string, value: string): void;
  readHashParam(name: string): string | null;
}

export interface ClaimInput {
  roomId: string;
  name: string;
}

export interface SetHostClaimInput {
  roomId: string;
  guestId: string;
}

export interface Membership {
  identity: PlayerIdentity | null;
  token: string | null;        // null = no invite / invalid link
  hostClaim: string | null;    // sessionStorage pin for the host tab
  sources: { token: 'hash' | 'session' | null; identity: 'storage' | null; hostClaim: 'session' | null };
}

// pure functions (lib/membership/)
export function resolveMembership(roomId: string, sources: Sources): Membership;
export function performClaim(input: ClaimInput, sources: Sources): Membership;
//   → reads hostClaim from sources; if present, uses it as preset guestId.
//     Otherwise generates a fresh guestId.
export function performSetHostClaim(input: SetHostClaimInput, sources: Sources): Membership;

// context value (Providers/RoomMembershipProvider/)
export interface RoomMembershipValue extends Membership {
  claim(input: ClaimInput): void;             // mutates provider state; consumers re-render
  setHostClaim(input: SetHostClaimInput): void; // same, for the host-tab pin
}
export const RoomMembershipContext = React.createContext<RoomMembershipValue | null>(null);
```

**Mounted at:** `src/app/room/[roomId]/layout.tsx` — replaces
`PageProvider`. NOT `src/app/layout.tsx` (token and hostClaim are
room-scoped; a global mount would leak across rooms).

**Re-rehydration:** the provider uses `useEffect([roomId])` to reset its
internal state and re-resolve from sources. Same pattern as today's
`PageProvider`; App Router keeps the layout mounted across dynamic param
changes, so a remount is not free.

**Dependencies.**

- **Leverages** A2 (`RoomSidebar`'s `me` / `isHost` derivation collapses to
  one read).
- **Leverages** A3 (the membership module is the natural first consumer of a
  shared `Player` type from `@mafia-game/contracts`).

**Migration.**

1. Create `src/lib/membership/` (pure logic + types + in-memory adapter).
2. Create `src/components/Providers/RoomMembershipProvider/` (provider + context).
3. Update `app/room/[roomId]/layout.tsx` to mount the new provider.
4. Update 5 consumers (`JoinForm`, `PlayerGrid`, `RoomSidebar`, `RoomGuard`,
   `RoomConnectionProvider`) to import the new context.
5. Update `CreateGame` to call `setHostClaim({ roomId, guestId: user.sub })`
   after `client.create` succeeds (host still goes through `JoinForm` like
   everyone else — no `asHost` flag on `claim`).
6. Update `JoinForm` to call `claim({ roomId, name })`; the module reads
   `hostClaim` internally and uses it as preset guestId when present.
7. Delete `PageProvider/` and `lib/identity.ts`.

**Open (Round 2) — settled.**

*(settled 2026-09-18: the host goes through the same `JoinForm` as everyone
else; the `asHost: true` API variant was a misframe. No host-display-name
source to source — `JoinForm` collects it.)*

- ~~**N2 — host display name source**~~ (cancelled). Host enters their
  display name in `JoinForm` like any guest. `claim()` reads `hostClaim`
  internally and uses it as the preset guestId; the display name is whatever
  the host typed.
---

## A2 · Split lobby commands from the lobby view — `Worth exploring`

**Status:** blocked by A1.

**Files**

- `src/components/Room/RoomSidebar/RoomSidebar.tsx`

**Problem.** `RoomSidebar` derives view state, branches host vs guest, builds
Colyseus message strings (`'setMaxPlayers'`, `'shuffle_players'`, `'startGame'`)
inline, and renders. Interface ≈ implementation — shallow module. Tests would
have to mount Colyseus to exercise a radio button.

**Solution.** Two modules: `useLobbyCommands(room)` adapter names the protocol
behind a small interface; `useLobbyView(state, me)` derives the display
view. `LobbyPanel` consumes both and renders.

**Seam.** The seam sits between the command surface (`setMaxPlayers`,
`shuffle`, `startGame`) and the Colyseus `room.send()` call. A second
adapter (in-memory) records commands for tests.

**Dependencies.**

- **Blocks:** A1. `useLobbyView` consumes `me` from the membership context;
  doing A2 first scatters that read across both modules.
- **Leveraged by:** the night-phase UI (when it lands) — same command
  adapter, same derivation pattern.

**Notes.**

- The Ukrainian plural helper `playersWord(n)` migrates to a `uk-plural`
  helper module before A2 lands.

---

## A3 · Source the client view from the server schema — `Worth exploring`

**Status:** blocked by A1.

**Files**

- `mafia-server/src/rooms/schema/MafiaState.ts`
- `mafia-server/src/rooms/schema/enums.ts`
- `src/components/Providers/RoomConnectionProvider/RoomConnectionProvider.tsx`

**Problem.** The client redeclares `MafiaStateView` with `role: string`
while the server has `enum Role`. Drift between the two is silent — a new
role on the server surfaces as a runtime string mismatch, not a TS error.
The same is true of `GamePhase` and `Team`.

**Solution.** Hoist `Role`, `GamePhase`, `Team`, and the `Player` shape into
a shared `@mafia-game/contracts` package. Both sides import. The server
keeps its `@colyseus/schema` decorators on a wrapper class; the client gets a
typed `Snapshot`.

**Seam.** The seam sits between the colyseus-schema runtime types and the
plain TypeScript types. The contracts package defines the plain types; an
adapter (per side) translates to/from the runtime representation.

**Dependencies.**

- **Blocks:** A1 (depends on the contracts package existing).
- **Cross-package:** introduces a third workspace package — asks-first per
  [boundaries.md](../boundaries.md).
- **Leveraged by:** `phaseLabel` becomes exhaustively typed; tests on both
  sides share fixtures.

**Notes.**

- Out of scope for A1 even after A1 lands — keep A1 surgical and treat A3 as
  its own ticket.
- Cross-package work → likely needs an ADR before code lands.

---

## A4 · Reconcile the auth form boundaries — `Speculative`

**Status:** independent of A1–A3.

**Files**

- `src/components/Form/LoginForm/LoginForm.tsx`
- `src/components/Form/SignUpForm/SignUpForm.tsx`
- `src/components/Form/ForgotPasswordForm/ForgotPasswordForm.tsx`
- `src/components/Form/UpdatePasswordForm/UpdatePasswordForm.tsx`
- `src/components/Form/JoinForm/JoinForm.tsx` (also touched by A1)

**Problem.** Five forms, two execution paths. `LoginForm` and `SignUpForm`
go through server actions; the other three call Supabase from the client.
Each form duplicates the `<Card>` / `<CardHeader>` / `<Input>` / error-block
scaffolding. The execution-path inconsistency is invisible from the outside
but real: error UX drifts, and the contract for what a server action returns
vs what `supabase.auth.*` returns is two different shapes.

**Solution.** A thin `<AuthForm>` scaffold and a `useAuthAction` /
`useSupabaseAuth` adapter pair. Each form declares schema + adapter
choice; scaffolding stays out of the form.

**Seam.** The seam sits between the auth adapter (server action vs Supabase
client) and the form component. The scaffold doesn't care which.

**Dependencies.**

- **Independent** of A1–A3. (Tactical overlap: `JoinForm` is also touched
  by A1; do the A1 refactor first, then route `JoinForm` through the
  scaffold if A4 lands.)
- **Cross-package:** none.

**Notes.**

- Lower leverage than A1–A3 because the auth forms change rarely after the
  initial scaffold lands.
- If A1 lands and `JoinForm` is consumed by the membership module's
  `claim()` action, A4 becomes a 4-form problem rather than 5.

---

## Dependency graph

```
A1 ──► A2   (A2 needs `me` from A1's context)
A1 ──► A3   (A3 exports the Player type A1 consumes)
A4          (independent)
```

**Critical path:** A1 → A2 → (later) night-phase UI; A1 → A3 → shared
contracts.

---

## Round 1 grill — settled for A1

- **Q1 (interface shape):** A — provider + imperative `claim()`. Context
  value carries the action method (`{ ...membership, claim, clear }`) so
  consumers re-render with fresh state. Module also exports pure
  `resolveMembership()` / `performClaim()` for non-React callers (tests).
- **Q2 (claim semantics):** A (revised 2026-09-18). `claim(roomId, name)` is
  the one identity-writing function, with no flags. A separate
  `setHostClaim(roomId, guestId)` action owns the host-claim write.
  `CreateGame` calls `setHostClaim` after `client.create`; the host still
  goes through `JoinForm` like any other player.
- **Q3 (token lifecycle):** A — owned by the membership module, mounted at
  `app/room/[roomId]/layout.tsx`, NOT `app/layout.tsx`. Provider watches
  `roomId` via `useEffect` and re-rehydrates on param change.

## Round 2 grill — settled for A1

- **N1 (host display name source):** cancelled. The host enters their
  display name in `JoinForm` like any other player. The `asHost: true`
  API variant was a misframe.

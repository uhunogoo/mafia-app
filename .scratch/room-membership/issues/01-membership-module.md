# 01: Pure RoomMembership module + mocha test suite

**What to build:** A new pure module at `src/lib/membership/` that owns every piece of room-membership state, the storage keys, the precedence rules, and the writes. From the outside, a developer can `import { resolveMembership, performClaim, performSetHostClaim, performSetToken, createBrowserSources, createMemorySources, ... } from '@/lib/membership'` and exercise every branch in `node` without a browser, React, or Colyseus. The test suite runs green under mocha.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [x] `src/lib/membership/index.ts` exports `Sources`, `Membership`, `ClaimInput`, `SetHostClaimInput`, `SetTokenInput`, `resolveMembership`, `performClaim`, `performSetHostClaim`, `performSetToken`, `createBrowserSources`, `createMemorySources`, and `PlayerIdentity` (moved from `src/lib/identity.ts`).
- [x] `createBrowserSources()` reads/writes `window.localStorage`, `window.sessionStorage`, and reads `window.location.hash` via the `Sources` interface.
- [x] `createMemorySources()` returns an in-memory adapter for tests with no DOM dependency.
- [x] Storage key shapes match the spec: `player:<roomId>` (local), `room_<roomId>_token` (session), `room_<roomId>_hostClaim` (session), `token` (hash).
- [x] `resolveMembership` returns a `Membership` whose `sources` field reflects whether each piece came from `'hash'`, `'session'`, `'storage'`, or `null`.
- [x] `performClaim` returns the current `Membership` unchanged when `input.name.trim()` is `''` (no write to `Sources`).
- [x] `performClaim` with a non-empty name and no `hostClaim` writes an identity with a freshly generated `password`.
- [x] `performClaim` with a non-empty name and a present `hostClaim` writes an identity using that `hostClaim` as the `password`.
- [x] `performSetHostClaim` writes `hostClaim` to session storage and returns the updated `Membership`.
- [x] `performSetToken` writes `token` to session storage and returns the updated `Membership`.
- [x] `package.json` declares `mocha`, `tsx`, and `@types/mocha` as devDependencies (versions matched to the mafia-server package for consistency: `mocha ^11.7.5`, `tsx`, `@types/mocha ^10.0.1`).
- [x] `package.json` has a `test` script that runs `mocha -r tsx 'src/**/*.test.ts' --exit`.
- [x] `src/lib/membership/membership.test.ts` exists and covers every branch listed in the spec (hash/session/none token, identity present/absent, hostClaim present/absent, empty-name no-op) by asserting what was recorded at the seam and what `Membership` was returned.
- [x] `npm test`, `npm run lint`, and `npm run build` all pass.

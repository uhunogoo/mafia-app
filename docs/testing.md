# Testing

This project has two kinds of tests, in two places.

## Game server (Colyseus)

Tests live in the **sibling package** `../mafia-server`.

- Stack: **mocha** + **@colyseus/testing**.
- Run: `npm test` (from `../mafia-server`). See
  [commands.md](./commands.md) for how to start the server itself.
- These cover room logic (гравці, фази, etc.). The client does not currently
  have a matching test layer — when adding server behaviour, add a test in
  `../mafia-server` first.

## Client (`src/`)

Pure-logic modules are tested with **mocha** + **tsx** (no DOM, no React).
The seam is the module's own dependency, not a browser global — for example
`src/lib/membership/` exposes a `Sources` interface and is tested via an
in-memory adapter (`createMemorySources`).

- Run: `npm test` (from this package).
- Add a new file at `src/<area>/<thing>.test.ts`. Mocha picks up any
  `*.test.ts` under `src/`.

## UI text

- **All user-visible UI strings are in Ukrainian.** Do not write English copy
  into components; if you must, ask first.

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

## UI text

- **All user-visible UI strings are in Ukrainian.** Do not write English copy
  into components; if you must, ask first.

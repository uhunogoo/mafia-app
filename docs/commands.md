# Commands

Standard scripts live in `package.json`. Only the non-obvious ones are noted
here.

## This package (Next.js client)

- Install deps: `npm install`.
- Dev server: `npm run dev`.
- Production build: `npm run build`.
- Lint: `npm run lint`.

## Game server (`../mafia-server`)

The Colyseus server is a **separate package** in the sibling directory.

- Start server (port 2567): `npm start` (run from `../mafia-server`).
- Run server tests: `npm test` (run from `../mafia-server`). See
  [testing.md](./testing.md) for the test stack.

# Architecture

Read this when adding files, creating components, or wiring up new providers.

## Rendering model

- **Server Components by default.** `'use client'` is opt-in.
- Mark a file `'use client'` only when it actually needs client-side features:
  stateful UI (`useState`, `useReducer`), browser APIs, event handlers attached
  to the DOM, real-time / WebSocket integrations (e.g. Colyseus), or React
  Context Providers.
- The parenthetical "(canvas, local state)" from the original is **examples,
  not exhaustive** — providers, hooks, and real-time integrations are also
  legitimate reasons for `'use client'`.

## Where state lives

- **Auth state** → Supabase SSR clients in `src/lib/supabase/*`. Use the
  helpers `getCurrentUser` / `requireUser` from `src/lib/supabase/auth.ts`.
- **Room state (гравці, фази)** → **only** through Colyseus, via
  `src/components/Providers/RoomConnectionProvider`. Supabase never stores room
  state; do not introduce a parallel source of truth.

## Folder layout

```
src/
├── app/                # routes
│   ├── (main)/         # pages with header
│   └── room/[roomId]/  # full-screen, no header, open to guests
├── components/         # folder-per-component, see below
│   └── Providers/<ProviderName>/  # provider + context in ONE file
├── constants.ts        # shared constants
├── hooks/              # custom hooks, kebab-case: use-foo.ts
└── lib/                # clients, server actions, zod validations
```

### Components (`src/components/`)

- **Folder-per-component** in PascalCase, with a barrel `index.ts`:

  ```
  ComponentName/
  ├── ComponentName.tsx
  └── index.ts          # re-exports the component
  ```

- Group related components in subfolders: `Form/`, `Room/`, `UI/`.
- Shared component constants live in `src/constants.ts`.
- One-off hooks live in `src/hooks/use-foo.ts` (kebab-case).

### Providers (`src/components/Providers/<ProviderName>/`)

A provider folder contains **the provider + its context in one file**:

- **Context** is a **named export**.
- **Provider** is the **default export**.
- Consumers read context **directly via `React.useContext`**, with an explicit
  throw-guard for nullable cases. **Do not** create wrapper hooks
  (`useAuth()`, `useRoom()`, etc.) in the provider file — if a hook is worth
  extracting, put it in `src/hooks/use-foo.ts`.

## App routes (`src/app/`)

- `(main)/` — pages that show the site header.
- `room/[roomId]/` — full-screen game room, no header, **open to guests**
  (no auth gate).

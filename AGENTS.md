<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Tech Stack
TypeScript, Next.js 16 (App Router), React 19, Zustand, Zod, Tailwind CSS v4, @colyseus/react.

## Commands
- Install: `npm install`
- Dev: `npm dev`
- Build: `npm build`
- Unit tests: `npm vitest run`
- Lint: `npm lint`

## Architecture
- Server Components by default. `'use client'` only for
  interactivity (canvas, local state).
- All DB queries — only via Route Handlers or Server Actions.
- Client components NEVER access Supabase directly.
- Structure: `src/components` (UI), `src/lib` (supabase clients, utils),
  `src/app` (routes).

## Boundaries
Always:
- Validate input data with Zod at the Server Action / Route Handler boundary.
Ask first:
- Before adding new dependencies.

Never:
- Use the `service_role` key on the client.
- Call Supabase directly from a client component.
- Use `NEXT_PUBLIC_` for secrets.
- Use inline `style={{}}` — only Tailwind utility classes
  and `@theme` tokens.

## Testing
Vitest — for business logic (`src/lib`, server actions).
Playwright — for critical E2E flows (auth, checkout, etc.).

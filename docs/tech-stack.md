# Tech Stack

Read this when picking libraries, deciding on file conventions, or troubleshooting
framework-specific behaviour.

- **Language**: TypeScript.
- **Framework**: Next.js 16 (App Router, `proxy.ts` замість middleware).
- **UI**: React 19.
- **Validation**: Zod (at the Server Action / Route Handler boundary — see
  [boundaries.md](./boundaries.md)).
- **Styling**: Tailwind CSS v4. No inline `style={{}}` — utility classes and
  `@theme` tokens only (see [code-style.md](./code-style.md)).
- **Auth**: Supabase (SSR clients under `src/lib/supabase/*`; helpers
  `getCurrentUser` / `requireUser` in `src/lib/supabase/auth.ts`).
- **Real-time / game state**: Colyseus (`@colyseus/react` + `@colyseus/sdk`) —
  the ігровий сервер lives in the sibling directory `../mafia-server`.

> **Next.js caveat**: this is NOT the Next.js you may remember. APIs,
> conventions, and file structure may differ from older training data. See the
> auto-injected notice at the top of the root [AGENTS.md](../AGENTS.md) and read
> the relevant guide in `node_modules/next/dist/docs/` before writing code.

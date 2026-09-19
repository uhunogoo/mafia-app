<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mafia Game

Multiplayer online Mafia: Next.js 16 client + Colyseus game server.

**Stack:** TypeScript, Next.js 16 (App Router, `proxy.ts`), React 19, Zod,
Tailwind v4, Supabase (auth), Colyseus.

## Non-obvious rules (every task)

- Validate input with Zod at the Server Action / Route Handler boundary.
- Ask first before adding new dependencies.
- Never: `service_role` on the client · `NEXT_PUBLIC_` for secrets ·
  inline `style={{}}` (Tailwind utilities and `@theme` tokens only).

Full version, with rationale: [docs/boundaries.md](./docs/boundaries.md).

## Detailed docs

- [docs/README.md](./docs/README.md) — index of all topic files.
- [docs/tech-stack.md](./docs/tech-stack.md) — technologies and versions.
- [docs/commands.md](./docs/commands.md) — dev / build / lint / game server.
- [docs/architecture.md](./docs/architecture.md) — folder layout, RSC,
  providers.
- [docs/code-style.md](./docs/code-style.md) — Joy of React conventions.
- [docs/boundaries.md](./docs/boundaries.md) — always / ask first / never.
- [docs/testing.md](./docs/testing.md) — mocha + UI text language.

## Agent skills

### Issue tracker

Local markdown under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: one root `CONTEXT.md` plus `docs/adr/`. See `docs/agents/domain.md`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Tech Stack
TypeScript, Next.js 16 (App Router, `proxy.ts` замість middleware), React 19, Zod, Tailwind CSS v4, Supabase (auth), Colyseus (`@colyseus/react` + `@colyseus/sdk`) — ігровий сервер у сусідньому каталозі `../mafia-server`.

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Ігровий сервер: `npm start` у `../mafia-server` (порт 2567), його тести: `npm test` там само.

## Architecture
- Server Components by default. `'use client'` only for
  interactivity (canvas, local state).
- Auth — через Supabase SSR-клієнти (`src/lib/supabase/*`);
  хелпери `getCurrentUser` / `requireUser` у `src/lib/supabase/auth.ts`.
- Room state (гравці, фази) — только через Colyseus
  (`src/components/Providers/RoomConnectionProvider`);
  Supabase не зберігає стан кімнати.
- Structure: `src/components` — folder-per-component у PascalCase з барелем
  `index.ts` (`ComponentName/ComponentName.tsx`), групи `Form/`, `Room/`, `UI/`;
  провайдери в `Providers/<ProviderName>/` — провайдер + його контекст
  в одному файлі (контекст — named export, провайдер — default); компоненти
  читають контекст напряму через `React.useContext` (з явним throw-guard-ом
  для nullable), без хуків-обгорток у файлі провайдера; спільні константи —
  `src/constants.ts`, окремі хуки — `src/hooks/use-*.ts` (kebab-case).
  `src/lib` (clients, actions, validations), `src/app` (routes; `(main)` —
  сторінки з хедером, `room/[roomId]` — без хедера, відкрита для гостей).
- Components пишемо в стилі Joy of React (skill
  `joy-of-react-tailwind-style`): function-декларації з `export default`
  в кінці файла, хуки через `React.useX`, обробники `handleX` як
  function-декларації, варіанти стилів через lookup-об'єкти.

## Boundaries
Always:
- Validate input data with Zod at the Server Action / Route Handler boundary.
Ask first:
- Before adding new dependencies.

Never:
- Use the `service_role` key on the client.
- Use `NEXT_PUBLIC_` for secrets.
- Use inline `style={{}}` — only Tailwind utility classes
  and `@theme` tokens.

## Testing
Тести кімнати — `npm test` у `../mafia-server` (mocha + @colyseus/testing).
UI-тексти — українською.

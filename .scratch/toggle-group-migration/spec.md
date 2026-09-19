Status: ready-for-agent

# Spec · Radix Toggle Group adoption

## Problem Statement

The Mafia web client's `RoomSidebar` (host view) ships a hand-rolled `role="radiogroup"` segmented control for the player-count selector (10 / 11 / 12). It works, but the ARIA contract is hand-coded at the call site: no arrow-key roving tabindex, no single point of truth for `disabled`, and the responsibility of "what does a grouped selection control look like in this app?" lives nowhere centralised. Every future grouped-selection call site would either repeat the same hand-rolled pattern or fork it. The user wants to adopt the canonical `@radix-ui/react-toggle-group` primitive to (a) improve keyboard accessibility, (b) reduce hand-rolled ARIA, and (c) give the next consumer a shared component to drop in.

## Solution

Wrap `@radix-ui/react-toggle-group` in a new shared UI module — `ToggleGroup` and `ToggleGroupItem` — under the existing `src/components/UI/` directory. Expose both `type="single"` and `type="multiple"` so multi-select is available without a second migration. Mirror the existing `Button` / `Dialog` styling conventions: CVA-driven `variant` + `size`, `cn(...)` for class merging, named exports, no default export inside the module. Migrate `RoomSidebar`'s player-count selector to consume the new primitive in `type="single"` controlled mode; everything call-site-specific (layout, disabled handling, value coercion) stays in `RoomSidebar`. Document the decision in one ADR. Defer any `ThemeToggle` standardisation to a separate, intentional PR.

## User Stories

1. As a **room host** (player), I want to select the player count with Tab + arrow keys, so that I can configure without a mouse.
2. As a **keyboard-only user**, I want Tab to enter the group once and arrow keys to move inside it, so that I can navigate at speed.
3. As a **screen-reader user**, I want the group to be announced as a radio group with one option currently selected, so that I can configure without sight.
4. As a **room host mid-disconnect**, I want the player-count selector to be inert while the Colyseus room is unavailable, so that I don't send toggles to a dead room.
5. As a **developer adding a future grouped selection control** (e.g. vote target picker, role preset picker), I want a shared `ToggleGroup` primitive already in `src/components/UI/`, so that I don't reinvent the ARIA again.
6. As a **developer needing multi-select tomorrow**, I want the wrapper to already support `type="multiple"` with the right `value` type narrowing, so that the next multi-select consumer doesn't need a second primitive.
7. As a **reviewer reading this PR**, I want to see a single ADR explaining why Radix was chosen and what counts as in-scope vs. out-of-scope, so that I can validate the trade-off in one read.
8. As a **future developer touching `ThemeToggle`**, I want the ADR to explicitly state this PR does NOT migrate it, so that I know the omission is deliberate.
9. As a **maintainer of the UI module**, I want `ToggleGroup` and `ToggleGroupItem` to live alongside `Button`, `Card`, `Dialog`, `Label`, so that the directory matches my mental model.
10. As a **stylist** wiring design tokens, I want `ToggleGroupItem` to accept the same `variant` + `size` CVA shape as `Button`, so that design tokens stay consistent across primitives.
11. As a **TypeScript user**, I want the `value` / `onValueChange` types to narrow with the `type` prop (`string` for single, `string[]` for multiple), so that misuse is a compile-time error.
12. As a **mobile / touch user**, I want the option buttons to keep their tap target and clear selected/unselected look, so the migration doesn't regress touch UX.
13. As a **player refreshing mid-config**, I want the chosen count to persist, so that a refresh doesn't reset it (Colyseus state survival, preserved by the migration).
14. As an **accessibility auditor**, I want the hand-rolled `role="radiogroup"` block to disappear from `src/`, so the canonical primitive list reflects the truth.

## Implementation Decisions

### Dependency

- **NEW dep:** `@radix-ui/react-toggle-group`, added to `dependencies` in `package.json`. Version pinned with `^` to match sibling Radix deps in this repo (`^1.1.23`, `^2.1.14`, etc.).
- **No other Radix packages added in this PR.** `@radix-ui/react-toggle` (the single-button sibling primitive) is intentionally NOT installed.

### Modules

- **NEW `src/components/UI/ToggleGroup/ToggleGroup.tsx`** — wraps Radix headless primitives. Exposes:
  - `ToggleGroup` — wraps `ToggleGroupPrimitive.Root`. Accepts `type: "single" | "multiple"`, controlled `value` + `onValueChange`, supports `aria-label`, `disabled`, `className`, plus standard `div`-shaped props via `React.ComponentProps<typeof ToggleGroupPrimitive.Root>` (minus the parts the discriminated union re-types).
  - `ToggleGroupItem` — wraps `ToggleGroupPrimitive.Item`. Accepts the same shape as a button (`value`, `disabled`, `onClick`, etc.) plus `VariantProps<typeof toggleVariants>`.
  - `toggleVariants` — exported CVA with `variant: default | outline` and `size: sm | default | lg | icon`, mirroring `buttonVariants` in `Button.tsx`.
- **NEW `src/components/UI/ToggleGroup/index.ts`** — barrel re-exporting the named exports.
- **MODIFIED `src/components/Room/RoomSidebar/RoomSidebar.tsx`** — replaces the hand-rolled `role="radiogroup"` block (currently lines 74–98) with the new primitive. The call-site wrapper keeps the container layout classes (`grid grid-cols-3 gap-1 rounded-lg border p-1`) and the `aria-label="Кількість гравців"`. Value coercion (`maxPlayers: Number(v)`) lives in the call site before `room.send('setMaxPlayers', …)`. The per-item `disabled={!room}` collapses into a single root-level `disabled={!room}` (Radix propagates to items).

### API shape

```ts
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

export interface ToggleGroupSingleProps
  extends Omit<
    React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
    'type' | 'value' | 'onValueChange' | 'defaultValue'
  > {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface ToggleGroupMultipleProps
  extends Omit<
    React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
    'type' | 'value' | 'onValueChange' | 'defaultValue'
  > {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;
```

The discriminated union narrows `value` and `onValueChange` based on `type`, so callers get a compile-time error if they wire the wrong shape.

### `toggleVariants` CVA (decision-rich)

```ts
export const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-transparent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        outline:
          'border border-input bg-transparent shadow-xs data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-4',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
```

The `data-[state=on]` selectors are what differentiates "selected" from "unselected" — Radix sets `data-state` on each item automatically. The selected look uses `--accent` / `--accent-foreground` so it picks up the project's theme tokens (light/dark).

### Composition pattern

- Mirrors `Dialog.tsx` and `Button.tsx`: named exports from `ToggleGroup.tsx`, no default export, `cn(...)` for class merging, no inline `style={{}}`.
- The wrapper does not impose layout on its container (no opinion on `grid` vs `flex`, no padding / border). It only styles the items themselves. Container visual rhythm stays in the call site.
- The wrapper forwards standard `div` props onto Radix's `Root`; consumers may pass `asChild` only via the Radix type if a custom inner element is needed.

### Migration compatibility

- Colyseus `maxPlayers` state survives the migration: the wrapper takes a `string` `value`, `RoomSidebar` coerces via `Number(v)` before sending to the room.
- Visible rhythm — bordered container, three equal columns, rounded selected item — is preserved by keeping `grid grid-cols-3 gap-1 rounded-lg border p-1` on the call-site wrapper around the `ToggleGroup`.
- `aria-label="Кількість гравців"` moves from the call-site `div` (which had `role="radiogroup"`) to the new `ToggleGroup`; Radix picks it up on the group element.

### Accessibility improvements inherited from Radix (informational)

- **Roving tabindex** — Tab enters the group once; arrow keys move between options; Home / End jump to first / last. The hand-rolled impl doesn't have this.
- **Proper `role="radiogroup"` + `role="radio"`** for `type="single"`; `role="group"` + `role="checkbox"` semantics for `type="multiple"`.
- **`aria-checked`** on items handled by Radix.
- **Disabled propagation** from a single `disabled` prop on the group.
- **Focus-visible** styling via `data-[state=on]` + `focus-visible:ring-1`, consistent with the rest of the UI primitives.

## Testing Decisions

- **What makes a good test:** external behaviour at the existing seams — TypeScript compiles, Tailwind resolves the class names, the production build succeeds, and a manual dev-server smoke confirms the runtime contract. There is no UI test framework in this repo today (no React Testing Library, no Vitest, no Playwright — see `docs/testing.md`), so adding one is out of scope.
- **Modules to be tested:** none in this PR (no test layer).
- **Prior art for verification:**
  - `npm run lint` — same ESLint + TypeScript pass used by every other PR.
  - `npm run build` — same Next.js production build pass (class-name extraction, type errors, dep resolution).
  - Dev-server smoke — `npm run dev`, log in as host, exercise the selector.
- **Manual coverage** (record in PR description):
  - Host panel renders the player-count row with the same visual rhythm as before.
  - Default value (`maxPlayers ?? DEFAULT_MAX_PLAYERS = 10`) renders selected.
  - Mouse click and keyboard arrows both change the value and trigger `room.send('setMaxPlayers', …)`.
  - With no `room`, the group is inert (every item disabled).
  - Screen reader (NVDA / VoiceOver) announces "Кількість гравців, radio group, 1 of 3" and the currently selected option.

## Out of Scope

- **Migrating `ThemeToggle` to `@radix-ui/react-toggle`.** Deliberately deferred to a separate PR; the ADR records this. `ThemeToggle` continues to use the project's `Button` + `next-themes`.
- **Adding `@radix-ui/react-toggle` as a dep.** Not installed in this PR.
- **Adding a UI test framework** (Vitest, RTL, Playwright). The repo has none today.
- **Visual redesign** of the player-count selector. Rhythm is preserved, not changed.
- **Other toggle-group-shaped call sites.** None exist in the codebase beyond `RoomSidebar`.
- **Refactoring other UI primitives** (`Button`, `Dialog`, `Card`, `Label`) to use the new `ToggleGroup` conventions.
- **Adding `CONTEXT.md`.** No new domain term surfaced. `ToggleGroup` is technical infrastructure, not domain vocabulary; the lazy-create rule is respected.
- **Changing `boundaries.md`, `docs/code-style.md`, or `docs/tech-stack.md`.**

## Further Notes

- **Recommended commit shape** for the single feature branch:
  1. `feat(ui): add ToggleGroup primitive` — adds `src/components/UI/ToggleGroup/`, updates `package.json`.
  2. `refactor(room): migrate RoomSidebar player-count selector to ToggleGroup` — replaces the hand-rolled radiogroup block.
  3. `docs(adr): 0001 — adopt @radix-ui/react-toggle-group for grouped selection` — adds `docs/adr/0001-radix-toggle-group.md`.
- **Follow-up PR candidate:** when the first multi-select requirement lands (vote target picker, etc.), the wrapper is already type-safe for it — the follow-up is a single call-site migration.
- **Version pinning:** `@radix-ui/react-toggle-group` lands at the same `^X.Y.Z` shape as the rest of the Radix family in `package.json`.
- The repo's `components.json` (shadcn new-york) doesn't ship its own ToggleGroup block; this primitive is hand-written to match the project's conventions rather than generated by the shadcn CLI.
- **Verification trap to avoid:** the `data-[state=on]:bg-accent` selected look only paints correctly under both light and dark themes if `--accent` is registered in `globals.css`. The Tailwind v4 theme tokens are already there for the rest of the primitives — no theme work is needed for this PR, but a dev-server smoke in both themes is cheap and worth doing.

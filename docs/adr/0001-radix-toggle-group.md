# ADR-0001 — Adopt `@radix-ui/react-toggle-group` for grouped selection

- **Status:** Accepted
- **Date:** 2026-09-19
- **Deciders:** Mafia web client maintainers

## Context

The Mafia web client's `RoomSidebar` (host view) shipped a hand-rolled
`role="radiogroup"` segmented control for the player-count selector (10 / 11 / 12).
The block worked, but the ARIA contract was maintained at the call site:

- `role="radiogroup"` on a wrapper `<div>` plus `role="radio"` and
  `aria-checked` on each option button.
- No **roving tabindex** — Tab left and re-entered the group on every option,
  which is the wrong keyboard model for a grouped selection control.
- `disabled` was repeated per item rather than propagated from a single root
  flag.
- The "what does a grouped selection control look like in this app?" decision
  lived nowhere central. Any future consumer (a vote target picker, a role
  preset picker, etc.) would either repeat the same hand-rolled pattern or fork
  it.

The repository already uses several `@radix-ui/*` packages as the canonical
headless primitives layer for the UI module (`react-dialog`, `react-dropdown-menu`,
`react-label`, `react-slot`), so adopting a sibling primitive is the same
direction the codebase has already taken for the rest of the UI module.

## Decision

Adopt **`@radix-ui/react-toggle-group`** as the canonical grouped-selection
primitive in this app. Ship a thin wrapper at
`src/components/UI/ToggleGroup/`, exposing three named exports:

- **`ToggleGroup`** — wraps `ToggleGroupPrimitive.Root`. Accepts a
  discriminated `type: 'single' | 'multiple'` prop. The wrapper does **not**
  impose layout on its container; call sites own the visual rhythm.
- **`ToggleGroupItem`** — wraps `ToggleGroupPrimitive.Item`. Accepts
  `VariantProps<typeof toggleVariants>` so it picks up the same `variant` and
  `size` vocabulary as `Button`.
- **`toggleVariants`** — CVA with `variant: default | outline` and
  `size: sm | default | lg | icon`, mirroring `buttonVariants` in `Button.tsx`.
  Selected-state styling uses `data-[state=on]:bg-accent` and
  `data-[state=on]:text-accent-foreground` so it inherits the existing
  `--accent` / `--accent-foreground` theme tokens.

The wrapper's `value` / `onValueChange` / `defaultValue` props narrow on
`type`: a `'single'` group pairs with `value?: string` (and a
`(value: string) => void` handler), a `'multiple'` group pairs with
`value?: string[]` (and a `(value: string[]) => void` handler). Misuse is a
compile-time error.

The validating example is the `RoomSidebar` player-count selector, which now
consumes `<ToggleGroup type="single">` instead of the hand-rolled radiogroup
block. `aria-label="Кількість гравців"` is set on the root; Radix forwards it
to its group element. Visible rhythm (bordered container, three equal columns,
1 px gap, rounded selected item) is preserved by keeping
`grid grid-cols-3 gap-1 rounded-lg border p-1` on the call-site `className`.

## Dependency approval

Per `docs/boundaries.md`, new dependencies require explicit user approval
before `package.json` is touched. That approval was granted as part of the
implementation request that produced this ADR (the user invoked the
implementation flow on the issue set that explicitly lists the new dep as a
checkbox). `@radix-ui/react-toggle-group@^1.1.19` is added to `dependencies`
with the same `^X.Y.Z` shape as sibling Radix packages in this repo.

## Consequences

### In-scope (this PR ships)

- `src/components/UI/ToggleGroup/ToggleGroup.tsx` — the wrapper module.
- `src/components/UI/ToggleGroup/index.ts` — the barrel.
- `src/components/Room/RoomSidebar/RoomSidebar.tsx` — migration of the
  player-count selector to `<ToggleGroup type="single">`.
- `package.json` — `@radix-ui/react-toggle-group@^1.1.19` in `dependencies`.
- The ADR itself (`docs/adr/0001-radix-toggle-group.md`).

### Accessibility improvements inherited from Radix

- **Roving tabindex** — Tab enters the group once; arrow keys move between
  options; Home / End jump to first / last. The hand-rolled impl did not have
  this.
- Proper `role="radiogroup"` + `role="radio"` for `type="single"`; `role="group"`
  + `role="checkbox"` semantics for `type="multiple"`.
- `aria-checked` handled by Radix, not maintained by hand.
- `disabled` propagation from a single root-level prop.
- `focus-visible` ring consistent with the rest of the UI primitives.

### Out-of-scope (deliberately deferred)

- **Migrating `ThemeToggle` to `@radix-ui/react-toggle`.** The single-button
  sibling primitive is intentionally **not** installed. `ThemeToggle`
  continues to use the project's `Button` + `next-themes`. This omission is
  deliberate; a future PR can revisit it independently.
- **Adding `@radix-ui/react-toggle` as a dep.** Not installed here.
- **Adding a UI test framework** (Vitest / React Testing Library / Playwright).
  The repo has no UI test layer today; `docs/testing.md` records this. Adding
  one to test a primitive migration would conflate two changes; the existing
  `npm run lint` + `npm run build` checks are the verification gate for this
  PR.
- **Refactoring other UI primitives** (`Button`, `Dialog`, `Card`, `Label`,
  `Input`, `StatusMessage`, `Title`) to consume the new conventions. Each
  primitive owns its decision independently.
- **Visual redesign** of the player-count selector. Rhythm is preserved, not
  changed.
- **Adding `CONTEXT.md`.** No new domain term surfaced — `ToggleGroup` is
  technical infrastructure, not domain vocabulary. The lazy-create rule from
  `docs/agents/domain.md` is respected.

## Follow-up candidates

- When the first multi-select requirement lands (vote target picker, role
  preset picker, etc.), the wrapper is already type-safe for it — the
  follow-up is a single call-site migration.
- A future PR may revisit `ThemeToggle` against `@radix-ui/react-toggle` once
  the grouped-selection primitive has settled.

## References

- Spec: `.scratch/toggle-group-migration/spec.md`
- Implementing tickets: `.scratch/toggle-group-migration/issues/01-add-toggle-group-primitive.md`,
  `.scratch/toggle-group-migration/issues/02-migrate-roomsidebar-player-count.md`,
  `.scratch/toggle-group-migration/issues/03-write-adr-radix-toggle-group.md`
- Dependency boundary: `docs/boundaries.md` (the "ask first" rule)
- Theme tokens: `src/app/globals.css`

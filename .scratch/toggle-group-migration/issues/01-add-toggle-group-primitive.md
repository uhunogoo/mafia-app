# 01: Add ToggleGroup UI primitive

**What to build:** A new shared UI module — `ToggleGroup` and `ToggleGroupItem` — under `src/components/UI/ToggleGroup/`, wrapping `@radix-ui/react-toggle-group` so any future grouped-selection control (vote target picker, role preset picker, etc.) has a canonical, accessible primitive to drop in. Both `type="single"` and `type="multiple"` are supported through a discriminated union so misuse is a compile-time error. The wrapper itself adds no opinionated layout; it only styles the items.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] User has explicitly approved adding `@radix-ui/react-toggle-group` as a new runtime dependency. This is required by `docs/boundaries.md` ("ask first before adding new dependencies") and must be confirmed in this turn before `package.json` is touched.
- [ ] `@radix-ui/react-toggle-group` is added to `dependencies` in `package.json`, pinned with the same `^X.Y.Z` shape used for sibling Radix packages in this repo.
- [ ] `src/components/UI/ToggleGroup/ToggleGroup.tsx` exists and exports named `ToggleGroup`, `ToggleGroupItem`, and `toggleVariants`. No default export from this file.
- [ ] `src/components/UI/ToggleGroup/index.ts` barrel re-exports the named exports, matching the barrel shape used by `Button/index.ts`, `Dialog/index.ts`, `Card/index.ts`, `Label/index.ts`.
- [ ] `ToggleGroupProps` is a discriminated union where `type: 'single'` pairs with `value?: string` (and a `(value: string) => void` handler), and `type: 'multiple'` pairs with `value?: string[]` (and a `(value: string[]) => void` handler). The original `value` / `onValueChange` / `defaultValue` keys are `Omit`-ted from the underlying Radix props so the union is the source of truth.
- [ ] `toggleVariants` is a CVA with `variant: default | outline` and `size: sm | default | lg | icon`, mirroring `buttonVariants` from `Button.tsx`. Selected-state styling uses `data-[state=on]:bg-accent data-[state=on]:text-accent-foreground` so it picks up the existing `--accent` / `--accent-foreground` theme tokens (verified under both light and dark themes — see "Verification trap" in the spec).
- [ ] Composition mirrors `Button` and `Dialog`: `cn(...)` for class merging, no inline `style={{}}`, named exports only.
- [ ] No call site in `src/` is updated by this ticket; the primitive is unconsumed at this point. That is expected — the migration lives in ticket 02.
- [ ] `npm run lint` exits 0.
- [ ] `npm run build` exits 0.

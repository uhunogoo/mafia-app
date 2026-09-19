# 03: Write ADR-0001 — adopt @radix-ui/react-toggle-group

**What to build:** A new ADR (`docs/adr/0001-radix-toggle-group.md`) that records the decision to adopt `@radix-ui/react-toggle-group` as the canonical grouped-selection primitive in this app. The ADR cites the migration done in ticket 02 as the validating example, and it explicitly enumerates what is out of scope so a future reader can answer "why Radix?", "what counts as in scope?", and "what about `ThemeToggle`?" from a single document instead of re-deriving it from the diff.

**Blocked by:** 02 (Migrate RoomSidebar player-count selector to ToggleGroup) — the ADR cites the concrete shipped migration as its validating example, so it is grounded only after the migration has landed.

**Status:** ready-for-agent

- [ ] `docs/adr/` directory is created (it does not exist in this repo today).
- [ ] `docs/adr/0001-radix-toggle-group.md` exists, numbered `0001` to leave room for future ADRs.
- [ ] The file follows the standard ADR shape (Context, Decision, Consequences, or an equivalent in this repo's house style) and is written for future readers — not for the author of the diff.
- [ ] **Context** explains the prior state: hand-rolled `role="radiogroup"` in `RoomSidebar`, no shared grouped-selection primitive, keyboard and screen-reader semantics maintained at the call site.
- [ ] **Decision** records: we adopt `@radix-ui/react-toggle-group` and ship a thin wrapper at `src/components/UI/ToggleGroup/` exposing `ToggleGroup`, `ToggleGroupItem`, and `toggleVariants`. Both `type="single"` and `type="multiple"` are supported via a discriminated union.
- [ ] **Consequences / In-scope** lists what this PR ships: the new primitive, the `RoomSidebar` migration, and the dependency addition.
- [ ] **Consequences / Out-of-scope** explicitly records each of:
  - Migrating `ThemeToggle` to `@radix-ui/react-toggle` (deferred to a separate, intentional PR).
  - Adding `@radix-ui/react-toggle` as a dependency (not installed in this PR).
  - Adding a UI test framework (Vitest / RTL / Playwright) — repo has none today and `docs/testing.md` records this.
  - Refactoring other UI primitives (`Button`, `Dialog`, `Card`, `Label`, `Input`, `StatusMessage`, `Title`) to consume the new conventions.
  - Visual redesign of the player-count selector — visual rhythm is preserved, not changed.
- [ ] The ADR notes the **dependency-approval gate** from `docs/boundaries.md` was followed (user confirmed `@radix-ui/react-toggle-group` before `package.json` was touched) so a future contributor knows the approval was explicit, not implicit.
- [ ] The ADR cross-references the spec at `.scratch/toggle-group-migration/spec.md` and the implementing tickets at `.scratch/toggle-group-migration/issues/01-…` and `02-…`.
- [ ] `npm run lint` and `npm run build` are unaffected (the ADR is documentation only) — confirm both still exit 0 to catch any stray file-format or frontmatter issues that surface as build warnings.

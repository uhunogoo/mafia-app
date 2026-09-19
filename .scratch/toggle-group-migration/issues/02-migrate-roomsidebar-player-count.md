# 02: Migrate RoomSidebar player-count selector to ToggleGroup

**What to build:** Replace the hand-rolled `role="radiogroup"` block in `RoomSidebar` (host view) with the new `ToggleGroup` primitive so the room host can configure the player count (10 / 11 / 12) with full keyboard accessibility (Tab enters once, arrow keys move between options), correct screen-reader semantics, and a single source of truth for `disabled`. Visible rhythm and Colyseus state survival are preserved — no user-visible behaviour regression, only an accessibility upgrade and the removal of hand-rolled ARIA from the codebase.

**Blocked by:** 01 (Add ToggleGroup UI primitive) — the call site consumes the primitive shipped there.

**Status:** ready-for-agent

- [ ] `RoomSidebar.tsx` no longer contains a `<div role="radiogroup">` block. The hand-rolled ARIA disappears entirely from `src/` after this ticket.
- [ ] The host's player-count row renders through the new `<ToggleGroup type="single">` with three `<ToggleGroupItem value="10" />`, `value="11"`, `value="12"` children.
- [ ] `aria-label="Кількість гравців"` is set on the `<ToggleGroup>` root (Radix forwards it to its group element). It is no longer on a wrapping `<div>`.
- [ ] The visible rhythm (three equal columns, 1px gap, rounded border, p-1 padding) is preserved by keeping a call-site wrapper element around the `<ToggleGroup>` carrying `grid grid-cols-3 gap-1 rounded-lg border p-1`. The primitive itself does not own this layout.
- [ ] `onValueChange` callback receives a `string`, coerces via `Number(value)`, and only then calls `room?.send('setMaxPlayers', { maxPlayers })` when the value is a finite number (skip no-op emissions like Radix's empty-string clear).
- [ ] The group has a single root-level `disabled={!room}`. The per-item `disabled={!room}` is removed because Radix propagates `disabled` from root to items.
- [ ] Default selection (`maxPlayers ?? DEFAULT_MAX_PLAYERS`) renders the matching `<ToggleGroupItem>` as selected on first render and after Colyseus state hydrates.
- [ ] No other call site is touched; `ThemeToggle` is intentionally left on `Button` + `next-themes` (see ticket 03's ADR).
- [ ] `npm run lint` exits 0.
- [ ] `npm run build` exits 0.
- [ ] Manual dev-server smoke recorded in the PR description:
  - [ ] Mouse click changes the selection and triggers `room.send('setMaxPlayers', …)`.
  - [ ] Keyboard: Tab enters the group once, arrow keys move selection, Home / End jump to first / last.
  - [ ] With no `room` connected, the group is inert (every item visibly disabled, no toggle fires).
  - [ ] Both light and dark themes paint the selected look via `data-[state=on]:bg-accent`.
  - [ ] Screen reader announces the group as a radio group with one option currently selected (manual check).

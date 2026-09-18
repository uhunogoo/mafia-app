# Code Style

Read this when writing or refactoring React components.

This codebase follows the **Joy of React** style (skill:
`joy-of-react-tailwind-style`), with the project-specific rules below.

## Component shape

- **Function declarations**, not arrow functions:

  ```tsx
  function ComponentName(props: Props) { ... }
  export default ComponentName;
  ```

- **`export default` at the bottom of the file**, not inline.
- **Hooks via `React.useX`** (e.g. `React.useState`, `React.useEffect`, not
  destructured `useState`).
- **Event handlers as named function declarations** prefixed `handle…`:

  ```tsx
  function handleClick() { ... }
  ```

- **Style variants via lookup objects**, not chains of `if/else`:

  ```tsx
  const variantStyles = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
  } as const;

  <button className={variantStyles[variant]} />
  ```

## Styling

- **Tailwind utility classes** and **`@theme` tokens only.**
- **Never inline `style={{ ... }}`** — see
  [boundaries.md](./boundaries.md#never).

## Where style rules live

- Component-internal styles → Tailwind classes in the component file (or a
  lookup object beside the component).
- Theme tokens → `@theme` in the global stylesheet.
- Shared constants (e.g. class lists reused across components) →
  `src/constants.ts`.

## Existing skill

If you are scaffolding a new component or want a worked example, load the
skill `joy-of-react-tailwind-style` from the local skills directory before
writing.

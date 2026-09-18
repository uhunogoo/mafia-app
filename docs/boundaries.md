# Boundaries

Hard rules for this codebase. When in doubt, prefer the stricter option.

## Always

- **Validate input with Zod at the Server Action / Route Handler boundary.**
  Treat any data crossing into a server-only context as untrusted until
  parsed.

## Ask first

- **Before adding new dependencies.** Even if it's a tiny utility — confirm
  with the user, since adding a dep affects bundle size, supply chain, and
  maintenance.

## Never

- **Use the `service_role` key on the client.** This is a server-only key; if
  it leaks into a client bundle, the database is compromised.
- **Use `NEXT_PUBLIC_` for secrets.** `NEXT_PUBLIC_*` is inlined into the
  client bundle at build time — any value prefixed this way is public.
- **Inline `style={{ ... }}`.** Use Tailwind utility classes and `@theme`
  tokens only. See [code-style.md](./code-style.md) for the styling
  conventions.

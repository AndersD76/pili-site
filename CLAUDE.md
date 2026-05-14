# PILI Industrial — Project Conventions

## Before declaring any change complete
- Always run `pnpm typecheck && pnpm lint` before declaring done
- Server Components by default; only use `"use client"` when strictly necessary
- Absolute imports via `@/`

## Style
- Tailwind only (no CSS-in-JS)
- Colors via CSS vars `--pili-*` (see globals.css and tailwind theme)
- Fonts via `font-display`, `font-sans`, `font-mono`
- Do not invent new palette colors without asking
- Do not use emojis in components
- Sentence case for labels/buttons

## Forms
- Always `react-hook-form + zod`
- Server actions must re-validate on the server
- Rate limit all public endpoints via Upstash

## Database
- Versioned migrations, never `db push` in production
- Soft delete where appropriate (field `deletedAt`)

## Commits
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- Branch per feature (`feat/admin-leads-table`)
- No "WIP" commits on main

## Do NOT
- Add dependencies without confirming first
- Install deprecated `@types/*` packages (use native TS types)
- Reset migrations without warning
- Use dark mode (this is a single-theme site: light industrial)

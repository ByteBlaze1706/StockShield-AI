---
name: Replit Auth implementation
description: Details of how Replit Auth (OIDC/PKCE) was integrated into StockShield AI.
---

# Replit Auth in StockShield AI

## What was added
- `lib/db/src/schema/auth.ts` — `sessionsTable` + `usersTable` (mandatory, do not drop)
- `lib/replit-auth-web/` — composite lib with `useAuth()` hook (needs `vite` in devDeps for `import.meta.env` types)
- `artifacts/api-server/src/lib/auth.ts` — OIDC config, session CRUD
- `artifacts/api-server/src/middlewares/authMiddleware.ts` — patches `req.user` and `req.isAuthenticated()`
- `artifacts/api-server/src/routes/auth.ts` — `/login`, `/callback`, `/logout`, `/auth/user` routes
- `artifacts/stockshield/src/lib/auth-context.tsx` — React context wrapping `useAuth()` for single fetch
- `artifacts/stockshield/src/pages/login.tsx` — branded login page with OIDC sign-in button

## Key decisions
- `AuthProvider` wraps the Wouter `Router` so `useAuthContext()` works in all child components.
- Protected routes use a `ProtectedRoute` wrapper that reads from `useAuthContext()` and redirects to `/login` when unauthenticated.
- Landing (`/`) and Login (`/login`) are public; all other routes are protected.
- Watchlist and conversations are scoped by `userId` (nullable column); unauthenticated rows have `null` userId.
- `cookieParser()` must come before `authMiddleware` in `app.ts`.
- `cors({ credentials: true, origin: true })` required for cookie-based auth through Replit proxy.

**Why:** Replit Auth uses OIDC redirect — no custom email/password forms. Generic "Sign in" labels only, never mention "Replit Auth" in UI.

## replit-auth-web tsconfig quirk
The `lib/replit-auth-web/tsconfig.json` needs:
- `composite: true`, `declarationMap: true`, `emitDeclarationOnly: true` (composite lib pattern)
- `types: ["vite/client"]` — required because `use-auth.ts` uses `import.meta.env.BASE_URL`
- `references: [{ "path": "../api-client-react" }]` — needed because it imports `AuthUser` from `@workspace/api-client-react`
- `vite` in devDependencies with `"catalog:"` — provides the vite/client types

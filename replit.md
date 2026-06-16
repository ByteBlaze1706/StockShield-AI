# StockShield AI

An AI-powered web app for detecting suspicious stock market activity and helping beginner investors identify fraud risks.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/stockshield run dev` — run the frontend (port 21568)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `GEMINI_API_KEY` — Gemini AI key

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, Recharts, Wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: Google Gemini 2.5 Flash (via `@google/genai`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/stockshield/src/pages/` — Landing, Dashboard, Stock Analysis, Chat, Analytics, Settings
- `artifacts/stockshield/src/components/layout/Shell.tsx` — sidebar + ticker tape + mobile nav
- `artifacts/stockshield/src/components/ui/` — RiskMeter, SeverityBadge, StockSearch + shadcn components
- `artifacts/api-server/src/routes/` — stocks, analysis, alerts, watchlist, chat, dashboard
- `lib/db/src/schema/` — watchlist, alerts, conversations, messages tables
- `lib/api-spec/` — OpenAPI source of truth
- `lib/api-client-react/` — generated React Query hooks
- `lib/api-zod/` — generated Zod schemas

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks and schemas
- SSE streaming for ShieldBot chat (not WebSocket) — simpler server-side, works through Replit proxy
- Gemini AI called directly from API server using `GEMINI_API_KEY` secret (not Replit AI integration)
- All mock stock data lives in `artifacts/api-server/src/routes/stocks.ts` — extend there to add tickers
- Dark-only theme enforced in Shell and Landing via `document.documentElement.classList.add("dark")`

## Product

- **Landing** — hero, features, "How it works", testimonials, footer with CTA
- **Dashboard** — live ticker tape, stat cards, top risky assets with risk bars, Market Intelligence (Fear & Greed gauge), recent alerts feed, watchlist
- **Stock Analysis** — price/volume chart with anomaly markers, Gemini AI fraud risk scoring (0–100 gauge), risk factors, AI recommendation, sentiment headlines
- **ShieldBot Chat** — streaming AI chat with conversation history (PostgreSQL), quick action prompts, typing indicator
- **Analytics** — sector risk bar chart, fraud type donut chart, risk score distribution, manipulation radar chart, multi-factor stock comparison
- **Settings** — notification toggles, risk threshold slider, display preferences, about panel

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT call `pnpm dev` at workspace root — use workflow restart instead
- After codegen, no need to run `typecheck:libs` separately
- SSE chat endpoint: POST returns a streaming response — the frontend must use `fetch` + `ReadableStream`, not generated hooks
- `GEMINI_API_KEY` is a Replit secret — never hardcode it

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details

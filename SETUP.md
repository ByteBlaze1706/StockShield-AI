# 🛠️ StockShield AI - Setup Instructions

Welcome to the setup instructions for **StockShield AI**! Follow this guide to get the development environment up and running on your local machine.

---

## 📌 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v24.x or higher recommended)
2. **pnpm** (v10.x or higher recommended) — *Note: This workspace uses pnpm. Do not use npm or yarn.*
3. **PostgreSQL** (running locally or hosted)
4. **Google Gemini API Key** (for ShieldBot AI features)

---

## 🚀 Step-by-Step Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ByteBlaze1706/StockShield-AI.git
cd StockShield-AI
```

### 2. Install Dependencies
Install all package dependencies in the pnpm workspace:
```bash
pnpm install
```

### 3. Configure Environment Variables
Create a `.env` file at the root of the project (or in your environment config):
```env
# Database connection string (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/stockshield"

# Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Push the Database Schema
Apply the database schema changes to your PostgreSQL instance using Drizzle:
```bash
pnpm --filter @workspace/db run push
```

### 5. Generate API Code (Optional/If Spec Changes)
If you need to regenerate API hooks and Zod schemas from the OpenAPI spec:
```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## 💻 Running the Application

StockShield AI consists of a backend API server and a frontend React application. You need to run both:

### Start the API Server (Backend)
Run the Express backend API server (runs on port `8080` by default):
```bash
pnpm --filter @workspace/api-server run dev
```

### Start the StockShield Web App (Frontend)
Run the Vite-powered React frontend (runs on port `21568` by default):
```bash
pnpm --filter @workspace/stockshield run dev
```

---

## 🛠️ Additional Development Commands

| Command | Action |
|:---|:---|
| `pnpm run typecheck` | Run full TypeScript typecheck across all packages |
| `pnpm run build` | Perform a typecheck and compile production builds for all packages |
| `pnpm --filter @workspace/db run push` | Push local schema changes directly to your database |

---

## ⚠️ Important Gotchas

- **Do NOT run `pnpm dev` at the workspace root**; instead, run the individual start commands for `@workspace/api-server` and `@workspace/stockshield`.
- **SSE (Server-Sent Events)**: The ShieldBot chat endpoint uses SSE for streaming responses, meaning `fetch` + `ReadableStream` is used directly rather than standard generated React hooks.
- **Never Hardcode Secrets**: Always use the `.env` file or environment secrets for `DATABASE_URL` and `GEMINI_API_KEY`.

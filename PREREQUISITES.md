# 📋 StockShield AI - Repository Prerequisites

Before setting up and running **StockShield AI**, ensure your local environment satisfies the following system, software, and credential prerequisites.

---

## 💻 1. Runtime & Package Management

### Node.js (v24.x or higher)
* **Purpose**: Runs the backend Express 5 API server, frontend build tools, and server-side utilities.
* **Verification Command**:
  ```bash
  node --version
  ```

### pnpm (v10.x or higher)
* **Purpose**: This repository is structured as a **pnpm workspace** to manage multiple packages and libraries efficiently. Installation via `npm` or `yarn` is disabled in `package.json`.
* **Verification Command**:
  ```bash
  pnpm --version
  ```

---

## 🗄️ 2. Database

### PostgreSQL (v15 or higher)
* **Purpose**: Persists real-time alerts, stock watchlists, user chat history, and conversation sessions.
* **Requirements**:
  * An active local or hosted PostgreSQL instance.
  * A valid connection string (`DATABASE_URL`) formatted as follows:
    ```
    postgresql://<username>:<password>@<host>:<port>/<database_name>
    ```

---

## 🤖 3. AI Capabilities & Credentials

### Google Gemini API Key
* **Purpose**: Powers **ShieldBot Chat** (streaming conversational assistant) and AI-driven stock fraud-risk indicators.
* **Requirements**:
  * A valid API Key from Google AI Studio.
  * The key must be set in the `GEMINI_API_KEY` environment variable.

---

## ⚙️ 4. Recommended System Tooling

* **OS**: macOS, Linux, or Windows with WSL2 (Windows Subsystem for Linux).
* **Git**: To manage branches, clone the repository, and contribute changes.
* **Docker** *(Optional)*: Recommended for running a local PostgreSQL container easily.
  ```bash
  docker run --name stockshield-postgres -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:16
  ```

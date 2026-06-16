# 🚀 StockShield AI

<div align="center">

### *We see what others miss.*

AI-powered market intelligence platform designed to detect suspicious trading activity, uncover hidden anomalies, and deliver smarter financial insights in real time.

---

🌐 **Deployments**
- **Frontend App**: [https://stockshield.vercel.app](https://stockshield.vercel.app)
- **Backend API**: [https://stock-shield-ai-api-server.vercel.app](https://stock-shield-ai-api-server.vercel.app)

🏆 **Devpost Submission**
https://devpost.com/software/stockshield-ai

</div>

---

# 📌 About The Project

StockShield AI is a modern financial intelligence platform built to help identify unusual market behavior, suspicious trading activity, and emerging fraud patterns through AI-driven analytics and real-time monitoring.

The platform transforms complex market signals into intuitive visual insights using interactive dashboards, anomaly detection systems, and intelligent alert mechanisms.

Designed with a futuristic interface and high-performance architecture, StockShield AI focuses on making advanced market analysis accessible, responsive, and actionable.

---

# ✨ Features

### 📊 Intelligent Market Monitoring

Track abnormal stock behavior, suspicious market movement, and real-time analytics through a dynamic monitoring dashboard.

### 🤖 AI-Powered Detection

Identify anomalies and high-risk market activity using AI-enhanced detection systems and behavioral analysis models.

### 📈 Interactive Analytics

Visualize trends, market signals, sentiment metrics, and trading insights with modern data visualizations.

### 🔔 Smart Alerts

Receive intelligent notifications for unusual spikes, anomalies, and suspicious financial activity.

### 🌙 Modern User Experience

Built with a sleek dark-themed interface focused on clarity, speed, and responsiveness.

### ⚡ Real-Time Insights

Deliver fast and actionable intelligence designed to simplify complex market data.

---

# 🛠️ Built With

* **Frontend**: JavaScript, React, Tailwind CSS, Vite
* **Backend**: Node.js, Express, esbuild
* **Database**: Neon PostgreSQL, Drizzle ORM
* **Authentication**: Credentials-based (Email/Username/Password) session auth, bcrypt (10 rounds) for secure hashing, HTTP-only secure cookies
* **Visualizations**: Recharts
* **Hosting**: Vercel Deployment

---

# ⚙️ Setup & Architecture

### Database Setup (Neon PostgreSQL)
The project is configured to use a serverless Neon PostgreSQL database via Drizzle ORM. 
To sync schemas and deploy database changes:
1. Ensure `DATABASE_URL` is set in your environment.
2. Run database push command:
   ```bash
   pnpm --filter @workspace/db run push-force
   ```

### Authentication Architecture
We use a self-hosted credential-based authentication system:
- **Registration**: Hashes passwords using `bcryptjs` with 10 salt rounds before storage.
- **Sessions**: Uses cookie-based sessions with HTTP-only cookies (`sid`) to manage active user states securely.
- **Data Scoping**: Watchlists, alerts, settings, and chat logs are strictly isolated and queried by checking `req.user.id` on authenticated sessions.
- **Security Guardrails**: Passwords are never stored in plaintext, logged, or returned in API responses.

---

# 📸 Preview

## Dashboard Overview

Advanced monitoring dashboard displaying fraud indicators, analytics, and live market intelligence.
<img width="1913" height="1007" alt="image" src="https://github.com/user-attachments/assets/fc541965-960a-4d28-95ad-987235672708" />



## Market Analytics

Interactive visualizations for anomaly tracking, sentiment analysis, and trading behavior.
<img width="1910" height="997" alt="image" src="https://github.com/user-attachments/assets/b4b166f1-6b89-4555-b601-490f7af6637d" />



## Alert Center

Centralized monitoring interface for intelligent alerts and anomaly notifications.
<img width="1909" height="1001" alt="image" src="https://github.com/user-attachments/assets/3f795c25-f56a-4e7b-99c2-1660ad21c5bd" />



## Company Analysis
<img width="1910" height="997" alt="image" src="https://github.com/user-attachments/assets/a4c7a11e-d035-4826-aa5b-d4af8e8f2ca3" />


## AI Assistant
<img width="1914" height="990" alt="image" src="https://github.com/user-attachments/assets/67ec4846-a767-48cc-b2b7-f9ece16539b4" />

---

# 🎯 Vision

Retail investors often lack access to sophisticated market intelligence tools capable of identifying manipulation patterns and suspicious trading behavior early.

StockShield AI aims to bridge that gap by creating a smarter, faster, and more accessible financial intelligence experience powered by AI.

---

# 🚀 Future Scope

* Personalized user dashboards
* Portfolio monitoring
* Live market API integrations
* Predictive analytics
* Mobile responsiveness enhancements
* AI-based forecasting systems
* Advanced watchlists and custom alerts

---

# 👨‍💻 Authors

### Devayani Hekare

### Shaarav Raghu

---

<div align="center">

### Built during the DevNetwork AI & ML Hackathon 2026 🚀

</div>
